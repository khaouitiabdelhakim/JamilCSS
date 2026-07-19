import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jamilPkg = require("../package.json");

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [rehypeSlug],
  },
});

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  env: {
    NEXT_PUBLIC_JAMILCSS_VERSION: jamilPkg.version,
  },
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default withMDX(config);
