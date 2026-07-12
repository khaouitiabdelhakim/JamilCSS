import Link from "next/link";

export function Breadcrumb({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <nav className="j-flex j-items-center j-gap-8 j-text-sm j-text-gray-600 j-mb-24 j-flex-wrap">
      {items.map((item, i) => (
        <span key={`${item.name}-${i}`} className="j-flex j-items-center j-gap-8">
          {i > 0 && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          )}
          {item.url ? (
            <Link href={item.url} className="hover:j-text-gray-300 j-transition">
              {item.name}
            </Link>
          ) : (
            <span className="j-text-gray-300 j-font-medium">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
