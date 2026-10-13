"use client";

import { useEffect, useRef, useState } from "react";
import { img } from "@/config/store";

/**
 * Product photo with a graceful fallback: if the URL fails (or there is no
 * photo yet), show a neutral tile with the category icon instead of a broken
 * image.
 */
export function ProductImage({
  src,
  alt,
  width = 600,
  fallbackIcon = "🛍️",
  className = "",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  width?: number;
  fallbackIcon?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The image may fail before React hydrates (so onError never fires) — check once on mount
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-surface text-5xl ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        {fallbackIcon && <span aria-hidden>{fallbackIcon}</span>}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external CDN photos; swap for next/image once you host your own
    <img
      ref={ref}
      src={img(src, width)}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`bg-surface object-cover ${className}`}
    />
  );
}
