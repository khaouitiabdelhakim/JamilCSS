"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="j-fixed j-top-0 j-left-0 j-right-0 j-z-50 j-h-64 j-flex j-items-center j-border-b j-border-gray-800 j-bg-gray-950/95 j-backdrop-blur">
        <div className="j-container j-flex j-items-center j-justify-between">
          {/* Logo */}
          <Link href="/" className="j-flex j-items-center j-gap-10 j-text-xl j-font-bold j-text-white">
            <span
              className="j-flex j-items-center j-justify-center j-w-32 j-h-32 j-rounded-lg j-text-white j-text-sm j-font-black"
              style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
            >
              J
            </span>
            Jamil<span className="brand-gradient-text">CSS</span>
          </Link>

          {/* Desktop nav */}
          <nav className="j-hidden md:j-flex j-items-center j-gap-32">
            <Link href="/docs" className="j-text-sm j-text-gray-400 hover:j-text-white j-transition">
              Docs
            </Link>
            <a
              href="https://github.com/khaouitiabdelhakim/JamilCSS"
              target="_blank"
              rel="noopener noreferrer"
              className="j-flex j-items-center j-gap-6 j-text-sm j-text-gray-400 hover:j-text-white j-transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </a>
          </nav>

          {/* CTA */}
          <div className="j-flex j-items-center j-gap-12">
            <Link
              href="/docs"
              className="j-hidden md:j-flex j-items-center j-gap-6 j-px-16 j-py-8 j-text-white j-text-sm j-font-semibold j-rounded-lg j-transition hover:j-opacity-90"
              style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
            >
              Get started
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:j-hidden j-flex j-items-center j-justify-center j-w-36 j-h-36 j-rounded-lg j-border j-border-gray-700 j-text-gray-400"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="j-fixed j-inset-0 j-z-50 md:j-hidden">
          <div className="j-absolute j-inset-0 j-bg-black/70 j-backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="j-absolute j-top-0 j-right-0 j-h-full j-w-280 j-bg-gray-950 j-border-l j-border-gray-800 j-p-24 j-flex j-flex-col j-gap-4">
            <div className="j-flex j-items-center j-justify-between j-mb-24">
              <span className="j-font-bold j-text-white">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="j-p-4 j-rounded-lg hover:j-bg-gray-800 j-text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <Link href="/docs" className="j-block j-py-12 j-text-gray-300 j-font-medium j-border-b j-border-gray-800" onClick={() => setMobileOpen(false)}>Docs</Link>
            <a href="https://github.com/khaouitiabdelhakim/JamilCSS" target="_blank" rel="noopener noreferrer" className="j-block j-py-12 j-text-gray-300 j-font-medium" onClick={() => setMobileOpen(false)}>GitHub</a>
          </div>
        </div>
      )}
    </>
  );
}
