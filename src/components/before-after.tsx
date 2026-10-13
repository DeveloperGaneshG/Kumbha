"use client";

/**
 * Drag (or use arrow keys) to compare two photos — e.g. a plastic-and-steel
 * kitchen with a clay one. Works with mouse, touch and keyboard.
 */
import { useRef, useState } from "react";
import { ProductImage } from "./product-image";

export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-2xl bg-surface md:aspect-[16/8]"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && moveTo(e.clientX)}
    >
      <ProductImage src={after} alt={afterLabel} width={1400} fallbackIcon="🏺" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <ProductImage src={before} alt={beforeLabel} width={1400} fallbackIcon="🧴" className="h-full w-full grayscale-[35%]" />
      </div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label="Compare the two kitchens"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
        }}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-ink shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <span aria-hidden className="text-lg font-bold">
          ⟷
        </span>
      </button>
    </div>
  );
}
