# JamilCSS

Utility-first CSS with the **same mechanism as Tailwind**: use a single directive in your CSS and a PostCSS plugin scans your `.tsx` / `.jsx` (and HTML) and compiles only the `j-*` utility classes you actually use.

**Open source · Open to collaboration**

Provided by **[KHAOUITI Apps](https://www.khaouitiapps.com)**  
[![Powered by KHAOUITI Apps](https://www.khaouitiapps.com/images/powered_by_khaouitiapps_white.png)](https://www.khaouitiapps.com)

## How it works (Tailwind-like)

1. Add **`@jamilcss`** in your global CSS.
2. Configure the **PostCSS plugin** with the paths to your components (content).
3. At build time, the plugin scans those files for `j-*` class names and injects only the matching utility CSS.

## Setup (e.g. Next.js)

### 1. Install

```bash
npm install jamilcss
```

### 2. PostCSS config

Create `postcss.config.cjs` (or `postcss.config.js`) in your project root:

```js
module.exports = {
  plugins: {
    jamilcss: {},
  },
};
```

If you add a **`jamil.config.js`** (or `jamil.config.cjs`) in your project root, the plugin will load it automatically. Then you can leave the PostCSS config as above.

**Optional: `jamil.config.js`** in the project root:

```js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  cwd: __dirname,
};
```

- **content**: globs for files to scan (where you use `j-*` classes).
- **cwd**: directory to resolve globs from (usually `__dirname`).
- **cssEntry** (optional): path to the CSS file that contains `@jamilcss` (e.g. `"app/globals.css"`). In development the plugin watches content files and touches this file so the bundler rebuilds; set this if your tool doesn’t pass the source path to PostCSS.

You can still pass options in PostCSS (e.g. `jamilcss: { content: [...], cssEntry: "app/globals.css" }`); they override values from `jamil.config.js`.

### 3. Use `@jamilcss` in your CSS

In your global CSS (e.g. `app/globals.css`):

```css
@jamilcss;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

### 4. Import that CSS in your app

In your root layout or entry (e.g. Next.js `app/layout.tsx`):

```tsx
import "./globals.css";
```

### 5. Use utility classes in JSX/HTML

Only classes that appear in your **content** files are compiled into the final CSS.

```tsx
<div className="j-flex j-items-center j-justify-between j-p-4 j-bg-white j-rounded-lg j-shadow">
  <h1 className="j-text-xl j-font-bold j-text-gray-900">Title</h1>
  <button className="j-px-4 j-py-2 j-bg-primary j-text-white j-rounded">Click</button>
</div>
```

### Dark / light theme (Tailwind-style variants)

Use **`j-dark:`** and **`j-light:`** prefixes so styles apply only when an ancestor has class `dark` or `light` (e.g. on `<html>`). Add `class="dark"` or `class="light"` to your root element based on user preference or system `prefers-color-scheme`.

```tsx
<div className="j-bg-white j-dark:j-bg-gray-900 j-text-gray-900 j-dark:j-text-gray-100">
  Content adapts to theme
</div>
```

### Responsive breakpoints (Tailwind-style)

Use **`sm:`**, **`md:`**, **`lg:`**, **`xl:`**, **`2xl:`** so styles apply only at that minimum viewport width. Values match Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

```tsx
<div className="j-p-4 md:j-p-8 lg:j-flex lg:j-items-center">
  Padding and layout change by breakpoint
</div>
```

## Generic numeric utilities (any number in px)

You don’t define every value: **any number** works and is compiled to pixels.

| Pattern | Example | CSS |
|--------|---------|-----|
| `j-p-{n}` | `j-p-12` | padding: 12px |
| `j-px-{n}`, `j-py-{n}` | `j-px-8`, `j-py-4` | padding left/right, top/bottom |
| `j-pt-{n}`, `j-pr-{n}`, `j-pb-{n}`, `j-pl-{n}` | `j-pt-16` | padding per side |
| `j-m-{n}`, `j-mt-{n}`, … | `j-m-7`, `j-mb-20` | margin |
| `j-gap-{n}` | `j-gap-24` | gap: 24px |
| `j-w-{n}`, `j-h-{n}` | `j-w-200`, `j-h-100` | width, height |
| `j-text-{n}` | `j-text-14`, `j-text-24` | font-size: n px (default unit) |
| `j-text-{n}-{unit}` | `j-text-24-rem`, `j-text-12-pt` | font-size: n + unit (optional) |
| `j-rounded-{n}` | `j-rounded-8`, `j-rounded-26`, `j-rounded-28` | border-radius: n px (any number) |

**Text size units** (optional; default is `px`): `rem`, `pt` (points), `pc` (picas), `cm`, `mm`, `in`, `Q` (quarter-millimeters). Example: `j-text-24` = 24px, `j-text-24-rem` = 24rem, `j-text-12-pt` = 12pt.

**Typography scale** (base + regex):

| Pattern | Example | CSS |
|--------|---------|-----|
| Bases | `j-text-xs`, `j-text-sm`, `j-text-base`, `j-text-lg`, `j-text-xl` | 0.75rem → 1.25rem |
| `j-text-lg-{n}` | `j-text-lg-1`, `j-text-lg-2` | font-size: n × 1.125rem |
| `j-text-sm-{n}` | `j-text-sm-1`, `j-text-sm-2` | font-size: 0.875÷n rem |
| `j-text-xl-{n}` | `j-text-xl-1`, `j-text-xl-2` | font-size: 1.25 + n×0.25rem |

**Colors** (base + regex, shades 0–1000 map to 50–950):

| Pattern | Example | CSS |
|--------|---------|-----|
| Base | `j-text-blue`, `j-bg-pink` | text/background = 500 shade |
| `j-text-{color}-{n}` | `j-text-gray-700`, `j-text-pink-400` | color: palette shade |
| `j-bg-{color}-{n}` | `j-bg-blue-100`, `j-bg-gray-900` | background-color |
| `j-border-{color}-{n}` | `j-border-pink-400` | border-color |

Color names: **gray, blue, red, green, yellow, orange, pink, purple, indigo, teal, cyan, slate** (plus `j-text-white`, `j-text-black`, `j-text-primary`, etc.).

For buttons with a gradient background, add `j-overflow-hidden` so the gradient is clipped to the rounded corners (e.g. `j-rounded-28 j-overflow-hidden`).

**Gradient** — `j-bg-gradient-{0–360}-{colors}` or `j-gradient-{0–360}-{colors}` (degree + list of colors):

- Named colors (hyphen-separated): `j-bg-gradient-90-blue-black-green-red` → `linear-gradient(90deg, blue, black, green, red)`
- Hex in brackets: `j-bg-gradient-180-[#fff]-[#000]-[#f00]` or `j-bg-gradient-45-[#adf34567]-[#000]` (3–8 hex digits)

Defined in `src/patterns.js`; add more patterns there if you need them.

## Example utilities (static/semantic)

| Category   | Examples |
|-----------|----------|
| Layout    | `j-flex`, `j-flex-col`, `j-grid`, `j-hidden` |
| Flexbox   | `j-items-center`, `j-justify-between`, `j-gap-4` |
| Spacing   | `j-p-4`, `j-m-2`, `j-px-4`, `j-py-2`, `j-mx-auto` |
| Typography| `j-text-xs`–`j-text-xl`, `j-text-lg-N`, `j-text-sm-N`, `j-text-xl-N`, `j-font-bold`, `j-text-center` |
| Colors    | `j-text-{color}`, `j-text-{color}-{0–1000}`, `j-bg-{color}`, `j-bg-{color}-{0–1000}`, `j-border-{color}-{0–1000}` |
| Border    | `j-rounded`, `j-rounded-lg`, `j-border`, `j-border-pink-400` |
| Theme     | `j-dark:j-bg-gray-900`, `j-light:j-text-black` (when ancestor has `.dark` / `.light`) |
| Responsive | `sm:j-p-4`, `md:j-flex`, `lg:j-text-xl`, `xl:j-w-320`, `2xl:j-max-w-2xl` (min-width media queries) |
| Shadow    | `j-shadow-sm`, `j-shadow-md` |
| Width     | `j-w-full`, `j-max-w-md`, `j-min-h-screen` |

New utilities are defined in `src/utilities.js`; patterns (typography scale, color shades, gradients) are in `src/patterns.js`. Reference list in `src/jamil.css`. Rebuild/publish the package after changes.

## Run the Next.js example (JamilCSS)

```bash
cd examples/next-app-tailwind
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The example includes a **notification card** (bell icon, mention text, time) and a **profile card** (gradient header, avatar, stats, button), all styled with JamilCSS only (`j-*` classes). It uses `@jamilcss` in `app/globals.css` and the PostCSS plugin in `postcss.config.cjs`.

### If style changes don’t show up (live reload)

When you change or add `j-*` classes (e.g. gradients), the generated CSS should update. The plugin uses the **same approach as Tailwind CSS**: PostCSS dependency messages plus, in development, touching the source CSS file when content changes. If styles still don’t update:

1. **Set `cssEntry`** in PostCSS so the plugin knows which file to touch (e.g. if your tool doesn’t pass the source path): `jamilcss: { content: [...], cwd: __dirname, cssEntry: "app/globals.css" }`.
2. **Restart and clear cache**: `rm -rf .next && npm run dev`.
3. **Content paths**: ensure **content** globs include the files you edit.
4. **Debug**: `JAMILCSS_DEBUG=1 npm run dev` to see when the plugin runs.

The PostCSS plugin uses an **in-memory cache** (keyed by content file mtimes) so repeated builds are fast; disable it with `jamilcss: { cache: false }` in PostCSS config if needed.

## Optional: use prebuilt CSS (no compiler)

If you don’t use PostCSS, you can still import the full utility CSS and use it like a normal stylesheet:

```tsx
import "jamilcss/dist/jamil.css";
```

All `j-*` utilities are included; no content scanning. Prefer the compiler setup above for smaller, optimized CSS.

---

## Open source & collaboration

JamilCSS is **open source** and **open to collaboration**. Contributions, issues, and ideas are welcome.

**Provided by [KHAOUITI Apps](https://www.khaouitiapps.com)**

[![Powered by KHAOUITI Apps](https://www.khaouitiapps.com/images/powered_by_khaouitiapps_black.png)](https://www.khaouitiapps.com)
