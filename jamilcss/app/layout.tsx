import "./globals.css";

export const metadata = {
  title: "JamilCSS — Utility-first CSS, built your way",
  description: "A PostCSS plugin that compiles j-* utility classes from your components. Tailwind-style, zero runtime.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="j-bg-gray-950 j-text-gray-100">
        {children}
      </body>
    </html>
  );
}
