"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function MobileDrawer({ tree }: { tree: { children: any[] } }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="lg:j-hidden j-flex j-items-center j-justify-center j-w-36 j-h-36 j-rounded-lg j-border j-border-gray-700 j-text-gray-400 hover:j-bg-gray-800 j-transition j-mr-8"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>

      {open && (
        <div className="j-fixed j-inset-0 j-z-50 lg:j-hidden">
          <div className="j-absolute j-inset-0 j-bg-black/70 j-backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div className="j-absolute j-left-0 j-top-0 j-h-full j-w-280 j-bg-gray-950 j-border-r j-border-gray-800 j-overflow-y-auto">
            <div className="j-flex j-items-center j-justify-between j-px-24 j-py-16 j-border-b j-border-gray-800">
              <span className="j-font-bold j-text-white">Navigation</span>
              <button
                type="button"
                className="j-flex j-items-center j-justify-center j-w-32 j-h-32 j-rounded-lg hover:j-bg-gray-800 j-transition j-text-gray-400"
                onClick={() => setOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="j-py-16" onClick={() => setOpen(false)}>
              <Sidebar tree={tree as any} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
