"use client";

/**
 * Bricks banner: slide to your wall's size and watch it build itself course
 * by course, with live bricks, cement and cost.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { estimateWall, ft } from "@/lib/calculators/construction";
import { formatINR } from "@/lib/money";
import { HeroFrame, HeroText, type HeroCopy } from "./frame";

// One scale for both directions, so the wall keeps its true shape and grows as you slide
const VW = 600;
const VH = 240;
const MAX_L = 40;
const MAX_H = 12;
const PX_PER_FT = Math.min((VW - 60) / MAX_L, (VH - 70) / MAX_H);
// Each drawn brick stands for a few real ones so the drawing stays light
const BRICK_W = 20;
const COURSE = 8;

// small deterministic colour variation so the wall looks fired, not flat
const shades = ["#b4532f", "#a94a29", "#bf5d36", "#9d4225", "#b85a33", "#c4663d"];
const shade = (r: number, c: number) => shades[(r * 7 + c * 13) % shades.length];

export function BrickWall({ copy, pricePer1000, productSlug }: { copy: HeroCopy; pricePer1000: number; productSlug: string }) {
  const [len, setLen] = useState(20);
  const [hgt, setHgt] = useState(10);
  const est = useMemo(() => estimateWall({ lengthM: ft(len), heightM: ft(hgt), thicknessM: 0.2 }), [len, hgt]);
  const cost = Math.round((est.bricks / 1000) * pricePer1000);

  const wallW = Math.max(BRICK_W * 2, len * PX_PER_FT);
  const courses = Math.max(1, Math.round((hgt * PX_PER_FT) / COURSE));
  const x0 = (VW - wallW) / 2;
  const yBase = VH - 22;

  const rows = Array.from({ length: courses }, (_, r) => {
    const offset = r % 2 ? BRICK_W / 2 : 0;
    const bricks = [];
    for (let x = -offset, c = 0; x < wallW; x += BRICK_W, c++) {
      const bx = Math.max(0, x);
      const bw = Math.min(BRICK_W, wallW - bx, x + BRICK_W - bx);
      if (bw > 3) bricks.push(<rect key={c} x={x0 + bx + 1} y={yBase - (r + 1) * COURSE + 1} width={bw - 2} height={COURSE - 2} rx="1" fill={shade(r, c)} />);
    }
    return (
      <g key={r} className="brick-course" style={{ animationDelay: `${Math.min(r, 20) * 45}ms` }}>
        {bricks}
      </g>
    );
  });

  const slider = (label: string, value: number, set: (n: number) => void, min: number, max: number, id: string) => (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id} className="font-semibold text-white/85">
          {label}
        </label>
        <span className="font-bold text-white">{value} ft</span>
      </div>
      <input id={id} type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))} className="mt-1 w-full accent-[var(--accent)]" />
    </div>
  );

  const visual = (
    <div id="calculator" className="scroll-mt-36 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:p-5">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" role="img" aria-label={`A wall ${len} feet long and ${hgt} feet high, about ${est.bricks} bricks`}>
        <rect x="0" y={yBase} width={VW} height="22" fill="#3b4148" />
        <rect x={x0} y={yBase - courses * COURSE} width={wallW} height={courses * COURSE} fill="#e2cdb2" />
        {rows}
        <text x={x0 + wallW / 2} y={yBase + 16} textAnchor="middle" fontSize="15" fontWeight="700" fill="#e5e7eb">
          {len} ft
        </text>
        <text x={x0 - 8} y={yBase - (courses * COURSE) / 2} textAnchor="end" fontSize="15" fontWeight="700" fill="#e5e7eb">
          {hgt} ft
        </text>
      </svg>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {slider("Wall length", len, setLen, 5, MAX_L, "wall-len")}
        {slider("Wall height", hgt, setHgt, 3, MAX_H, "wall-hgt")}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center" aria-live="polite">
        <div className="rounded-xl bg-white/10 p-3">
          <dt className="text-xs text-white/70">Bricks</dt>
          <dd className="text-xl font-extrabold">{est.bricks.toLocaleString("en-IN")}</dd>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <dt className="text-xs text-white/70">Cement</dt>
          <dd className="text-xl font-extrabold">{est.cementBags} bags</dd>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <dt className="text-xs text-white/70">Bricks cost</dt>
          <dd className="text-xl font-extrabold">{formatINR(cost)}</dd>
        </div>
      </dl>
      <Link
        href={`/quote?product=${productSlug}&qty=${Math.max(1, Math.ceil(est.bricks / 1000))}`}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 font-bold text-ink hover:brightness-105"
      >
        Get a quote for {est.bricks.toLocaleString("en-IN")} bricks
      </Link>
      <p className="mt-2 text-center text-xs text-white/60">9-inch wall, 5% wastage. Delivery quoted for your site.</p>
    </div>
  );

  return (
    <HeroFrame dark background="linear-gradient(160deg, #1f2429 0%, #2f3a45 60%, #4a2c20 140%)" visual={visual}>
      <HeroText copy={copy} dark />
    </HeroFrame>
  );
}
