"use client";

import { HeartIcon } from "./icons";
import { useLocalList, WISHLIST_KEY } from "./local-list";

export function WishlistButton({ slug, name, variant = "icon" }: { slug: string; name: string; variant?: "icon" | "button" }) {
  const { has, toggle } = useLocalList(WISHLIST_KEY);
  const saved = has(slug);
  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-3 font-semibold hover:border-ink"
      >
        <HeartIcon size={18} filled={saved} className={saved ? "text-sale" : ""} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 transition hover:scale-105"
    >
      <HeartIcon size={18} filled={saved} className={saved ? "text-sale" : "text-ink"} />
    </button>
  );
}
