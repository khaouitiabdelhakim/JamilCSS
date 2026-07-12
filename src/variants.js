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
    // Longest prefixes first to avoid partial matches
    { prefix: "focus-visible:", type: "pseudo", pseudo: ":focus-visible" },
    { prefix: "focus-within:", type: "pseudo", pseudo: ":focus-within" },
    { prefix: "placeholder-shown:", type: "pseudo", pseudo: ":placeholder-shown" },
    { prefix: "group-hover:", type: "group-state", groupPseudo: "hover" },
    { prefix: "group-focus:", type: "group-state", groupPseudo: "focus" },
    { prefix: "group-active:", type: "group-state", groupPseudo: "active" },
    { prefix: "group-disabled:", type: "group-state", groupPseudo: "disabled" },
    { prefix: "peer-hover:", type: "peer", peerPseudo: "hover" },
    { prefix: "peer-focus:", type: "peer", peerPseudo: "focus" },
    { prefix: "peer-focus-visible:", type: "peer", peerPseudo: "focus-visible" },
    { prefix: "peer-checked:", type: "peer", peerPseudo: "checked" },
    { prefix: "peer-active:", type: "peer", peerPseudo: "active" },
    { prefix: "peer-disabled:", type: "peer", peerPseudo: "disabled" },
    { prefix: "peer-invalid:", type: "peer", peerPseudo: "invalid" },
    { prefix: "peer-valid:", type: "peer", peerPseudo: "valid" },
    { prefix: "peer-placeholder-shown:", type: "peer", peerPseudo: "placeholder-shown" },
    { prefix: "motion-reduce:", type: "media", media: "(prefers-reduced-motion: reduce)" },
    { prefix: "motion-safe:", type: "media", media: "(prefers-reduced-motion: no-preference)" },
    { prefix: "placeholder:", type: "pseudo", pseudo: "::placeholder" },
    { prefix: "portrait:", type: "media", media: "(orientation: portrait)" },
    { prefix: "landscape:", type: "media", media: "(orientation: landscape)" },
    { prefix: "print:", type: "media", media: "print" },
    { prefix: "hover:", type: "pseudo", pseudo: ":hover" },
    { prefix: "focus:", type: "pseudo", pseudo: ":focus" },
    { prefix: "active:", type: "pseudo", pseudo: ":active" },
    { prefix: "disabled:", type: "pseudo", pseudo: ":disabled" },
    { prefix: "checked:", type: "pseudo", pseudo: ":checked" },
    { prefix: "required:", type: "pseudo", pseudo: ":required" },
    { prefix: "invalid:", type: "pseudo", pseudo: ":invalid" },
    { prefix: "valid:", type: "pseudo", pseudo: ":valid" },
    { prefix: "visited:", type: "pseudo", pseudo: ":visited" },
    { prefix: "first:", type: "pseudo", pseudo: ":first-child" },
    { prefix: "last:", type: "pseudo", pseudo: ":last-child" },
    { prefix: "odd:", type: "pseudo", pseudo: ":nth-child(odd)" },
    { prefix: "even:", type: "pseudo", pseudo: ":nth-child(even)" },
    { prefix: "first-of-type:", type: "pseudo", pseudo: ":first-of-type" },
    { prefix: "last-of-type:", type: "pseudo", pseudo: ":last-of-type" },
    { prefix: "only-child:", type: "pseudo", pseudo: ":only-child" },
    { prefix: "empty:", type: "pseudo", pseudo: ":empty" },
    { prefix: "before:", type: "pseudo", pseudo: "::before" },
    { prefix: "after:", type: "pseudo", pseudo: "::after" },
    { prefix: "selection:", type: "pseudo", pseudo: "::selection" },
    { prefix: "file:", type: "pseudo", pseudo: "::file-selector-button" },
    // Supports feature queries
    { prefix: "supports-grid:", type: "supports", query: "(display: grid)" },
    { prefix: "supports-flex:", type: "supports", query: "(display: flex)" },
    // ARIA attribute variants
    { prefix: "aria-checked:", type: "aria", attr: "aria-checked", val: "true" },
    { prefix: "aria-disabled:", type: "aria", attr: "aria-disabled", val: "true" },
    { prefix: "aria-expanded:", type: "aria", attr: "aria-expanded", val: "true" },
    { prefix: "aria-hidden:", type: "aria", attr: "aria-hidden", val: "true" },
    { prefix: "aria-selected:", type: "aria", attr: "aria-selected", val: "true" },
    { prefix: "aria-required:", type: "aria", attr: "aria-required", val: "true" },
    { prefix: "aria-pressed:", type: "aria", attr: "aria-pressed", val: "true" },
    { prefix: "aria-invalid:", type: "aria", attr: "aria-invalid", val: "true" },
    { prefix: "aria-readonly:", type: "aria", attr: "aria-readonly", val: "true" },
    // Not-* negation variants
    { prefix: "not-disabled:", type: "pseudo", pseudo: ":not(:disabled)" },
    { prefix: "not-first:", type: "pseudo", pseudo: ":not(:first-child)" },
    { prefix: "not-last:", type: "pseudo", pseudo: ":not(:last-child)" },
    { prefix: "not-checked:", type: "pseudo", pseudo: ":not(:checked)" },
    { prefix: "not-focus:", type: "pseudo", pseudo: ":not(:focus)" },
    { prefix: "not-hover:", type: "pseudo", pseudo: ":not(:hover)" },
  ];
}

function getThemeVariants() {
  return [
    { prefix: "j-dark:", type: "theme", selector: ".dark" },
    { prefix: "j-light:", type: "theme", selector: ".light" },
  ];
}

/** All variant descriptors (longest prefix first). */
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
 * e.g. "md:dark:hover:j-w-12" → { baseClass: "j-w-12", variants: [...] }
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
