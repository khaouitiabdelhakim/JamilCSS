"use client";

import { useEffect, useRef } from "react";

export function BackgroundOrbs() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const y = scrollRef.current;
        if (orb1Ref.current) {
          orb1Ref.current.style.transform = `translateY(${y * 0.18}px)`;
        }
        if (orb2Ref.current) {
          orb2Ref.current.style.transform = `translateY(${-y * 0.12}px)`;
        }
        if (orb3Ref.current) {
          orb3Ref.current.style.transform = `translateY(${y * 0.08}px)`;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: "#030712",
        overflow: "hidden",
      }}
    >
      {/* Pink orb — top left */}
      <div
        ref={orb1Ref}
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(248,87,166,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />
      {/* Red/orange orb — bottom right */}
      <div
        ref={orb2Ref}
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-8%",
          width: 650,
          height: 650,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,88,88,0.14) 0%, transparent 70%)",
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />
      {/* Purple orb — center */}
      <div
        ref={orb3Ref}
        style={{
          position: "absolute",
          top: "40%",
          left: "35%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
          filter: "blur(90px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
