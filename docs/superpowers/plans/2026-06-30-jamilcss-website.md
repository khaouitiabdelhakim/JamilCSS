# JamilCSS Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 14 TypeScript site in `jamilcss/` with a JamilCSS-only landing page at `/` and fumadocs-powered docs at `/docs`, proving the framework in production.

**Architecture:** Scaffold a standalone Next.js App Router app that depends on the parent `jamilcss` package via `"file:.."`. Use `fumadocs-mdx` for MDX compilation and `fumadocs-core` headlessly for page tree, TOC, breadcrumbs, and Orama search — all UI built with `j-*` classes. PostCSS runs the local JamilCSS plugin against `app/`, `components/`, and `content/` globs.

**Tech Stack:** Next.js 14, React 18, TypeScript, fumadocs-core, fumadocs-mdx, shiki (syntax highlighting), Playwright (smoke tests), JamilCSS PostCSS plugin (local `file:..` dep)

---

## File Map

| Path | Responsibility |
|------|----------------|
| `jamilcss/package.json` | App deps, scripts, local jamilcss link |
| `jamilcss/postcss.config.cjs` | JamilCSS PostCSS plugin |
| `jamilcss/jamil.config.js` | Content globs + `cssEntry` |
| `jamilcss/next.config.mjs` | fumadocs-mdx wrapper (ESM) |
| `jamilcss/source.config.ts` | fumadocs-mdx docs collection |
| `jamilcss/tsconfig.json` | `@/*` alias + `collections/*` → `.source/*` |
| `jamilcss/app/layout.tsx` | Root layout, theme script, font |
| `jamilcss/app/globals.css` | `@jamilcss-preflight; @jamilcss;` |
| `jamilcss/app/page.tsx` | Landing page composition |
| `jamilcss/app/docs/layout.tsx` | Docs shell (sidebar + TOC + top bar) |
| `jamilcss/app/docs/[[...slug]]/page.tsx` | MDX page renderer |
| `jamilcss/lib/source.ts` | fumadocs-core loader |
| `jamilcss/lib/search.ts` | `createFromSource` search API |
| `jamilcss/lib/theme.tsx` | `ThemeProvider` + `useTheme` |
| `jamilcss/lib/utilities-data.ts` | Static utilities table data from parent `utilities.js` |
| `jamilcss/components/landing/*` | 7 landing sections |
| `jamilcss/components/docs/*` | 5 docs shell components |
| `jamilcss/components/mdx/*` | Callout, CodeBlock, PropTable |
| `jamilcss/content/docs/**` | 20 MDX pages |
| `jamilcss/e2e/smoke.spec.ts` | Playwright smoke tests |
| `jamilcss/playwright.config.ts` | Playwright config |

---

### Task 1: Scaffold Next.js app + Playwright harness

**Files:**
- Create: `jamilcss/package.json`
- Create: `jamilcss/tsconfig.json`
- Create: `jamilcss/next-env.d.ts`
- Create: `jamilcss/.gitignore`
- Create: `jamilcss/playwright.config.ts`
- Create: `jamilcss/e2e/smoke.spec.ts`

- [ ] **Step 1: Create `jamilcss/package.json`**

```json
{
  "name": "jamilcss-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install chromium"
  },
  "dependencies": {
    "fumadocs-core": "^15.0.0",
    "fumadocs-mdx": "^11.0.0",
    "jamilcss": "file:..",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "shiki": "^1.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "@types/mdx": "^2.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `jamilcss/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "collections/*": ["./.source/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".source/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create minimal app stubs so install succeeds**

Create `jamilcss/app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `jamilcss/app/page.tsx`:

```tsx
export default function Home() {
  return <main>JamilCSS</main>;
}
```

- [ ] **Step 4: Write failing Playwright smoke test**

Create `jamilcss/playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

Create `jamilcss/e2e/smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /utility-first css/i })).toBeVisible();
});
```

- [ ] **Step 5: Install dependencies and run test (expect FAIL)**

```bash
cd jamilcss && npm install && npx playwright install chromium && npm run test:e2e
```

Expected: FAIL — heading not found (page only shows "JamilCSS")

- [ ] **Step 6: Commit**

```bash
git add jamilcss/
git commit -m "feat(website): scaffold Next.js app with Playwright harness"
```

---

### Task 2: JamilCSS PostCSS integration

**Files:**
- Create: `jamilcss/postcss.config.cjs`
- Create: `jamilcss/jamil.config.js`
- Create: `jamilcss/app/globals.css`
- Modify: `jamilcss/app/layout.tsx`

- [ ] **Step 1: Create PostCSS + JamilCSS config**

`jamilcss/postcss.config.cjs`:

```js
module.exports = {
  plugins: {
    jamilcss: {},
  },
};
```

`jamilcss/jamil.config.js`:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  cwd: __dirname,
  cssEntry: "app/globals.css",
};
```

`jamilcss/app/globals.css`:

```css
@jamilcss-preflight;
@jamilcss;
```

- [ ] **Step 2: Import globals in root layout**

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="j-bg-white j-dark:j-bg-gray-900 j-text-gray-900 j-dark:j-text-gray-100">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build compiles JamilCSS**

```bash
cd jamilcss && npm run build
```

Expected: PASS — no PostCSS errors; `.next` output created

- [ ] **Step 4: Commit**

```bash
git add jamilcss/postcss.config.cjs jamilcss/jamil.config.js jamilcss/app/globals.css jamilcss/app/layout.tsx
git commit -m "feat(website): wire JamilCSS PostCSS plugin and preflight"
```

---

### Task 3: Theme provider + dark mode

**Files:**
- Create: `jamilcss/lib/theme.tsx`
- Modify: `jamilcss/app/layout.tsx`
- Create: `jamilcss/components/ThemeToggle.tsx`

- [ ] **Step 1: Create theme context**

`jamilcss/lib/theme.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("jamilcss-theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("jamilcss-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

- [ ] **Step 2: Create ThemeToggle**

`jamilcss/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="j-p-2 j-rounded-lg j-border j-border-gray-200 j-dark:j-border-gray-700 hover:j-bg-gray-100 j-dark:hover:j-bg-gray-800 j-transition"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

- [ ] **Step 3: Wrap layout with ThemeProvider**

```tsx
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="j-bg-white j-dark:j-bg-gray-900 j-text-gray-900 j-dark:j-text-gray-100 j-antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Add theme toggle e2e test**

Add to `jamilcss/e2e/smoke.spec.ts`:

```ts
test("theme toggle adds dark class to html", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
```

Run: `cd jamilcss && npm run test:e2e` — FAIL until landing Navbar renders ThemeToggle (Task 5)

- [ ] **Step 5: Commit**

```bash
git add jamilcss/lib/theme.tsx jamilcss/components/ThemeToggle.tsx jamilcss/app/layout.tsx jamilcss/e2e/smoke.spec.ts
git commit -m "feat(website): add theme provider and toggle"
```

---

### Task 4: Landing page — Navbar + Hero

**Files:**
- Create: `jamilcss/components/landing/Navbar.tsx`
- Create: `jamilcss/components/landing/Hero.tsx`
- Modify: `jamilcss/app/page.tsx`

- [ ] **Step 1: Create Navbar**

`jamilcss/components/landing/Navbar.tsx`:

```tsx
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="j-sticky j-top-0 j-z-50 j-border-b j-border-gray-200/60 j-dark:j-border-gray-800/60 j-bg-white/80 j-dark:j-bg-gray-900/80 j-backdrop-blur">
      <nav className="j-container j-flex j-items-center j-justify-between j-py-4">
        <Link href="/" className="j-text-xl j-font-bold j-text-gray-900 j-dark:j-text-white">
          JamilCSS
        </Link>
        <div className="j-flex j-items-center j-gap-6">
          <Link href="/docs" className="j-text-gray-600 j-dark:j-text-gray-300 hover:j-text-gray-900 j-dark:hover:j-text-white">
            Docs
          </Link>
          <a
            href="https://github.com/khaouitiabdelhakim/JamilCSS"
            target="_blank"
            rel="noopener noreferrer"
            className="j-text-gray-600 j-dark:j-text-gray-300 hover:j-text-gray-900 j-dark:hover:j-text-white"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create Hero**

`jamilcss/components/landing/Hero.tsx`:

```tsx
import Link from "next/link";

const EXAMPLE = `<div className="j-flex j-items-center j-gap-4 j-p-6 j-bg-white j-dark:j-bg-gray-800 j-rounded-xl j-shadow-md">
  <span className="j-w-12 j-h-12 j-rounded-full j-bg-blue-500" />
  <div>
    <p className="j-font-semibold j-text-gray-900 j-dark:j-text-white">JamilCSS</p>
    <p className="j-text-sm j-text-gray-500">Utility-first, your way</p>
  </div>
</div>`;

export function Hero() {
  return (
    <section className="j-min-h-screen j-flex j-flex-col j-items-center j-justify-center j-px-4 j-py-24 j-text-center">
      <h1 className="j-text-5xl md:j-text-6xl j-font-bold j-tracking-tight j-text-gray-900 j-dark:j-text-white j-mb-6">
        Utility-first CSS, your way.
      </h1>
      <p className="j-max-w-2xl j-text-lg j-text-gray-600 j-dark:j-text-gray-300 j-mb-10">
        JamilCSS gives you Tailwind-style <code className="j-font-mono j-text-blue-600 j-dark:j-text-blue-400">j-*</code> utility
        classes compiled by a PostCSS plugin. Scan your components, emit only what you use, stack breakpoints,
        themes, and states in one class.
      </p>
      <div className="j-flex j-flex-wrap j-gap-4 j-justify-center j-mb-16">
        <Link
          href="/docs"
          className="j-px-6 j-py-3 j-bg-blue-600 hover:j-bg-blue-700 j-text-white j-font-medium j-rounded-lg j-transition"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/khaouitiabdelhakim/JamilCSS"
          target="_blank"
          rel="noopener noreferrer"
          className="j-px-6 j-py-3 j-border j-border-gray-300 j-dark:j-border-gray-600 hover:j-bg-gray-50 j-dark:hover:j-bg-gray-800 j-font-medium j-rounded-lg j-transition"
        >
          View on GitHub
        </a>
      </div>
      <pre className="j-max-w-xl j-w-full j-text-left j-p-6 j-bg-gray-900 j-text-gray-100 j-rounded-xl j-overflow-x-auto j-text-sm j-font-mono">
        <code>{EXAMPLE}</code>
      </pre>
    </section>
  );
}
```

- [ ] **Step 3: Compose landing page (partial)**

```tsx
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
```

- [ ] **Step 4: Run e2e — hero heading test should PASS**

```bash
cd jamilcss && npm run test:e2e -- --grep "landing page loads"
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add jamilcss/components/landing/ jamilcss/app/page.tsx
git commit -m "feat(website): add landing navbar and hero"
```

---

### Task 5: Landing page — FeatureCards, ColorPalette, CodeExample

**Files:**
- Create: `jamilcss/components/landing/FeatureCards.tsx`
- Create: `jamilcss/components/landing/ColorPalette.tsx`
- Create: `jamilcss/components/landing/CodeExample.tsx`
- Modify: `jamilcss/app/page.tsx`

- [ ] **Step 1: Create FeatureCards (3-column grid)**

`jamilcss/components/landing/FeatureCards.tsx`:

```tsx
const FEATURES = [
  {
    title: "PostCSS compiler",
    body: "Scan your JSX and compile only the j-* classes you actually use. Smaller CSS, faster builds.",
    icon: "⚡",
  },
  {
    title: "Generic numeric utilities",
    body: "Any number works: j-p-12, j-w-200-rem, j-text-24-pt. No config file per value.",
    icon: "🔢",
  },
  {
    title: "Stacked variants",
    body: "Combine breakpoint, theme, and state: md:dark:hover:j-w-12 in a single class name.",
    icon: "📚",
  },
];

export function FeatureCards() {
  return (
    <section className="j-py-24 j-px-4 j-bg-gray-50 j-dark:j-bg-gray-950">
      <div className="j-container">
        <h2 className="j-text-3xl j-font-bold j-text-center j-mb-12 j-text-gray-900 j-dark:j-text-white">
          Why JamilCSS
        </h2>
        <div className="j-grid md:j-grid-cols-3 j-gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="j-p-8 j-bg-white j-dark:j-bg-gray-900 j-rounded-xl j-border j-border-gray-200 j-dark:j-border-gray-800 j-shadow-sm"
            >
              <span className="j-text-3xl j-mb-4 j-block">{f.icon}</span>
              <h3 className="j-text-xl j-font-semibold j-mb-2 j-text-gray-900 j-dark:j-text-white">{f.title}</h3>
              <p className="j-text-gray-600 j-dark:j-text-gray-400">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create ColorPalette (22 families × shades 100–900)**

`jamilcss/components/landing/ColorPalette.tsx`:

```tsx
const FAMILIES = [
  "gray", "blue", "red", "green", "yellow", "orange", "pink", "purple", "indigo",
  "teal", "cyan", "slate", "rose", "sky", "lime", "emerald", "violet", "fuchsia",
  "amber", "zinc", "neutral", "stone",
] as const;

const SHADES = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export function ColorPalette() {
  return (
    <section className="j-py-24 j-px-4">
      <div className="j-container">
        <h2 className="j-text-3xl j-font-bold j-text-center j-mb-4 j-text-gray-900 j-dark:j-text-white">
          22 color families
        </h2>
        <p className="j-text-center j-text-gray-600 j-dark:j-text-gray-400 j-mb-12">
          Shades 100–900 via <code className="j-font-mono">j-bg-{"{color}"}-{"{shade}"}</code>
        </p>
        <div className="j-grid j-gap-6">
          {FAMILIES.map((family) => (
            <div key={family} className="j-flex j-flex-col j-gap-2">
              <span className="j-text-sm j-font-medium j-text-gray-700 j-dark:j-text-gray-300 j-capitalize">{family}</span>
              <div className="j-flex j-gap-1 j-overflow-x-auto">
                {SHADES.map((shade) => (
                  <div
                    key={shade}
                    className={`j-w-10 j-h-10 j-rounded j-shrink-0 j-bg-${family}-${shade} j-animate-pulse-1-s`}
                    title={`j-bg-${family}-${shade}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

> **Note:** Each `j-bg-{family}-{shade}` class must appear literally in this file (or a generated constants file) so the PostCSS scanner emits them. If dynamic template strings are not scanned, replace with explicit class names per swatch.

- [ ] **Step 3: Create CodeExample (split layout with live preview)**

`jamilcss/components/landing/CodeExample.tsx`:

```tsx
const CODE = `<button className="j-px-6 j-py-3 j-bg-gradient-90-blue-600-purple-600 j-text-white j-font-semibold j-rounded-28 j-overflow-hidden j-shadow-md hover:j-opacity-90 j-transition">
  Get started
</button>`;

export function CodeExample() {
  return (
    <section className="j-py-24 j-px-4 j-bg-gray-50 j-dark:j-bg-gray-950">
      <div className="j-container j-grid lg:j-grid-cols-2 j-gap-12 j-items-center">
        <pre className="j-p-6 j-bg-gray-900 j-text-gray-100 j-rounded-xl j-overflow-x-auto j-text-sm j-font-mono">
          <code>{CODE}</code>
        </pre>
        <div className="j-flex j-items-center j-justify-center j-p-12 j-bg-white j-dark:j-bg-gray-900 j-rounded-xl j-border j-border-gray-200 j-dark:j-border-gray-800">
          <button
            type="button"
            className="j-px-6 j-py-3 j-bg-gradient-90-blue-600-purple-600 j-text-white j-font-semibold j-rounded-28 j-overflow-hidden j-shadow-md hover:j-opacity-90 j-transition"
          >
            Get started
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add sections to `app/page.tsx`**

```tsx
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { ColorPalette } from "@/components/landing/ColorPalette";
import { CodeExample } from "@/components/landing/CodeExample";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureCards />
      <ColorPalette />
      <CodeExample />
    </>
  );
}
```

- [ ] **Step 5: Build verify**

```bash
cd jamilcss && npm run build
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add jamilcss/components/landing/FeatureCards.tsx jamilcss/components/landing/ColorPalette.tsx jamilcss/components/landing/CodeExample.tsx jamilcss/app/page.tsx
git commit -m "feat(website): add feature cards, color palette, code example sections"
```

---

### Task 6: Landing page — AnimationDemo + Footer

**Files:**
- Create: `jamilcss/components/landing/AnimationDemo.tsx`
- Create: `jamilcss/components/landing/Footer.tsx`
- Modify: `jamilcss/app/page.tsx`
- Modify: `jamilcss/e2e/smoke.spec.ts`

- [ ] **Step 1: Create AnimationDemo**

`jamilcss/components/landing/AnimationDemo.tsx`:

```tsx
const DEMOS = [
  { cls: "j-animate-fadein-300", label: "j-animate-fadein-300" },
  { cls: "j-animate-spin-2-s", label: "j-animate-spin-2-s" },
  { cls: "j-animate-pulse-1-s", label: "j-animate-pulse-1-s" },
  { cls: "j-animate-bounce-800", label: "j-animate-bounce-800" },
];

export function AnimationDemo() {
  return (
    <section className="j-py-24 j-px-4">
      <div className="j-container">
        <h2 className="j-text-3xl j-font-bold j-text-center j-mb-12 j-text-gray-900 j-dark:j-text-white">
          Built-in animations
        </h2>
        <div className="j-flex j-flex-wrap j-justify-center j-gap-12">
          {DEMOS.map((d) => (
            <div key={d.cls} className="j-flex j-flex-col j-items-center j-gap-4">
              <div className={`j-w-16 j-h-16 j-rounded-lg j-bg-blue-500 ${d.cls}`} />
              <code className="j-text-xs j-font-mono j-text-gray-600 j-dark:j-text-gray-400">{d.label}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Footer**

`jamilcss/components/landing/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="j-py-12 j-px-4 j-border-t j-border-gray-200 j-dark:j-border-gray-800 j-bg-white j-dark:j-bg-gray-900">
      <div className="j-container j-flex j-flex-col md:j-flex-row j-items-center j-justify-between j-gap-4 j-text-sm j-text-gray-600 j-dark:j-text-gray-400">
        <p>Open source · Provided by KHAOUITI Apps</p>
        <a
          href="https://github.com/khaouitiabdelhakim/JamilCSS"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:j-text-gray-900 j-dark:hover:j-text-white"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Complete landing page**

```tsx
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { ColorPalette } from "@/components/landing/ColorPalette";
import { CodeExample } from "@/components/landing/CodeExample";
import { AnimationDemo } from "@/components/landing/AnimationDemo";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
        <ColorPalette />
        <CodeExample />
        <AnimationDemo />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run full landing e2e suite**

```bash
cd jamilcss && npm run test:e2e
```

Expected: PASS (landing + theme toggle)

- [ ] **Step 5: Commit**

```bash
git add jamilcss/components/landing/AnimationDemo.tsx jamilcss/components/landing/Footer.tsx jamilcss/app/page.tsx jamilcss/e2e/smoke.spec.ts
git commit -m "feat(website): complete landing page with animations and footer"
```

---

### Task 7: Fumadocs MDX pipeline

**Files:**
- Create: `jamilcss/source.config.ts`
- Create: `jamilcss/next.config.mjs`
- Create: `jamilcss/lib/source.ts`
- Create: `jamilcss/lib/search.ts`
- Create: `jamilcss/content/docs/index.mdx` (stub)
- Create: `jamilcss/app/docs/[[...slug]]/page.tsx` (stub)

- [ ] **Step 1: Create fumadocs-mdx config**

`jamilcss/source.config.ts`:

```ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig();
```

- [ ] **Step 2: Create Next.js config with MDX plugin**

`jamilcss/next.config.mjs`:

```js
import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

const withMDX = createMDX();

export default withMDX(config);
```

- [ ] **Step 3: Create source loader**

`jamilcss/lib/source.ts`:

```ts
import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
```

- [ ] **Step 4: Create search API helper**

`jamilcss/lib/search.ts`:

```ts
import { createFromSource } from "fumadocs-core/search/server";
import { source } from "./source";

export const { GET: searchGET } = createFromSource(source, {
  language: "english",
});
```

Create `jamilcss/app/api/search/route.ts`:

```ts
export { searchGET as GET } from "@/lib/search";
```

- [ ] **Step 5: Create stub MDX + docs page**

`jamilcss/content/docs/index.mdx`:

```mdx
---
title: Introduction
description: Get started with JamilCSS
---

# Introduction

Welcome to JamilCSS documentation.
```

`jamilcss/app/docs/[[...slug]]/page.tsx`:

```tsx
import { source } from "@/lib/source";
import { notFound } from "next/navigation";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <article className="j-prose j-max-w-none">
      <h1 className="j-text-3xl j-font-bold j-mb-4">{page.data.title}</h1>
      <MDX />
    </article>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}
```

- [ ] **Step 6: Build (generates `.source/`)**

```bash
cd jamilcss && npm run build
```

Expected: PASS — `/docs` route compiles

- [ ] **Step 7: Add docs e2e test**

```ts
test("docs index loads", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByRole("heading", { name: "Introduction" })).toBeVisible();
});
```

- [ ] **Step 8: Commit**

```bash
git add jamilcss/source.config.ts jamilcss/next.config.mjs jamilcss/lib/ jamilcss/content/ jamilcss/app/docs/ jamilcss/app/api/
git commit -m "feat(website): integrate fumadocs-mdx and search API"
```

---

### Task 8: MDX components (Callout, CodeBlock, PropTable)

**Files:**
- Create: `jamilcss/components/mdx/Callout.tsx`
- Create: `jamilcss/components/mdx/CodeBlock.tsx`
- Create: `jamilcss/components/mdx/PropTable.tsx`
- Create: `jamilcss/components/mdx/index.tsx`
- Modify: `jamilcss/app/docs/[[...slug]]/page.tsx`

- [ ] **Step 1: Create Callout**

`jamilcss/components/mdx/Callout.tsx`:

```tsx
type Variant = "info" | "warning" | "tip";

const STYLES: Record<Variant, string> = {
  info: "j-bg-blue-50 j-dark:j-bg-blue-950 j-border-blue-200 j-dark:j-border-blue-800 j-text-blue-900 j-dark:j-text-blue-100",
  warning: "j-bg-amber-50 j-dark:j-bg-amber-950 j-border-amber-200 j-dark:j-border-amber-800 j-text-amber-900 j-dark:j-text-amber-100",
  tip: "j-bg-green-50 j-dark:j-bg-green-950 j-border-green-200 j-dark:j-border-green-800 j-text-green-900 j-dark:j-text-green-100",
};

export function Callout({
  type = "info",
  children,
}: {
  type?: Variant;
  children: React.ReactNode;
}) {
  return (
    <div className={`j-my-6 j-p-4 j-rounded-lg j-border ${STYLES[type]}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create CodeBlock with shiki + copy button**

`jamilcss/components/mdx/CodeBlock.tsx`:

```tsx
"use client";

import { useState } from "react";
import { codeToHtml } from "shiki";

export async function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  return <CodeBlockClient html={html} code={code} />;
}

function CodeBlockClient({ html, code }: { html: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="j-relative j-my-6 j-rounded-lg j-overflow-hidden j-border j-border-gray-800">
      <button
        type="button"
        onClick={copy}
        className="j-absolute j-top-2 j-right-2 j-px-2 j-py-1 j-text-xs j-bg-gray-700 j-text-gray-200 j-rounded"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
```

- [ ] **Step 3: Create PropTable**

`jamilcss/components/mdx/PropTable.tsx`:

```tsx
export function PropTable({
  rows,
}: {
  rows: { utility: string; css: string }[];
}) {
  return (
    <div className="j-my-6 j-overflow-x-auto">
      <table className="j-w-full j-text-sm j-border j-border-gray-200 j-dark:j-border-gray-700">
        <thead className="j-bg-gray-50 j-dark:j-bg-gray-800">
          <tr>
            <th className="j-px-4 j-py-2 j-text-left j-font-semibold">Utility</th>
            <th className="j-px-4 j-py-2 j-text-left j-font-semibold">CSS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.utility} className="j-border-t j-border-gray-200 j-dark:j-border-gray-700">
              <td className="j-px-4 j-py-2 j-font-mono j-text-blue-600 j-dark:j-text-blue-400">{row.utility}</td>
              <td className="j-px-4 j-py-2 j-font-mono j-text-gray-600 j-dark:j-text-gray-300">{row.css}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Export MDX components and wire into docs page**

`jamilcss/components/mdx/index.tsx`:

```tsx
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

export const mdxComponents = {
  Callout,
  CodeBlock,
  PropTable,
};
```

Update `page.tsx` to pass `components={mdxComponents}` to `<MDX />`.

- [ ] **Step 5: Build verify**

```bash
cd jamilcss && npm run build
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add jamilcss/components/mdx/ jamilcss/app/docs/
git commit -m "feat(website): add MDX Callout, CodeBlock, and PropTable components"
```

---

### Task 9: Docs shell layout + navigation components

**Files:**
- Create: `jamilcss/app/docs/layout.tsx`
- Create: `jamilcss/components/docs/Sidebar.tsx`
- Create: `jamilcss/components/docs/TableOfContents.tsx`
- Create: `jamilcss/components/docs/Breadcrumb.tsx`
- Create: `jamilcss/components/docs/SearchBar.tsx`
- Create: `jamilcss/components/docs/MobileDrawer.tsx`
- Modify: `jamilcss/app/docs/[[...slug]]/page.tsx`

- [ ] **Step 1: Create Sidebar from page tree**

`jamilcss/components/docs/Sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PageTree } from "fumadocs-core/server";

function NavNode({ item, pathname }: { item: PageTree.Node; pathname: string }) {
  if (item.type === "folder") {
    return (
      <div className="j-mb-4">
        <p className="j-px-3 j-py-1 j-text-xs j-font-semibold j-uppercase j-text-gray-500">{item.name}</p>
        <div className="j-mt-1 j-space-y-1">
          {item.children.map((child) => (
            <NavNode key={child.$id} item={child} pathname={pathname} />
          ))}
        </div>
      </div>
    );
  }
  const active = pathname === item.url;
  return (
    <Link
      href={item.url}
      className={`j-block j-px-3 j-py-2 j-rounded-md j-text-sm ${
        active
          ? "j-bg-blue-50 j-dark:j-bg-blue-950 j-text-blue-700 j-dark:j-text-blue-300 j-font-medium"
          : "j-text-gray-700 j-dark:j-text-gray-300 hover:j-bg-gray-100 j-dark:hover:j-bg-gray-800"
      }`}
    >
      {item.name}
    </Link>
  );
}

export function Sidebar({ tree }: { tree: PageTree.Root }) {
  const pathname = usePathname();
  return (
    <aside className="j-hidden lg:j-block j-w-64 j-shrink-0 j-border-r j-border-gray-200 j-dark:j-border-gray-800 j-pr-6">
      <nav className="j-sticky j-top-20 j-max-h-[calc(100vh-6rem)] j-overflow-y-auto">
        {tree.children.map((item) => (
          <NavNode key={item.$id} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create TableOfContents**

`jamilcss/components/docs/TableOfContents.tsx`:

```tsx
"use client";

import type { TOCItemType } from "fumadocs-core/toc";

export function TableOfContents({ items }: { items: TOCItemType[] }) {
  if (!items.length) return null;
  return (
    <aside className="j-hidden xl:j-block j-w-56 j-shrink-0">
      <nav className="j-sticky j-top-20">
        <p className="j-text-xs j-font-semibold j-uppercase j-text-gray-500 j-mb-3">On this page</p>
        <ul className="j-space-y-2 j-text-sm">
          {items.map((item) => (
            <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
              <a
                href={item.url}
                className="j-text-gray-600 j-dark:j-text-gray-400 hover:j-text-gray-900 j-dark:hover:j-text-white"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

- [ ] **Step 3: Create Breadcrumb**

`jamilcss/components/docs/Breadcrumb.tsx`:

```tsx
import Link from "next/link";

export function Breadcrumb({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <nav className="j-flex j-items-center j-gap-2 j-text-sm j-text-gray-500 j-mb-6">
      {items.map((item, i) => (
        <span key={item.name} className="j-flex j-items-center j-gap-2">
          {i > 0 && <span>/</span>}
          {item.url ? (
            <Link href={item.url} className="hover:j-text-gray-900 j-dark:hover:j-text-white">
              {item.name}
            </Link>
          ) : (
            <span className="j-text-gray-900 j-dark:j-text-white">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Create SearchBar (client fetch to `/api/search`)**

`jamilcss/components/docs/SearchBar.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type SearchResult = { id: string; url: string; title: string };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const search = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data ?? []);
  };

  return (
    <div className="j-relative j-w-full j-max-w-sm">
      <input
        type="search"
        placeholder="Search docs…"
        value={query}
        onChange={(e) => search(e.target.value)}
        className="j-w-full j-px-3 j-py-2 j-text-sm j-rounded-lg j-border j-border-gray-300 j-dark:j-border-gray-600 j-bg-white j-dark:j-bg-gray-800"
      />
      {results.length > 0 && (
        <ul className="j-absolute j-z-50 j-mt-1 j-w-full j-bg-white j-dark:j-bg-gray-900 j-border j-border-gray-200 j-dark:j-border-gray-700 j-rounded-lg j-shadow-lg j-max-h-64 j-overflow-y-auto">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={r.url}
                className="j-block j-px-3 j-py-2 j-text-sm hover:j-bg-gray-100 j-dark:hover:j-bg-gray-800"
                onClick={() => setResults([])}
              >
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create MobileDrawer**

`jamilcss/components/docs/MobileDrawer.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { PageTree } from "fumadocs-core/server";
import { Sidebar } from "./Sidebar";

export function MobileDrawer({ tree }: { tree: PageTree.Root }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="lg:j-hidden j-p-2 j-rounded-lg j-border j-border-gray-300 j-dark:j-border-gray-600"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        ☰
      </button>
      {open && (
        <div className="j-fixed j-inset-0 j-z-50 lg:j-hidden">
          <div className="j-absolute j-inset-0 j-bg-black/50" onClick={() => setOpen(false)} />
          <div className="j-absolute j-left-0 j-top-0 j-h-full j-w-72 j-bg-white j-dark:j-bg-gray-900 j-p-4 j-overflow-y-auto">
            <button type="button" className="j-mb-4" onClick={() => setOpen(false)}>✕</button>
            <Sidebar tree={tree} />
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 6: Create docs layout**

`jamilcss/app/docs/layout.tsx`:

```tsx
import Link from "next/link";
import { source } from "@/lib/source";
import { Sidebar } from "@/components/docs/Sidebar";
import { SearchBar } from "@/components/docs/SearchBar";
import { MobileDrawer } from "@/components/docs/MobileDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = source.pageTree;
  return (
    <div className="j-min-h-screen">
      <header className="j-sticky j-top-0 j-z-40 j-border-b j-border-gray-200 j-dark:j-border-gray-800 j-bg-white/80 j-dark:j-bg-gray-900/80 j-backdrop-blur">
        <div className="j-container j-flex j-items-center j-justify-between j-py-4 j-gap-4">
          <div className="j-flex j-items-center j-gap-4">
            <MobileDrawer tree={tree} />
            <Link href="/" className="j-font-bold">JamilCSS</Link>
          </div>
          <SearchBar />
          <ThemeToggle />
        </div>
      </header>
      <div className="j-container j-flex j-gap-8 j-py-8">
        <Sidebar tree={tree} />
        <main className="j-flex-1 j-min-w-0">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Update docs page to include breadcrumb + TOC**

Pass `page.data.toc` to `<TableOfContents />` and build breadcrumb from `source.getPageTreePeers(slug)`.

- [ ] **Step 8: Build + e2e**

```bash
cd jamilcss && npm run build && npm run test:e2e -- --grep "docs index"
```

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add jamilcss/app/docs/ jamilcss/components/docs/
git commit -m "feat(website): add docs shell with sidebar, TOC, search, and mobile drawer"
```

---

### Task 10: Utilities reference data generator

**Files:**
- Create: `jamilcss/lib/utilities-data.ts`
- Create: `jamilcss/scripts/generate-utilities-data.mjs`

- [ ] **Step 1: Create generator script**

`jamilcss/scripts/generate-utilities-data.mjs`:

```js
import { writeFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const utilities = require("../../src/utilities.js");

const rows = Object.entries(utilities).map(([utility, css]) => ({
  utility,
  css: css.replace(/\s+/g, " ").trim(),
}));

writeFileSync(
  new URL("../lib/utilities-data.ts", import.meta.url),
  `// Auto-generated from ../src/utilities.js — do not edit\nexport const utilityRows = ${JSON.stringify(rows, null, 2)} as const;\n`
);

console.log(`Wrote ${rows.length} utilities`);
```

- [ ] **Step 2: Run generator**

```bash
node jamilcss/scripts/generate-utilities-data.mjs
```

Expected: `Wrote N utilities` (N ≈ 400+)

- [ ] **Step 3: Add npm script**

In `jamilcss/package.json`:

```json
"generate:utilities": "node scripts/generate-utilities-data.mjs"
```

- [ ] **Step 4: Commit**

```bash
git add jamilcss/scripts/ jamilcss/lib/utilities-data.ts jamilcss/package.json
git commit -m "feat(website): generate utilities reference data from framework source"
```

---

### Task 11: MDX content — Getting Started + Core Concepts (7 pages)

**Files:**
- Create: `jamilcss/content/docs/installation.mdx`
- Create: `jamilcss/content/docs/configuration.mdx`
- Create: `jamilcss/content/docs/core-concepts/how-it-works.mdx`
- Create: `jamilcss/content/docs/core-concepts/jamilcss-directive.mdx`
- Create: `jamilcss/content/docs/core-concepts/apply-directive.mdx`
- Create: `jamilcss/content/docs/core-concepts/preflight.mdx`
- Modify: `jamilcss/content/docs/index.mdx`

Each page MUST include:
1. Frontmatter (`title`, `description`)
2. One explanation paragraph
3. A syntax/options table (markdown table or `<PropTable>`)
4. At least one `<CodeBlock>` with real `j-*` examples

**Content source:** Pull accurate setup steps from repo root `README.md` lines 18–90. Pull preflight info from `src/preflight.js` header comment.

- [ ] **Step 1: Write `index.mdx`** — overview, quick start snippet, link to installation

- [ ] **Step 2: Write `installation.mdx`** — npm install, postcss.config.cjs, globals.css, layout import

- [ ] **Step 3: Write `configuration.mdx`** — jamil.config.js options: content, cwd, cssEntry, theme.breakpoints

- [ ] **Step 4: Write `core-concepts/how-it-works.mdx`** — scan → compile → inject flow

- [ ] **Step 5: Write `core-concepts/jamilcss-directive.mdx`** — `@jamilcss;` directive

- [ ] **Step 6: Write `core-concepts/apply-directive.mdx`** — `@apply` if supported in plugin, or document pattern from `src/plugin.js`

- [ ] **Step 7: Write `core-concepts/preflight.mdx`** — `@jamilcss-preflight;`

- [ ] **Step 8: Build verify all routes**

```bash
cd jamilcss && npm run build
```

Expected: PASS — 7 doc routes generated

- [ ] **Step 9: Commit**

```bash
git add jamilcss/content/docs/
git commit -m "docs(website): add getting started and core concepts pages"
```

---

### Task 12: MDX content — Layout + Typography (9 pages)

**Files:**
- Create: `jamilcss/content/docs/layout/flexbox.mdx`
- Create: `jamilcss/content/docs/layout/grid.mdx`
- Create: `jamilcss/content/docs/layout/spacing-sizing.mdx`
- Create: `jamilcss/content/docs/layout/position.mdx`
- Create: `jamilcss/content/docs/layout/overflow.mdx`
- Create: `jamilcss/content/docs/typography/font-size.mdx`
- Create: `jamilcss/content/docs/typography/font-weight-family.mdx`
- Create: `jamilcss/content/docs/typography/text-color.mdx`
- Create: `jamilcss/content/docs/typography/text-modifiers.mdx`

**Content source:** `README.md` utility tables (lines 140–223) and `src/utilities.js` / `src/patterns.js`.

Each page: frontmatter, explanation, PropTable or markdown table, CodeBlock examples.

- [ ] **Step 1–9:** Write each MDX file per spec content map

- [ ] **Step 10: Build verify**

```bash
cd jamilcss && npm run build
```

- [ ] **Step 11: Commit**

```bash
git add jamilcss/content/docs/layout/ jamilcss/content/docs/typography/
git commit -m "docs(website): add layout and typography reference pages"
```

---

### Task 13: MDX content — Colors + Variants + Animation (13 pages)

**Files:**
- Create: `jamilcss/content/docs/colors/palette.mdx`
- Create: `jamilcss/content/docs/colors/background.mdx`
- Create: `jamilcss/content/docs/colors/border-color.mdx`
- Create: `jamilcss/content/docs/colors/gradients.mdx`
- Create: `jamilcss/content/docs/colors/opacity.mdx`
- Create: `jamilcss/content/docs/variants/breakpoints.mdx`
- Create: `jamilcss/content/docs/variants/dark-light-theme.mdx`
- Create: `jamilcss/content/docs/variants/state-variants.mdx`
- Create: `jamilcss/content/docs/variants/stacked-variants.mdx`
- Create: `jamilcss/content/docs/variants/peer-group.mdx`
- Create: `jamilcss/content/docs/variants/aria-supports.mdx`
- Create: `jamilcss/content/docs/animation/transitions.mdx`
- Create: `jamilcss/content/docs/animation/keyframe-animations.mdx`

**Content source:** `README.md` (colors, variants, animation), `src/variants.js`, `src/keyframes.js`, `src/patterns.js` (gradients, opacity modifiers).

- [ ] **Step 1–13:** Write each MDX file

- [ ] **Step 14: Build verify**

```bash
cd jamilcss && npm run build
```

- [ ] **Step 15: Commit**

```bash
git add jamilcss/content/docs/colors/ jamilcss/content/docs/variants/ jamilcss/content/docs/animation/
git commit -m "docs(website): add colors, variants, and animation pages"
```

---

### Task 14: Utilities reference page

**Files:**
- Create: `jamilcss/content/docs/utilities-reference.mdx`
- Create: `jamilcss/components/mdx/UtilitiesReference.tsx`

- [ ] **Step 1: Create client search/filter component**

`jamilcss/components/mdx/UtilitiesReference.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { utilityRows } from "@/lib/utilities-data";

export function UtilitiesReference() {
  const [filter, setFilter] = useState("");
  const rows = useMemo(
    () =>
      utilityRows.filter(
        (r) =>
          r.utility.includes(filter) ||
          r.css.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter]
  );

  return (
    <div>
      <input
        type="search"
        placeholder="Filter utilities…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="j-mb-6 j-w-full j-max-w-md j-px-3 j-py-2 j-rounded-lg j-border j-border-gray-300 j-dark:j-border-gray-600"
      />
      <div className="j-overflow-x-auto">
        <table className="j-w-full j-text-sm j-border j-border-gray-200 j-dark:j-border-gray-700">
          <thead className="j-bg-gray-50 j-dark:j-bg-gray-800">
            <tr>
              <th className="j-px-4 j-py-2 j-text-left">Utility</th>
              <th className="j-px-4 j-py-2 j-text-left">CSS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.utility} className="j-border-t j-border-gray-200 j-dark:j-border-gray-700">
                <td className="j-px-4 j-py-2 j-font-mono j-text-blue-600 j-dark:j-text-blue-400">{row.utility}</td>
                <td className="j-px-4 j-py-2 j-font-mono">{row.css}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="j-mt-4 j-text-sm j-text-gray-500">{rows.length} utilities shown</p>
    </div>
  );
}
```

- [ ] **Step 2: Create MDX page**

`jamilcss/content/docs/utilities-reference.mdx`:

```mdx
---
title: Utilities Reference
description: Complete table of static JamilCSS utilities
---

# Utilities Reference

All static utilities from `utilities.js`. Numeric and pattern-based utilities (e.g. `j-p-{n}`) are documented in their category pages.

<UtilitiesReference />
```

- [ ] **Step 3: Register component in `mdxComponents`**

- [ ] **Step 4: Build + test search on reference page**

```bash
cd jamilcss && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add jamilcss/content/docs/utilities-reference.mdx jamilcss/components/mdx/UtilitiesReference.tsx
git commit -m "docs(website): add searchable utilities reference page"
```

---

### Task 15: MDX prose styling + final polish

**Files:**
- Create: `jamilcss/components/docs/Prose.tsx`
- Modify: `jamilcss/app/docs/[[...slug]]/page.tsx`
- Modify: `jamilcss/e2e/smoke.spec.ts`

- [ ] **Step 1: Create prose wrapper with j-* typography**

`jamilcss/components/docs/Prose.tsx`:

```tsx
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="j-prose-content j-text-gray-800 j-dark:j-text-gray-200 j-leading-relaxed [&_h2]:j-text-2xl [&_h2]:j-font-bold [&_h2]:j-mt-10 [&_h2]:j-mb-4 [&_h3]:j-text-xl [&_h3]:j-font-semibold [&_h3]:j-mt-8 [&_h3]:j-mb-3 [&_p]:j-mb-4 [&_code]:j-font-mono [&_code]:j-text-sm [&_code]:j-bg-gray-100 [&_code]:j-dark:j-bg-gray-800 [&_code]:j-px-1 [&_code]:j-rounded [&_ul]:j-list-disc [&_ul]:j-pl-6 [&_ul]:j-mb-4 [&_ol]:j-list-decimal [&_ol]:j-pl-6 [&_ol]:j-mb-4 [&_a]:j-text-blue-600 [&_a]:j-dark:j-text-blue-400 [&_a]:j-underline">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Wrap MDX body in Prose; add typography classes to layout headings**

- [ ] **Step 3: Expand e2e suite**

```ts
test("docs search returns results", async ({ page }) => {
  await page.goto("/docs");
  await page.getByPlaceholder("Search docs…").fill("flexbox");
  await expect(page.getByRole("link", { name: /flexbox/i })).toBeVisible();
});

test("no tailwind classes in rendered HTML", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  expect(html).not.toMatch(/class="[^"]*\bflex\b/);
  expect(html).not.toMatch(/class="[^"]*\btext-xl\b(?!.*j-text)/);
});
```

- [ ] **Step 4: Full verification**

```bash
cd jamilcss && npm run build && npm run test:e2e
```

Expected: all tests PASS; 20+ static doc routes

- [ ] **Step 5: Update root README with website section**

Add to root `README.md` after "Run the Next.js example":

```markdown
## JamilCSS website (landing + docs)

```bash
cd jamilcss
npm install
npm run dev
```

Open http://localhost:3000 for the landing page and http://localhost:3000/docs for documentation.
```

- [ ] **Step 6: Commit**

```bash
git add jamilcss/ README.md
git commit -m "feat(website): polish docs prose styling and add README entry"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|-----------------|------|
| Next.js 14 TypeScript in `jamilcss/` | Task 1 |
| `fumadocs-core` headless + `fumadocs-mdx` | Task 7 |
| JamilCSS only (`j-*`), no Tailwind | All tasks; verified Task 15 |
| `@jamilcss-preflight; @jamilcss;` | Task 2 |
| Local `jamilcss: "file:.."` dep | Task 1 |
| Landing: Navbar, Hero, FeatureCards, ColorPalette, CodeExample, AnimationDemo, Footer | Tasks 4–6 |
| Theme toggle (`class="dark"` on `<html>`) | Task 3 |
| Docs shell: sidebar, TOC, breadcrumb, search, mobile drawer | Task 9 |
| 20 MDX pages | Tasks 11–14 |
| MDX components: Callout, CodeBlock, PropTable | Task 8 |
| Utilities reference from `utilities.js` | Tasks 10, 14 |
| Out of scope items excluded | N/A — not planned |

## Known Risks & Mitigations

1. **Dynamic color class names in ColorPalette** — PostCSS scanner may miss template-built classes. Mitigation: use explicit literal class strings or a generated swatch map file committed to repo.
2. **fumadocs-mdx ESM** — Use `next.config.mjs` not `.ts` if ESM resolution fails.
3. **fumadocs API version drift** — Pin `fumadocs-core` and `fumadocs-mdx` versions; adjust `loader` / `createFromSource` imports if APIs changed.
4. **CodeBlock async in MDX** — If shiki async server component fails in MDX, fall back to a sync `pre`/`code` block with manual highlighting.
5. **ColorPalette spec says 100–900** — `patterns.js` also has 50/950; showcase uses 100–900 per spec.

## Execution Order

```
Task 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15
```

Tasks 11–13 can run in parallel after Task 10 (content writing is independent per section).
