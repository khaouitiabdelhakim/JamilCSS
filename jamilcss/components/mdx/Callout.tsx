type Variant = "info" | "warning" | "tip";

const STYLES: Record<Variant, { wrapper: string; icon: string; label: string }> = {
  info: {
    wrapper: "j-bg-blue-950 j-border-blue-800 j-text-blue-100",
    icon: "ℹ",
    label: "Info",
  },
  warning: {
    wrapper: "j-bg-amber-950 j-border-amber-800 j-text-amber-100",
    icon: "⚠",
    label: "Warning",
  },
  tip: {
    wrapper: "j-bg-emerald-950 j-border-emerald-800 j-text-emerald-100",
    icon: "💡",
    label: "Tip",
  },
};

export function Callout({ type = "info", children }: { type?: Variant; children: React.ReactNode }) {
  const s = STYLES[type];
  return (
    <div className={`j-my-24 j-p-16 j-rounded-xl j-border ${s.wrapper}`}>
      <div className="j-flex j-items-start j-gap-12">
        <span className="j-text-base j-mt-1">{s.icon}</span>
        <div className="j-flex-1">
          <p className="j-font-semibold j-mb-4">{s.label}</p>
          <div className="j-text-sm j-leading-relaxed j-opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}
