import { SWATCHES } from "./swatches";

const byFamily = SWATCHES.reduce(
  (acc, s) => {
    if (!acc[s.family]) acc[s.family] = [];
    acc[s.family].push(s);
    return acc;
  },
  {} as Record<string, (typeof SWATCHES)[number][]>
);

const FAMILIES = Object.entries(byFamily).slice(0, 8);

export function ColorPalette() {
  return (
    <section className="j-py-96 j-px-24 j-bg-gray-950">
      <div className="j-container">
        <div className="j-text-center j-mb-64">
          <h2 className="j-text-4xl j-font-bold j-text-white j-mb-16 j-tracking-tight">
            22 color families
          </h2>
          <p className="j-text-xl j-text-gray-400">
            Shades 50–950 via{" "}
            <code className="j-font-mono j-text-sm j-bg-gray-900 j-border j-border-gray-700 j-px-8 j-py-2 j-rounded-md" style={{ color: "#f857a6" }}>
              j-bg-{"{color}"}-{"{shade}"}
            </code>
          </p>
        </div>

        <div className="j-flex j-flex-col j-gap-10">
          {FAMILIES.map(([family, swatches]) => (
            <div key={family} className="j-flex j-items-center j-gap-16">
              <span className="j-w-80 j-text-sm j-font-medium j-text-gray-500 j-capitalize j-shrink-0">
                {family}
              </span>
              <div className="j-flex j-gap-3 j-flex-1">
                {swatches.map((s) => (
                  <div
                    key={s.cls}
                    className={`j-flex-1 j-h-28 j-rounded-md j-shrink-0 ${s.cls}`}
                    title={s.cls}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="j-text-center j-mt-32 j-text-sm j-text-gray-600">
          + 14 more: rose, sky, emerald, violet, amber, fuchsia, lime, and more.
        </p>
      </div>
    </section>
  );
}
