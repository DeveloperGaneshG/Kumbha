"use client";

/**
 * Diwali banner: the scene is dark and the visitor's pointer is a lamp.
 * Wherever it moves, warm light reveals the products underneath.
 * "Light every diya" lifts the darkness completely.
 * The lamp position is written straight to CSS variables (no re-render per move).
 */
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "../product-image";
import { HeroText, type HeroCopy } from "./frame";

const DARK = "13, 8, 6";

export function DiyaReveal({ copy, images }: { copy: HeroCopy; images: string[] }) {
  const stage = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);
  const tiles = images.slice(0, 8);

  // On phones the text fills the top, so start the lamp lower, over the photos
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      stage.current?.style.setProperty("--x", "70%");
      stage.current?.style.setProperty("--y", "84%");
    }
  }, []);

  const move = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || lit) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section
      ref={stage}
      onPointerMove={move}
      onPointerDown={move}
      className="diya-stage relative isolate min-h-[720px] overflow-hidden rounded-2xl text-white md:min-h-[540px]"
      style={{ background: `rgb(${DARK})`, ["--x" as string]: "72%", ["--y" as string]: "58%" }}
    >
      {/* the products, waiting in the dark */}
      <div aria-hidden className="absolute inset-0 -z-20 grid grid-cols-2 grid-rows-4 gap-1.5 md:grid-cols-4 md:grid-rows-2">
        {tiles.map((src, i) => (
          <ProductImage key={src + i} src={src} alt="" width={600} fallbackIcon="🪔" className="h-full w-full" />
        ))}
      </div>

      {/* darkness with a hole of warm light where the lamp is */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-[1200ms]"
        style={{
          opacity: lit ? 0 : 1,
          background: `radial-gradient(circle clamp(150px, 24vw, 300px) at var(--x) var(--y), rgba(${DARK},0) 0%, rgba(${DARK},0.25) 35%, rgba(${DARK},0.9) 70%, rgba(${DARK},0.97) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity duration-700"
        style={{ left: "var(--x)", top: "var(--y)", opacity: lit ? 0 : 1, background: "radial-gradient(circle, rgba(240,162,2,0.32), rgba(240,162,2,0) 60%)" }}
      />
      {/* keep the text readable over the photos */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[rgb(13,8,6)] via-[rgba(13,8,6,0.75)] to-transparent md:bg-gradient-to-r md:via-[rgba(13,8,6,0.6)]" style={{ opacity: lit ? 0.85 : 0.9 }} />

      {/* the lamp */}
      {!lit && (
        <svg
          aria-hidden
          width="84"
          height="70"
          viewBox="-50 -66 100 86"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[62%] drop-shadow-[0_0_24px_rgba(240,162,2,0.8)]"
          style={{ left: "var(--x)", top: "var(--y)" }}
        >
          <path className="diya-flame" d="M0-64C13-47 13-32 0-26C-13-32-13-47 0-64Z" fill="#ffd166" />
          <ellipse cx="0" cy="-34" rx="4" ry="8" fill="#fff4cc" />
          <path d="M-50-22Q0-12 50-22Q44 18 0 18Q-44 18-50-22Z" fill="#b8551f" />
          <path d="M-36 -6h72" stroke="#ffd166" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        </svg>
      )}

      <div className="flex min-h-[inherit] flex-col justify-between gap-8 px-6 pb-8 pt-10 sm:px-10 md:py-12">
        <HeroText copy={copy} dark />
        <div className="relative z-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setLit((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink transition hover:brightness-110"
          >
            {lit ? "Dim the lights" : "✦ Light every diya"}
          </button>
          {!lit && <p className="text-sm text-white/70">Move your cursor or finger to light the way</p>}
        </div>
      </div>
    </section>
  );
}
