"use client";

import { useReveal } from "@/lib/useReveal";

const DEMOS = [
  { cls: "j-animate-fadein-500", label: "j-animate-fadein-500", style: { background: "linear-gradient(135deg, #f857a6, #ff5858)" } },
  { cls: "j-animate-spin-2-s", label: "j-animate-spin-2-s", style: { background: "linear-gradient(135deg, #ff5858, #f97316)" } },
  { cls: "j-animate-pulse-1-s", label: "j-animate-pulse-1-s", style: { background: "linear-gradient(135deg, #f857a6, #a855f7)" } },
  { cls: "j-animate-bounce-800", label: "j-animate-bounce-800", style: { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" } },
  { cls: "j-animate-ping-600", label: "j-animate-ping-600", style: { background: "linear-gradient(135deg, #10b981, #3b82f6)" } },
  { cls: "j-animate-fadeout-400", label: "j-animate-fadeout-400", style: { background: "linear-gradient(135deg, #a855f7, #f857a6)" } },
];

export function AnimationDemo() {
  const revealRef = useReveal();

  return (
    <section className="j-py-56 lg:j-py-96 j-px-20 j-border-y" style={{ borderColor: "rgba(248,87,166,0.08)" }}>
      <div className="j-container">
        <div className="reveal j-text-center j-mb-48 lg:j-mb-64" ref={revealRef}>
          <p className="j-text-sm j-font-semibold j-uppercase j-tracking-widest j-mb-12" style={{ color: "#f857a6" }}>Animations</p>
          <h2
            className="j-font-bold j-text-white j-mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Built-in motion.
          </h2>
          <p className="j-text-lg j-text-gray-400 j-max-w-xl j-mx-auto">
            Fade, spin, pulse, bounce, ping — drop in animated utilities instantly. No keyframe authoring.
          </p>
        </div>

        <div className="j-flex j-flex-wrap j-justify-center j-gap-32 md:j-gap-48">
          {DEMOS.map((d, i) => (
            <div key={d.cls} className={`reveal reveal-delay-${i + 1} j-flex j-flex-col j-items-center j-gap-20`}>
              <div
                className={`j-w-72 j-h-72 j-rounded-2xl j-shadow-xl ${d.cls}`}
                style={{ ...d.style, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
              />
              <code
                className="j-text-xs j-font-mono j-px-12 j-py-6 j-rounded-lg j-border"
                style={{ color: "#f857a6", background: "rgba(248,87,166,0.06)", borderColor: "rgba(248,87,166,0.15)" }}
              >
                {d.label}
              </code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
