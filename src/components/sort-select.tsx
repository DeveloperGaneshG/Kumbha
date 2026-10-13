"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/sort";

export function SortSelect() {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Sort by</span>
      <select
        value={params.get("sort") ?? "popular"}
        onChange={(e) => {
          const next = new URLSearchParams(params);
          if (e.target.value === "popular") next.delete("sort");
          else next.set("sort", e.target.value);
          router.push(`${path}?${next.toString()}`, { scroll: false });
        }}
        className="rounded-lg border border-line bg-white px-3 py-2 font-medium"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
