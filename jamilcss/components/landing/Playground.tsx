"use client";

import { useState, useRef, useEffect } from "react";
import { useReveal } from "@/lib/useReveal";

type Tab = "Buttons" | "Cards" | "Badges" | "Inputs";
const TABS: Tab[] = ["Buttons", "Cards", "Badges", "Inputs"];

const BUTTON_VARIANTS = [
  { label: "Primary", classes: "j-px-24 j-py-12 j-rounded-xl j-text-white j-font-semibold j-text-sm j-transition hover:j-opacity-80", style: { background: "linear-gradient(135deg, #f857a6, #ff5858)" }, code: "j-px-24 j-py-12 j-rounded-xl j-text-white j-font-semibold" },
  { label: "Ghost", classes: "j-px-24 j-py-12 j-rounded-xl j-font-semibold j-text-sm j-border j-text-gray-300 hover:j-text-white hover:j-bg-gray-800 j-transition", style: { borderColor: "rgba(255,255,255,0.15)" }, code: "j-px-24 j-py-12 j-rounded-xl j-border j-text-gray-300 hover:j-bg-gray-800" },
  { label: "Pill", classes: "j-px-24 j-py-10 j-rounded-full j-text-white j-font-semibold j-text-sm j-transition hover:j-opacity-80", style: { background: "linear-gradient(135deg, #a855f7, #f857a6)" }, code: "j-px-24 j-py-10 j-rounded-full j-text-white j-font-semibold" },
  { label: "Outline", classes: "j-px-24 j-py-12 j-rounded-xl j-font-semibold j-text-sm j-border j-transition", style: { borderColor: "#f857a6", color: "#f857a6" }, code: "j-px-24 j-py-12 j-rounded-xl j-border j-border-pink-500 j-text-pink-500" },
  { label: "Danger", classes: "j-px-24 j-py-12 j-rounded-xl j-text-white j-font-semibold j-text-sm j-transition hover:j-opacity-80", style: { background: "#ef4444" }, code: "j-px-24 j-py-12 j-rounded-xl j-bg-red-500 j-text-white" },
  { label: "Icon", classes: "j-flex j-items-center j-gap-8 j-px-20 j-py-12 j-rounded-xl j-text-white j-font-semibold j-text-sm j-transition hover:j-opacity-80", style: { background: "linear-gradient(135deg, #f857a6, #ff5858)" }, code: "j-flex j-items-center j-gap-8 j-px-20 j-py-12 j-rounded-xl" },
];

const CARD_VARIANTS = [
  { label: "Dark card", code: "j-p-24 j-rounded-2xl j-bg-gray-900 j-border j-border-gray-800" },
  { label: "Glow card", code: "j-p-24 j-rounded-2xl j-border j-border-pink-500/20" },
  { label: "Glass card", code: "j-p-24 j-rounded-2xl j-border j-border-white/10 j-backdrop-blur" },
  { label: "Stat card", code: "j-p-24 j-rounded-2xl j-bg-gray-900 j-border-t-4 j-border-t-pink-500" },
];

const CARD_STYLES = [
  { bg: "#1e293b", border: "rgba(248,87,166,0.1)", shadow: "none", borderTop: undefined },
  { bg: "rgba(248,87,166,0.04)", border: "rgba(248,87,166,0.2)", shadow: "0 0 24px rgba(248,87,166,0.08)", borderTop: undefined },
  { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.1)", shadow: "none", borderTop: undefined },
  { bg: "#1e293b", border: "rgba(248,87,166,0.1)", shadow: "none", borderTop: "4px solid #f857a6" },
];

const BADGE_VARIANTS = [
  { text: "New", code: "j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold j-bg-pink-500/20 j-text-pink-300", style: { background: "rgba(248,87,166,0.15)", color: "#f9a8d4" } },
  { text: "Active", code: "j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold j-bg-green-500/20 j-text-green-300", style: { background: "rgba(16,185,129,0.15)", color: "#6ee7b7" } },
  { text: "Beta", code: "j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold j-bg-yellow-500/20 j-text-yellow-300", style: { background: "rgba(245,158,11,0.15)", color: "#fcd34d" } },
  { text: "Deprecated", code: "j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold j-bg-red-500/20 j-text-red-300", style: { background: "rgba(239,68,68,0.15)", color: "#fca5a5" } },
  { text: "Pro", code: "j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold j-bg-purple-500/20 j-text-purple-300", style: { background: "rgba(168,85,247,0.15)", color: "#c4b5fd" } },
  { text: "Draft", code: "j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold j-bg-gray-700 j-text-gray-300", style: { background: "#374151", color: "#d1d5db" } },
];

const INPUT_VARIANTS = [
  { label: "Default", placeholder: "Type something...", code: "j-px-16 j-py-10 j-rounded-lg j-border j-border-gray-700 j-bg-gray-900 j-text-white j-text-sm focus:j-border-pink-500", border: "#374151", bg: "#111827" },
  { label: "Search", placeholder: "Search...", code: "j-pl-40 j-pr-16 j-py-10 j-rounded-lg j-border j-border-gray-700 j-bg-gray-900 j-text-white j-text-sm", border: "#374151", bg: "#111827" },
  { label: "Error", placeholder: "Invalid value", code: "j-px-16 j-py-10 j-rounded-lg j-border j-border-red-500 j-bg-red-500/5 j-text-white j-text-sm", border: "#ef4444", bg: "rgba(239,68,68,0.05)" },
  { label: "Success", placeholder: "name@example.com", code: "j-px-16 j-py-10 j-rounded-lg j-border j-border-green-500 j-bg-green-500/5 j-text-white j-text-sm", border: "#10b981", bg: "rgba(16,185,129,0.05)" },
];

function CodePill({ code, show }: { code: string; show: boolean }) {
  if (!show) return null;
  return (
    <code
      className="j-text-xs j-font-mono j-px-16 j-py-12 j-rounded-lg j-block j-text-left j-mt-24"
      style={{ background: "#060b18", color: "#f857a6", border: "1px solid rgba(248,87,166,0.15)" }}
    >
      className=&quot;{code}&quot;
    </code>
  );
}

function ButtonsTab({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div>
      <div className="j-flex j-flex-wrap j-gap-16">
        {BUTTON_VARIANTS.map((v, i) => (
          <button
            key={v.label}
            type="button"
            onClick={() => setActive(i)}
            className={v.classes}
            style={{ ...v.style, outline: active === i ? "2px solid #f857a6" : "none", outlineOffset: 3 }}
          >
            {v.label === "Icon" && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
            {v.label}
          </button>
        ))}
      </div>
      <CodePill code={active >= 0 ? BUTTON_VARIANTS[active].code : ""} show={active >= 0} />
    </div>
  );
}

function CardsTab({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div>
      <div className="j-grid j-grid-cols-2 j-gap-16">
        {CARD_VARIANTS.map((v, i) => (
          <div
            key={v.label}
            onClick={() => setActive(i)}
            className="j-p-24 j-rounded-2xl j-cursor-pointer j-transition"
            style={{
              background: CARD_STYLES[i].bg,
              border: `1px solid ${CARD_STYLES[i].border}`,
              borderTop: CARD_STYLES[i].borderTop ?? undefined,
              boxShadow: active === i ? "0 0 0 2px #f857a6" : (CARD_STYLES[i].shadow ?? "none"),
            }}
          >
            <div className="j-w-24 j-h-8 j-rounded j-mb-8" style={{ background: "rgba(248,87,166,0.3)" }} />
            <div className="j-w-full j-h-6 j-rounded j-mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="j-w-3/4 j-h-6 j-rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
            <p className="j-text-xs j-text-gray-500 j-mt-12">{v.label}</p>
          </div>
        ))}
      </div>
      <CodePill code={active >= 0 ? CARD_VARIANTS[active].code : ""} show={active >= 0} />
    </div>
  );
}

function BadgesTab({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div>
      <div className="j-flex j-flex-wrap j-gap-16 j-items-center">
        {BADGE_VARIANTS.map((v, i) => (
          <span
            key={v.text}
            onClick={() => setActive(i)}
            className="j-px-10 j-py-4 j-rounded-full j-text-xs j-font-semibold j-cursor-pointer j-transition"
            style={{ ...v.style, outline: active === i ? "2px solid #f857a6" : "none", outlineOffset: 3 }}
          >
            {v.text}
          </span>
        ))}
      </div>
      <CodePill code={active >= 0 ? BADGE_VARIANTS[active].code : ""} show={active >= 0} />
    </div>
  );
}

function InputsTab({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div className="j-flex j-flex-col j-gap-16">
      {INPUT_VARIANTS.map((v, i) => (
        <div key={v.label} className="j-flex j-flex-col j-gap-6">
          <label className="j-text-xs j-text-gray-500 j-font-medium">{v.label}</label>
          <div className="j-relative">
            {i === 1 && (
              <svg className="j-absolute j-left-12 j-top-1/2" style={{ transform: "translateY(-50%)", color: "#6b7280" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            )}
            <input
              type="text"
              placeholder={v.placeholder}
              onClick={() => setActive(i)}
              readOnly
              className="j-w-full j-rounded-lg j-text-sm j-text-white j-outline-none j-cursor-pointer j-transition"
              style={{
                padding: i === 1 ? "10px 16px 10px 36px" : "10px 16px",
                background: v.bg,
                border: `1px solid ${active === i ? "#f857a6" : v.border}`,
                boxShadow: active === i ? "0 0 0 2px rgba(248,87,166,0.2)" : "none",
              }}
            />
          </div>
        </div>
      ))}
      <CodePill code={active >= 0 ? INPUT_VARIANTS[active].code : ""} show={active >= 0} />
    </div>
  );
}

export function Playground() {
  const [activeTab, setActiveTab] = useState<Tab>("Buttons");
  const [activeItem, setActiveItem] = useState(-1);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const revealRef = useReveal();

  useEffect(() => { setActiveItem(-1); }, [activeTab]);

  useEffect(() => {
    const idx = TABS.indexOf(activeTab);
    const el = tabRefs.current[idx];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  return (
    <section className="j-py-96 j-px-24">
      <div className="j-container">
        <div className="reveal j-text-center j-mb-64" ref={revealRef}>
          <p className="j-text-sm j-font-semibold j-uppercase j-tracking-widest j-mb-12" style={{ color: "#f857a6" }}>Interactive Demo</p>
          <h2 className="j-text-5xl j-font-bold j-text-white j-mb-16" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}>
            See it work. Click anything.
          </h2>
          <p className="j-text-xl j-text-gray-400">Every component styled with real JamilCSS utility classes.</p>
        </div>

        <div
          className="j-rounded-2xl j-border j-overflow-hidden"
          style={{ borderColor: "rgba(248,87,166,0.15)", boxShadow: "0 0 0 1px rgba(248,87,166,0.06), 0 24px 48px rgba(0,0,0,0.5)" }}
        >
          {/* Tab bar */}
          <div
            className="j-relative j-flex j-border-b"
            style={{ background: "rgba(15,23,42,0.95)", borderColor: "rgba(248,87,166,0.1)", padding: "0 8px" }}
          >
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
            {TABS.map((t, i) => (
              <button
                key={t}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                onClick={() => setActiveTab(t)}
                style={{ color: activeTab === t ? "#f1f5f9" : "#64748b", background: "none", border: "none", cursor: "pointer", padding: "14px 20px", fontSize: "0.875rem", fontWeight: activeTab === t ? 600 : 400, transition: "color 0.15s" }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="j-p-36" style={{ background: "#070d1a", minHeight: 240 }}>
            {activeTab === "Buttons" && <ButtonsTab active={activeItem} setActive={setActiveItem} />}
            {activeTab === "Cards" && <CardsTab active={activeItem} setActive={setActiveItem} />}
            {activeTab === "Badges" && <BadgesTab active={activeItem} setActive={setActiveItem} />}
            {activeTab === "Inputs" && <InputsTab active={activeItem} setActive={setActiveItem} />}
          </div>
        </div>
      </div>
    </section>
  );
}
