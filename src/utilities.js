/**
 * Static utility definitions (non-numeric).
 * Numeric utilities (j-p-12, j-m-7, etc.) are generated generically in patterns.js.
 */
module.exports = {
  /* Layout / Display */
  "j-block": "display: block",
  "j-inline-block": "display: inline-block",
  "j-inline": "display: inline",
  "j-flex": "display: flex",
  "j-inline-flex": "display: inline-flex",
  "j-grid": "display: grid",
  "j-hidden": "display: none",
  /* Flexbox */
  "j-flex-row": "flex-direction: row",
  "j-flex-col": "flex-direction: column",
  "j-flex-wrap": "flex-wrap: wrap",
  "j-items-center": "align-items: center",
  "j-items-start": "align-items: flex-start",
  "j-items-end": "align-items: flex-end",
  "j-justify-center": "justify-content: center",
  "j-justify-between": "justify-content: space-between",
  "j-justify-start": "justify-content: flex-start",
  "j-justify-end": "justify-content: flex-end",
  "j-flex-shrink-0": "flex-shrink: 0",
  /* Margin special */
  "j-mx-auto": "margin-left: auto; margin-right: auto",
  /* Typography (semantic sizes; use j-text-{n} for any px) */
  "j-text-xs": "font-size: 0.75rem",
  "j-text-sm": "font-size: 0.875rem",
  "j-text-base": "font-size: 1rem",
  "j-text-lg": "font-size: 1.125rem",
  "j-text-xl": "font-size: 1.25rem",
  "j-text-2xl": "font-size: 1.5rem",
  "j-font-normal": "font-weight: 400",
  "j-font-medium": "font-weight: 500",
  "j-font-bold": "font-weight: 700",
  "j-text-left": "text-align: left",
  "j-text-center": "text-align: center",
  "j-text-right": "text-align: right",
  /* Colors (text) */
  "j-text-gray-500": "color: #6b7280",
  "j-text-gray-700": "color: #374151",
  "j-text-gray-900": "color: #111827",
  "j-text-white": "color: #fff",
  "j-text-primary": "color: #2563eb",
  "j-text-pink-500": "color: #ec4899",
  "j-text-orange-400": "color: #fb923c",
  /* Colors (background) */
  "j-bg-white": "background-color: #fff",
  "j-bg-gray-100": "background-color: #f3f4f6",
  "j-bg-gray-200": "background-color: #e5e7eb",
  "j-bg-primary": "background-color: #2563eb",
  "j-bg-primary-dark": "background-color: #1d4ed8",
  /* Border & radius (semantic; use j-rounded-{n} for any px) */
  "j-border": "border-width: 1px; border-style: solid",
  "j-border-4": "border-width: 4px; border-style: solid",
  "j-border-gray-200": "border-color: #e5e7eb",
  "j-rounded": "border-radius: 0.25rem",
  "j-rounded-lg": "border-radius: 0.5rem",
  "j-rounded-xl": "border-radius: 0.75rem",
  "j-rounded-full": "border-radius: 50%",
  "j-border-white": "border-color: #fff",
  "j-overflow-hidden": "overflow: hidden",
  "j-object-cover": "object-fit: cover",
  "j-relative": "position: relative",
  "j-absolute": "position: absolute",
  /* Shadow */
  "j-shadow-sm": "box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "j-shadow": "box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)",
  "j-shadow-md": "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)",
  /* Width / Container (non-numeric) */
  "j-w-full": "width: 100%",
  "j-max-w-md": "max-width: 28rem",
  "j-max-w-lg": "max-width: 32rem",
  "j-max-w-xl": "max-width: 36rem",
  "j-min-h-screen": "min-height: 100vh",
};
