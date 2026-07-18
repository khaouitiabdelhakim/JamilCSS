"use client";

import { useState } from "react";
import { useReveal } from "@/lib/useReveal";

export function ThemeDemo() {
  const [isDark, setIsDark] = useState(true);
  const revealRef = useReveal();

  return (
    <section className="j-py-96 j-px-24" style={{ background: "#030712" }}>
      <div className="j-container">
        <div className="reveal j-text-center j-mb-64" ref={revealRef}>
          <p className="j-text-sm j-font-semibold j-uppercase j-tracking-widest j-mb-12" style={{ color: "#f857a6" }}>Theming</p>
          <h2
            className="j-text-5xl j-font-bold j-text-white j-mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
          >
            Dark &amp; light theming.<br />One prefix away.
          </h2>
          <p className="j-text-gray-400 j-text-xl j-mb-36">
            Add{" "}
            <code className="j-font-mono j-text-sm j-px-8 j-py-2 j-rounded-md j-bg-gray-900 j-border j-border-gray-700" style={{ color: "#f857a6" }}>.dark</code>
            {" "}to{" "}
            <code className="j-font-mono j-text-sm j-px-8 j-py-2 j-rounded-md j-bg-gray-900 j-border j-border-gray-700" style={{ color: "#f857a6" }}>&lt;html&gt;</code>
            {" "}— no JS, no runtime cost.
          </p>

          {/* Toggle */}
          <div className="j-flex j-items-center j-justify-center j-gap-16 j-mb-48">
            <span className="j-text-sm j-font-medium" style={{ color: isDark ? "#f857a6" : "#64748b" }}>Dark</span>
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle theme demo"
              style={{
                position: "relative",
                width: 56,
                height: 28,
                borderRadius: 999,
                background: isDark ? "rgba(248,87,166,0.2)" : "rgba(248,87,166,0.6)",
                border: "1px solid rgba(248,87,166,0.4)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: isDark ? 3 : "calc(100% - 25px)",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#f857a6",
                  boxShadow: "0 0 8px rgba(248,87,166,0.6)",
                  transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </button>
            <span className="j-text-sm j-font-medium" style={{ color: isDark ? "#64748b" : "#f857a6" }}>Light</span>
          </div>
        </div>

        {/* Side-by-side cards */}
        <div className="j-grid lg:j-grid-cols-2 j-gap-24 j-max-w-3xl j-mx-auto">
          {/* Dark card */}
          <div>
            <div className="j-flex j-items-center j-gap-8 j-mb-16">
              <span className="j-w-10 j-h-10 j-rounded-full" style={{ background: "#1e293b", border: "1px solid #334155" }} />
              <span className="j-text-xs j-font-mono j-text-gray-500">dark mode</span>
              {isDark && <span className="j-ml-auto j-text-xs j-font-semibold" style={{ color: "#f857a6" }}>Active</span>}
            </div>
            <div
              className="j-p-28 j-rounded-2xl j-border j-transition"
              style={{
                background: isDark ? "#0f172a" : "#1e293b",
                borderColor: isDark ? "rgba(248,87,166,0.2)" : "rgba(255,255,255,0.05)",
                boxShadow: isDark ? "0 0 32px rgba(248,87,166,0.06)" : "none",
              }}
            >
              <div className="j-flex j-items-center j-gap-12 j-mb-16">
                <div className="j-w-40 j-h-40 j-rounded-full" style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }} />
                <div>
                  <p className="j-font-semibold j-text-sm" style={{ color: isDark ? "#f8fafc" : "#94a3b8" }}>Alex Kim</p>
                  <p className="j-text-xs" style={{ color: isDark ? "#64748b" : "#475569" }}>Developer</p>
                </div>
              </div>
              <p className="j-text-sm j-leading-relaxed j-mb-20" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                Utility-first CSS that just makes sense.
              </p>
              <div className="j-flex j-flex-wrap j-gap-8">
                {["j-dark:j-bg-slate-900", "j-dark:j-text-white", "j-dark:j-border-pink-500/20"].map((cls) => (
                  <span key={cls} className="j-text-xs j-font-mono j-px-8 j-py-3 j-rounded-md" style={{ background: "rgba(248,87,166,0.1)", color: "#f9a8d4" }}>
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Light card */}
          <div>
            <div className="j-flex j-items-center j-gap-8 j-mb-16">
              <span className="j-w-10 j-h-10 j-rounded-full" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }} />
              <span className="j-text-xs j-font-mono j-text-gray-500">light mode</span>
              {!isDark && <span className="j-ml-auto j-text-xs j-font-semibold" style={{ color: "#f857a6" }}>Active</span>}
            </div>
            <div
              className="j-p-28 j-rounded-2xl j-border j-transition"
              style={{
                background: isDark ? "#f8fafc" : "#ffffff",
                borderColor: isDark ? "#e2e8f0" : "rgba(248,87,166,0.2)",
                boxShadow: isDark ? "none" : "0 0 32px rgba(248,87,166,0.06)",
              }}
            >
              <div className="j-flex j-items-center j-gap-12 j-mb-16">
                <div className="j-w-40 j-h-40 j-rounded-full" style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }} />
                <div>
                  <p className="j-font-semibold j-text-sm" style={{ color: isDark ? "#475569" : "#0f172a" }}>Alex Kim</p>
                  <p className="j-text-xs" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Developer</p>
                </div>
              </div>
              <p className="j-text-sm j-leading-relaxed j-mb-20" style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                Utility-first CSS that just makes sense.
              </p>
              <div className="j-flex j-flex-wrap j-gap-8">
                {["j-light:j-bg-white", "j-light:j-text-gray-900", "j-light:j-border-gray-200"].map((cls) => (
                  <span key={cls} className="j-text-xs j-font-mono j-px-8 j-py-3 j-rounded-md" style={{ background: "rgba(248,87,166,0.1)", color: "#be185d" }}>
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
