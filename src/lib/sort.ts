/** Sort options shared by server pages and the client sort dropdown (no DB imports here). */
export type SortKey = "popular" | "price-asc" | "price-desc" | "rating" | "new";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "rating", label: "Top rated" },
  { key: "new", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];
