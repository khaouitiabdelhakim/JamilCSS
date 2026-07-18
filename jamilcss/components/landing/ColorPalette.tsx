"use client";

import { useState } from "react";
import { SWATCHES } from "./swatches";
import { useReveal } from "@/lib/useReveal";

type Swatch = (typeof SWATCHES)[number];

const byFamily = SWATCHES.reduce((acc, s) => {
  if (!acc[s.family]) acc[s.family] = [];
  acc[s.family].push(s);
  return acc;
}, {} as Record<string, Swatch[]>);

const ALL_FAMILIES = Object.entries(byFamily);
const MAIN = ALL_FAMILIES.slice(0, 8);
const MORE = ALL_FAMILIES.slice(8);

export function ColorPalette() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const revealRef = useReveal();

  const families = expanded ? ALL_FAMILIES : MAIN;

  return (
    <section className="j-py-96 j-px-24 j-border-y" style={{ background: "#030712", borderColor: "rgba(248,87,166,0.08)" }}>
      <div className="j-container">
        <div className="reveal j-text-center j-mb-64" ref={revealRef}>
          <p className="j-text-sm j-font-semibold j-uppercase j-tracking-widest j-mb-12" style={{ color: "#f857a6" }}>Color System</p>
          <h2
            className="j-text-5xl j-font-bold j-text-white j-mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
          >
            22 color families.
          </h2>
          <p className="j-text-xl j-text-gray-400">
            Shades 50–950 via{" "}
            <code
              className="j-font-mono j-text-sm j-bg-gray-900 j-border j-border-gray-700 j-px-8 j-py-2 j-rounded-md"
              style={{ color: "#f857a6" }}
            >
              j-bg-&#123;color&#125;-&#123;shade&#125;
            </code>
          </p>
        </div>

        <div className="j-flex j-flex-col j-gap-10">
          {families.map(([family, swatches]) => (
            <div key={family} className="j-flex j-items-center j-gap-16">
              <span className="j-w-80 j-text-sm j-font-medium j-text-gray-500 j-capitalize j-shrink-0">{family}</span>
              <div className="j-flex j-gap-3 j-flex-1">
                {swatches.map((s) => (
                  <div
                    key={s.cls}
                    className={`j-flex-1 j-h-28 j-rounded-md j-shrink-0 j-cursor-pointer j-relative ${s.cls}`}
                    title={s.cls}
                    onMouseEnter={() => setHovered(s.cls)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      transform: hovered === s.cls ? "scaleY(1.5) translateY(-4px)" : "scaleY(1)",
                      boxShadow: hovered === s.cls ? "0 4px 16px rgba(0,0,0,0.5)" : "none",
                      zIndex: hovered === s.cls ? 2 : 1,
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {hovered && (
          <p className="j-text-center j-mt-20 j-text-xs j-font-mono j-text-gray-500">
            Hovered: <span style={{ color: "#f857a6" }}>{hovered}</span>
          </p>
        )}

        {MORE.length > 0 && (
          <div className="j-text-center j-mt-32">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="j-text-sm j-font-medium j-px-20 j-py-10 j-rounded-lg j-border j-transition hover:j-border-gray-600 hover:j-text-white"
              style={{ color: "#64748b", borderColor: "#1e293b" }}
            >
              {expanded ? "Show less" : `+ ${MORE.length} more families`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
