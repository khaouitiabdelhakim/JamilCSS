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
        const config = require(configPath);
        return config && typeof config === "object" ? { config, configPath } : null;
      } catch (_) {
        return null;
      }
    }
  }
  return null;
}

function getContentFiles(contentGlobs, cwd) {
  const resolvedCwd = path.resolve(cwd);
  const resolvedGlobs = contentGlobs.map((p) => path.resolve(resolvedCwd, p));
  return glob.sync(resolvedGlobs, { absolute: true });
}

/** Extract dirs to watch from content globs (e.g. ./app from ./app/**\/*.tsx). */
function getContentDirs(contentGlobs, cwd) {
  const resolvedCwd = path.resolve(cwd);
  const dirs = new Set();
  for (const g of contentGlobs) {
    const beforeStar = g.split(/\*\*?/)[0].replace(/\/$/, "") || ".";
    const dir = path.resolve(resolvedCwd, beforeStar);
    if (dir && fs.existsSync(dir)) dirs.add(dir);
  }
  return [...dirs];
}

/** Touch a file to update its mtime so webpack's watcher sees a change. */
function touchFile(filePath) {
  try {
    const t = Date.now() / 1000;
    fs.utimesSync(filePath, t, t);
  } catch (e) {
    try {
      fs.appendFileSync(filePath, "");
    } catch (_) {}
  }
}

/**
 * Webpack plugin for Next.js: when content files (e.g. app/**\/*.tsx) change,
 * touches the CSS entry file so webpack rebuilds it and JamilCSS regenerates styles.
 *
 * Options:
 *   - content: string[]  (globs, e.g. ["./app/**\/*.{js,ts,jsx,tsx}"])
 *   - cwd: string        (project root)
 *   - cssEntry: string   (path to CSS that contains @jamilcss, e.g. "./app/globals.css")
 */
class JamilCSSWatchPlugin {
  constructor(options = {}) {
    this.options = options;
    this.watchers = [];
    this.touchTimer = null;
  }

  apply(compiler) {
    const cwd = path.resolve(this.options.cwd || compiler.context);
    const loaded = loadJamilConfig(cwd);
    const fileConfig = loaded ? loaded.config : {};
    const contentGlobs = this.options.content ?? fileConfig.content;
    const configCwd = path.resolve(this.options.cwd ?? fileConfig.cwd ?? cwd);
    const cssEntry = this.options.cssEntry || "app/globals.css";
    const cssPath = path.resolve(configCwd, cssEntry);

    if (!Array.isArray(contentGlobs) || contentGlobs.length === 0) return;

    // 1) Add to fileDependencies so webpack knows about these files
    compiler.hooks.compilation.tap("JamilCSSWatchPlugin", (compilation) => {
      const contentFiles = getContentFiles(contentGlobs, configCwd);
      for (const file of contentFiles) {
        const abs = path.resolve(file);
        if (fs.existsSync(abs)) compilation.fileDependencies.add(abs);
      }
      if (loaded && loaded.configPath) {
        compilation.fileDependencies.add(path.resolve(loaded.configPath));
      }
    });

    // 2) In watch mode: when a content file changes, touch the CSS file so webpack rebuilds it
    compiler.hooks.watchRun.tapAsync("JamilCSSWatchPlugin", (_, callback) => {
      if (this.watchers.length > 0) {
        callback();
        return;
      }

      const contentDirs = getContentDirs(contentGlobs, configCwd);
      const CONTENT_EXT = /\.(js|ts|jsx|tsx)$/;

      const scheduleTouch = () => {
        if (this.touchTimer) clearTimeout(this.touchTimer);
        this.touchTimer = setTimeout(() => {
          this.touchTimer = null;
          if (fs.existsSync(cssPath)) {
            touchFile(cssPath);
          }
        }, 80);
      };

      for (const dir of contentDirs) {
        try {
          const w = fs.watch(
            dir,
            { recursive: true },
            (eventType, filename) => {
              if (filename && CONTENT_EXT.test(filename)) {
                scheduleTouch();
              }
            }
          );
          w.on("error", () => {});
          this.watchers.push(w);
        } catch (_) {}
      }
      callback();
    });

    compiler.hooks.done.tap("JamilCSSWatchPlugin", () => {
      if (this.touchTimer) clearTimeout(this.touchTimer);
    });
  }
}

module.exports = JamilCSSWatchPlugin;
