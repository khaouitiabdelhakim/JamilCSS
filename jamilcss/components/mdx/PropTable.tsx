export function PropTable({ rows = [] }: { rows?: { utility: string; css: string }[] }) {
  const safeRows = Array.isArray(rows) ? rows : [];
  return (
    <div className="j-my-24 j-overflow-x-auto j-rounded-xl j-border j-border-gray-800">
      <table className="j-w-full j-text-sm">
        <thead>
          <tr className="j-bg-gray-900">
            <th className="j-px-16 j-py-10 j-text-left j-font-semibold j-text-gray-300 j-border-b j-border-gray-800">Utility</th>
            <th className="j-px-16 j-py-10 j-text-left j-font-semibold j-text-gray-300 j-border-b j-border-gray-800">CSS Output</th>
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row, i) => (
            <tr key={row.utility} className={i % 2 !== 0 ? "j-bg-gray-900" : ""}>
              <td className="j-px-16 j-py-10 j-font-mono j-border-b j-border-gray-800" style={{ color: "#f857a6" }}>
                {row.utility}
              </td>
              <td className="j-px-16 j-py-10 j-font-mono j-text-gray-400 j-border-b j-border-gray-800">
                {row.css}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
