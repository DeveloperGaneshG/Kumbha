"use client";

import { useState } from "react";
import Link from "next/link";
import { estimateWall, ft } from "@/lib/calculators/construction";
import { btn } from "./ui";

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

  const field = "w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-brand";
  const num = (v: number, set: (n: number) => void, label: string, id: string) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input id={id} type="number" min={0} value={v} onChange={(e) => set(Number(e.target.value))} className={field} />
    </div>
  );

  return (
    <div id="calculator" className="scroll-mt-32 rounded-2xl border border-line bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">How many bricks do I need?</h2>
          <p className="mt-1 text-muted">Enter your wall size for an instant estimate of bricks, cement and sand.</p>
        </div>
        <div role="radiogroup" aria-label="Units" className="flex rounded-lg border border-line bg-white p-1 text-sm font-semibold">
          {(["ft", "m"] as const).map((u) => (
            <button
              key={u}
              type="button"
              role="radio"
              aria-checked={unit === u}
              onClick={() => setUnit(u)}
              className={`rounded-md px-3 py-1.5 ${unit === u ? "bg-ink text-white" : "text-muted"}`}
            >
              {u === "ft" ? "Feet" : "Metres"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {num(length, setLength, `Wall length (${unit})`, "calc-l")}
        {num(height, setHeight, `Wall height (${unit})`, "calc-h")}
        <div>
          <label htmlFor="calc-t" className="mb-1.5 block text-sm font-semibold">
            Wall thickness
          </label>
          <select id="calc-t" value={thickness} onChange={(e) => setThickness(Number(e.target.value) as 0.1 | 0.2)} className={field}>
            <option value={0.2}>9 inch (full brick)</option>
            <option value={0.1}>4.5 inch (half brick)</option>
          </select>
        </div>
        {num(openings, setOpenings, `Doors & windows (sq ${unit})`, "calc-o")}
      </div>

      {result && (
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {[
            ["Bricks", result.bricks.toLocaleString("en-IN")],
            ["Cement", `${result.cementBags} bags`],
            ["Sand", `${result.sandCft} cft`],
            ["Wall volume", `${result.wallVolumeM3} m³`],
          ].map(([k, v]) => (
            <div key={k} className="bg-white p-4">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="mt-0.5 text-2xl font-extrabold">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">Includes 5% wastage and 1:6 mortar. Confirm quantities with your engineer.</p>
        {result && (
          <Link href={`/quote?product=red-clay-bricks&qty=${Math.ceil(result.bricks / 1000)}`} className={btn.primary}>
            Get a quote for {result.bricks.toLocaleString("en-IN")} bricks
          </Link>
        )}
      </div>
    </div>
  );
}
