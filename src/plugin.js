const path = require("path");
const fs = require("fs");
const postcss = require("postcss");
const glob = require("fast-glob");
const utilities = require("./utilities");
const patterns = require("./patterns");

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

function createPlugin(opts = {}) {
  const content = opts.content || [];
  const cwd = path.resolve(opts.cwd || process.cwd());

  return {
    postcssPlugin: "postcss-jamilcss",
    Once(root, result) {
      const contentFiles = getContentFiles(content, cwd);
      if (!result.messages) result.messages = [];
      // File-level deps so webpack knows which files affect this CSS
      for (const file of contentFiles) {
        result.messages.push({ type: "dependency", file });
        result.messages.push({ type: "build-dependency", file });
      }
      // Dir-level deps so ANY change under app/ or components/ invalidates (fixes stale j-py-8 vs j-py-70)
      const contentDirs = [
        ...new Set(
          content.map((g) => path.resolve(cwd, g.replace(/\*\*.*$/, "")))
        ),
      ].filter((dir) => dir && path.isAbsolute(dir));
      for (const dir of contentDirs) {
        result.messages.push({ type: "dir-dependency", dir });
      }
      root.walkAtRules("jamilcss", (atRule) => {
        const used = scanContent(contentFiles);
        const lines = [];
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
        if (!css) {
          atRule.remove();
          return;
        }
        const parsed = postcss.parse(css);
        atRule.replaceWith(parsed.nodes);
      });
    },
  };
}

createPlugin.postcss = true;
module.exports = createPlugin;
