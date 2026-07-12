import { writeFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const utilities = require("../../src/utilities.js");

const rows = Object.entries(utilities).map(([utility, css]) => ({
  utility,
  css: String(css).replace(/\s+/g, " ").trim(),
}));

const out = `// Auto-generated from ../src/utilities.js — do not edit\nexport const utilityRows = ${JSON.stringify(rows, null, 2)} as const;\n`;

writeFileSync(join(__dirname, "../lib/utilities-data.ts"), out);
console.log(`Wrote ${rows.length} utilities`);
