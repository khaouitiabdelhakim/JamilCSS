"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/lib/useReveal";

const STATS = [
  { value: 0, label: "KB runtime", suffix: "" },
  { value: 22, label: "color families", suffix: "" },
  { value: 100, label: "utilities", suffix: "+" },
];

const VERBOSE_CSS = `.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: #1e293b;
  border-radius: 16px;
  border: 1px solid #334155;
}

.card:hover {
  border-color: #475569;
  box-shadow: 0 0 32px rgba(0,0,0,0.3);
}

.card__title {
  font-size: 18px;
  font-weight: 600;
  color: #f8fafc;
}

.card__body {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
}`;

const JAMIL_CODE = `<div className="
  j-flex j-flex-col j-gap-16
  j-p-24 j-rounded-2xl j-border
  j-border-gray-700
  hover:j-border-gray-600
  hover:j-shadow-xl
  j-transition
">
  <h3 className="
    j-text-lg j-font-semibold
    j-text-white
  ">
    Title
  </h3>
  <p className="
    j-text-sm j-text-gray-400
    j-leading-relaxed
  ">
    Body text here.
  </p>
</div>`;

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          if (target === 0) { setCount(0); return; }
          let current = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(current);
            if (current >= target) clearInterval(timer);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={spanRef}>{count}{suffix}</span>;
}

export function StatsComparison() {
  const [copied, setCopied] = useState(false);
  const revealRef = useReveal();

  const copy = async () => {
    await navigator.clipboard.writeText(JAMIL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="j-py-56 lg:j-py-96 j-px-20 j-border-y" style={{ borderColor: "rgba(248,87,166,0.08)" }}>
      <div className="j-container">
        {/* Stat counters */}
        <div className="reveal j-grid j-grid-cols-3 j-gap-12 md:j-gap-24 j-mb-48 lg:j-mb-80 j-text-center" ref={revealRef}>
          {STATS.map((s) => (
            <div
              key={s.label}
              className="j-p-16 md:j-p-28 j-rounded-2xl j-border"
              style={{ background: "rgba(248,87,166,0.04)", borderColor: "rgba(248,87,166,0.12)" }}
            >
              <div
                className="j-font-bold j-mb-8"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em", fontSize: "clamp(1.8rem, 5vw, 3.5rem)", background: "linear-gradient(135deg, #f857a6, #ff5858)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em", background: "linear-gradient(135deg, #f857a6, #ff5858)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <p className="j-text-gray-400 j-text-sm j-font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Heading */}
        <div className="j-text-center j-mb-48">
          <h2 className="j-font-bold j-text-white j-mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
            Less to write. More to show.
          </h2>
          <p className="j-text-gray-400 j-text-lg">Same result. Drastically less code.</p>
        </div>

        {/* Code comparison */}
        <div
          className="j-grid lg:j-grid-cols-2 j-rounded-2xl j-overflow-hidden j-border"
          style={{ borderColor: "rgba(248,87,166,0.15)" }}
        >
          {/* Verbose CSS */}
          <div>
            <div
              className="j-flex j-items-center j-gap-8 j-px-20 j-py-12 j-border-b"
              style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)" }}
            >
              <span className="j-w-8 j-h-8 j-rounded-full" style={{ background: "#ef4444" }} />
              <span className="j-text-sm j-font-mono j-text-gray-400">verbose.css</span>
              <span className="j-ml-auto j-text-xs j-text-red-400 j-font-semibold">17 lines</span>
            </div>
            <pre className="j-p-24 j-text-xs j-font-mono j-overflow-x-auto j-leading-relaxed" style={{ background: "#060b18", color: "#94a3b8", minHeight: 280 }}>
              <code>{VERBOSE_CSS}</code>
            </pre>
          </div>

          {/* JamilCSS */}
          <div className="j-relative lg:j-border-l j-border-t lg:j-border-t-0" style={{ borderColor: "rgba(248,87,166,0.15)" }}>
            {/* vs badge */}
            <div
              className="j-absolute j-hidden lg:j-flex j-items-center j-justify-center j-z-10"
              style={{ left: 0, top: "50%", transform: "translate(-50%, -50%)" }}
            >
              <span
                className="j-text-xs j-font-bold j-px-10 j-py-6 j-rounded-full"
                style={{ background: "#030712", color: "#f857a6", border: "1px solid rgba(248,87,166,0.3)" }}
              >
                vs
              </span>
            </div>

            <div
              className="j-flex j-items-center j-gap-8 j-px-20 j-py-12 j-border-b"
              style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.15)" }}
            >
              <span className="j-w-8 j-h-8 j-rounded-full" style={{ background: "#10b981" }} />
              <span className="j-text-sm j-font-mono j-text-gray-400">component.tsx</span>
              <span className="j-text-xs j-text-green-400 j-font-semibold">JamilCSS</span>
              <button
                type="button"
                onClick={copy}
                className="j-ml-auto j-text-xs j-px-10 j-py-4 j-rounded-md j-transition"
                style={{ background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)", color: copied ? "#10b981" : "#64748b" }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="j-p-24 j-text-xs j-font-mono j-overflow-x-auto j-leading-relaxed" style={{ background: "#060b18", color: "#e2e8f0", minHeight: 280 }}>
              <code style={{ color: "#94a3b8" }}>{JAMIL_CODE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
