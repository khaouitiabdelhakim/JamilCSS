import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { readFileSync } from "fs";
import path from "path";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { PropTable } from "@/components/mdx/PropTable";
import { UtilitiesReference } from "@/components/mdx/UtilitiesReference";
import { FrameworkTabs } from "@/components/mdx/FrameworkTabs";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { Prose } from "@/components/docs/Prose";
import { TableOfContents, type TocHeading } from "@/components/docs/TableOfContents";
import { docsEntries, getDoc, getDocUrl } from "@/lib/docs";

const mdxComponents = { Callout, CodeBlock, PropTable, UtilitiesReference, FrameworkTabs };

function extractHeadings(slug?: string[]): TocHeading[] {
  try {
    const filePath = slug?.length
      ? path.join(process.cwd(), "content", "docs", ...slug.slice(0, -1), `${slug[slug.length - 1]}.mdx`)
      : path.join(process.cwd(), "content", "docs", "index.mdx");

    const content = readFileSync(filePath, "utf-8");
    const headings: TocHeading[] = [];

    // Skip frontmatter block
    let body = content;
    if (content.startsWith("---")) {
      const end = content.indexOf("---", 3);
      if (end !== -1) body = content.slice(end + 3);
    }

    for (const line of body.split("\n")) {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (match) {
        const text = match[2].trim().replace(/`([^`]+)`/g, "$1");
        // rehype-slug uses github-slugger compatible IDs
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        headings.push({ id, text, level: match[1].length });
      }
    }
    return headings;
  } catch {
    return [];
  }
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const mod = await doc.load();
  const MDX = mod.default;
  const headings = extractHeadings(slug);

  const breadcrumbItems = [
    { name: "Docs", url: "/docs" },
    ...(slug?.slice(0, -1).map((segment, i) => ({
      name: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: getDocUrl(slug.slice(0, i + 1)),
    })) ?? []),
    { name: doc.title },
  ];

  return (
    <div className="j-flex j-items-start j-w-full">
      {/* Main content */}
      <article className="j-flex-1 j-min-w-0">
        <Breadcrumb items={breadcrumbItems} />
        <h1
          className="j-text-4xl j-font-bold j-mb-8 j-text-white j-tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
        >
          {doc.title}
        </h1>
        {doc.description && (
          <p className="j-text-lg j-text-gray-400 j-mb-40 j-leading-relaxed">
            {doc.description}
          </p>
        )}
        <div className="j-border-t j-border-gray-800 j-pt-32">
          <Prose>
            <MDX components={mdxComponents as unknown as Record<string, ComponentType>} />
          </Prose>
        </div>
      </article>

      {/* Right-side TOC */}
      <TableOfContents headings={headings} />
    </div>
  );
}

export function generateStaticParams() {
  return docsEntries.map((d) => ({
    slug: d.slug.length ? d.slug : undefined,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} | JamilCSS`,
    description: doc.description,
  };
}
