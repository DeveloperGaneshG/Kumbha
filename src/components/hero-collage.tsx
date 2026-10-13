import Link from "next/link";
import { ProductImage } from "./product-image";

/** Kalash outline (same shape as the logo), normalised to a 0–1 box for clip-path. */
const POT =
  "M 0.2283,0.0 H 0.7717 A 0.0543 0.0526 0 0 1 0.7717,0.1053 H 0.6522 C 0.6522,0.1474 0.6652,0.1811 0.7,0.2021 C 0.9043,0.2779 1.0,0.4211 1.0,0.5789 C 1.0,0.8126 0.7826,1.0 0.5,1.0 C 0.2174,1.0 0.0,0.8126 0.0,0.5789 C 0.0,0.4211 0.0957,0.2779 0.3,0.2021 C 0.3348,0.1811 0.3478,0.1474 0.3478,0.1053 H 0.2283 A 0.0543 0.0526 0 0 1 0.2283,0.0 Z";

export type HeroTile = { href: string; label: string; image: string | null; icon: string };

/**
 * Where each kalash sits in the cluster (percent of the stage). The first
 * tile is the hero product and takes the big centre pot.
 */
const SLOTS = [
  { left: 24, top: 10, width: 50, z: 5, delay: 0 },
  { left: 0, top: 2, width: 30, z: 3, delay: 120 },
  { left: 72, top: 0, width: 28, z: 3, delay: 200 },
  { left: 2, top: 52, width: 32, z: 4, delay: 280 },
  { left: 68, top: 50, width: 31, z: 4, delay: 360 },
];

export function KumbhaClipDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <clipPath id="kumbha-clip" clipPathUnits="objectBoundingBox">
          <path d={POT} />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Pot-shaped product windows arranged as one scene. */
export function HeroCollage({ tiles }: { tiles: HeroTile[] }) {
  const shown = tiles.slice(0, SLOTS.length);
  return (
    <div className="relative mx-auto aspect-[1.1/1] w-full max-w-[560px]">
      <KumbhaClipDefs />
      {/* Warm diya glow behind the centre pot */}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/35 blur-3xl" />
      {shown.map((t, i) => {
        const s = SLOTS[i];
        return (
          <Link
            key={t.href + i}
            href={t.href}
            className="kumbha-rise group absolute block drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] focus-visible:outline-none"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.width}%`, zIndex: s.z, animationDelay: `${s.delay}ms` }}
          >
            <span className="block aspect-[0.968/1] w-full transition-transform duration-500 group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5" style={{ clipPath: "url(#kumbha-clip)" }}>
              <ProductImage src={t.image} alt="" width={i === 0 ? 900 : 500} priority fallbackIcon={t.icon} className="h-full w-full scale-110 text-5xl" />
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-bold text-ink shadow-md group-hover:bg-accent group-focus-visible:bg-accent">
              {t.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/** Soft, blurred mosaic of every product photo — the backdrop the pots float on. */
export function HeroMosaic({ images }: { images: (string | null)[] }) {
  return (
    <div aria-hidden className="absolute -inset-10 -z-10 grid grid-cols-3 grid-rows-2 opacity-30 blur-[60px] saturate-125 md:grid-cols-5 md:grid-rows-1">
      {images.map((src, i) => (
        <ProductImage key={i} src={src} alt="" width={400} fallbackIcon="" className="h-full w-full scale-125" />
      ))}
    </div>
  );
}
