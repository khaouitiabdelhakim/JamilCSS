"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const INSTALL = "npm install jamilcss";

const JSX_CODE = `<div className="
  j-flex j-flex-col j-gap-16
  j-p-28 j-rounded-2xl j-border
  j-bg-gray-900
">
  <div className="j-flex j-items-center j-gap-12">
    <div className="j-w-44 j-h-44 j-rounded-full
      j-bg-pink-500" />
    <div>
      <p className="j-text-white j-font-semibold">
        Sarah Chen
      </p>
      <p className="j-text-gray-400 j-text-sm">
        UI Engineer
      </p>
    </div>
    <span className="j-ml-auto j-px-10 j-py-4
      j-rounded-full j-text-xs j-font-semibold
      j-bg-pink-500/20 j-text-pink-300">
      Pro
    </span>
  </div>
  <p className="j-text-gray-300 j-leading-relaxed">
    JamilCSS changed how I ship UI.
  </p>
  <button className="j-w-full j-py-10
    j-rounded-xl j-text-white j-font-semibold
    hover:j-opacity-80 j-transition">
    Follow
  </button>
</div>`;

export function Hero() {
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        i++;
        setTyped(INSTALL.slice(0, i));
        if (i >= INSTALL.length && intervalRef.current) clearInterval(intervalRef.current);
      }, 55);
    }, 800);
    return () => {
      clearTimeout(delay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="j-relative j-min-h-screen j-flex j-items-center j-pt-64 j-pb-80 j-px-24 j-overflow-hidden">
      {/* Dot grid */}
      <div
        className="j-absolute j-inset-0 j-pointer-events-none hero-grid"
        style={{
          backgroundImage: "radial-gradient(rgba(248,87,166,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          zIndex: 0,
        }}
      />
      {/* Orb 1 */}
      <div
        className="hero-orb-1 j-absolute j-pointer-events-none"
        style={{ zIndex: 0, top: "5%", left: "10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(248,87,166,0.18) 0%, transparent 70%)", filter: "blur(50px)" }}
      />
      {/* Orb 2 */}
      <div
        className="hero-orb-2 j-absolute j-pointer-events-none"
        style={{ zIndex: 0, bottom: "10%", right: "8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,88,88,0.14) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="j-container j-relative j-flex lg:j-flex-row j-flex-col j-items-center j-gap-64" style={{ zIndex: 1 }}>
        {/* ── Left column ── */}
        <div className="j-flex j-flex-col j-items-center lg:j-items-start j-text-center lg:j-text-left j-flex-1 j-max-w-2xl">
          {/* Badge */}
          <div
            className="hero-fade-1 j-mb-28 j-inline-flex j-items-center j-gap-8 j-px-16 j-py-7 j-rounded-full j-text-sm j-font-medium j-border"
            style={{ background: "rgba(248,87,166,0.06)", borderColor: "rgba(248,87,166,0.25)", color: "#f9a8d4" }}
          >
            <span className="j-w-6 j-h-6 j-rounded-full j-animate-pulse-1-s" style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }} />
            PostCSS-powered · Zero runtime · v2.0
          </div>

          {/* Headline */}
          <h1
            className="hero-fade-2 j-font-bold j-text-white j-mb-24 j-leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800 }}
          >
            Style at the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f857a6 0%, #ff5858 50%, #f857a6 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient-pan 4s ease infinite",
              }}
            >
              speed of thought.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-fade-3 j-text-xl j-text-gray-400 j-leading-relaxed j-mb-40 j-max-w-xl">
            Compose UIs with{" "}
            <code className="j-font-mono j-text-sm j-bg-gray-900 j-border j-border-gray-700 j-px-8 j-py-2 j-rounded-md" style={{ color: "#f857a6" }}>j-*</code>
            {" "}utility classes. PostCSS scans your components and emits only what you use — stack breakpoints, themes, and states in a single class name.
          </p>

          {/* Install terminal */}
          <div
            className="hero-fade-4 j-flex j-items-center j-gap-16 j-w-full j-max-w-md j-px-20 j-py-14 j-rounded-xl j-border j-mb-32 j-font-mono j-text-sm"
            style={{ background: "#060b18", borderColor: "rgba(248,87,166,0.15)" }}
          >
            <span style={{ color: "#f857a6" }}>$</span>
            <span className="j-text-gray-300 j-flex-1">
              {typed}
              <span
                className="j-inline-block j-w-2 j-h-14 j-ml-1 j-align-middle"
                style={{ background: "#f857a6", animation: "badge-glow 1s ease-in-out infinite" }}
              />
            </span>
            <button
              type="button"
              onClick={copy}
              className="j-text-xs j-px-10 j-py-4 j-rounded-md j-transition j-font-sans"
              style={{
                background: copied ? "rgba(248,87,166,0.15)" : "rgba(255,255,255,0.05)",
                color: copied ? "#f857a6" : "#64748b",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* CTAs */}
          <div className="hero-fade-5 j-flex j-flex-wrap j-gap-16 j-justify-center lg:j-justify-start">
            <Link
              href="/docs"
              className="j-relative j-overflow-hidden j-flex j-items-center j-gap-8 j-px-32 j-py-16 j-text-white j-font-semibold j-rounded-xl j-text-lg j-transition hover:j-opacity-90"
              style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)", boxShadow: "0 0 40px rgba(248,87,166,0.3)" }}
            >
              <span
                className="j-absolute j-inset-y-0 j-w-24"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmer-line 3s 2s ease-in-out infinite" }}
              />
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/khaouitiabdelhakim/JamilCSS"
              target="_blank"
              rel="noopener noreferrer"
              className="j-flex j-items-center j-gap-8 j-px-32 j-py-16 j-border hover:j-border-gray-500 j-font-semibold j-rounded-xl j-text-gray-300 hover:j-text-white hover:j-bg-gray-800 j-transition j-text-lg"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        {/* ── Right column: code + preview ── */}
        <div className="hero-fade-5 j-flex-1 j-max-w-lg j-w-full j-flex j-flex-col">
          {/* Code window */}
          <div
            className="j-rounded-t-2xl j-overflow-hidden j-border j-border-b-0"
            style={{ borderColor: "rgba(248,87,166,0.15)", boxShadow: "0 0 0 1px rgba(248,87,166,0.06), 0 16px 48px rgba(0,0,0,0.5)" }}
          >
            <div
              className="j-flex j-items-center j-gap-6 j-px-16 j-py-12 j-border-b"
              style={{ background: "rgba(15,23,42,0.95)", borderColor: "rgba(248,87,166,0.1)" }}
            >
              <span className="j-w-12 j-h-12 j-rounded-full" style={{ background: "#ff5f57" }} />
              <span className="j-w-12 j-h-12 j-rounded-full" style={{ background: "#ffbc2e" }} />
              <span className="j-w-12 j-h-12 j-rounded-full" style={{ background: "#28c840" }} />
              <span className="j-ml-12 j-text-xs j-font-mono j-text-gray-600">profile-card.tsx</span>
              <span className="j-ml-auto j-text-xs j-font-mono j-px-8 j-py-3 j-rounded-md" style={{ color: "#f857a6", background: "rgba(248,87,166,0.08)" }}>TSX</span>
            </div>
            <pre className="j-p-20 j-text-xs j-text-left j-overflow-x-auto j-leading-relaxed j-font-mono" style={{ background: "#060b18", color: "#94a3b8" }}>
              <code>{JSX_CODE}</code>
            </pre>
          </div>

          {/* Connector */}
          <div
            style={{
              background: "rgba(248,87,166,0.03)",
              borderLeft: "1px solid rgba(248,87,166,0.15)",
              borderRight: "1px solid rgba(248,87,166,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0" }}>
              <div style={{ width: 1, height: 12, background: "linear-gradient(to bottom, transparent, #f857a6)" }} />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: "3px 10px",
                  borderRadius: 999,
                  color: "#f857a6",
                  background: "rgba(248,87,166,0.1)",
                  border: "1px solid rgba(248,87,166,0.2)",
                }}
              >
                renders
              </span>
              <div style={{ width: 1, height: 12, background: "linear-gradient(to bottom, #f857a6, transparent)" }} />
            </div>
          </div>

          {/* Live preview */}
          <div
            className="j-rounded-b-2xl j-overflow-hidden j-border j-border-t-0 j-p-20"
            style={{ background: "#0f172a", borderColor: "rgba(248,87,166,0.15)" }}
          >
            <div className="j-flex j-flex-col j-gap-16 j-p-24 j-rounded-2xl j-border" style={{ background: "#1e293b", borderColor: "rgba(248,87,166,0.1)" }}>
              <div className="j-flex j-items-center j-gap-12">
                <div className="j-w-44 j-h-44 j-rounded-full" style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }} />
                <div>
                  <p className="j-text-white j-font-semibold j-text-sm">Sarah Chen</p>
                  <p className="j-text-gray-400 j-text-xs">UI Engineer</p>
                </div>
                <span className="j-ml-auto j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold" style={{ background: "rgba(248,87,166,0.15)", color: "#f9a8d4" }}>Pro</span>
              </div>
              <p className="j-text-gray-300 j-text-sm j-leading-relaxed">JamilCSS changed how I ship UI.</p>
              <button
                type="button"
                className="j-w-full j-py-10 j-rounded-xl j-text-white j-font-semibold j-text-sm j-transition hover:j-opacity-80"
                style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
              >
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll chevron */}
      <div
        className="j-absolute j-bottom-32 j-left-1/2 j-pointer-events-none"
        style={{ transform: "translateX(-50%)", zIndex: 1, animation: "orb-float 2s ease-in-out infinite" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(248,87,166,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
