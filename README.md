<div align="center">
  <img src="jamilcss/public/JamilCss.webp" alt="JamilCSS" width="80" />
  <h1>JamilCSS</h1>
  <p>Utility-first CSS framework powered by PostCSS. Zero runtime. Any framework.</p>

  [![npm version](https://img.shields.io/npm/v/jamilcss?color=f857a6&labelColor=0f172a&style=flat-square)](https://www.npmjs.com/package/jamilcss)
  [![npm downloads](https://img.shields.io/npm/dw/jamilcss?color=ff5858&labelColor=0f172a&style=flat-square)](https://www.npmjs.com/package/jamilcss)
  [![License: MIT](https://img.shields.io/badge/license-MIT-f857a6?labelColor=0f172a&style=flat-square)](./LICENSE.md)

  **[jamilcss.com](https://jamilcss.com) · [npm](https://www.npmjs.com/package/jamilcss) · [GitHub](https://github.com/khaouitiabdelhakim/JamilCSS)**
</div>

---

## Install

```bash
npm install jamilcss
```

## Setup

**`postcss.config.cjs`**
```js
module.exports = {
  plugins: { jamilcss: {} },
};
```

**`jamil.config.js`** _(optional, auto-loaded)_
```js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  cwd: __dirname,
};
```

**`globals.css`**
```css
@jamilcss;
```

## Usage

```tsx
<div className="j-flex j-items-center j-gap-16 j-p-24 j-rounded-2xl j-bg-gray-900">
  <h1 className="j-text-xl j-font-bold j-text-white">JamilCSS</h1>
  <button className="j-px-16 j-py-8 j-bg-pink-500 j-text-white j-rounded-lg hover:j-opacity-80 j-transition">
    Click
  </button>
</div>
```

## Key features

- **Any numeric value** — `j-w-237`, `j-p-48`, `j-text-23` — no config needed
- **Any unit** — `j-w-12-rem`, `j-p-8-vh`, `j-text-24-pt`
- **Stacked variants** — `md:dark:hover:j-bg-pink-500`
- **22 color families** — shades 50–950 with opacity modifier (`j-bg-pink-500/50`)
- **Animations** — `j-animate-fadein-300`, `j-animate-spin-2-s`
- **Themes** — `j-dark:j-bg-gray-900`, `j-light:j-text-black`

## Docs

Full documentation at **[jamilcss.com](https://jamilcss.com)**

---

MIT © [KHAOUITI Apps](https://www.khaouitiapps.com)
