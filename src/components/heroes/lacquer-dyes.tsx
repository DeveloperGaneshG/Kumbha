"use client";

/**
 * Etikoppaka banner: the background is made of lathe-turned lacquer bands.
 * Tapping a natural colour re-dyes the whole banner and says where it comes from.
 */
import { useState } from "react";
import Link from "next/link";
import { ProductImage } from "../product-image";
import { formatINR } from "@/lib/money";
import { HeroFrame, HeroText, type HeroCopy } from "./frame";

export type LacquerToy = { name: string; href: string; image: string | null; price: number };

const DYES = [
  { key: "lac", name: "Lac red", color: "#b3261e", source: "Lac — a natural resin — melted with a red plant dye and pressed onto the spinning toy." },
  { key: "turmeric", name: "Turmeric yellow", color: "#d99a06", source: "Turmeric root, dried, ground and mixed into the lac." },
  { key: "indigo", name: "Indigo blue", color: "#2f4f8f", source: "Leaves of the indigo plant, fermented into a deep blue dye." },
  { key: "leaf", name: "Leaf green", color: "#3f7a3a", source: "Plant dyes blended to green — no synthetic paint anywhere." },
];

export function LacquerDyes({ copy, toys }: { copy: HeroCopy; toys: LacquerToy[] }) {
  const [d, setD] = useState(DYES[0]);
  const bands = `repeating-linear-gradient(180deg, ${d.color} 0 26px, color-mix(in srgb, ${d.color} 65%, white) 26px 34px, #f7efe2 34px 46px, color-mix(in srgb, ${d.color} 80%, black) 46px 50px)`;

  const visual = (
    <div className="relative">
      <div key={d.key} className="lacquer-fade relative aspect-[1.1/1] w-full overflow-hidden rounded-[40px] shadow-[inset_0_0_40px_rgba(0,0,0,0.25)]" style={{ background: bands }}>
        {/* soft lathe highlight */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.35)_45%,rgba(255,255,255,0)_60%)]" />
        <ul className="absolute inset-[7%] grid grid-cols-2 grid-rows-2 gap-[6%]">
          {toys.slice(0, 4).map((t, i, arr) => (
            <li
              key={t.href}
              className={arr.length === 3 && i === 0 ? "row-span-2" : arr.length === 1 ? "col-span-2 row-span-2" : ""}
              style={{ transform: `rotate(${i % 2 ? 3 : -3}deg)` }}
            >
              <Link href={t.href} className="group block h-full">
                <span
                  className="block h-full overflow-hidden rounded-[38%] border-[5px] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105 group-focus-visible:scale-105"
                  style={{ borderColor: "#f7efe2" }}
                >
                  <ProductImage src={t.image} alt="" width={420} fallbackIcon="🪀" className="h-full w-full text-4xl" />
                </span>
                <span className="sr-only">
                  {t.name}, {formatINR(t.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <div role="radiogroup" aria-label="Natural colours" className="flex flex-wrap gap-2">
          {DYES.map((x) => (
            <button
              key={x.key}
              type="button"
              role="radio"
              aria-checked={x.key === d.key}
              onClick={() => setD(x)}
              className={`inline-flex items-center gap-2 rounded-full border-2 bg-white px-3 py-1.5 text-sm font-semibold transition ${x.key === d.key ? "border-ink" : "border-transparent hover:border-ink/30"}`}
            >
              <span aria-hidden className="h-5 w-5 rounded-full ring-2 ring-white" style={{ background: x.color, boxShadow: `0 0 0 1px ${x.color}` }} />
              {x.name}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-3 text-sm text-ink">
          <strong style={{ color: d.color }}>{d.name}:</strong> {d.source}
        </p>
      </div>
    </div>
  );

  return (
    <HeroFrame background="#fbf6ee" visual={visual}>
      <HeroText copy={copy} />
    </HeroFrame>
  );
}
