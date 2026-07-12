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

// Palette: base colors with shades 50–950 (Tailwind-like)
const PALETTE = {
  gray:    { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827", 950: "#030712" },
  blue:    { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f8", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
  red:     { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a" },
  green:   { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d", 950: "#052e16" },
  yellow:  { 50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12", 950: "#422006" },
  orange:  { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12", 950: "#431407" },
  pink:    { 50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843", 950: "#500724" },
  purple:  { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8", 900: "#581c87", 950: "#3b0764" },
  indigo:  { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b" },
  teal:    { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e" },
  cyan:    { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63", 950: "#083344" },
  slate:   { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617" },
  // P1 new colors
  rose:    { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" },
  sky:     { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49" },
  lime:    { 50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264", 400: "#a3e635", 500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f", 800: "#3f6212", 900: "#365314", 950: "#1a2e05" },
  emerald: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" },
  violet:  { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" },
  fuchsia: { 50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc", 400: "#e879f9", 500: "#d946ef", 600: "#c026d3", 700: "#a21caf", 800: "#86198f", 900: "#701a75", 950: "#4a044e" },
  amber:   { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" },
  zinc:    { 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8", 400: "#a1a1aa", 500: "#71717a", 600: "#52525b", 700: "#3f3f46", 800: "#27272a", 900: "#18181b", 950: "#09090b" },
  neutral: { 50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4", 400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717", 950: "#0a0a0a" },
  stone:   { 50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 300: "#d6d3d1", 400: "#a8a29e", 500: "#78716c", 600: "#57534e", 700: "#44403c", 800: "#292524", 900: "#1c1917", 950: "#0c0a09" },
};

const COLOR_NAMES = Object.keys(PALETTE).join("|");
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function closestShade(n) {
  const clamped = Math.min(1000, Math.max(0, n));
  return SHADES.reduce((a, b) => (Math.abs(b - clamped) < Math.abs(a - clamped) ? b : a));
}

function colorDecl(prop, colorName, shadeNum) {
  const shades = PALETTE[colorName];
  if (!shades) return null;
  const shade = closestShade(parseInt(shadeNum, 10));
  const hex = shades[shade] || shades[500];
  return hex ? `${prop}: ${hex}` : null;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

module.exports = [
  // ===== Padding with optional unit =====
  { test: new RegExp(`^j-p-${NUM}-${UNITS}$`),  generate: (_, n, u) => `padding: ${value(n, u)}` },
  { test: new RegExp(`^j-px-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-left: ${value(n, u)}; padding-right: ${value(n, u)}` },
  { test: new RegExp(`^j-py-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-top: ${value(n, u)}; padding-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-pt-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-top: ${value(n, u)}` },
  { test: new RegExp(`^j-pr-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-right: ${value(n, u)}` },
  { test: new RegExp(`^j-pb-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-pl-${NUM}-${UNITS}$`), generate: (_, n, u) => `padding-left: ${value(n, u)}` },
  // ===== Margin with optional unit =====
  { test: new RegExp(`^j-m-${NUM}-${UNITS}$`),  generate: (_, n, u) => `margin: ${value(n, u)}` },
  { test: new RegExp(`^j-mx-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-left: ${value(n, u)}; margin-right: ${value(n, u)}` },
  { test: new RegExp(`^j-my-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-top: ${value(n, u)}; margin-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-mt-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-top: ${value(n, u)}` },
  { test: new RegExp(`^j-mr-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-right: ${value(n, u)}` },
  { test: new RegExp(`^j-mb-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-ml-${NUM}-${UNITS}$`), generate: (_, n, u) => `margin-left: ${value(n, u)}` },
  // ===== Size with optional unit =====
  { test: new RegExp(`^j-w-${NUM}-${UNITS}$`),     generate: (_, n, u) => `width: ${value(n, u)}` },
  { test: new RegExp(`^j-h-${NUM}-${UNITS}$`),     generate: (_, n, u) => `height: ${value(n, u)}` },
  { test: new RegExp(`^j-min-w-${NUM}-${UNITS}$`), generate: (_, n, u) => `min-width: ${value(n, u)}` },
  { test: new RegExp(`^j-min-h-${NUM}-${UNITS}$`), generate: (_, n, u) => `min-height: ${value(n, u)}` },
  { test: new RegExp(`^j-max-w-${NUM}-${UNITS}$`), generate: (_, n, u) => `max-width: ${value(n, u)}` },
  { test: new RegExp(`^j-max-h-${NUM}-${UNITS}$`), generate: (_, n, u) => `max-height: ${value(n, u)}` },
  { test: new RegExp(`^j-gap-${NUM}-${UNITS}$`),   generate: (_, n, u) => `gap: ${value(n, u)}` },
  { test: new RegExp(`^j-gap-x-${NUM}-${UNITS}$`), generate: (_, n, u) => `column-gap: ${value(n, u)}` },
  { test: new RegExp(`^j-gap-y-${NUM}-${UNITS}$`), generate: (_, n, u) => `row-gap: ${value(n, u)}` },
  { test: new RegExp(`^j-top-${NUM}-${UNITS}$`),   generate: (_, n, u) => `top: ${value(n, u)}` },
  { test: new RegExp(`^j-right-${NUM}-${UNITS}$`), generate: (_, n, u) => `right: ${value(n, u)}` },
  { test: new RegExp(`^j-bottom-${NUM}-${UNITS}$`),generate: (_, n, u) => `bottom: ${value(n, u)}` },
  { test: new RegExp(`^j-left-${NUM}-${UNITS}$`),  generate: (_, n, u) => `left: ${value(n, u)}` },
  { test: new RegExp(`^j-size-${NUM}-${UNITS}$`),  generate: (_, n, u) => `width: ${value(n, u)}; height: ${value(n, u)}` },
  { test: new RegExp(`^j-inset-${NUM}-${UNITS}$`), generate: (_, n, u) => `top: ${value(n, u)}; right: ${value(n, u)}; bottom: ${value(n, u)}; left: ${value(n, u)}` },
  { test: new RegExp(`^j-inset-x-${NUM}-${UNITS}$`), generate: (_, n, u) => `left: ${value(n, u)}; right: ${value(n, u)}` },
  { test: new RegExp(`^j-inset-y-${NUM}-${UNITS}$`), generate: (_, n, u) => `top: ${value(n, u)}; bottom: ${value(n, u)}` },
  // ===== Padding (numeric, px default) =====
  { test: new RegExp(`^j-p-${NUM}$`),  generate: (_, n) => `padding: ${px(n)}` },
  { test: new RegExp(`^j-px-${NUM}$`), generate: (_, n) => `padding-left: ${px(n)}; padding-right: ${px(n)}` },
  { test: new RegExp(`^j-py-${NUM}$`), generate: (_, n) => `padding-top: ${px(n)}; padding-bottom: ${px(n)}` },
  { test: new RegExp(`^j-pt-${NUM}$`), generate: (_, n) => `padding-top: ${px(n)}` },
  { test: new RegExp(`^j-pr-${NUM}$`), generate: (_, n) => `padding-right: ${px(n)}` },
  { test: new RegExp(`^j-pb-${NUM}$`), generate: (_, n) => `padding-bottom: ${px(n)}` },
  { test: new RegExp(`^j-pl-${NUM}$`), generate: (_, n) => `padding-left: ${px(n)}` },
  // ===== Margin (positive) =====
  { test: new RegExp(`^j-m-${NUM}$`),  generate: (_, n) => `margin: ${px(n)}` },
  { test: new RegExp(`^j-mx-${NUM}$`), generate: (_, n) => `margin-left: ${px(n)}; margin-right: ${px(n)}` },
  { test: new RegExp(`^j-my-${NUM}$`), generate: (_, n) => `margin-top: ${px(n)}; margin-bottom: ${px(n)}` },
  { test: new RegExp(`^j-mt-${NUM}$`), generate: (_, n) => `margin-top: ${px(n)}` },
  { test: new RegExp(`^j-mr-${NUM}$`), generate: (_, n) => `margin-right: ${px(n)}` },
  { test: new RegExp(`^j-mb-${NUM}$`), generate: (_, n) => `margin-bottom: ${px(n)}` },
  { test: new RegExp(`^j-ml-${NUM}$`), generate: (_, n) => `margin-left: ${px(n)}` },
  // ===== Negative margin =====
  { test: new RegExp(`^j--m-${NUM}$`),  generate: (_, n) => `margin: -${px(n)}` },
  { test: new RegExp(`^j--mx-${NUM}$`), generate: (_, n) => `margin-left: -${px(n)}; margin-right: -${px(n)}` },
  { test: new RegExp(`^j--my-${NUM}$`), generate: (_, n) => `margin-top: -${px(n)}; margin-bottom: -${px(n)}` },
  { test: new RegExp(`^j--mt-${NUM}$`), generate: (_, n) => `margin-top: -${px(n)}` },
  { test: new RegExp(`^j--mb-${NUM}$`), generate: (_, n) => `margin-bottom: -${px(n)}` },
  { test: new RegExp(`^j--ml-${NUM}$`), generate: (_, n) => `margin-left: -${px(n)}` },
  { test: new RegExp(`^j--mr-${NUM}$`), generate: (_, n) => `margin-right: -${px(n)}` },
  // ===== Gap =====
  { test: new RegExp(`^j-gap-${NUM}$`),   generate: (_, n) => `gap: ${px(n)}` },
  { test: new RegExp(`^j-gap-x-${NUM}$`), generate: (_, n) => `column-gap: ${px(n)}` },
  { test: new RegExp(`^j-gap-y-${NUM}$`), generate: (_, n) => `row-gap: ${px(n)}` },
  // ===== Size =====
  { test: new RegExp(`^j-w-${NUM}$`),     generate: (_, n) => `width: ${px(n)}` },
  { test: new RegExp(`^j-h-${NUM}$`),     generate: (_, n) => `height: ${px(n)}` },
  { test: new RegExp(`^j-min-w-${NUM}$`), generate: (_, n) => `min-width: ${px(n)}` },
  { test: new RegExp(`^j-min-h-${NUM}$`), generate: (_, n) => `min-height: ${px(n)}` },
  { test: new RegExp(`^j-max-w-${NUM}$`), generate: (_, n) => `max-width: ${px(n)}` },
  { test: new RegExp(`^j-max-h-${NUM}$`), generate: (_, n) => `max-height: ${px(n)}` },
  { test: new RegExp(`^j-z-${NUM}$`),     generate: (_, n) => `z-index: ${n}` },
  { test: /^j--z-(\d+)$/,                 generate: (_, n) => `z-index: -${n}` },
  // ===== Size shorthand (width + height) =====
  { test: new RegExp(`^j-size-${NUM}$`),  generate: (_, n) => `width: ${px(n)}; height: ${px(n)}` },
  // ===== Positions =====
  { test: new RegExp(`^j-top-${NUM}$`),    generate: (_, n) => `top: ${px(n)}` },
  { test: new RegExp(`^j-right-${NUM}$`),  generate: (_, n) => `right: ${px(n)}` },
  { test: new RegExp(`^j-bottom-${NUM}$`), generate: (_, n) => `bottom: ${px(n)}` },
  { test: new RegExp(`^j-left-${NUM}$`),   generate: (_, n) => `left: ${px(n)}` },
  // ===== Negative positions =====
  { test: new RegExp(`^j--top-${NUM}$`),    generate: (_, n) => `top: -${px(n)}` },
  { test: new RegExp(`^j--right-${NUM}$`),  generate: (_, n) => `right: -${px(n)}` },
  { test: new RegExp(`^j--bottom-${NUM}$`), generate: (_, n) => `bottom: -${px(n)}` },
  { test: new RegExp(`^j--left-${NUM}$`),   generate: (_, n) => `left: -${px(n)}` },
  // ===== Inset =====
  { test: new RegExp(`^j-inset-${NUM}$`),   generate: (_, n) => `top: ${px(n)}; right: ${px(n)}; bottom: ${px(n)}; left: ${px(n)}` },
  { test: new RegExp(`^j-inset-x-${NUM}$`), generate: (_, n) => `left: ${px(n)}; right: ${px(n)}` },
  { test: new RegExp(`^j-inset-y-${NUM}$`), generate: (_, n) => `top: ${px(n)}; bottom: ${px(n)}` },
  { test: new RegExp(`^j--inset-${NUM}$`),  generate: (_, n) => `top: -${px(n)}; right: -${px(n)}; bottom: -${px(n)}; left: -${px(n)}` },
  // ===== Space between =====
  { test: new RegExp(`^j-space-x-${NUM}$`), generate: (_, n) => ({ rule: `.j-space-x-${n} > * + * { margin-left: ${px(n)} }` }) },
  { test: new RegExp(`^j-space-y-${NUM}$`), generate: (_, n) => ({ rule: `.j-space-y-${n} > * + * { margin-top: ${px(n)} }` }) },
  // ===== Divide =====
  { test: /^j-divide-x$/, generate: () => ({ rule: ".j-divide-x > * + * { border-left-width: 1px; border-left-style: solid; border-color: inherit }" }) },
  { test: /^j-divide-y$/, generate: () => ({ rule: ".j-divide-y > * + * { border-top-width: 1px; border-top-style: solid; border-color: inherit }" }) },
  // ===== Aspect ratio =====
  { test: /^j-aspect-(\d+)-(\d+)$/, generate: (_, a, b) => `aspect-ratio: ${a} / ${b}` },
  // ===== Opacity =====
  { test: /^j-opacity-(\d+)$/, generate: (_, n) => {
    const v = Math.min(1000, Math.max(0, parseInt(n, 10)));
    const val = v <= 100 ? (v / 100).toFixed(2) : (v / 1000).toFixed(3);
    return `opacity: ${parseFloat(val)}`;
  }},
  // ===== Transition duration =====
  { test: /^j-duration-(\d+)-s$/, generate: (_, n) => `transition-duration: ${n}s` },
  { test: /^j-duration-(\d+)$/, generate: (_, n) => `transition-duration: ${n}ms` },
  // ===== Transition delay =====
  { test: /^j-delay-(\d+)-s$/, generate: (_, n) => `transition-delay: ${n}s` },
  { test: /^j-delay-(\d+)$/, generate: (_, n) => `transition-delay: ${n}ms` },
  // ===== Animation =====
  { test: /^j-animate-([a-zA-Z0-9]+)-(\d+)-s$/, generate: (_, name, n) => `animation: j-${name} ${n}s ease both` },
  { test: /^j-animate-([a-zA-Z0-9]+)-(\d+)$/, generate: (_, name, n) => `animation: j-${name} ${n}ms ease both` },
  // ===== Line height numeric =====
  { test: /^j-leading-(\d+)$/, generate: (_, n) => `line-height: ${n}` },
  { test: /^j-leading-(\d+)-(\d+)$/, generate: (_, a, b) => `line-height: ${a}.${b}` },
  // ===== Letter spacing numeric =====
  { test: /^j-tracking-(-?\d+)$/, generate: (_, n) => `letter-spacing: ${n === "0" ? "0" : n + "em"}` },
  // ===== Grid =====
  { test: new RegExp(`^j-grid-cols-${NUM}$`), generate: (_, n) => `grid-template-columns: repeat(${n}, minmax(0, 1fr))` },
  { test: new RegExp(`^j-grid-rows-${NUM}$`), generate: (_, n) => `grid-template-rows: repeat(${n}, minmax(0, 1fr))` },
  { test: new RegExp(`^j-col-span-${NUM}$`),  generate: (_, n) => `grid-column: span ${n} / span ${n}` },
  { test: new RegExp(`^j-row-span-${NUM}$`),  generate: (_, n) => `grid-row: span ${n} / span ${n}` },
  { test: new RegExp(`^j-col-start-${NUM}$`), generate: (_, n) => `grid-column-start: ${n}` },
  { test: new RegExp(`^j-col-end-${NUM}$`),   generate: (_, n) => `grid-column-end: ${n}` },
  { test: new RegExp(`^j-row-start-${NUM}$`), generate: (_, n) => `grid-row-start: ${n}` },
  { test: new RegExp(`^j-row-end-${NUM}$`),   generate: (_, n) => `grid-row-end: ${n}` },
  // ===== Outline width/offset =====
  { test: new RegExp(`^j-outline-${NUM}$`),        generate: (_, n) => `outline-width: ${px(n)}` },
  { test: new RegExp(`^j-outline-offset-${NUM}$`), generate: (_, n) => `outline-offset: ${px(n)}` },
  // ===== Typography: font-size numeric =====
  { test: /^j-text-(\d+)-(rem|pt|pc|cm|mm|in|Q)$/, generate: (_, n, unit) => `font-size: ${n}${unit}` },
  { test: new RegExp(`^j-text-${NUM}$`), generate: (_, n) => `font-size: ${px(n)}` },
  // j-text-lg-N, j-text-sm-N, j-text-xl-N scale helpers
  { test: /^j-text-lg-(\d+)$/, generate: (_, n) => `font-size: ${Number(n) * 1.125}rem` },
  { test: /^j-text-sm-(\d+)$/, generate: (_, n) => `font-size: ${(0.875 / Number(n)).toFixed(4).replace(/\.?0+$/, "")}rem` },
  { test: /^j-text-xl-(\d+)$/, generate: (_, n) => `font-size: ${1.25 + Number(n) * 0.25}rem` },
  // ===== Colors (text, bg, border) with shade: j-text-{color}-{n} =====
  { test: new RegExp(`^j-text-(${COLOR_NAMES})-(\\d+)$`),   generate: (_, color, num) => colorDecl("color", color, num) },
  { test: new RegExp(`^j-bg-(${COLOR_NAMES})-(\\d+)$`),    generate: (_, color, num) => colorDecl("background-color", color, num) },
  { test: new RegExp(`^j-border-(${COLOR_NAMES})-(\\d+)$`), generate: (_, color, num) => colorDecl("border-color", color, num) },
  // ===== Color opacity modifier: j-bg-{color}-{shade}/{opacity} — e.g. j-bg-blue-500/50 =====
  {
    test: new RegExp(`^j-bg-(${COLOR_NAMES})-(\\d+)/(\\d+)$`),
    generate: (_, color, shade, opacity) => {
      const palette = PALETTE[color];
      if (!palette) return null;
      const hex = palette[closestShade(parseInt(shade, 10))];
      if (!hex) return null;
      const rgb = hexToRgb(hex);
      if (!rgb) return null;
      const pct = Math.min(100, Math.max(0, parseInt(opacity, 10)));
      return `background-color: rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${pct}%)`;
    },
  },
  {
    test: new RegExp(`^j-text-(${COLOR_NAMES})-(\\d+)/(\\d+)$`),
    generate: (_, color, shade, opacity) => {
      const palette = PALETTE[color];
      if (!palette) return null;
      const hex = palette[closestShade(parseInt(shade, 10))];
      if (!hex) return null;
      const rgb = hexToRgb(hex);
      if (!rgb) return null;
      const pct = Math.min(100, Math.max(0, parseInt(opacity, 10)));
      return `color: rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${pct}%)`;
    },
  },
  {
    test: new RegExp(`^j-border-(${COLOR_NAMES})-(\\d+)/(\\d+)$`),
    generate: (_, color, shade, opacity) => {
      const palette = PALETTE[color];
      if (!palette) return null;
      const hex = palette[closestShade(parseInt(shade, 10))];
      if (!hex) return null;
      const rgb = hexToRgb(hex);
      if (!rgb) return null;
      const pct = Math.min(100, Math.max(0, parseInt(opacity, 10)));
      return `border-color: rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${pct}%)`;
    },
  },
  // ===== Ring by color =====
  {
    test: new RegExp(`^j-ring-(${COLOR_NAMES})-(\\d+)$`),
    generate: (_, color, shade) => {
      const palette = PALETTE[color];
      if (!palette) return null;
      const hex = palette[closestShade(parseInt(shade, 10))];
      return hex ? `box-shadow: 0 0 0 3px ${hex}` : null;
    },
  },
  // ===== Border radius numeric =====
  { test: /^j-rounded-\d+$/, generate: (cls) => {
    const n = cls.slice("j-rounded-".length);
    return `border-radius: ${n === "0" ? "0" : n + "px"}`;
  }},
  // ===== Border width numeric =====
  { test: /^j-border-(\d+)$/, generate: (_, n) => `border-width: ${px(n)}; border-style: solid` },
  // ===== Transforms =====
  { test: /^j-scale-(\d+)$/,   generate: (_, n) => `transform: scale(${parseInt(n, 10) / 100})` },
  { test: /^j-scale-x-(\d+)$/, generate: (_, n) => `transform: scaleX(${parseInt(n, 10) / 100})` },
  { test: /^j-scale-y-(\d+)$/, generate: (_, n) => `transform: scaleY(${parseInt(n, 10) / 100})` },
  { test: /^j-rotate-(\d+)$/,  generate: (_, n) => `transform: rotate(${n}deg)` },
  { test: /^j--rotate-(\d+)$/, generate: (_, n) => `transform: rotate(-${n}deg)` },
  { test: new RegExp(`^j-translate-x-${NUM}$`),  generate: (_, n) => `transform: translateX(${px(n)})` },
  { test: new RegExp(`^j-translate-y-${NUM}$`),  generate: (_, n) => `transform: translateY(${px(n)})` },
  { test: new RegExp(`^j--translate-x-${NUM}$`), generate: (_, n) => `transform: translateX(-${px(n)})` },
  { test: new RegExp(`^j--translate-y-${NUM}$`), generate: (_, n) => `transform: translateY(-${px(n)})` },
  { test: /^j-translate-x-(\d+)-(\d+)$/, generate: (_, a, b) => `transform: translateX(${a}.${b}rem)` },
  { test: /^j-translate-y-(\d+)-(\d+)$/, generate: (_, a, b) => `transform: translateY(${a}.${b}rem)` },
  { test: /^j-skew-x-(\d+)$/, generate: (_, n) => `transform: skewX(${n}deg)` },
  { test: /^j-skew-y-(\d+)$/, generate: (_, n) => `transform: skewY(${n}deg)` },
  // ===== Filters =====
  { test: /^j-blur-(\d+)$/,        generate: (_, n) => `filter: blur(${px(n)})` },
  { test: /^j-brightness-(\d+)$/,  generate: (_, n) => `filter: brightness(${parseInt(n, 10) / 100})` },
  { test: /^j-contrast-(\d+)$/,    generate: (_, n) => `filter: contrast(${parseInt(n, 10) / 100})` },
  { test: /^j-saturate-(\d+)$/,    generate: (_, n) => `filter: saturate(${parseInt(n, 10) / 100})` },
  { test: /^j-hue-rotate-(\d+)$/,  generate: (_, n) => `filter: hue-rotate(${n}deg)` },
  { test: /^j--hue-rotate-(\d+)$/, generate: (_, n) => `filter: hue-rotate(-${n}deg)` },
  // ===== Backdrop filters =====
  { test: /^j-backdrop-blur-(\d+)$/,       generate: (_, n) => `backdrop-filter: blur(${px(n)})` },
  { test: /^j-backdrop-brightness-(\d+)$/, generate: (_, n) => `backdrop-filter: brightness(${parseInt(n, 10) / 100})` },
  { test: /^j-backdrop-contrast-(\d+)$/,   generate: (_, n) => `backdrop-filter: contrast(${parseInt(n, 10) / 100})` },
  { test: /^j-backdrop-saturate-(\d+)$/,   generate: (_, n) => `backdrop-filter: saturate(${parseInt(n, 10) / 100})` },
  // ===== Gradient =====
  { test: /^j-gradient-\d+-.+$/, generate: gradientGenerate },
  { test: /^j-bg-gradient-\d+-.+$/, generate: gradientGenerate },
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
