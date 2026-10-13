import { describe, it, expect } from "vitest";
import { offerProgress, orderByNotice } from "./campaign";
import { giftProducts, listBundles, getProducts } from "./catalog";
import { DEMO_PRODUCTS } from "@/catalog/demo-products";

describe("spend-more-save-more offers", () => {
  it("gives nothing below the first tier and points to it", () => {
    const o = offerProgress(100000);
    expect(o.discount).toBe(0);
    expect(o.next).toMatchObject({ percent: 5, remaining: 50000 });
  });
  it("applies the highest tier reached", () => {
    expect(offerProgress(200000)).toMatchObject({ percent: 5, discount: 10000 });
    expect(offerProgress(400000)).toMatchObject({ percent: 10, discount: 40000, next: null });
  });
});

describe("festival delivery cut-off", () => {
  it("shows before the cut-off and hides after", () => {
    expect(orderByNotice(new Date("2026-10-13T12:00:00+05:30"))?.text).toMatch(/^Order by 3 Nov/);
    expect(orderByNotice(new Date("2026-11-04T09:00:00+05:30"))).toBeNull();
  });
});

describe("combos", () => {
  it("every combo resolves all items and is cheaper than buying separately", async () => {
    const bundles = await listBundles();
    expect(bundles.length).toBe(4);
    for (const b of bundles) expect(b.price, b.slug).toBeLessThan(b.mrp);
  });
});

describe("gift finder & pairings", () => {
  it("filters by recipient and budget", async () => {
    const kids = await giftProducts({ tag: "kids" });
    expect(kids.length).toBeGreaterThan(0);
    expect(kids.every((p) => p.tags.includes("kids"))).toBe(true);
    const cheap = await giftProducts({ max: 500 });
    expect(cheap.every((p) => Math.min(...p.variants.map((v) => v.price)) < 50000)).toBe(true);
  });
  it("every pairsWith slug points to a real product", async () => {
    for (const p of DEMO_PRODUCTS) {
      const found = await getProducts(p.pairsWith ?? []);
      expect(found.length, p.slug).toBe((p.pairsWith ?? []).length);
    }
  });
});
