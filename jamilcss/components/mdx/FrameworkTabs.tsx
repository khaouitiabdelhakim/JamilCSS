"use client";

import { useState, useRef, useEffect } from "react";
import { CodeBlock } from "./CodeBlock";

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

interface Step {
  label: string;
  lang: string;
  code: string;
}

interface Framework {
  id: string;
  name: string;
  logo: string;
  invertLogo?: boolean;
  steps: Step[];
}

const FRAMEWORKS: Framework[] = [
  {
    id: "nextjs",
    name: "Next.js",
    logo: `${CDN}/nextjs/nextjs-plain.svg`,
    steps: [
      {
        label: "Install",
        lang: "bash",
        code: "npm install jamilcss",
      },
      {
        label: "postcss.config.cjs",
        lang: "js",
        code: `module.exports = {
  plugins: {
    jamilcss: {
      content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
      cwd: __dirname,
      cssEntry: "app/globals.css",
    },
  },
};`,
      },
      {
        label: "app/globals.css",
        lang: "css",
        code: `@jamilcss;

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,
      },
      {
        label: "app/layout.tsx",
        lang: "tsx",
        code: `import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
      },
    ],
  },
  {
    id: "react-vite",
    name: "React",
    logo: `${CDN}/react/react-original.svg`,
    steps: [
      {
        label: "Install",
        lang: "bash",
        code: "npm install jamilcss",
      },
      {
        label: "postcss.config.cjs",
        lang: "js",
        code: `module.exports = {
  plugins: {
    jamilcss: {
      content: ["./src/**/*.{js,ts,jsx,tsx}"],
      cwd: __dirname,
      cssEntry: "src/index.css",
    },
  },
};`,
      },
      {
        label: "src/index.css",
        lang: "css",
        code: `@jamilcss;

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,
      },
      {
        label: "src/main.tsx",
        lang: "tsx",
        code: `import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },
    ],
  },
  {
    id: "vue",
    name: "Vue",
    logo: `${CDN}/vuejs/vuejs-original.svg`,
    steps: [
      {
        label: "Install",
        lang: "bash",
        code: "npm install jamilcss",
      },
      {
        label: "postcss.config.cjs",
        lang: "js",
        code: `module.exports = {
  plugins: {
    jamilcss: {
      content: ["./src/**/*.{js,ts,vue}"],
      cwd: __dirname,
      cssEntry: "src/style.css",
    },
  },
};`,
      },
      {
        label: "src/style.css",
        lang: "css",
        code: `@jamilcss;

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,
      },
      {
        label: "src/main.ts",
        lang: "ts",
        code: `import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");`,
      },
    ],
  },
  {
    id: "nuxt",
    name: "Nuxt",
    logo: `${CDN}/nuxtjs/nuxtjs-original.svg`,
    steps: [
      {
        label: "Install",
        lang: "bash",
        code: "npm install jamilcss",
      },
      {
        label: "nuxt.config.ts",
        lang: "ts",
        code: `export default defineNuxtConfig({
  postcss: {
    plugins: {
      jamilcss: {
        content: [
          "./app.vue",
          "./pages/**/*.{vue,js,ts}",
          "./components/**/*.{vue,js,ts}",
        ],
        cwd: __dirname,
        cssEntry: "assets/css/main.css",
      },
    },
  },
  css: ["~/assets/css/main.css"],
});`,
      },
      {
        label: "assets/css/main.css",
        lang: "css",
        code: `@jamilcss;

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,
      },
    ],
  },
  {
    id: "svelte",
    name: "SvelteKit",
    logo: `${CDN}/svelte/svelte-original.svg`,
    steps: [
      {
        label: "Install",
        lang: "bash",
        code: "npm install jamilcss",
      },
      {
        label: "postcss.config.cjs",
        lang: "js",
        code: `module.exports = {
  plugins: {
    jamilcss: {
      content: ["./src/**/*.{html,js,ts,svelte}"],
      cwd: __dirname,
      cssEntry: "src/app.css",
    },
  },
};`,
      },
      {
        label: "src/app.css",
        lang: "css",
        code: `@jamilcss;

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,
      },
      {
        label: "src/routes/+layout.svelte",
        lang: "html",
        code: `<script>
  import "../app.css";
</script>

<slot />`,
      },
    ],
  },
  {
    id: "astro",
    name: "Astro",
    logo: `${CDN}/astro/astro-original.svg`,
    steps: [
      {
        label: "Install",
        lang: "bash",
        code: "npm install jamilcss",
      },
      {
        label: "postcss.config.cjs",
        lang: "js",
        code: `module.exports = {
  plugins: {
    jamilcss: {
      content: ["./src/**/*.{astro,html,js,ts,jsx,tsx}"],
      cwd: __dirname,
      cssEntry: "src/styles/global.css",
    },
  },
};`,
      },
      {
        label: "src/styles/global.css",
        lang: "css",
        code: `@jamilcss;

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,
      },
      {
        label: "src/layouts/Layout.astro",
        lang: "html",
        code: `---
import "../styles/global.css";
---
<html lang="en">
  <head><meta charset="UTF-8" /><title>My App</title></head>
  <body><slot /></body>
</html>`,
      },
    ],
  },
  {
    id: "angular",
    name: "Angular",
    logo: `${CDN}/angular/angular-original.svg`,
    steps: [
      {
        label: "Install",
        lang: "bash",
        code: "npm install jamilcss",
      },
      {
        label: "postcss.config.js",
        lang: "js",
        code: `module.exports = {
  plugins: {
    jamilcss: {
      content: ["./src/**/*.{ts,html}"],
      cwd: __dirname,
      cssEntry: "src/styles.css",
    },
  },
};`,
      },
      {
        label: "angular.json (excerpt)",
        lang: "json",
        code: `{
  "architect": {
    "build": {
      "options": {
        "styles": ["src/styles.css"],
        "stylePreprocessorOptions": {
          "includePaths": []
        }
      }
    }
  }
}`,
      },
      {
        label: "src/styles.css",
        lang: "css",
        code: `@jamilcss;

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,
      },
    ],
  },
];

export function FrameworkTabs() {
  const [active, setActive] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fw = FRAMEWORKS[active];

  useEffect(() => {
    const el = tabRefs.current[active];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active]);

  return (
    <div
      className="j-my-32 j-rounded-2xl j-overflow-hidden j-border"
      style={{
        borderColor: "rgba(248,87,166,0.15)",
        boxShadow: "0 0 0 1px rgba(248,87,166,0.06), 0 8px 40px rgba(0,0,0,0.5)",
        background: "#070d1a",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(15,23,42,0.95)",
          borderBottom: "1px solid rgba(248,87,166,0.1)",
        }}
      >
        {/* Tab bar */}
        <div className="j-relative j-flex j-overflow-x-auto" style={{ padding: "0 8px" }}>
          {/* Sliding indicator */}
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: 2,
              background: "linear-gradient(90deg, #f857a6, #ff5858)",
              borderRadius: "2px 2px 0 0",
              transition: "left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
          {FRAMEWORKS.map((f, i) => (
            <button
              key={f.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => setActive(i)}
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "12px 14px",
                fontSize: "0.8rem",
                fontWeight: active === i ? 600 : 400,
                color: active === i ? "#f1f5f9" : "#64748b",
                background: "none",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.logo}
                alt={f.name}
                width={18}
                height={18}
                style={{
                  opacity: active === i ? 1 : 0.45,
                  transition: "opacity 0.15s",
                  flexShrink: 0,
                }}
              />
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: "8px 0 0" }}>
        {fw.steps.map((step, i) => (
          <div key={i}>
            {/* Step label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 20px 4px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f857a6, #ff5858)",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
                {step.label}
              </span>
            </div>
            <div style={{ padding: "0 16px" }}>
              <CodeBlock code={step.code} lang={step.lang} filename={step.label} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(248,87,166,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fw.logo} alt={fw.name} width={14} height={14} style={{ opacity: 0.6 }} />
        <span style={{ fontSize: "0.75rem", color: "#475569" }}>
          Use <code style={{ color: "#f857a6", background: "rgba(248,87,166,0.08)", padding: "1px 5px", borderRadius: 4, fontSize: "0.72rem" }}>j-*</code> classes anywhere in your {fw.name} components.
          {" "}
          <span style={{ color: "#334155" }}>
            No PostCSS? Import <code style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)", padding: "1px 5px", borderRadius: 4, fontSize: "0.72rem" }}>jamilcss/dist/jamil.css</code> instead.
          </span>
        </span>
      </div>
    </div>
  );
}
