/**
 * Variant prefix definitions for stacked variants (e.g. md:dark:hover:j-w-12).
 * Order: longest prefix first so we strip correctly.
 */
function getDefaultBreakpoints() {
  return [
    { prefix: "2xl:", type: "breakpoint", minWidth: "1536px" },
    { prefix: "xl:", type: "breakpoint", minWidth: "1280px" },
    { prefix: "lg:", type: "breakpoint", minWidth: "1024px" },
    { prefix: "md:", type: "breakpoint", minWidth: "768px" },
    { prefix: "sm:", type: "breakpoint", minWidth: "640px" },
  ];
}

function getDefaultStateVariants() {
  return [
    { prefix: "focus-visible:", type: "pseudo", pseudo: ":focus-visible" },
    { prefix: "group-hover:", type: "group-hover" },
    { prefix: "motion-reduce:", type: "media", media: "(prefers-reduced-motion: reduce)" },
    { prefix: "hover:", type: "pseudo", pseudo: ":hover" },
    { prefix: "focus:", type: "pseudo", pseudo: ":focus" },
    { prefix: "active:", type: "pseudo", pseudo: ":active" },
    { prefix: "disabled:", type: "pseudo", pseudo: ":disabled" },
    { prefix: "first:", type: "pseudo", pseudo: ":first-child" },
    { prefix: "last:", type: "pseudo", pseudo: ":last-child" },
    { prefix: "odd:", type: "pseudo", pseudo: ":nth-child(odd)" },
    { prefix: "even:", type: "pseudo", pseudo: ":nth-child(even)" },
  ];
}

function getThemeVariants() {
  return [
    { prefix: "j-dark:", type: "theme", selector: ".dark" },
    { prefix: "j-light:", type: "theme", selector: ".light" },
  ];
}

/** All variant descriptors (longest prefix first). Merge breakpoints from config later. */
function getAllVariants(breakpointsOverride) {
  const breakpoints = breakpointsOverride && breakpointsOverride.length
    ? breakpointsOverride.map((b) => ({
        prefix: b.prefix.endsWith(":") ? b.prefix : b.prefix + ":",
        type: "breakpoint",
        minWidth: b.minWidth || b.min,
      }))
    : getDefaultBreakpoints();
  return [
    ...breakpoints,
    ...getThemeVariants(),
    ...getDefaultStateVariants(),
  ];
}

/**
 * Parse a class into base class and list of variant descriptors.
 * e.g. "md:dark:hover:j-w-12" → { baseClass: "j-w-12", variants: [breakpoint md, theme dark, pseudo hover] }
 */
function parseVariants(cls, variantList) {
  let rest = cls;
  const variants = [];
  while (rest) {
    const found = variantList.find((v) => rest.startsWith(v.prefix));
    if (!found) break;
    variants.push(found);
    rest = rest.slice(found.prefix.length);
  }
  if (!rest.startsWith("j-")) return null;
  return { baseClass: rest, variants };
}

module.exports = {
  getDefaultBreakpoints,
  getThemeVariants,
  getAllVariants,
  parseVariants,
};
