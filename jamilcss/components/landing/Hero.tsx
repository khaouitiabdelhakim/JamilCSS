"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const CODE = `/* postcss.config.cjs */
module.exports = {
  plugins: {
    jamilcss: {
      content: ["./src/**/*.tsx"],
    },
  },
};

/* Your component */
<div className="j-flex j-gap-16 j-p-24
                j-bg-gray-900 j-rounded-xl">

  <h1 className="j-text-4xl j-font-bold
                 j-text-white j-tracking-tight">
    JamilCSS
  </h1>

  <button className="
    j-px-20 j-py-10 j-rounded-lg
    j-text-white j-font-semibold
    md:dark:hover:j-opacity-80
  ">
    Get started →
  </button>

</div>`;

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${5 + ((i * 47) % 90)}%`,
  delay: `${(i * 0.7) % 8}s`,
  duration: `${8 + ((i * 3) % 10)}s`,
  size: 2 + (i % 3),
}));

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf: number;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Animated mesh lines
      const t = frame * 0.003;
      ctx.lineWidth = 0.5;

      // Horizontal flowing lines
      for (let i = 0; i < 8; i++) {
        const y = (h / 8) * i + Math.sin(t + i * 0.5) * 20;
        const alpha = 0.04 + Math.sin(t * 0.7 + i) * 0.02;
        ctx.strokeStyle = `rgba(248,87,166,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 10) {
          ctx.lineTo(x, y + Math.sin(t + x * 0.01 + i * 0.5) * 8);
        }
        ctx.stroke();
      }

      frame++;
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="j-pt-64 j-min-h-screen j-flex j-flex-col j-items-center j-justify-center j-px-24 j-py-80 j-text-center j-relative j-overflow-hidden">

      {/* ── Animated canvas mesh ── */}
      <canvas
        ref={canvasRef}
        className="j-absolute j-inset-0 j-w-full j-h-full j-pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Grid overlay ── */}
      <div
        className="hero-grid j-absolute j-inset-0 j-pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(248,87,166,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248,87,166,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Orb 1 — pink blob ── */}
      <div
        className="hero-orb-1 j-absolute j-pointer-events-none"
        style={{
          zIndex: 0,
          top: "5%",
          left: "15%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(248,87,166,0.18) 0%, rgba(248,87,166,0.04) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Orb 2 — coral blob ── */}
      <div
        className="hero-orb-2 j-absolute j-pointer-events-none"
        style={{
          zIndex: 0,
          bottom: "10%",
          right: "10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,88,88,0.15) 0%, rgba(255,88,88,0.04) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── Orb 3 — center glow ── */}
      <div
        className="hero-orb-3 j-absolute j-pointer-events-none"
        style={{
          zIndex: 0,
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(200,60,140,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="j-absolute j-rounded-full j-pointer-events-none"
          style={{
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 3 === 0 ? "#f857a6" : p.id % 3 === 1 ? "#ff5858" : "rgba(248,87,166,0.5)",
            animation: `particle-rise ${p.duration} ${p.delay} ease-in infinite`,
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Content ── */}
      <div className="j-relative j-flex j-flex-col j-items-center j-max-w-5xl j-w-full" style={{ zIndex: 1 }}>

        {/* Badge */}
        <div
          className="hero-badge hero-fade-1 j-mb-28 j-inline-flex j-items-center j-gap-8 j-px-16 j-py-7 j-rounded-full j-text-sm j-font-medium j-text-pink-200 j-border"
          style={{
            background: "rgba(248,87,166,0.06)",
            borderColor: "rgba(248,87,166,0.25)",
          }}
        >
          <span
            className="j-w-6 j-h-6 j-rounded-full"
            style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
          />
          PostCSS-powered · Zero runtime overhead · v2.0
        </div>

        {/* Headline */}
        <h1
          className="hero-fade-2 j-text-7xl j-font-bold j-tracking-tight j-text-white j-mb-24 j-leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em" }}
        >
          Style your UI{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f857a6 0%, #ff5858 50%, #f857a6 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-pan 4s ease infinite",
            }}
          >
            without limits.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-fade-3 j-max-w-2xl j-text-xl j-text-gray-400 j-leading-relaxed j-mb-44">
          JamilCSS gives you{" "}
          <code
            className="j-font-mono j-text-sm j-bg-gray-900 j-border j-border-gray-700 j-px-8 j-py-2 j-rounded-md"
            style={{ color: "#f857a6" }}
          >
            j-*
          </code>{" "}
          utility classes compiled by a PostCSS plugin — scan your components,
          emit only what you use, stack breakpoints and themes in one class name.
        </p>

        {/* CTAs */}
        <div className="hero-fade-4 j-flex j-flex-wrap j-gap-16 j-justify-center j-mb-72">
          <Link
            href="/docs"
            className="j-relative j-overflow-hidden j-flex j-items-center j-gap-8 j-px-32 j-py-16 j-text-white j-font-semibold j-rounded-xl j-text-lg j-transition-all hover:j-shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #f857a6, #ff5858)",
              boxShadow: "0 0 40px rgba(248,87,166,0.3)",
            }}
          >
            {/* shimmer beam */}
            <span
              className="j-absolute j-inset-y-0 j-w-24 j-pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                animation: "shimmer-line 3s 1.5s ease-in-out infinite",
              }}
            />
            Read the docs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="https://github.com/khaouitiabdelhakim/JamilCSS"
            target="_blank"
            rel="noopener noreferrer"
            className="j-flex j-items-center j-gap-8 j-px-32 j-py-16 j-border hover:j-border-gray-500 j-font-semibold j-rounded-xl j-text-gray-300 hover:j-text-white hover:j-bg-gray-800 j-transition j-text-lg"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            View on GitHub
          </a>
        </div>

        {/* Code terminal */}
        <div
          className="hero-fade-5 j-max-w-3xl j-w-full j-rounded-2xl j-overflow-hidden j-border j-shadow-2xl"
          style={{
            borderColor: "rgba(248,87,166,0.15)",
            boxShadow: "0 0 0 1px rgba(248,87,166,0.08), 0 32px 64px rgba(0,0,0,0.6)",
          }}
        >
          {/* Terminal titlebar */}
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
            <span className="j-ml-12 j-text-xs j-font-mono j-text-gray-600">example.tsx</span>
            <span
              className="j-ml-auto j-text-xs j-font-mono j-px-8 j-py-3 j-rounded-md"
              style={{ color: "#f857a6", background: "rgba(248,87,166,0.08)" }}
            >
              JSX
            </span>
          </div>
          <pre
            className="j-p-28 j-text-sm j-text-left j-text-gray-300 j-overflow-x-auto j-leading-relaxed"
            style={{ background: "#060b18" }}
          >
            <code>{CODE}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
