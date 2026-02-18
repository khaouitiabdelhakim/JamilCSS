/**
 * Generic utility patterns: any number in pixels (e.g. j-p-12 → padding: 12px).
 * Optional unit suffix: j-w-12-rem, j-p-8-vh. Duration: j-animate-fadein-300 (ms), j-animate-fadein-2-s (seconds).
 * Each pattern has: test (RegExp), generate(className, ...captures) → CSS declaration string.
 */
const NUM = "(\\d+)";
const UNITS = "(px|rem|em|%|vh|vw|vmin|vmax|cm|mm|in|pt|pc|Q)";

function px(n) {
  return n === "0" ? "0" : `${n}px`;
}

function value(n, unit) {
  if (unit === "px") return n === "0" ? "0" : `${n}px`;
  return `${n}${unit}`;
}

// Palette: base colors with shades 50–950 (Tailwind-like). j-text-{color} = 500, j-text-{color}-{n} = shade n.
const PALETTE = {
  gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827", 950: "#030712" },
  blue: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f8", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
  red: { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a" },
  green: { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d", 950: "#052e16" },
  yellow: { 50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12", 950: "#422006" },
  orange: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12", 950: "#431407" },
  pink: { 50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843", 950: "#500724" },
  purple: { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8", 900: "#581c87", 950: "#3b0764" },
  indigo: { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b" },
  teal: { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e" },
  cyan: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63", 950: "#083344" },
  slate: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617" },
};
const COLOR_NAMES = Object.keys(PALETTE).join("|");
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function colorDecl(prop, colorName, shadeNum) {
  const shades = PALETTE[colorName];
  if (!shades) return null;
  const n = Math.min(1000, Math.max(0, parseInt(shadeNum, 10)));
  const shade = SHADES.includes(n) ? n : SHADES.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
  const hex = shades[shade] || shades[500];
  return hex ? `${prop}: ${hex}` : null;
}

module.exports = [
  // ----- Padding with optional unit (before numeric-only) -----
  { test: new RegExp(`^j-p-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding: ${value(n, u)}` },
  { test: new RegExp(`^j-px-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-left: ${value(n, u)}; padding-right: ${value(n, u)}` },
  { test: new RegExp(`^j-py-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-top: ${value(n, u)}; padding-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-pt-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-top: ${value(n, u)}` },
  { test: new RegExp(`^j-pr-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-right: ${value(n, u)}` },
  { test: new RegExp(`^j-pb-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-pl-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-left: ${value(n, u)}` },
  // ----- Margin with optional unit -----
  { test: new RegExp(`^j-m-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin: ${value(n, u)}` },
  { test: new RegExp(`^j-mx-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-left: ${value(n, u)}; margin-right: ${value(n, u)}` },
  { test: new RegExp(`^j-my-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-top: ${value(n, u)}; margin-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-mt-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-top: ${value(n, u)}` },
  { test: new RegExp(`^j-mr-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-right: ${value(n, u)}` },
  { test: new RegExp(`^j-mb-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-ml-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-left: ${value(n, u)}` },
  // ----- Size with optional unit -----
  { test: new RegExp(`^j-w-${NUM}-${UNITS}$`), generate: (_, n, u) => `width: ${value(n, u)}` },
  { test: new RegExp(`^j-h-${NUM}-${UNITS}$`), generate: (_, n, u) => `height: ${value(n, u)}` },
  { test: new RegExp(`^j-min-w-${NUM}-${UNITS}$`), generate: (_, n, u) => `min-width: ${value(n, u)}` },
  { test: new RegExp(`^j-min-h-${NUM}-${UNITS}$`), generate: (_, n, u) => `min-height: ${value(n, u)}` },
  { test: new RegExp(`^j-max-w-${NUM}-${UNITS}$`), generate: (_, n, u) => `max-width: ${value(n, u)}` },
  { test: new RegExp(`^j-max-h-${NUM}-${UNITS}$`), generate: (_, n, u) => `max-height: ${value(n, u)}` },
  { test: new RegExp(`^j-gap-${NUM}-${UNITS}$`), generate: (_, n, u) => `gap: ${value(n, u)}` },
  { test: new RegExp(`^j-top-${NUM}-${UNITS}$`), generate: (_, n, u) => `top: ${value(n, u)}` },
  { test: new RegExp(`^j-right-${NUM}-${UNITS}$`), generate: (_, n, u) => `right: ${value(n, u)}` },
  { test: new RegExp(`^j-bottom-${NUM}-${UNITS}$`), generate: (_, n, u) => `bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-left-${NUM}-${UNITS}$`), generate: (_, n, u) => `left: ${value(n, u)}` },
  // ----- Padding (numeric, px default) -----
  { test: new RegExp(`^j-p-${NUM}$`), generate: (_, n) => `padding: ${px(n)}` },
  { test: new RegExp(`^j-px-${NUM}$`), generate: (_, n) => `padding-left: ${px(n)}; padding-right: ${px(n)}` },
  { test: new RegExp(`^j-py-${NUM}$`), generate: (_, n) => `padding-top: ${px(n)}; padding-bottom: ${px(n)}` },
  { test: new RegExp(`^j-pt-${NUM}$`), generate: (_, n) => `padding-top: ${px(n)}` },
  { test: new RegExp(`^j-pr-${NUM}$`), generate: (_, n) => `padding-right: ${px(n)}` },
  { test: new RegExp(`^j-pb-${NUM}$`), generate: (_, n) => `padding-bottom: ${px(n)}` },
  { test: new RegExp(`^j-pl-${NUM}$`), generate: (_, n) => `padding-left: ${px(n)}` },
  // ----- Margin -----
  { test: new RegExp(`^j-m-${NUM}$`), generate: (_, n) => `margin: ${px(n)}` },
  { test: new RegExp(`^j-mx-${NUM}$`), generate: (_, n) => `margin-left: ${px(n)}; margin-right: ${px(n)}` },
  { test: new RegExp(`^j-my-${NUM}$`), generate: (_, n) => `margin-top: ${px(n)}; margin-bottom: ${px(n)}` },
  { test: new RegExp(`^j-mt-${NUM}$`), generate: (_, n) => `margin-top: ${px(n)}` },
  { test: new RegExp(`^j-mr-${NUM}$`), generate: (_, n) => `margin-right: ${px(n)}` },
  { test: new RegExp(`^j-mb-${NUM}$`), generate: (_, n) => `margin-bottom: ${px(n)}` },
  { test: new RegExp(`^j-ml-${NUM}$`), generate: (_, n) => `margin-left: ${px(n)}` },
  { test: new RegExp(`^j--mt-${NUM}$`), generate: (_, n) => `margin-top: -${px(n)}` },
  { test: new RegExp(`^j--mb-${NUM}$`), generate: (_, n) => `margin-bottom: -${px(n)}` },
  // ----- Gap -----
  { test: new RegExp(`^j-gap-${NUM}$`), generate: (_, n) => `gap: ${px(n)}` },
  // ----- Size -----
  { test: new RegExp(`^j-w-${NUM}$`), generate: (_, n) => `width: ${px(n)}` },
  { test: new RegExp(`^j-h-${NUM}$`), generate: (_, n) => `height: ${px(n)}` },
  { test: new RegExp(`^j-min-w-${NUM}$`), generate: (_, n) => `min-width: ${px(n)}` },
  { test: new RegExp(`^j-min-h-${NUM}$`), generate: (_, n) => `min-height: ${px(n)}` },
  { test: new RegExp(`^j-max-w-${NUM}$`), generate: (_, n) => `max-width: ${px(n)}` },
  { test: new RegExp(`^j-max-h-${NUM}$`), generate: (_, n) => `max-height: ${px(n)}` },
  { test: new RegExp(`^j-z-${NUM}$`), generate: (_, n) => `z-index: ${n}` },
  { test: new RegExp(`^j-top-${NUM}$`), generate: (_, n) => `top: ${px(n)}` },
  { test: new RegExp(`^j-right-${NUM}$`), generate: (_, n) => `right: ${px(n)}` },
  { test: new RegExp(`^j-bottom-${NUM}$`), generate: (_, n) => `bottom: ${px(n)}` },
  { test: new RegExp(`^j-left-${NUM}$`), generate: (_, n) => `left: ${px(n)}` },
  // ----- Space between (margin on children except first) -----
  { test: new RegExp(`^j-space-x-${NUM}$`), generate: (_, n) => ({ rule: `.j-space-x-${n} > * + * { margin-left: ${px(n)} }` }) },
  { test: new RegExp(`^j-space-y-${NUM}$`), generate: (_, n) => ({ rule: `.j-space-y-${n} > * + * { margin-top: ${px(n)} }` }) },
  // ----- Divide (border between children) -----
  { test: /^j-divide-x$/, generate: () => ({ rule: ".j-divide-x > * + * { border-left-width: 1px; border-left-style: solid; border-color: inherit }" }) },
  { test: /^j-divide-y$/, generate: () => ({ rule: ".j-divide-y > * + * { border-top-width: 1px; border-top-style: solid; border-color: inherit }" }) },
  // ----- Aspect ratio (numeric: j-aspect-16-9) -----
  { test: /^j-aspect-(\d+)-(\d+)$/, generate: (_, a, b) => `aspect-ratio: ${a} / ${b}` },
  // ----- Opacity (0-100 or 0-1000 → decimal) -----
  { test: /^j-opacity-(\d+)$/, generate: (_, n) => { const v = Math.min(1000, Math.max(0, parseInt(n, 10))); const val = v <= 100 ? (v / 100).toFixed(2) : (v / 1000).toFixed(3); return `opacity: ${parseFloat(val)}`; } },
  // ----- Transition duration: j-duration-{n} = n ms, j-duration-{n}-s = n seconds -----
  { test: /^j-duration-(\d+)-s$/, generate: (_, n) => `transition-duration: ${n}s` },
  { test: /^j-duration-(\d+)$/, generate: (_, n) => `transition-duration: ${n}ms` },
  // ----- Animation: j-animate-{name}-{n} = n ms, j-animate-{name}-{n}-s = n seconds -----
  { test: /^j-animate-([a-zA-Z0-9]+)-(\d+)-s$/, generate: (_, name, n) => `animation: j-${name} ${n}s ease both` },
  { test: /^j-animate-([a-zA-Z0-9]+)-(\d+)$/, generate: (_, name, n) => `animation: j-${name} ${n}ms ease both` },
  // ----- Line height & letter spacing -----
  { test: /^j-leading-(\d+)$/, generate: (_, n) => `line-height: ${n}` },
  { test: /^j-leading-(\d+)-(\d+)$/, generate: (_, a, b) => `line-height: ${a}.${b}` },
  { test: /^j-tracking-(-?\d+)$/, generate: (_, n) => `letter-spacing: ${n === "0" ? "0" : n + "em"}` },
  // ----- Grid -----
  { test: new RegExp(`^j-grid-cols-${NUM}$`), generate: (_, n) => `grid-template-columns: repeat(${n}, minmax(0, 1fr))` },
  { test: new RegExp(`^j-grid-rows-${NUM}$`), generate: (_, n) => `grid-template-rows: repeat(${n}, minmax(0, 1fr))` },
  { test: new RegExp(`^j-col-span-${NUM}$`), generate: (_, n) => `grid-column: span ${n} / span ${n}` },
  { test: new RegExp(`^j-row-span-${NUM}$`), generate: (_, n) => `grid-row: span ${n} / span ${n}` },
  // ----- Typography: j-text-{number} = px (default); j-text-{number}-{unit} = optional unit (rem, pt, pc, cm, mm, in, Q)
  { test: /^j-text-(\d+)-(rem|pt|pc|cm|mm|in|Q)$/, generate: (_, n, unit) => `font-size: ${n}${unit}` },
  { test: new RegExp(`^j-text-${NUM}$`), generate: (_, n) => `font-size: ${px(n)}` },
  // j-text-lg-N → N * lg (lg = 1.125rem), e.g. j-text-lg-1 = 1.125rem, j-text-lg-2 = 2.25rem
  { test: /^j-text-lg-(\d+)$/, generate: (_, n) => `font-size: ${Number(n) * 1.125}rem` },
  // j-text-sm-N → sm / N (sm = 0.875rem), e.g. j-text-sm-1 = 0.875rem, j-text-sm-2 = 0.4375rem
  { test: /^j-text-sm-(\d+)$/, generate: (_, n) => `font-size: ${(0.875 / Number(n)).toFixed(4).replace(/\.?0+$/, "")}rem` },
  // j-text-xl-N → xl + N * 0.25rem (xl = 1.25rem), e.g. j-text-xl-1 = 1.5rem, j-text-xl-2 = 1.75rem
  { test: /^j-text-xl-(\d+)$/, generate: (_, n) => `font-size: ${1.25 + Number(n) * 0.25}rem` },
  // Colors: j-text-{color}-{n}, j-bg-{color}-{n}, j-border-{color}-{n}; n 0–1000 (maps to shade 50–950)
  { test: new RegExp(`^j-text-(${COLOR_NAMES})-(\\d+)$`), generate: (_, color, num) => colorDecl("color", color, num) },
  { test: new RegExp(`^j-bg-(${COLOR_NAMES})-(\\d+)$`), generate: (_, color, num) => colorDecl("background-color", color, num) },
  { test: new RegExp(`^j-border-(${COLOR_NAMES})-(\\d+)$`), generate: (_, color, num) => colorDecl("border-color", color, num) },
  // Border radius: j-rounded-{n} → border-radius: n px (e.g. j-rounded-13, j-rounded-104)
  {
    test: /^j-rounded-\d+$/,
    generate: (cls) => {
      const n = cls.slice("j-rounded-".length);
      return `border-radius: ${n === "0" ? "0" : n + "px"}`;
    },
  },
  // Gradient: j-gradient-{0-360}-{colors} or j-bg-gradient-{0-360}-{colors}
  // Colors: named (blue-black-green-red) or hex ([#adf345]-[#000]-[#f00])
  {
    test: /^j-gradient-\d+-.+$/,
    generate: gradientGenerate,
  },
  {
    test: /^j-bg-gradient-\d+-.+$/,
    generate: gradientGenerate,
  },
];

function gradientGenerate(cls) {
  const match = cls.match(/^j-(?:bg-)?gradient-(\d+)-(.+)$/);
  if (!match) return null;
  const degree = Math.min(360, Math.max(0, parseInt(match[1], 10)));
  const part = match[2];
  let colors;
  if (part.includes("[")) {
    const hexMatches = part.matchAll(/\[#([a-fA-F0-9]{3,8})\]/g);
    colors = [...hexMatches].map((m) => `#${m[1]}`);
  } else {
    colors = part.split("-").filter(Boolean);
  }
  if (colors.length < 2) return null;
  return `background: linear-gradient(${degree}deg, ${colors.join(", ")})`;
}
