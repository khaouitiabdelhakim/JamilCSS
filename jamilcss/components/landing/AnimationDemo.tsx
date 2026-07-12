const DEMOS = [
  { cls: "j-animate-fadein-500", label: "j-animate-fadein-500", style: { background: "linear-gradient(135deg, #f857a6, #ff5858)" } },
  { cls: "j-animate-spin-2-s", label: "j-animate-spin-2-s", style: { background: "linear-gradient(135deg, #ff5858, #f857a6)" } },
  { cls: "j-animate-pulse-1-s", label: "j-animate-pulse-1-s", style: { background: "linear-gradient(135deg, #f857a6, #a855f7)" } },
  { cls: "j-animate-bounce-800", label: "j-animate-bounce-800", style: { background: "linear-gradient(135deg, #ff5858, #f97316)" } },
];

export function AnimationDemo() {
  return (
    <section className="j-py-96 j-px-24 j-bg-gray-900 j-border-y j-border-gray-800">
      <div className="j-container">
        <div className="j-text-center j-mb-64">
          <h2 className="j-text-4xl j-font-bold j-text-white j-mb-16 j-tracking-tight">
            Animations built-in
          </h2>
          <p className="j-text-xl j-text-gray-400 j-max-w-xl j-mx-auto">
            Fade-in, spin, pulse, bounce — drop in animated utilities instantly.
          </p>
        </div>

        <div className="j-flex j-flex-wrap j-justify-center j-gap-48">
          {DEMOS.map((d) => (
            <div key={d.cls} className="j-flex j-flex-col j-items-center j-gap-16">
              <div
                className={`j-w-56 j-h-56 j-rounded-xl j-shadow-lg ${d.cls}`}
                style={d.style}
              />
              <code className="j-text-xs j-font-mono j-text-gray-500 j-bg-gray-950 j-border j-border-gray-800 j-px-10 j-py-4 j-rounded-lg">
                {d.label}
              </code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
