import Link from "next/link";
import { Sidebar } from "@/components/docs/Sidebar";
import { SearchBar } from "@/components/docs/SearchBar";
import { MobileDrawer } from "@/components/docs/MobileDrawer";
import { docsTree } from "@/lib/docs";

const tree = {
  children: docsTree.map((section) => ({
    type: "folder",
    name: section.name,
    children: section.children.map((page) => ({
      type: "page",
      name: page.name,
      url: page.url,
    })),
  })),
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="j-min-h-screen j-bg-gray-950">
      {/* Top header */}
      <header className="j-sticky j-top-0 j-z-40 j-h-64 j-flex j-items-center j-border-b j-border-gray-800 j-bg-gray-950/95 j-backdrop-blur">
        <div className="j-w-full j-px-24 j-flex j-items-center j-gap-16">
          <MobileDrawer tree={tree as any} />

          <Link href="/" className="j-flex j-items-center j-gap-8 j-mr-24 j-flex-shrink-0">
            <span
              className="j-flex j-items-center j-justify-center j-w-28 j-h-28 j-rounded-md j-text-white j-text-xs j-font-black"
              style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
            >
              J
            </span>
            <span className="j-font-bold j-text-white">
              Jamil<span className="brand-gradient-text">CSS</span>
            </span>
          </Link>

          <div className="j-flex-1 j-max-w-md">
            <SearchBar />
          </div>

          <div className="j-flex j-items-center j-gap-16 j-ml-auto">
            <a
              href="https://github.com/khaouitiabdelhakim/JamilCSS"
              target="_blank"
              rel="noopener noreferrer"
              className="j-hidden md:j-flex j-items-center j-gap-6 j-text-sm j-text-gray-500 hover:j-text-white j-transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </a>
            <Link
              href="/docs"
              className="j-hidden md:j-flex j-px-14 j-py-7 j-text-white j-text-sm j-font-semibold j-rounded-lg hover:j-opacity-90 j-transition"
              style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
            >
              Docs
            </Link>
          </div>
        </div>
      </header>

      <div className="j-flex">
        <Sidebar tree={tree as any} />
        <main className="j-flex-1 j-min-w-0 j-px-48 j-py-48">
          {children}
        </main>
      </div>
    </div>
  );
}
