import Link from "next/link";
import Image from "next/image";

const DOC_LINKS = [
  { label: "Documentation", href: "/docs" },
  { label: "Installation", href: "/docs/installation" },
  { label: "Configuration", href: "/docs/configuration" },
  { label: "Utilities Reference", href: "/docs/utilities-reference" },
  { label: "Core Concepts", href: "/docs/core-concepts/how-it-works" },
];

const EXTERNAL_LINKS = [
  { label: "GitHub", href: "https://github.com/khaouitiabdelhakim/JamilCSS" },
  { label: "npm", href: "https://www.npmjs.com/package/jamilcss" },
  { label: "KHAOUITI Apps", href: "https://www.khaouitiapps.com" },
];

export function Footer() {
  return (
    <footer className="j-border-t" style={{ borderColor: "rgba(248,87,166,0.08)" }}>
      <div className="j-container j-py-48 lg:j-py-72 j-px-20">
        <div className="j-grid md:j-grid-cols-3 j-gap-40 lg:j-gap-48 j-mb-48 lg:j-mb-64">
          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="j-flex j-items-center j-gap-10 j-text-xl j-font-bold j-text-white j-mb-16 j-transition hover:j-opacity-80">
              <Image src="/JamilCss.webp" alt="JamilCSS" width={32} height={32} className="j-rounded-lg" />
              <span className="brand-gradient-text">JamilCSS</span>
            </Link>
            <p className="j-text-sm j-text-gray-500 j-mb-20 j-leading-relaxed">
              Utility-first CSS compiled by PostCSS.<br />
              Zero runtime. Any framework.
            </p>
            <div className="j-flex j-gap-12">
              <span
                className="j-inline-flex j-items-center j-px-10 j-py-4 j-rounded-full j-text-xs j-font-mono"
                style={{ background: "rgba(248,87,166,0.08)", color: "#f857a6", border: "1px solid rgba(248,87,166,0.2)" }}
              >
                MIT License
              </span>
              <span
                className="j-inline-flex j-items-center j-px-10 j-py-4 j-rounded-full j-text-xs j-font-mono"
                style={{ background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                v{process.env.NEXT_PUBLIC_JAMILCSS_VERSION}
              </span>
            </div>
          </div>

          {/* Col 2: Doc links */}
          <div>
            <p className="j-text-sm j-font-semibold j-text-white j-mb-20">Documentation</p>
            <div className="j-flex j-flex-col j-gap-12">
              {DOC_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="j-text-sm j-text-gray-500 hover:j-text-white j-transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Newsletter + external links */}
          <div>
            <p className="j-text-sm j-font-semibold j-text-white j-mb-8">Stay updated</p>
            <p className="j-text-sm j-text-gray-500 j-mb-20">Get notified when new utilities and features ship.</p>
            <div className="j-flex j-flex-wrap j-gap-8 j-mb-28">
              <input
                type="email"
                placeholder="you@example.com"
                className="j-flex-1 j-px-14 j-py-10 j-rounded-lg j-text-sm j-text-white j-outline-none"
                style={{ background: "#0f172a", border: "1px solid rgba(248,87,166,0.15)", color: "#f1f5f9", minWidth: 160 }}
              />
              <button
                type="button"
                className="j-px-16 j-py-10 j-rounded-lg j-text-white j-text-sm j-font-semibold j-transition hover:j-opacity-90 j-whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
              >
                Subscribe
              </button>
            </div>
            <div className="j-flex j-flex-col j-gap-10">
              {EXTERNAL_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="j-text-sm j-text-gray-500 hover:j-text-white j-transition j-flex j-items-center j-gap-6"
                >
                  {l.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="j-pt-28 j-border-t j-flex j-flex-col md:j-flex-row j-items-center j-justify-between j-gap-12"
          style={{ borderColor: "rgba(248,87,166,0.08)" }}
        >
          <p className="j-text-xs j-text-gray-700">
            &copy; {new Date().getFullYear()} KHAOUITI Apps. Open source under MIT.
          </p>
          <p className="j-text-xs j-text-gray-700">
            Built with <span style={{ color: "#f857a6" }}>JamilCSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
