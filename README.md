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
| `j-text-{n}` | `j-text-14` | font-size: 14px |
| `j-rounded-{n}` | `j-rounded-8`, `j-rounded-26`, `j-rounded-28` | border-radius: n px (any number) |

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
| Typography| `j-text-lg`, `j-font-bold`, `j-text-center` |
| Colors    | `j-text-gray-700`, `j-bg-primary`, `j-bg-gray-100` |
| Border    | `j-rounded`, `j-rounded-lg`, `j-border` |
| Shadow    | `j-shadow-sm`, `j-shadow-md` |
| Width     | `j-w-full`, `j-max-w-md`, `j-min-h-screen` |

New utilities are defined in `src/utilities.js` (and optionally mirrored in `src/jamil.css` for reference). Rebuild/publish the package after changes.

## Run the Next.js example (JamilCSS)

```bash
cd examples/next-app-tailwind
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The example uses `@jamilcss` in `app/globals.css` and the PostCSS plugin in `postcss.config.cjs`.

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
