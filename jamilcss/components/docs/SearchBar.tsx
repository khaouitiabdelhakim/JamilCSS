"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const PAGES = [
  { url: "/docs", title: "Introduction" },
  { url: "/docs/installation", title: "Installation" },
  { url: "/docs/configuration", title: "Configuration" },
  { url: "/docs/core-concepts/how-it-works", title: "How It Works" },
  { url: "/docs/core-concepts/jamilcss-directive", title: "The @jamilcss Directive" },
  { url: "/docs/core-concepts/apply-directive", title: "The @apply Directive" },
  { url: "/docs/core-concepts/preflight", title: "Preflight" },
  { url: "/docs/layout/flexbox", title: "Flexbox" },
  { url: "/docs/layout/grid", title: "Grid" },
  { url: "/docs/layout/spacing-sizing", title: "Spacing & Sizing" },
  { url: "/docs/layout/position", title: "Position" },
  { url: "/docs/layout/overflow", title: "Overflow" },
  { url: "/docs/typography/font-size", title: "Font Size" },
  { url: "/docs/typography/font-weight-family", title: "Font Weight & Family" },
  { url: "/docs/typography/text-color", title: "Text Color" },
  { url: "/docs/typography/text-modifiers", title: "Text Modifiers" },
  { url: "/docs/colors/palette", title: "Color Palette" },
  { url: "/docs/colors/background", title: "Background" },
  { url: "/docs/colors/border-color", title: "Border Color" },
  { url: "/docs/colors/gradients", title: "Gradients" },
  { url: "/docs/colors/opacity", title: "Opacity" },
  { url: "/docs/variants/breakpoints", title: "Breakpoints" },
  { url: "/docs/variants/dark-light-theme", title: "Dark & Light Theme" },
  { url: "/docs/variants/state-variants", title: "State Variants" },
  { url: "/docs/variants/stacked-variants", title: "Stacked Variants" },
  { url: "/docs/variants/peer-group", title: "Peer & Group" },
  { url: "/docs/variants/aria-supports", title: "ARIA & Supports" },
  { url: "/docs/animation/transitions", title: "Transitions" },
  { url: "/docs/animation/keyframe-animations", title: "Keyframe Animations" },
  { url: "/docs/utilities-reference", title: "Utilities Reference" },
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? PAGES.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="j-relative j-w-full">
      <div className="j-relative">
        <svg className="j-absolute j-left-12 j-top-0 j-bottom-0 j-my-auto j-text-gray-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          placeholder="Search docs…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="j-w-full j-pl-36 j-pr-48 j-py-8 j-text-sm j-rounded-lg j-border j-border-gray-800 j-bg-gray-900 j-text-gray-200 j-transition focus:j-outline-none"
          style={{ caretColor: "#f857a6" }}
        />
        <kbd className="j-absolute j-right-10 j-top-0 j-bottom-0 j-my-auto j-flex j-items-center j-px-6 j-py-2 j-text-xs j-text-gray-600 j-bg-gray-800 j-rounded j-h-20">
          ⌘K
        </kbd>
      </div>

      {open && results.length > 0 && (
        <ul className="j-absolute j-z-50 j-mt-4 j-w-full j-bg-gray-900 j-border j-border-gray-800 j-rounded-xl j-shadow-2xl j-overflow-hidden j-max-h-320 j-overflow-y-auto">
          {results.map((r) => (
            <li key={r.url}>
              <Link
                href={r.url}
                className="j-flex j-items-center j-gap-10 j-px-16 j-py-10 j-text-sm j-text-gray-300 hover:j-bg-gray-800 hover:j-text-white j-transition"
                onClick={() => { setOpen(false); setQuery(""); }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
