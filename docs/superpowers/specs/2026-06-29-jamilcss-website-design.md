# JamilCSS Website Design Spec

**Date:** 2026-06-29
**Status:** Approved
**Scope:** Next.js 14 TypeScript website with landing page and fumadocs-powered docs

---

## Overview

A Next.js 14 TypeScript site in the `jamilcss/` subdirectory of the JamilCSS monorepo. It serves two purposes: marketing the framework (landing page at `/`) and documenting it completely (docs at `/docs`). The entire site is styled exclusively with JamilCSS `j-*` utility classes — no Tailwind, no other CSS framework. The site itself is a live proof-of-concept for JamilCSS.

---

## Architecture

### Approach

**fumadocs-core (headless) + JamilCSS styling.** Use `fumadocs-core` for MDX processing, routing, page tree generation, and built-in search. Build all UI components (sidebar, TOC, breadcrumbs, search bar, mobile drawer) from scratch with JamilCSS. This satisfies the "JamilCSS only" constraint while retaining fumadocs' core infrastructure.

### Directory Structure

```
jamilcss/                        # Next.js 14 app (App Router, TypeScript)
├── app/
│   ├── layout.tsx               # Root layout — ThemeProvider, font
│   ├── globals.css              # @jamilcss-preflight; @jamilcss;
│   ├── page.tsx                 # Landing page at /
│   └── docs/
│       ├── layout.tsx           # Docs shell: sidebar + TOC wrapper
│       └── [[...slug]]/
│           └── page.tsx         # Dynamic MDX renderer via fumadocs-core
├── content/docs/                # MDX source files (20 pages)
│   ├── index.mdx
│   ├── installation.mdx
│   ├── configuration.mdx
│   ├── core-concepts/
│   │   ├── how-it-works.mdx
│   │   ├── jamilcss-directive.mdx
│   │   ├── apply-directive.mdx
│   │   └── preflight.mdx
│   ├── layout/
│   │   ├── flexbox.mdx
│   │   ├── grid.mdx
│   │   ├── spacing-sizing.mdx
│   │   ├── position.mdx
│   │   └── overflow.mdx
│   ├── typography/
│   │   ├── font-size.mdx
│   │   ├── font-weight-family.mdx
│   │   ├── text-color.mdx
│   │   └── text-modifiers.mdx
│   ├── colors/
│   │   ├── palette.mdx
│   │   ├── background.mdx
│   │   ├── border-color.mdx
│   │   ├── gradients.mdx
│   │   └── opacity.mdx
│   ├── variants/
│   │   ├── breakpoints.mdx
│   │   ├── dark-light-theme.mdx
│   │   ├── state-variants.mdx
│   │   ├── stacked-variants.mdx
│   │   ├── peer-group.mdx
│   │   └── aria-supports.mdx
│   ├── animation/
│   │   ├── transitions.mdx
│   │   └── keyframe-animations.mdx
│   └── utilities-reference.mdx
├── components/
│   ├── docs/
│   │   ├── Sidebar.tsx          # Collapsible section nav
│   │   ├── TableOfContents.tsx  # Right-column anchor list
│   │   ├── Breadcrumb.tsx
│   │   ├── SearchBar.tsx        # fumadocs-core search integration
│   │   └── MobileDrawer.tsx     # Mobile hamburger nav
│   └── landing/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── FeatureCards.tsx
│       ├── ColorPalette.tsx
│       ├── CodeExample.tsx
│       ├── AnimationDemo.tsx
│       └── Footer.tsx
├── lib/
│   └── source.ts                # fumadocs-core loader + page tree
├── postcss.config.cjs           # { plugins: { jamilcss: {} } }
├── jamil.config.js              # content globs for app/ + components/ + content/
├── next.config.ts               # MDX support via fumadocs-mdx
└── package.json                 # "jamilcss": "file:../"
```

### Dependencies

- `next` 14, `react`, `react-dom`, `typescript`
- `fumadocs-core` — headless MDX source, page tree, search
- `fumadocs-mdx` — MDX compilation pipeline for Next.js; handles rendering
- `jamilcss: "file:../"` — local reference to the framework being demoed

---

## Landing Page (`/`)

Seven sections, all styled with `j-*` classes only. Theme toggle flips `class="dark"` on `<html>`.

### 1. Navbar
Sticky with backdrop blur. Logo text "JamilCSS" on the left. Right: "Docs" link, "GitHub" link, theme toggle button (sun/moon icon). Uses `j-dark:j-bg-gray-900/80` for dark mode.

### 2. Hero
Full-viewport section. Large headline: *"Utility-first CSS, your way."* Subtext: one paragraph explaining the `j-*` system and PostCSS plugin. Two CTAs: `Get Started` (→ `/docs`) and `View on GitHub`. Below CTAs: a syntax-highlighted code block showing a real JSX component with `j-*` classes.

### 3. Feature Cards (3-column grid)
Three cards highlighting:
- **PostCSS compiler** — scan & compile only used classes
- **Generic numeric utilities** — `j-p-12`, `j-w-200-rem`, any number works
- **Stacked variants** — `md:dark:hover:j-w-12`, combine breakpoint + theme + state

### 4. Color Palette Showcase
Animated swatch grid showing all 22 color families (gray, blue, red, green, yellow, orange, pink, purple, indigo, teal, cyan, slate, rose, sky, lime, emerald, violet, fuchsia, amber, zinc, neutral, stone) with shades 100–900.

### 5. Code Example Section
Split layout: left = JSX code block with `j-*` classes, right = live rendered preview of the resulting component.

### 6. Animation Demo
Row of boxes each running a named keyframe: `j-animate-fadein-300`, `j-animate-spin-2-s`, `j-animate-pulse-1-s`, `j-animate-bounce-800`. Labels below each box show the class name used.

### 7. Footer
"Open source · Provided by KHAOUITI Apps" with GitHub link. Dark-mode aware.

---

## Docs (`/docs`)

### Shell Layout
- **Left sidebar** (fixed on desktop, drawer on mobile): collapsible sections, active page highlight, built from fumadocs-core page tree
- **Center content**: MDX rendered with prose styling using `j-*` typography classes
- **Right column**: Table of Contents with anchor links auto-generated from headings
- **Top bar**: breadcrumb trail + search bar (fumadocs-core `createSearchAPI`)

### Content Map (20 MDX pages)

| Section | Pages |
|---|---|
| Getting Started | index, installation, configuration |
| Core Concepts | how-it-works, jamilcss-directive, apply-directive, preflight |
| Layout | flexbox, grid, spacing-sizing, position, overflow |
| Typography | font-size, font-weight-family, text-color, text-modifiers |
| Colors | palette, background, border-color, gradients, opacity |
| Variants | breakpoints, dark-light-theme, state-variants, stacked-variants, peer-group, aria-supports |
| Animation | transitions, keyframe-animations |
| Reference | utilities-reference |

Each page contains: explanation paragraph, syntax/options table, one or more code block examples with real `j-*` classes. The Reference page is a complete searchable table of all static utilities from `utilities.js`.

### MDX Components

Custom MDX components passed to the renderer:
- `<Callout>` — info/warning/tip boxes styled with `j-*`
- `<CodeBlock>` — syntax-highlighted code with copy button
- `<PropTable>` — utility reference table rows

---

## Styling Contract

- **No Tailwind.** No `className="flex"` or any non-`j-*` utility.
- All layout, spacing, color, typography done with `j-*` classes.
- Dark mode: `j-dark:` variants activated by `class="dark"` on `<html>`.
- Responsive: `sm:`, `md:`, `lg:` prefixes for breakpoints.
- JamilCSS referenced as local file dep so changes to the framework are immediately reflected in the site.

---

## Out of Scope

- Versioned docs
- i18n / localization
- Authentication
- Blog section
- Interactive playground (class → CSS compiler in-browser)
