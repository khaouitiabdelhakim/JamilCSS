const LEFT_CODE = `<button
  className="
    j-px-24 j-py-12
    j-bg-gradient-90-pink-500-red-500
    j-text-white j-font-semibold
    j-rounded-full j-shadow-md
    hover:j-opacity-80 j-transition
  "
>
  Get started
</button>`;

const RIGHT_CODE = `/* Responsive + dark mode */
<div className="j-grid md:j-grid-cols-2 j-gap-16">

  <div className="j-bg-gray-900 j-p-24 j-rounded-xl">
    <h2 className="j-text-white j-font-bold">
      Dark by default
    </h2>
  </div>

  {/* Stacked variants */}
  <button className="
    j-px-20 j-py-10 j-rounded-lg
    md:dark:hover:j-bg-pink-600
    j-transition j-font-semibold
  ">
    Hover me on md+
  </button>

</div>`;

export function CodeExample() {
  return (
    <section className="j-py-96 j-px-24 j-bg-gray-950">
      <div className="j-container">
        <div className="j-text-center j-mb-64">
          <h2 className="j-text-4xl j-font-bold j-text-white j-mb-16 j-tracking-tight">
            Write less, style more
          </h2>
          <p className="j-text-xl j-text-gray-400 j-max-w-2xl j-mx-auto">
            Familiar utility syntax, JamilCSS power.
          </p>
        </div>

        <div className="j-grid lg:j-grid-cols-2 j-gap-24">
          {/* Gradient button demo */}
          <div className="j-rounded-xl j-overflow-hidden j-border j-border-gray-800 j-shadow-xl">
            <div className="j-flex j-items-center j-gap-6 j-px-16 j-py-12 j-bg-gray-900 j-border-b j-border-gray-800">
              <span className="j-w-10 j-h-10 j-rounded-full j-bg-red-500" />
              <span className="j-w-10 j-h-10 j-rounded-full j-bg-yellow-400" />
              <span className="j-w-10 j-h-10 j-rounded-full j-bg-green-500" />
              <span className="j-ml-8 j-text-xs j-font-mono j-text-gray-500">gradient.tsx</span>
            </div>
            <pre className="j-bg-gray-950 j-p-24 j-text-sm j-font-mono j-text-gray-300 j-overflow-x-auto j-leading-relaxed">
              <code>{LEFT_CODE}</code>
            </pre>
            <div className="j-flex j-items-center j-justify-center j-p-40 j-bg-gray-900 j-border-t j-border-gray-800">
              <button
                type="button"
                className="j-px-24 j-py-12 j-text-white j-font-semibold j-rounded-full j-shadow-md hover:j-opacity-80 j-transition"
                style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
              >
                Get started
              </button>
            </div>
          </div>

          {/* Variants demo */}
          <div className="j-rounded-xl j-overflow-hidden j-border j-border-gray-800 j-shadow-xl">
            <div className="j-flex j-items-center j-gap-6 j-px-16 j-py-12 j-bg-gray-900 j-border-b j-border-gray-800">
              <span className="j-w-10 j-h-10 j-rounded-full j-bg-red-500" />
              <span className="j-w-10 j-h-10 j-rounded-full j-bg-yellow-400" />
              <span className="j-w-10 j-h-10 j-rounded-full j-bg-green-500" />
              <span className="j-ml-8 j-text-xs j-font-mono j-text-gray-500">variants.tsx</span>
            </div>
            <pre className="j-bg-gray-950 j-p-24 j-text-sm j-font-mono j-text-gray-300 j-overflow-x-auto j-leading-relaxed">
              <code>{RIGHT_CODE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
