"use client";

/**
 * Idols banner: a marigold toran across the top and a size picker. The chosen
 * idol grows next to a 5'6" person, with its price and a pre-book link.
 */
import { useState } from "react";
import Link from "next/link";
import { ProductImage } from "../product-image";
import { formatINR } from "@/lib/money";
import { HeroFrame, HeroText, type HeroCopy } from "./frame";

export type IdolSizeOption = { heightFt: number; label: string; price: number; href: string; image: string | null; name: string; advancePercent: number };

const PERSON_FT = 5.5;

function Toran() {
  // marigold flowers on a string with mango leaves hanging between them
  const items = Array.from({ length: 26 }, (_, i) => i);
  return (
    <svg aria-hidden viewBox="0 0 1040 70" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-14 w-full md:h-16">
      <path d="M0 10 Q520 34 1040 10" stroke="#7a4a1f" strokeWidth="2" fill="none" />
      {items.map((i) => {
        const x = 20 + i * 40;
        const y = 10 + 24 * (1 - Math.pow((x - 520) / 520, 2));
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {i % 2 === 0 ? (
              <path d="M0 0 C10 10 9 30 0 42 C-9 30 -10 10 0 0Z" fill="#3f7a3a" />
            ) : (
              <>
                <circle r="11" fill={i % 4 === 1 ? "#f59e0b" : "#ea580c"} />
                <circle r="5" fill={i % 4 === 1 ? "#fcd34d" : "#fb923c"} />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function IdolSize({ copy, sizes }: { copy: HeroCopy; sizes: IdolSizeOption[] }) {
  const sorted = [...sizes].sort((a, b) => a.heightFt - b.heightFt);
  // open on the second-largest size: big enough to impress, still a home idol
  const [i, setI] = useState(Math.max(0, sorted.length - 2));
  const sel = sorted[i];
  const maxFt = Math.max(PERSON_FT, ...sorted.map((s) => s.heightFt)) * 1.08;
  const pct = (ft: number) => `${(ft / maxFt) * 100}%`;

  const visual = sel ? (
    <div>
      <div className="relative mx-auto flex aspect-[1.15/1] w-full max-w-[520px] items-end justify-center gap-[8%] rounded-2xl bg-white/45 px-[8%] pb-0 shadow-inner">
        {/* height guide lines every foot */}
        {Array.from({ length: Math.floor(maxFt) }, (_, f) => (
          <div key={f} aria-hidden className="absolute inset-x-3 border-t border-dashed border-[#9a5b1e]/20" style={{ bottom: pct(f + 1) }}>
            <span className="absolute -top-2.5 left-0 text-[10px] font-semibold text-[#9a5b1e]/60">{f + 1} ft</span>
          </div>
        ))}
        {/* person */}
        <svg aria-label="An adult, 5 ft 6 in" role="img" viewBox="0 0 40 110" className="relative shrink-0" style={{ height: pct(PERSON_FT) }} preserveAspectRatio="xMidYMax meet">
          <g fill="#c79a6e">
            <circle cx="20" cy="9" r="8" />
            <rect x="9" y="19" width="22" height="46" rx="8" />
            <rect x="10" y="60" width="8.5" height="50" rx="4" />
            <rect x="21.5" y="60" width="8.5" height="50" rx="4" />
          </g>
        </svg>
        {/* the idol, framed in a temple arch */}
        <div className="relative flex h-full items-end">
          <div
            className="relative overflow-hidden rounded-t-full border-4 border-b-0 border-[#d97706] bg-[#fde68a] shadow-[0_-8px_30px_rgba(217,119,6,0.35)] transition-all duration-500 ease-out"
            style={{ height: pct(sel.heightFt), aspectRatio: "0.68" }}
          >
            <ProductImage key={sel.image} src={sel.image} alt={sel.name} width={600} fallbackIcon="🛕" className="h-full w-full text-4xl" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-sm font-bold text-white transition-all duration-500" style={{ bottom: `calc(${pct(sel.heightFt)} + 8px)` }}>
            {sel.label}
          </span>
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2 rounded-b-2xl bg-[#9a5b1e]/40" />
      </div>

      <div role="radiogroup" aria-label="Idol height" className="mt-5 flex flex-wrap justify-center gap-2">
        {sorted.map((s, j) => (
          <button
            key={s.href + s.label}
            type="button"
            role="radio"
            aria-checked={j === i}
            onClick={() => setI(j)}
            className={`rounded-xl border-2 px-4 py-2 text-left transition-colors ${j === i ? "border-ink bg-ink text-white" : "border-[#d97706]/40 bg-white/70 hover:border-ink"}`}
          >
            <span className="block text-sm font-bold">{s.label}</span>
            <span className="block text-xs opacity-80">{formatINR(s.price)}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-[#6b3f12]">
        <strong>{sel.name}</strong>, {sel.label} — {formatINR(sel.price)}. Pay {formatINR(Math.round((sel.price * sel.advancePercent) / 100))} now.{" "}
        <Link href={sel.href} className="font-bold text-brand underline underline-offset-2">
          Pre-book this size
        </Link>
      </p>
    </div>
  ) : null;

  return (
    <HeroFrame background="linear-gradient(170deg, #fff7e8 0%, #ffe3b8 60%, #fdd29a 100%)" decoration={<Toran />} visual={visual}>
      <div className="pt-6">
        <HeroText copy={copy} />
      </div>
    </HeroFrame>
  );
}
