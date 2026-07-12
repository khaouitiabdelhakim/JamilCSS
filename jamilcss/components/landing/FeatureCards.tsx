const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "PostCSS compiler",
    desc: "Scans your JSX/TSX and compiles only the j-* classes you actually use. Zero dead CSS.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Any numeric value",
    desc: "j-p-16, j-w-200-rem, j-text-24-pt — any number works. No config file per value.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "Stacked variants",
    desc: "md:dark:hover:j-bg-pink-600 — combine breakpoint, theme, and state in one class.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
      </svg>
    ),
    title: "22 color families",
    desc: "Gray to stone, shades 50–950. Tailwind-compatible palette you already know.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
    title: "Dark & light themes",
    desc: "Prefix dark: or light: to any utility. Toggle via .dark on html — no JS overhead.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Zero runtime",
    desc: "Pure CSS output — no JS bundle, no style injection at runtime. Framework agnostic.",
  },
];

export function FeatureCards() {
  return (
    <section className="j-py-96 j-px-24 j-bg-gray-900 j-border-y j-border-gray-800">
      <div className="j-container">
        <div className="j-text-center j-mb-64">
          <h2 className="j-text-4xl j-font-bold j-text-white j-mb-16 j-tracking-tight">
            Everything you need
          </h2>
          <p className="j-text-xl j-text-gray-400 j-max-w-2xl j-mx-auto">
            Built for developers who want full control without the complexity.
          </p>
        </div>

        <div className="j-grid md:j-grid-cols-2 lg:j-grid-cols-3 j-gap-24">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="j-p-28 j-bg-gray-950 j-rounded-xl j-border j-border-gray-800 hover:j-border-gray-700 j-transition j-group"
            >
              <div
                className="j-inline-flex j-items-center j-justify-center j-w-44 j-h-44 j-rounded-xl j-mb-20 j-text-white"
                style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
              >
                {f.icon}
              </div>
              <h3 className="j-text-lg j-font-semibold j-text-white j-mb-8">
                {f.title}
              </h3>
              <p className="j-text-gray-400 j-leading-relaxed j-text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
