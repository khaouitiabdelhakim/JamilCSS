"use strict";

const path = require("path");
const fs = require("fs");
const glob = require("fast-glob");

/**
 * Load jamil.config.js or jamil.config.cjs from the given cwd.
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
        delete require.cache[require.resolve(configPath)];
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
 * Resolve content globs to absolute file paths (same logic as plugin).
 */
function getContentFiles(contentGlobs, cwd) {
  const resolvedCwd = path.resolve(cwd);
  const resolvedGlobs = contentGlobs.map((p) => path.resolve(resolvedCwd, p));
  return glob.sync(resolvedGlobs, { absolute: true });
}

/**
 * Webpack loader: adds file and context dependencies so that when any content file
 * (e.g. app/**\/*.tsx) changes, the CSS module is invalidated and PostCSS runs again.
 *
 * Options (or from jamil.config.js):
 *   - content: string[] (globs like ["./app/**\/*.{js,ts,jsx,tsx}"])
 *   - cwd: string (resolve globs from this dir)
 */
const DEBUG = process.env.JAMILCSS_DEBUG === "1" || process.env.JAMILCSS_DEBUG === "true";

function jamilcssLoader(content) {
  const options = this.getOptions() || {};
  const cwd = path.resolve(options.cwd || this.rootContext || process.cwd());

  if (DEBUG) {
    console.log("[jamilcss loader] running for", this.resourcePath || "(no resource)");
  }

  const loaded = loadJamilConfig(cwd);
  const fileConfig = loaded ? loaded.config : {};
  const contentGlobs = options.content ?? fileConfig.content;
  const configCwd = path.resolve(options.cwd ?? fileConfig.cwd ?? cwd);

  if (Array.isArray(contentGlobs) && contentGlobs.length > 0) {
    const contentFiles = getContentFiles(contentGlobs, configCwd);
    for (const file of contentFiles) {
      try {
        const abs = path.resolve(file);
        this.addDependency(abs);
      } catch (_) {}
    }
    if (DEBUG && contentFiles.length) {
      console.log("[jamilcss loader] addDependency (files):", contentFiles.length, contentFiles.map((f) => path.basename(f)));
    }
    const seen = new Set();
    for (const glob of contentGlobs) {
      const beforeStar = glob.split(/\*\*?/)[0].replace(/\/$/, "") || ".";
      const dir = path.resolve(configCwd, beforeStar);
      if (dir && !seen.has(dir) && fs.existsSync(dir)) {
        seen.add(dir);
        this.addContextDependency(dir);
      }
    }
  }

  if (loaded && loaded.configPath) {
    this.addDependency(loaded.configPath);
  }

  return content;
}

module.exports = jamilcssLoader;
