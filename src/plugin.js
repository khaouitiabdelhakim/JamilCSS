const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const postcss = require("postcss");
const glob = require("fast-glob");
const utilities = require("./utilities");
const patterns = require("./patterns");
const { getAllVariants, parseVariants } = require("./variants");
const { getKeyframesCSS } = require("./keyframes");
const { PREFLIGHT_CSS } = require("./preflight");

const cache = new Map();
const CACHE_MAX = 50;
const DEBUG = process.env.JAMILCSS_DEBUG === "1" || process.env.JAMILCSS_DEBUG === "true";

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

// Match stacked variants + j-* — supports all variant prefixes and / in class names (for color opacity)
const J_CLASS_REGEX = /\b(?:[a-z0-9-]+:)*j-[a-zA-Z0-9_\-\[\]#:/]+/g;

/** Escape class for CSS selector */
function selectorForClass(cls) {
  if (/[\[\]]/.test(cls)) {
    return `[class~="${cls.replace(/"/g, '\\"')}" i]`;
  }
  // Escape special chars: : / [ ]
  return "." + cls.replace(/[:/]/g, (c) => `\\${c}`);
}

/** Resolve a base class (no variant) to its CSS declaration string, or null */
function getDeclaration(cls, utilities, patterns) {
  let decl = utilities[cls];
  if (decl) return decl;
  for (const { test, generate } of patterns) {
    const m = cls.match(test);
    if (m) {
      decl = generate(cls, ...m.slice(1));
      if (decl) return decl;
    }
  }
  return null;
}

/** Build CSS rule(s) for a class with stacked variants. Returns array of line strings. */
function buildRule(cls, variantList) {
  const parsed = parseVariants(cls, variantList);
  const baseClass = parsed ? parsed.baseClass : cls;
  const variants = parsed ? parsed.variants : [];
  const declaration = getDeclaration(baseClass, utilities, patterns);
  if (!declaration || (typeof declaration === "object" && declaration.rule)) return [];

  const sel = selectorForClass(cls);
  let themePrefix = "";
  const pseudos = [];
  const attrSelectors = [];
  let breakpointQuery = null;
  const mediaQueries = [];
  const supportsQueries = [];
  let groupHover = false;
  let groupStatePseudo = null;
  let peerPseudo = null;

  for (const v of variants) {
    if (v.type === "breakpoint") {
      breakpointQuery = `(min-width: ${v.minWidth})`;
    } else if (v.type === "theme") {
      themePrefix = (themePrefix ? themePrefix + " " : "") + v.selector;
    } else if (v.type === "pseudo") {
      pseudos.push(v.pseudo);
    } else if (v.type === "media") {
      mediaQueries.push(v.media);
    } else if (v.type === "supports") {
      supportsQueries.push(v.query);
    } else if (v.type === "group-hover") {
      groupHover = true;
    } else if (v.type === "group-state") {
      groupStatePseudo = v.groupPseudo;
    } else if (v.type === "peer") {
      peerPseudo = v.peerPseudo;
    } else if (v.type === "aria") {
      attrSelectors.push(`[${v.attr}="${v.val}"]`);
    }
  }

  let innerSelector;
  if (groupHover) {
    innerSelector = `.group:hover ${sel}`;
  } else if (groupStatePseudo) {
    innerSelector = `.group:${groupStatePseudo} ${sel}`;
  } else if (peerPseudo) {
    innerSelector = `.peer:${peerPseudo} ~ ${sel}`;
  } else {
    innerSelector = sel;
  }

  // Append attribute selectors (aria-*)
  if (attrSelectors.length) innerSelector += attrSelectors.join("");
  // Append pseudo-classes / pseudo-elements
  if (pseudos.length) innerSelector += pseudos.join("");
  // Wrap with theme prefix (.dark, .light)
  if (themePrefix) innerSelector = themePrefix + " " + innerSelector;

  let block = `${innerSelector} { ${declaration}; }`;
  // Wrap in @supports
  for (const q of supportsQueries) block = `@supports ${q} { ${block} }`;
  // Wrap in breakpoint
  if (breakpointQuery) block = `@media ${breakpointQuery} { ${block} }`;
  // Wrap in additional media queries (motion-reduce, print, portrait, landscape, etc.)
  for (const q of mediaQueries) block = `@media ${q} { ${block} }`;

  return [block];
}

/**
 * Extract class names from file content (JSX/TSX/HTML).
 */
function extractClassNames(content) {
  const names = new Set();
  const attrRegex = /(?:className|class)\s*=\s*[\{"'`]([^"'`}]+)[\}"'`]/g;
  let m;
  while ((m = attrRegex.exec(content)) !== null) {
    const value = m[1];
    const tokens = value.split(/\s+/);
    for (const t of tokens) {
      if (t.match(J_CLASS_REGEX)) names.add(t);
    }
  }
  const allJ = content.match(J_CLASS_REGEX);
  if (allJ) allJ.forEach((c) => names.add(c));
  return names;
}

function getContentFiles(contentGlobs, cwd) {
  const resolvedCwd = path.resolve(cwd);
  const resolvedGlobs = contentGlobs.map((p) => path.resolve(resolvedCwd, p));
  return glob.sync(resolvedGlobs, { absolute: true });
}

function scanContent(files) {
  const used = new Set();
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const names = extractClassNames(content);
      names.forEach((n) => used.add(n));
    } catch (_) {}
  }
  return used;
}

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

function loadJamilConfig(cwd) {
  const base = path.resolve(cwd);
  const candidates = [
    path.join(base, "jamil.config.cjs"),
    path.join(base, "jamil.config.js"),
  ];
  for (const configPath of candidates) {
    if (fs.existsSync(configPath)) {
      try {
        try { delete require.cache[require.resolve(configPath)]; } catch (_) {}
        const config = require(configPath);
        return config && typeof config === "object" ? { config, configPath } : null;
      } catch (_) {
        return null;
      }
    }
  }
  return null;
}

/**
 * Parse a CSS declaration string ("prop: value; prop2: value2") into
 * PostCSS Declaration nodes.
 */
function declStringToNodes(declaration) {
  const nodes = [];
  for (const part of declaration.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim();
    if (prop && val) nodes.push(postcss.decl({ prop, value: val }));
  }
  return nodes;
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

      const cssFileToTouch = parent || (opts.cssEntry ? path.resolve(cwd, opts.cssEntry) : null);
      if (process.env.NODE_ENV === "development" && contentDirs.length > 0 && cssFileToTouch && fs.existsSync(cssFileToTouch)) {
        setupContentWatcher(cssFileToTouch, contentDirs);
      }

      const useCache = opts.cache !== false && process.env.NODE_ENV !== "development";
      const themeConfig = (loaded && loaded.config && loaded.config.theme) ? loaded.config.theme : {};
      const breakpointsOverride = themeConfig.breakpoints;
      const variantList = getAllVariants(breakpointsOverride);

      // ===== Handle @jamilcss-preflight =====
      root.walkAtRules("jamilcss-preflight", (atRule) => {
        atRule.replaceWith(postcss.parse(PREFLIGHT_CSS).nodes);
      });

      // ===== Handle @apply directive =====
      // @apply j-flex j-items-center j-bg-blue resolves utility declarations inline.
      root.walkAtRules("apply", (atRule) => {
        const classes = atRule.params.trim().split(/\s+/).filter(Boolean);
        const nodes = [];
        for (const cls of classes) {
          const name = cls.startsWith(".") ? cls.slice(1) : cls;
          const declaration = getDeclaration(name, utilities, patterns);
          if (declaration && typeof declaration === "string") {
            nodes.push(...declStringToNodes(declaration));
          }
        }
        if (nodes.length) {
          atRule.replaceWith(nodes);
        } else {
          atRule.remove();
        }
      });

      // ===== Handle @jamilcss =====
      root.walkAtRules("jamilcss", (atRule) => {
        const key = useCache ? contentCacheKey(contentFiles) : null;
        if (useCache && key && cache.has(key)) {
          const cached = cache.get(key);
          if (cached) {
            if (DEBUG) console.log("[jamilcss plugin] CACHE HIT key=" + key.slice(0, 8) + "...");
            atRule.replaceWith(postcss.parse(cached).nodes);
            return;
          }
        }

        if (DEBUG) {
          console.log("[jamilcss plugin] CACHE MISS – key=" + (key ? key.slice(0, 12) + "..." : "n/a"));
        }
        const used = scanContent(contentFiles);
        const gradientClasses = [...used].filter((c) => c.includes("gradient"));
        const animationNames = new Set();
        [...used].forEach((c) => {
          const parsed = parseVariants(c, variantList);
          const base = parsed ? parsed.baseClass : c;
          const m = base.match(/^j-animate-([a-zA-Z0-9]+)-/);
          if (m) animationNames.add(m[1]);
        });
        if (DEBUG) {
          console.log("[jamilcss plugin] total classes:", used.size);
          console.log("[jamilcss plugin] gradient classes:", gradientClasses);
        }
        const lines = [];
        const ts = new Date().toISOString();
        lines.push(`/* jamilcss ${used.size} classes - ${ts} */`);
        const keyframesCSS = getKeyframesCSS([...animationNames]);
        if (keyframesCSS) lines.push(keyframesCSS);
        if (DEBUG && gradientClasses.length) {
          lines.push(`/* jamilcss DEBUG gradient classes: ${gradientClasses.join(", ")} */`);
        }
        for (const cls of used) {
          const parsed = parseVariants(cls, variantList);
          const hasVariants = parsed && parsed.variants.length > 0;
          const baseClass = parsed ? parsed.baseClass : cls;
          const decl = getDeclaration(baseClass, utilities, patterns);
          if (!decl) continue;

          if (typeof decl === "object" && decl.rule) {
            if (!hasVariants) lines.push(decl.rule);
            continue;
          }
          if (hasVariants) {
            lines.push(...buildRule(cls, variantList));
          } else {
            lines.push(`${selectorForClass(cls)} { ${decl}; }`);
          }
        }
        const css = lines.join("\n");
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
