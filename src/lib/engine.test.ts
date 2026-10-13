import { describe, it, expect } from "vitest";
import { computeTotals, unitPriceFor, gstComponent } from "./pricing";
import { deliveryQuote, distanceKm, tripsNeeded } from "./delivery";
import { estimateWall, ft } from "./calculators/construction";
import { buildAttributeValidator } from "./category-template";
import { effectiveModes } from "./selling-modes";
import { activeSeasons } from "./seasons";
import { CATEGORY_PRESETS } from "@/catalog/presets";
import { DEMO_PRODUCTS } from "@/catalog/demo-products";

describe("pricing", () => {
  it("applies the highest qualifying bulk tier", () => {
    const tiers = [{ minQty: 10, unitPrice: 900 }, { minQty: 50, unitPrice: 800 }];
    expect(unitPriceFor(1000, 5, tiers)).toBe(1000);
    expect(unitPriceFor(1000, 10, tiers)).toBe(900);
    expect(unitPriceFor(1000, 75, tiers)).toBe(800);
  });

  it("extracts inclusive GST", () => {
    expect(gstComponent(11800, 18)).toBe(1800);
  });

  it("charges an advance for pre-booking and packaging for fragile items", () => {
    const t = computeTotals({
      lines: [{ unitPrice: 100000, quantity: 1, gstRate: 12 }],
      mode: "PRE_BOOK",
      rules: { fragile: true, advancePercent: 30 },
    });
    expect(t.packagingFee).toBe(4000);
    expect(t.total).toBe(104000);
    expect(t.payNow).toBe(31200);
    expect(t.payLater).toBe(72800);
  });
});

describe("delivery", () => {
  const rates = [
    { vehicle: "Tractor", maxKm: 25, baseFee: 80000, perKmFee: 4000, freeKm: 5 },
    { vehicle: "Lorry", maxKm: 60, baseFee: 250000, perKmFee: 5500, freeKm: 10 },
  ];
  it("picks the cheapest band that covers the distance", () => {
    expect(deliveryQuote(12, rates)).toMatchObject({ vehicle: "Tractor", fee: 80000 + 7 * 4000 });
    expect(deliveryQuote(40, rates)?.vehicle).toBe("Lorry");
    expect(deliveryQuote(100, rates)).toBeNull();
  });
  it("computes distance and trips", () => {
    // Vijayawada → Guntur ≈ 30 km straight line
    expect(distanceKm({ lat: 16.5062, lng: 80.648 }, { lat: 16.3067, lng: 80.4365 })).toBeGreaterThan(25);
    expect(tripsNeeded(7000, 3000)).toBe(3);
  });
});

describe("construction calculator", () => {
  it("estimates a 10ft × 10ft 9-inch wall", () => {
    const e = estimateWall({ lengthM: ft(10), heightM: ft(10), thicknessM: 0.2 });
    // ~1.86 m³ → ~930 bricks + 5% wastage
    expect(e.bricks).toBeGreaterThan(950);
    expect(e.bricks).toBeLessThan(1000);
    expect(e.cementBags).toBeGreaterThan(0);
  });
  it("rejects bad input", () => {
    expect(() => estimateWall({ lengthM: 0, heightM: 3, thicknessM: 0.1 })).toThrow();
  });
});

describe("category templates", () => {
  it("every demo product matches its category's attribute schema", () => {
    for (const p of DEMO_PRODUCTS) {
      const c = CATEGORY_PRESETS.find((x) => x.slug === p.categorySlug);
      expect(c, p.slug).toBeDefined();
      const res = buildAttributeValidator(c!.attributeSchema).safeParse(p.attributes);
      expect(res.success, `${p.slug}: ${res.error?.message}`).toBe(true);
    }
  });
  it("rejects values outside the template", () => {
    const idols = CATEGORY_PRESETS.find((c) => c.slug === "idols")!;
    const validate = buildAttributeValidator(idols.attributeSchema);
    expect(validate.safeParse({ deity: "Ganesh", heightFt: 2, material: "Plaster of Paris" }).success).toBe(false);
    expect(validate.safeParse({ deity: "Ganesh", heightFt: 2, material: "Eco clay", colour: "x" }).success).toBe(false);
  });
});

describe("selling modes", () => {
  it("products can narrow but never widen category modes", () => {
    expect(effectiveModes(["QUOTE", "PICKUP"], [])).toEqual(["QUOTE", "PICKUP"]);
    expect(effectiveModes(["QUOTE", "PICKUP"], ["PICKUP", "SHIP_TO_HOME"])).toEqual(["PICKUP"]);
  });
  it("crackers are never sold for shipping", () => {
    const crackers = CATEGORY_PRESETS.find((c) => c.slug === "crackers")!;
    expect(crackers.sellingModes).not.toContain("SHIP_TO_HOME");
    expect(crackers.sellingModes).not.toContain("LOCAL_DELIVERY");
  });
});

describe("seasons", () => {
  it("promotes Diwali in October", () => {
    expect(activeSeasons(new Date("2026-10-13"))[0].slug).toBe("diwali");
  });
});
