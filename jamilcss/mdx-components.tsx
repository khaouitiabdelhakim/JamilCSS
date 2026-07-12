import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { PropTable } from "@/components/mdx/PropTable";
import { UtilitiesReference } from "@/components/mdx/UtilitiesReference";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
    CodeBlock,
    PropTable,
    UtilitiesReference,
  };
}
