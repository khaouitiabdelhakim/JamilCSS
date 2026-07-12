"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Page = { type: string; name: string; url: string };
type Folder = { type: string; name: string; children: Page[] };

function SidebarSection({ section, pathname }: { section: Folder; pathname: string }) {
  return (
    <div className="j-mb-28">
      <p className="j-px-10 j-mb-6 j-text-xs j-font-semibold j-uppercase j-tracking-widest j-text-gray-600">
        {section.name}
      </p>
      <ul>
        {section.children.map((page) => {
          const active = pathname === page.url;
          return (
            <li key={page.url}>
              <Link
                href={page.url}
                className={
                  active
                    ? "j-flex j-items-center j-gap-8 j-px-10 j-py-7 j-rounded-lg j-text-sm j-font-medium j-text-white j-bg-gray-800"
                    : "j-flex j-items-center j-px-10 j-py-7 j-rounded-lg j-text-sm j-text-gray-500 hover:j-bg-gray-900 hover:j-text-gray-200 j-transition"
                }
              >
                {active && (
                  <span
                    className="j-w-4 j-h-4 j-rounded-full j-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
                  />
                )}
                {page.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar({ tree }: { tree: { children: Folder[] } }) {
  const pathname = usePathname();
  return (
    <aside className="j-hidden lg:j-block j-w-260 j-shrink-0">
      <nav
        className="j-sticky j-top-64 j-overflow-y-auto j-py-28 j-px-16 j-border-r j-border-gray-800"
        style={{ maxHeight: "calc(100vh - 4rem)" }}
      >
        {tree.children.map((section) => (
          <SidebarSection key={section.name} section={section} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}
