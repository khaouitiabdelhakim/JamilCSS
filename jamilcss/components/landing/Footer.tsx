import Link from "next/link";

const LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Installation", href: "/docs/installation" },
  { label: "Configuration", href: "/docs/configuration" },
];

export function Footer() {
  return (
    <footer className="j-py-48 j-px-24 j-border-t j-border-gray-800 j-bg-gray-950">
      <div className="j-container">
        <div className="j-flex j-flex-col md:j-flex-row j-items-center j-justify-between j-gap-24">
          <div className="j-flex j-flex-col j-items-center md:j-items-start j-gap-8">
            <Link href="/" className="j-text-lg j-font-bold j-text-white">
              Jamil<span className="brand-gradient-text">CSS</span>
            </Link>
            <p className="j-text-sm j-text-gray-600">
              Utility-first CSS, built your way.
            </p>
          </div>

          <nav className="j-flex j-items-center j-gap-24">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="j-text-sm j-text-gray-500 hover:j-text-white j-transition">
                {l.label}
              </Link>
            ))}
            <a
              href="https://github.com/khaouitiabdelhakim/JamilCSS"
              target="_blank"
              rel="noopener noreferrer"
              className="j-text-sm j-text-gray-500 hover:j-text-white j-transition"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="j-mt-32 j-pt-24 j-border-t j-border-gray-800 j-text-center">
          <p className="j-text-xs j-text-gray-700">
            Open source · Provided by KHAOUITI Apps
          </p>
        </div>
      </div>
    </footer>
  );
}
