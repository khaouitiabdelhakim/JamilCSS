"use client";

import { useMemo, useState } from "react";
import { utilityRows } from "@/lib/utilities-data";

export function UtilitiesReference() {
  const [filter, setFilter] = useState("");
  const rows = useMemo(
    () => utilityRows.filter((r) => r.utility.includes(filter) || r.css.toLowerCase().includes(filter.toLowerCase())),
    [filter]
  );

  return (
    <div>
      <div className="j-relative j-mb-24">
        <svg className="j-absolute j-left-12 j-top-0 j-bottom-0 j-my-auto j-text-gray-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          placeholder="Filter utilities…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="j-w-full j-max-w-md j-pl-36 j-pr-12 j-py-10 j-rounded-xl j-border j-border-gray-800 j-bg-gray-900 j-text-gray-200 j-text-sm focus:j-outline-none"
          style={{ caretColor: "#f857a6" }}
        />
      </div>

      <div className="j-overflow-x-auto j-rounded-xl j-border j-border-gray-800">
        <table className="j-w-full j-text-sm">
          <thead>
            <tr className="j-bg-gray-900">
              <th className="j-px-16 j-py-10 j-text-left j-font-semibold j-text-gray-300 j-border-b j-border-gray-800">Utility</th>
              <th className="j-px-16 j-py-10 j-text-left j-font-semibold j-text-gray-300 j-border-b j-border-gray-800">CSS Output</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
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
      <p className="j-mt-16 j-text-sm j-text-gray-600">{rows.length} utilities shown</p>
    </div>
  );
}
