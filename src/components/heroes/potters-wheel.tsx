import Link from "next/link";
import { ProductImage } from "../product-image";
import { LogoMark } from "../logo";
import { HeroFrame, HeroText, type HeroCopy } from "./frame";

export type WheelPlate = { href: string; label: string; image: string | null; icon: string };

/**
 * A potter's wheel that slowly turns, carrying products on clay plates.
 * - The wheel spins; each plate counter-spins at the same speed so photos stay upright.
 * - Hovering, touching or keyboard-focusing the wheel pauses it (CSS only, no JS).
 * - The light/sheen layer does not rotate, so the clay looks lit from one side.
 * - With reduced motion the wheel stands still.
 */
export function PottersWheel({ plates, seconds = 70 }: { plates: WheelPlate[]; seconds?: number }) {
  const n = plates.length;
  const R = 36; // plate orbit, % of wheel size
  return (
    <div className="kumbha-rise wheel-stage group relative mx-auto aspect-square w-full max-w-[540px]" style={{ ["--spin" as string]: `${seconds}s` }}>
      {/* soft shadow the wheel casts on the table */}
      <div aria-hidden className="absolute inset-[6%] translate-y-[5%] rounded-full bg-black/35 blur-2xl" />

      {/* rotating disc: grooves + slip streaks + plates */}
      <div className="wheel-spin absolute inset-0 rounded-full" style={{ background: "var(--wheel-clay)" }}>
        <div aria-hidden className="absolute inset-0 rounded-full" style={{ background: "var(--wheel-grooves)" }} />
        <div aria-hidden className="absolute inset-0 rounded-full opacity-60" style={{ background: "var(--wheel-streaks)" }} />
        {plates.map((p, i) => {
          const a = (i / n) * Math.PI * 2;
          return (
            <div
              key={p.href + i}
              className="absolute w-[24%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + R * Math.sin(a)}%`, top: `${50 - R * Math.cos(a)}%` }}
            >
              <div className="wheel-counter">
                <Link href={p.href} className="group/plate relative block rounded-full focus-visible:outline-offset-4">
                  <span className="block aspect-square overflow-hidden rounded-full border-[5px] border-[#f4ead9] shadow-[0_10px_22px_rgba(40,20,8,0.45)] transition-transform duration-300 group-hover/plate:scale-110 group-focus-visible/plate:scale-110">
                    <ProductImage src={p.image} alt="" width={360} priority fallbackIcon={p.icon} className="h-full w-full text-3xl" />
                  </span>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white shadow-md sm:text-xs group-hover/plate:bg-brand group-focus-visible/plate:bg-brand">
                    {p.label}
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* fixed light: sheen from the top-left, darker rim at the bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,240,220,0.28), rgba(255,240,220,0) 45%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 62%, rgba(30,12,4,0.45) 100%)",
        }}
      />

      {/* hub: a lump of wet clay with the Kumbha mark */}
      <div
        className="absolute left-1/2 top-1/2 flex w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          aspectRatio: "1",
          background: "radial-gradient(circle at 35% 30%, #b97a52, #7c4528 70%)",
          boxShadow: "inset 0 -8px 18px rgba(0,0,0,0.35), inset 0 6px 12px rgba(255,220,190,0.25), 0 6px 16px rgba(0,0,0,0.3)",
        }}
      >
        <LogoMark size={56} cutColor="#8a4f2f" className="text-[#f4ead9] drop-shadow-sm" />
      </div>

      <p className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-[#6b4a32] transition-opacity group-hover:opacity-0">
        Hover or tap the wheel to stop it
      </p>
    </div>
  );
}

/** Clay pots banner: text + the turning wheel on a warm clay background. */
export function WheelHero({ copy, plates }: { copy: HeroCopy; plates: WheelPlate[] }) {
  return (
    <HeroFrame background="linear-gradient(160deg, #f1e4d2 0%, #e3cdb0 55%, #d6b993 100%)" visual={<PottersWheel plates={plates} />}>
      <HeroText copy={copy} />
    </HeroFrame>
  );
}
