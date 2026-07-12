"use client";

import { useEffect, useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside
      className="j-hidden xl:j-block j-sticky j-top-80 j-self-start j-pl-32"
      style={{ width: "220px", flexShrink: 0, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
    >
      <p
        className="j-mb-12 j-text-xs j-font-semibold j-uppercase"
        style={{ color: "#f857a6", letterSpacing: "0.12em" }}
      >
        On this page
      </p>
      <nav className="j-flex j-flex-col" style={{ gap: "2px" }}>
        {headings.map(({ id, text, level }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`toc-link${level === 3 ? " toc-link-h3" : ""}${activeId === id ? " active" : ""}`}
          >
            {text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
