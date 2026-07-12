import type { ComponentType } from "react";

export type DocEntry = {
  slug: string[];
  title: string;
  description?: string;
  load: () => Promise<{ default: ComponentType<{ components?: Record<string, ComponentType> }> }>;
};

export const docsEntries: DocEntry[] = [
  { slug: [], title: "Introduction", description: "Get started with JamilCSS", load: () => import("@/content/docs/index.mdx") },
  { slug: ["installation"], title: "Installation", description: "Install and configure JamilCSS", load: () => import("@/content/docs/installation.mdx") },
  { slug: ["configuration"], title: "Configuration", description: "Configure content paths and breakpoints", load: () => import("@/content/docs/configuration.mdx") },
  { slug: ["core-concepts", "how-it-works"], title: "How It Works", load: () => import("@/content/docs/core-concepts/how-it-works.mdx") },
  { slug: ["core-concepts", "jamilcss-directive"], title: "The @jamilcss Directive", load: () => import("@/content/docs/core-concepts/jamilcss-directive.mdx") },
  { slug: ["core-concepts", "apply-directive"], title: "The @apply Directive", load: () => import("@/content/docs/core-concepts/apply-directive.mdx") },
  { slug: ["core-concepts", "preflight"], title: "Preflight", load: () => import("@/content/docs/core-concepts/preflight.mdx") },
  { slug: ["layout", "flexbox"], title: "Flexbox", load: () => import("@/content/docs/layout/flexbox.mdx") },
  { slug: ["layout", "grid"], title: "Grid", load: () => import("@/content/docs/layout/grid.mdx") },
  { slug: ["layout", "spacing-sizing"], title: "Spacing & Sizing", load: () => import("@/content/docs/layout/spacing-sizing.mdx") },
  { slug: ["layout", "position"], title: "Position", load: () => import("@/content/docs/layout/position.mdx") },
  { slug: ["layout", "overflow"], title: "Overflow", load: () => import("@/content/docs/layout/overflow.mdx") },
  { slug: ["typography", "font-size"], title: "Font Size", load: () => import("@/content/docs/typography/font-size.mdx") },
  { slug: ["typography", "font-weight-family"], title: "Font Weight & Family", load: () => import("@/content/docs/typography/font-weight-family.mdx") },
  { slug: ["typography", "text-color"], title: "Text Color", load: () => import("@/content/docs/typography/text-color.mdx") },
  { slug: ["typography", "text-modifiers"], title: "Text Modifiers", load: () => import("@/content/docs/typography/text-modifiers.mdx") },
  { slug: ["colors", "palette"], title: "Color Palette", load: () => import("@/content/docs/colors/palette.mdx") },
  { slug: ["colors", "background"], title: "Background", load: () => import("@/content/docs/colors/background.mdx") },
  { slug: ["colors", "border-color"], title: "Border Color", load: () => import("@/content/docs/colors/border-color.mdx") },
  { slug: ["colors", "gradients"], title: "Gradients", load: () => import("@/content/docs/colors/gradients.mdx") },
  { slug: ["colors", "opacity"], title: "Opacity", load: () => import("@/content/docs/colors/opacity.mdx") },
  { slug: ["variants", "breakpoints"], title: "Breakpoints", load: () => import("@/content/docs/variants/breakpoints.mdx") },
  { slug: ["variants", "dark-light-theme"], title: "Dark & Light Theme", load: () => import("@/content/docs/variants/dark-light-theme.mdx") },
  { slug: ["variants", "state-variants"], title: "State Variants", load: () => import("@/content/docs/variants/state-variants.mdx") },
  { slug: ["variants", "stacked-variants"], title: "Stacked Variants", load: () => import("@/content/docs/variants/stacked-variants.mdx") },
  { slug: ["variants", "peer-group"], title: "Peer & Group", load: () => import("@/content/docs/variants/peer-group.mdx") },
  { slug: ["variants", "aria-supports"], title: "ARIA Supports", load: () => import("@/content/docs/variants/aria-supports.mdx") },
  { slug: ["animation", "transitions"], title: "Transitions", load: () => import("@/content/docs/animation/transitions.mdx") },
  { slug: ["animation", "keyframe-animations"], title: "Keyframe Animations", load: () => import("@/content/docs/animation/keyframe-animations.mdx") },
  { slug: ["utilities-reference"], title: "Utilities Reference", description: "Complete table of static utilities", load: () => import("@/content/docs/utilities-reference.mdx") },
];

export function getDoc(slug?: string[]) {
  const key = (slug ?? []).join("/");
  return docsEntries.find((d) => d.slug.join("/") === key);
}

export function getDocUrl(slug: string[]) {
  return slug.length ? `/docs/${slug.join("/")}` : "/docs";
}

export const docsTree = [
  { name: "Getting Started", children: [
    { name: "Introduction", url: "/docs" },
    { name: "Installation", url: "/docs/installation" },
    { name: "Configuration", url: "/docs/configuration" },
  ]},
  { name: "Core Concepts", children: [
    { name: "How It Works", url: "/docs/core-concepts/how-it-works" },
    { name: "The @jamilcss Directive", url: "/docs/core-concepts/jamilcss-directive" },
    { name: "The @apply Directive", url: "/docs/core-concepts/apply-directive" },
    { name: "Preflight", url: "/docs/core-concepts/preflight" },
  ]},
  { name: "Layout", children: [
    { name: "Flexbox", url: "/docs/layout/flexbox" },
    { name: "Grid", url: "/docs/layout/grid" },
    { name: "Spacing & Sizing", url: "/docs/layout/spacing-sizing" },
    { name: "Position", url: "/docs/layout/position" },
    { name: "Overflow", url: "/docs/layout/overflow" },
  ]},
  { name: "Typography", children: [
    { name: "Font Size", url: "/docs/typography/font-size" },
    { name: "Font Weight & Family", url: "/docs/typography/font-weight-family" },
    { name: "Text Color", url: "/docs/typography/text-color" },
    { name: "Text Modifiers", url: "/docs/typography/text-modifiers" },
  ]},
  { name: "Colors", children: [
    { name: "Color Palette", url: "/docs/colors/palette" },
    { name: "Background", url: "/docs/colors/background" },
    { name: "Border Color", url: "/docs/colors/border-color" },
    { name: "Gradients", url: "/docs/colors/gradients" },
    { name: "Opacity", url: "/docs/colors/opacity" },
  ]},
  { name: "Variants", children: [
    { name: "Breakpoints", url: "/docs/variants/breakpoints" },
    { name: "Dark & Light Theme", url: "/docs/variants/dark-light-theme" },
    { name: "State Variants", url: "/docs/variants/state-variants" },
    { name: "Stacked Variants", url: "/docs/variants/stacked-variants" },
    { name: "Peer & Group", url: "/docs/variants/peer-group" },
    { name: "ARIA Supports", url: "/docs/variants/aria-supports" },
  ]},
  { name: "Animation", children: [
    { name: "Transitions", url: "/docs/animation/transitions" },
    { name: "Keyframe Animations", url: "/docs/animation/keyframe-animations" },
  ]},
  { name: "Reference", children: [
    { name: "Utilities Reference", url: "/docs/utilities-reference" },
  ]},
];
