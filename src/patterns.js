/**
 * Generic utility patterns: any number in pixels (e.g. j-p-12 → padding: 12px).
 * Each pattern has: test (RegExp), generate(className, ...captures) → CSS declaration string.
 */
const NUM = "(\\d+)";

function px(n) {
  return n === "0" ? "0" : `${n}px`;
}

module.exports = [
  // Padding
  { test: new RegExp(`^j-p-${NUM}$`), generate: (_, n) => `padding: ${px(n)}` },
  { test: new RegExp(`^j-px-${NUM}$`), generate: (_, n) => `padding-left: ${px(n)}; padding-right: ${px(n)}` },
  { test: new RegExp(`^j-py-${NUM}$`), generate: (_, n) => `padding-top: ${px(n)}; padding-bottom: ${px(n)}` },
  { test: new RegExp(`^j-pt-${NUM}$`), generate: (_, n) => `padding-top: ${px(n)}` },
  { test: new RegExp(`^j-pr-${NUM}$`), generate: (_, n) => `padding-right: ${px(n)}` },
  { test: new RegExp(`^j-pb-${NUM}$`), generate: (_, n) => `padding-bottom: ${px(n)}` },
  { test: new RegExp(`^j-pl-${NUM}$`), generate: (_, n) => `padding-left: ${px(n)}` },
  // Margin
  { test: new RegExp(`^j-m-${NUM}$`), generate: (_, n) => `margin: ${px(n)}` },
  { test: new RegExp(`^j-mx-${NUM}$`), generate: (_, n) => `margin-left: ${px(n)}; margin-right: ${px(n)}` },
  { test: new RegExp(`^j-my-${NUM}$`), generate: (_, n) => `margin-top: ${px(n)}; margin-bottom: ${px(n)}` },
  { test: new RegExp(`^j-mt-${NUM}$`), generate: (_, n) => `margin-top: ${px(n)}` },
  { test: new RegExp(`^j-mr-${NUM}$`), generate: (_, n) => `margin-right: ${px(n)}` },
  { test: new RegExp(`^j-mb-${NUM}$`), generate: (_, n) => `margin-bottom: ${px(n)}` },
  { test: new RegExp(`^j-ml-${NUM}$`), generate: (_, n) => `margin-left: ${px(n)}` },
  { test: new RegExp(`^j--mt-${NUM}$`), generate: (_, n) => `margin-top: -${px(n)}` },
  { test: new RegExp(`^j--mb-${NUM}$`), generate: (_, n) => `margin-bottom: -${px(n)}` },
  // Gap
  { test: new RegExp(`^j-gap-${NUM}$`), generate: (_, n) => `gap: ${px(n)}` },
  // Size
  { test: new RegExp(`^j-w-${NUM}$`), generate: (_, n) => `width: ${px(n)}` },
  { test: new RegExp(`^j-h-${NUM}$`), generate: (_, n) => `height: ${px(n)}` },
  { test: new RegExp(`^j-min-w-${NUM}$`), generate: (_, n) => `min-width: ${px(n)}` },
  { test: new RegExp(`^j-min-h-${NUM}$`), generate: (_, n) => `min-height: ${px(n)}` },
  { test: new RegExp(`^j-max-w-${NUM}$`), generate: (_, n) => `max-width: ${px(n)}` },
  { test: new RegExp(`^j-max-h-${NUM}$`), generate: (_, n) => `max-height: ${px(n)}` },
  // Typography
  { test: new RegExp(`^j-text-${NUM}$`), generate: (_, n) => `font-size: ${px(n)}` },
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
