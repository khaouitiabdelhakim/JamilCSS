"use client";

import { useReveal } from "@/lib/useReveal";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "PostCSS compiler",
    desc: "Scans your JSX/TSX and compiles only the j-* classes you actually use. Zero dead CSS, zero overhead.",
    tag: "Performance",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Any numeric value",
    desc: "j-p-16, j-w-200-rem, j-text-24-pt — any number works. No config file per value. Just write it.",
    tag: "DX",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Stacked variants",
    desc: "md:dark:hover:j-bg-pink-600 — combine breakpoint, theme, and state in one class name.",
    tag: "Power",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
      </svg>
    ),
    title: "22 color families",
    desc: "Gray to stone, shades 50–950. Tailwind-compatible palette with opacity modifier: j-bg-pink-500/50.",
    tag: "Design",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    title: "Dark & light themes",
    desc: "Prefix j-dark: or j-light: to any utility. Toggle via .dark on <html> — no JS overhead.",
    tag: "Theming",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Zero runtime",
    desc: "Pure CSS output — no JS bundle, no style injection. Works with React, Vue, Svelte, Astro, and any HTML.",
    tag: "Performance",
  },
];

const TAG_COLORS: Record<string, string> = {
  Performance: "#10b981",
  DX: "#f857a6",
  Power: "#a855f7",
  Design: "#f59e0b",
  Theming: "#3b82f6",
};

export function FeatureCards() {
  const ref = useReveal();

  return (
    <section className="j-py-96 j-px-24 j-border-y" style={{ borderColor: "rgba(248,87,166,0.08)" }}>
      <div className="j-container">
        <div className="reveal j-text-center j-mb-64" ref={ref}>
          <p className="j-text-sm j-font-semibold j-uppercase j-tracking-widest j-mb-12" style={{ color: "#f857a6" }}>Why JamilCSS</p>
          <h2
            className="j-text-5xl j-font-bold j-text-white j-mb-16 j-tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
          >
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
          <p className="j-text-xl j-text-gray-400 j-max-w-2xl j-mx-auto">
            Built for developers who want full control without the complexity.
          </p>
        </div>

        <div className="j-grid md:j-grid-cols-2 lg:j-grid-cols-3 j-gap-24">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`reveal reveal-delay-${(i % 6) + 1} j-p-28 j-rounded-2xl j-border j-transition j-group j-relative j-overflow-hidden`}
              style={{ background: "rgba(15,23,42,0.6)", borderColor: "rgba(248,87,166,0.1)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,87,166,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(248,87,166,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,87,166,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div className="j-flex j-items-start j-justify-between j-mb-20">
                <div
                  className="j-inline-flex j-items-center j-justify-center j-w-44 j-h-44 j-rounded-xl j-text-white"
                  style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
                >
                  {f.icon}
                </div>
                <span
                  className="j-text-xs j-font-semibold j-px-10 j-py-4 j-rounded-full"
                  style={{ color: TAG_COLORS[f.tag], background: `${TAG_COLORS[f.tag]}18` }}
                >
                  {f.tag}
                </span>
              </div>
              <h3 className="j-text-lg j-font-semibold j-text-white j-mb-8">{f.title}</h3>
              <p className="j-text-gray-400 j-leading-relaxed j-text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
