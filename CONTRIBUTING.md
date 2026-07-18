# Contributing to JamilCSS

Thank you for your interest in contributing! JamilCSS is open source and open to collaboration — every issue report, idea, and pull request is welcome.

## Ways to Contribute

- **Bug reports** — Found something broken? Open an issue with a minimal reproduction.
- **Feature requests** — Have an idea for a new utility, pattern, or variant? Open an issue describing the use case.
- **Code contributions** — Bug fixes, new utilities, documentation improvements, or new examples.
- **Spread the word** — Star the repo, share it, write about it.

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/khaouitiabdelhakim/JamilCSS.git
cd JamilCSS
npm install
```

### 2. Understand the structure

| File | Purpose |
|------|---------|
| `src/utilities.js` | Static utility map — class name → CSS declaration |
| `src/patterns.js` | Regex patterns for dynamic numeric utilities and the color palette |
| `src/variants.js` | Variant prefix definitions (breakpoints, pseudo-classes, media, etc.) |
| `src/plugin.js` | PostCSS plugin — scans content, generates CSS, handles directives |
| `src/keyframes.js` | Animation keyframe registry |
| `src/preflight.js` | CSS reset/normalize |

### 3. Make your change

- **New utility** → add to `src/utilities.js`
- **New dynamic pattern** → add a regex entry to `src/patterns.js`
- **New variant** → add to `src/variants.js`
- **Plugin behaviour** → edit `src/plugin.js`

### 4. Test your change locally

Run the Next.js example to verify your change works end to end:

```bash
cd examples/next-app-tailwind
npm install
npm run dev
```

Add your new class to a component and confirm it compiles and renders correctly.

### 5. Run the website locally

```bash
cd jamilcss
npm install
npm run dev
```

Visit `http://localhost:3000` (landing page) and `http://localhost:3000/docs`.

### 6. Open a pull request

- Keep PRs focused — one feature or fix per PR.
- Include a short description of what changed and why.
- If adding a utility, mention the class name and the CSS it emits.
- If fixing a bug, include steps to reproduce and verify the fix.

## Code Style

- Plain JavaScript (no TypeScript) in `src/` — keep it simple.
- Follow the existing patterns in each file.
- No unnecessary dependencies — JamilCSS has zero production runtime dependencies.

## Commit Style

Use short, descriptive commit messages:

```
feat(utilities): add j-cursor-grab utility
fix(plugin): handle class names with brackets correctly
docs: update installation guide for SvelteKit
```

## Support

If you have questions, open a GitHub Discussion or an issue — happy to help.

---

Made with love by [KHAOUITI Apps](https://www.khaouitiapps.com)
