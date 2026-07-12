"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

const LANG_LABEL: Record<string, string> = {
  tsx: "TSX",
  jsx: "JSX",
  ts: "TS",
  js: "JS",
  css: "CSS",
  bash: "BASH",
  sh: "SH",
  json: "JSON",
  html: "HTML",
};

export function CodeBlock({
  code,
  lang = "tsx",
  filename,
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    codeToHtml(code, { lang, theme: "github-dark-dimmed" }).then((raw) => {
      // Remove inline background-color so our wrapper background shows through
      setHtml(raw.replace(/background-color:[^;'"]+;?/g, ""));
    });
  }, [code, lang]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const label = LANG_LABEL[lang] ?? lang.toUpperCase();
  const file = filename ?? (lang === "bash" || lang === "sh" ? "terminal" : `example.${lang}`);

  const titleBar = (
    <div
      className="j-flex j-items-center j-gap-6 j-px-16 j-py-12 j-border-b"
      style={{
        background: "rgba(15,23,42,0.95)",
        borderColor: "rgba(248,87,166,0.1)",
      }}
    >
      <span className="j-w-12 j-h-12 j-rounded-full" style={{ background: "#ff5f57" }} />
      <span className="j-w-12 j-h-12 j-rounded-full" style={{ background: "#ffbc2e" }} />
      <span className="j-w-12 j-h-12 j-rounded-full" style={{ background: "#28c840" }} />
      <span className="j-ml-12 j-text-xs j-font-mono j-text-gray-600">{file}</span>
      <div className="j-flex j-items-center j-gap-8 j-ml-auto">
        <span
          className="j-text-xs j-font-mono j-px-8 j-py-3 j-rounded-md"
          style={{ color: "#f857a6", background: "rgba(248,87,166,0.08)" }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="j-text-xs j-font-medium j-px-10 j-py-5 j-rounded-lg j-transition"
          style={{
            background: copied ? "rgba(248,87,166,0.15)" : "rgba(255,255,255,0.06)",
            color: copied ? "#f857a6" : "#9ca3af",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );

  if (!html) {
    return (
      <div
        className="j-my-24 j-rounded-2xl j-overflow-hidden j-border"
        style={{
          borderColor: "rgba(248,87,166,0.15)",
          boxShadow: "0 0 0 1px rgba(248,87,166,0.06), 0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {titleBar}
        <pre
          className="j-p-24 j-text-sm j-font-mono j-text-gray-300 j-overflow-x-auto j-leading-relaxed"
          style={{ background: "#060b18" }}
        >
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className="j-my-24 j-rounded-2xl j-overflow-hidden j-border"
      style={{
        borderColor: "rgba(248,87,166,0.15)",
        boxShadow: "0 0 0 1px rgba(248,87,166,0.06), 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {titleBar}
      <div
        className="j-overflow-x-auto"
        style={{ background: "#060b18" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
