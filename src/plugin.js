const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const postcss = require("postcss");
const glob = require("fast-glob");
const utilities = require("./utilities");
const patterns = require("./patterns");

const cache = new Map();
const CACHE_MAX = 50;
const DEBUG = process.env.JAMILCSS_DEBUG === "1" || process.env.JAMILCSS_DEBUG === "true";

// Tailwind-style: when content changes, touch the source CSS file so the bundler rebuilds it.
const watchedDirsForCss = new Map();

function touchFile(filePath) {
  try {
    const t = Date.now() / 1000;
    fs.utimesSync(filePath, t, t);
  } catch (_) {
    try {
      fs.appendFileSync(filePath, " ");
      fs.truncateSync(filePath, fs.statSync(filePath).size - 1);
    } catch (_) {}
  }
}

function setupContentWatcher(cssFilePath, contentDirs) {
  if (!cssFilePath || !fs.existsSync(cssFilePath)) return;
  const key = cssFilePath;
  if (watchedDirsForCss.has(key)) return;
  watchedDirsForCss.set(key, true);

  const CONTENT_EXT = /\.(js|ts|jsx|tsx)$/;
  let touchTimer = null;
  const scheduleTouch = () => {
    if (touchTimer) clearTimeout(touchTimer);
    touchTimer = setTimeout(() => {
      touchTimer = null;
      if (fs.existsSync(cssFilePath)) touchFile(cssFilePath);
    }, 50);
  };

  for (const dir of contentDirs) {
    try {
      fs.watch(dir, { recursive: true }, (_, filename) => {
        if (filename && CONTENT_EXT.test(filename)) scheduleTouch();
      });
    } catch (_) {}
  }
}

// Match j-* classes including gradient with [#hex] (brackets, #)
const J_CLASS_REGEX = /\bj-[a-zA-Z0-9_\-\[\]#]+/g;

/** Selector for a class name: use [class~="..." i] when name contains [ or ] so hex casing (e.g. #FCB045) always matches */
function selectorForClass(cls) {
  if (/[\[\]]/.test(cls)) {
    return `[class~="${cls.replace(/"/g, '\\"')}" i]`;
  }
  return "." + cls;
}

/**
 * Extract class names from file content (JSX/TSX/HTML).
 * Matches: className="...", className='...', className={`...`}, class="..."
 */
function extractClassNames(content) {
  const names = new Set();
  // className="...", class="...", className='...', class='...'
  const attrRegex = /(?:className|class)\s*=\s*[\{"'`]([^"'`}]+)[\}"'`]/g;
  let m;
  while ((m = attrRegex.exec(content)) !== null) {
    const value = m[1];
    const tokens = value.split(/\s+/);
    for (const t of tokens) {
      if (t.match(J_CLASS_REGEX)) names.add(t);
    }
  }
  // Template literal: className={`j-flex ${x}`} - take all j-* tokens from the whole file
  const allJ = content.match(J_CLASS_REGEX);
  if (allJ) allJ.forEach((c) => names.add(c));
  return names;
}

/**
 * Resolve content globs to absolute file paths.
 */
function getContentFiles(contentGlobs, cwd) {
  const resolvedCwd = path.resolve(cwd);
  const resolvedGlobs = contentGlobs.map((p) => path.resolve(resolvedCwd, p));
  return glob.sync(resolvedGlobs, { absolute: true });
}

/**
 * Scan content files and return the set of used j-* class names.
 */
function scanContent(files) {
  const used = new Set();
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const names = extractClassNames(content);
      names.forEach((n) => used.add(n));
    } catch (_) {
      // skip unreadable files
    }
  }
  return used;
}

/**
 * Build a cache key from content file paths and their mtimes so any edit invalidates the cache.
 */
function contentCacheKey(contentFiles) {
  const entries = contentFiles
    .map((f) => {
      try {
        return `${f}:${fs.statSync(f).mtimeMs}`;
      } catch (_) {
        return f;
      }
    })
    .sort();
  return crypto.createHash("sha1").update(entries.join("\n")).digest("hex");
}

/**
 * Load jamil.config.js or jamil.config.cjs from the given cwd.
 * Clears require cache before loading so config changes are picked up (Tailwind-like).
 * Returns { config: object, configPath: string } or null if not found.
 */
function loadJamilConfig(cwd) {
  const base = path.resolve(cwd);
  const candidates = [
    path.join(base, "jamil.config.cjs"),
    path.join(base, "jamil.config.js"),
  ];
  for (const configPath of candidates) {
    if (fs.existsSync(configPath)) {
      try {
        try {
          delete require.cache[require.resolve(configPath)];
        } catch (_) {}
        const config = require(configPath);
        return config && typeof config === "object" ? { config, configPath } : null;
      } catch (_) {
        return null;
      }
    }
  }
  return null;
}

function createPlugin(opts = {}) {
  const initialCwd = path.resolve(opts.cwd || process.cwd());

  return {
    postcssPlugin: "postcss-jamilcss",
    Once(root, result) {
      const loaded = loadJamilConfig(initialCwd);
      const fileConfig = loaded ? loaded.config : {};
      const merged = {
        content: opts.content ?? fileConfig.content,
        cwd: opts.cwd ?? fileConfig.cwd ?? initialCwd,
      };
      const content = Array.isArray(merged.content) ? merged.content : [];
      const cwd = path.resolve(merged.cwd);

      const contentFiles = getContentFiles(content, cwd);
      if (DEBUG) {
        console.log("[jamilcss plugin] Once() running for", result.opts?.from || "(no from)");
        console.log("[jamilcss plugin] cwd:", cwd);
        console.log("[jamilcss plugin] content globs:", content);
        console.log("[jamilcss plugin] content files (" + contentFiles.length + "):", contentFiles.map((f) => path.basename(f)));
      }
      if (!result.messages) result.messages = [];
      const norm = (f) => path.resolve(f).split(path.sep).join("/");
      const parent = result.opts?.from;

      // Tailwind-style: register dependencies so postcss-loader can addDependency / addContextDependency
      const pushMsg = (msg) => {
        result.messages.push({ plugin: "postcss-jamilcss", parent, ...msg });
      };
      for (const file of contentFiles) {
        pushMsg({ type: "dependency", file: norm(file) });
        pushMsg({ type: "build-dependency", file: norm(file) });
      }
      if (loaded && loaded.configPath) {
        pushMsg({ type: "dependency", file: norm(loaded.configPath) });
        pushMsg({ type: "build-dependency", file: norm(loaded.configPath) });
      }
      const contentDirs = [
        ...new Set(
          content.map((g) => {
            const beforeStar = g.split(/\*\*?/)[0].replace(/\/$/, "") || ".";
            return path.resolve(cwd, beforeStar);
          })
        ),
      ].filter((dir) => dir && fs.existsSync(dir));
      for (const dir of contentDirs) {
        pushMsg({ type: "dir-dependency", dir: norm(dir) });
      }

      // Tailwind-style: when content files change, touch the source CSS file so the bundler rebuilds
      const cssFileToTouch = parent || (opts.cssEntry ? path.resolve(cwd, opts.cssEntry) : null);
      if (process.env.NODE_ENV === "development" && contentDirs.length > 0 && cssFileToTouch && fs.existsSync(cssFileToTouch)) {
        setupContentWatcher(cssFileToTouch, contentDirs);
      }
      const useCache = opts.cache !== false && process.env.NODE_ENV !== "development";
      root.walkAtRules("jamilcss", (atRule) => {
        const key = useCache ? contentCacheKey(contentFiles) : null;
        if (useCache && key && cache.has(key)) {
          const cached = cache.get(key);
          if (cached) {
            if (DEBUG) console.log("[jamilcss plugin] CACHE HIT key=" + key.slice(0, 8) + "... (using cached CSS, plugin will not re-scan)");
            atRule.replaceWith(postcss.parse(cached).nodes);
            return;
          }
        }

        if (DEBUG) {
          console.log("[jamilcss plugin] CACHE MISS – key=" + (key ? key.slice(0, 12) + "..." : "n/a") + " (content file mtimes changed = new key)");
        }
        const used = scanContent(contentFiles);
        const gradientClasses = [...used].filter((c) => c.includes("gradient"));
        if (DEBUG) {
          console.log("[jamilcss plugin] total classes:", used.size);
          console.log("[jamilcss plugin] gradient classes:", gradientClasses);
        }
        const lines = [];
        const ts = new Date().toISOString();
        lines.push(`/* jamilcss ${used.size} classes - ${ts} */`);
        if (DEBUG && gradientClasses.length) {
          lines.push(`/* jamilcss DEBUG gradient classes: ${gradientClasses.join(", ")} */`);
        }
        for (const cls of used) {
          let decl = utilities[cls];
          if (!decl) {
            for (const { test, generate } of patterns) {
              const m = cls.match(test);
              if (m) {
                decl = generate(cls, ...m.slice(1));
                break;
              }
            }
          }
          if (decl) {
            const selector = selectorForClass(cls);
            lines.push(`${selector} { ${decl}; }`);
          }
        }
        const css = lines.join("\n");
        if (DEBUG && gradientClasses.length) {
          const gradientLines = lines.filter((l) => gradientClasses.some((g) => l.includes(g)));
          console.log("[jamilcss plugin] generated gradient CSS (first 500 chars):", gradientLines.join("\n").slice(0, 500));
        }
        if (!css) {
          atRule.remove();
          return;
        }
        if (useCache && key) {
          if (cache.size >= CACHE_MAX) {
            const first = cache.keys().next().value;
            if (first !== undefined) cache.delete(first);
          }
          cache.set(key, css);
        }
        atRule.replaceWith(postcss.parse(css).nodes);
      });
    },
  };
}

createPlugin.postcss = true;
module.exports = createPlugin;
