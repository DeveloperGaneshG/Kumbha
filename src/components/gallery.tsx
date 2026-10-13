"use client";

import { useState } from "react";
import { ProductImage } from "./product-image";

export function Gallery({ images, name, icon }: { images: string[]; name: string; icon: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [""];
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {list.length > 1 && (
        <ul className="scroller flex gap-2 overflow-x-auto md:w-20 md:flex-col md:overflow-visible" role="tablist" aria-label="Product photos">
          {list.map((src, i) => (
            <li key={src + i} className="shrink-0">
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Photo ${i + 1} of ${list.length}`}
                onClick={() => setActive(i)}
                className={`block overflow-hidden rounded-lg ring-2 transition ${i === active ? "ring-ink" : "ring-transparent hover:ring-line"}`}
              >
                <ProductImage src={src} alt="" width={160} fallbackIcon={icon} className="h-16 w-16 md:h-20 md:w-20" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex-1 overflow-hidden rounded-2xl">
        <ProductImage key={active} src={list[active]} alt={name} width={1200} fallbackIcon={icon} priority className="aspect-square w-full text-8xl" />
      </div>
    </div>
  );
}
