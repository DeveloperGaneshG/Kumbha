"use client";

import { useState } from "react";
import Link from "next/link";
import { estimateWall, ft } from "@/lib/calculators/construction";

export function WallCalculator() {
  const [unit, setUnit] = useState<"ft" | "m">("ft");
  const [length, setLength] = useState(20);
  const [height, setHeight] = useState(10);
  const [thickness, setThickness] = useState<0.1 | 0.2>(0.2);
  const [openings, setOpenings] = useState(0);

  const toM = (n: number) => (unit === "ft" ? ft(n) : n);
  const toM2 = (n: number) => (unit === "ft" ? n * 0.0929 : n);
  let result: ReturnType<typeof estimateWall> | null = null;
  try {
    result = estimateWall({ lengthM: toM(length), heightM: toM(height), thicknessM: thickness, openingsM2: toM2(openings) });
  } catch {
    result = null;
  }

  const num = (v: number, set: (n: number) => void, label: string) => (
    <label className="text-sm">
      <span className="mb-1 block font-semibold text-slate-200">{label}</span>
      <input
        type="number"
        min={0}
        value={v}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-slate-500 bg-slate-800 px-3 py-2 text-white"
      />
    </label>
  );

  return (
    <div id="calculator" className="rounded-3xl bg-slate-build p-6 text-white md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl">🧮 Brick & material calculator</h2>
        <div className="flex rounded-full bg-slate-700 p-1 text-sm">
          {(["ft", "m"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)} className={`rounded-full px-3 py-1 ${unit === u ? "bg-white text-slate-build" : ""}`}>
              {u === "ft" ? "Feet" : "Metres"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {num(length, setLength, `Wall length (${unit})`)}
        {num(height, setHeight, `Wall height (${unit})`)}
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-slate-200">Thickness</span>
          <select
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value) as 0.1 | 0.2)}
            className="w-full rounded-lg border border-slate-500 bg-slate-800 px-3 py-2"
          >
            <option value={0.2}>9 inch (full brick)</option>
            <option value={0.1}>4.5 inch (half brick)</option>
          </select>
        </label>
        {num(openings, setOpenings, `Doors/windows (sq ${unit})`)}
      </div>

      {result && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Bricks", result.bricks.toLocaleString("en-IN")],
            ["Cement (50kg bags)", result.cementBags],
            ["Sand", `${result.sandCft} cft`],
            ["Wall volume", `${result.wallVolumeM3} m³`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white/10 p-4">
              <p className="text-xs text-slate-300">{k}</p>
              <p className="text-2xl font-semibold">{v}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-300">Estimate includes 5% wastage, 1:6 mortar. Confirm with your engineer.</p>
        {result && (
          <Link href={`/quote?product=red-clay-bricks&qty=${Math.ceil(result.bricks / 1000)}`} className="rounded-full bg-turmeric px-5 py-2.5 font-semibold text-slate-build">
            Get a quote for {result.bricks.toLocaleString("en-IN")} bricks →
          </Link>
        )}
      </div>
    </div>
  );
}
