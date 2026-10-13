/**
 * Category templates — WHAT a product in a category looks like.
 *
 * Each category stores an `attributeSchema` (list of fields). The admin product
 * form, storefront filters, product spec table and server-side validation are
 * all generated from it, so a new category needs zero code.
 */
import { z } from "zod";

type BaseField = {
  key: string;
  label: string;
  labelTe?: string;
  required?: boolean;
  /** Show as a filter on the category page */
  filterable?: boolean;
  help?: string;
};

export type AttributeField =
  | (BaseField & { type: "text" })
  | (BaseField & { type: "number"; unit?: string; min?: number; max?: number })
  | (BaseField & { type: "select"; options: string[] })
  | (BaseField & { type: "multiselect"; options: string[] })
  | (BaseField & { type: "boolean" });

export type CategoryRules = {
  /** Adds protective packaging fee and breakage-claim flow */
  fragile?: boolean;
  /** Selling unit shown with price: "piece", "1000 bricks", "bag" */
  unit?: string;
  minOrderQty?: number;
  /** Overrides the selling mode's default advance */
  advancePercent?: number;
  leadTimeDays?: number;
  /** Max delivery radius for LOCAL_DELIVERY / QUOTE */
  deliveryRadiusKm?: number;
  /** Shown prominently on every product (licensing, safety, etc.) */
  legalNotice?: string;
  /** Badges shown on products: "GI tagged", "Eco-friendly clay" */
  badges?: string[];
  /** Show the construction material calculator */
  showCalculator?: boolean;
  /** Show the human-silhouette size visualiser */
  showSizeVisualizer?: boolean;
  /** Festivals this category peaks in (slugs from seasons.ts) */
  seasons?: string[];
  /** How-to / care guide shown on the category page */
  guide?: { title: string; intro?: string; steps: { title: string; body: string }[] };
  /** Category-specific questions shown on the category page */
  faqs?: { q: string; a: string }[];
  /** Interactive banner for this category's page (and its tab on the homepage) */
  hero?: { style: "wheel" | "diya" | "idol-size" | "lacquer" | "brick-wall"; title: string; subtitle: string };
  /** Craft origin story for GI / heritage categories */
  origin?: { place: string; gi?: boolean; story: string };
};

function fieldValidator(field: AttributeField): z.ZodType {
  let v: z.ZodType;
  switch (field.type) {
    case "text":
      v = z.string().trim().min(1);
      break;
    case "number": {
      let n = z.number();
      if (field.min !== undefined) n = n.min(field.min);
      if (field.max !== undefined) n = n.max(field.max);
      v = n;
      break;
    }
    case "select":
      v = z.enum(field.options as [string, ...string[]]);
      break;
    case "multiselect":
      v = z.array(z.enum(field.options as [string, ...string[]]));
      break;
    case "boolean":
      v = z.boolean();
      break;
  }
  return field.required ? v : v.optional();
}

/** Build a Zod validator for product attributes from a category's schema. */
export function buildAttributeValidator(schema: AttributeField[]) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of schema) shape[field.key] = fieldValidator(field);
  return z.object(shape).strict();
}

/** Human-readable spec rows for the product page. */
export function formatAttributes(schema: AttributeField[], values: Record<string, unknown>) {
  return schema
    .filter((f) => values[f.key] !== undefined && values[f.key] !== null && values[f.key] !== "")
    .map((f) => {
      const raw = values[f.key];
      let value: string;
      if (Array.isArray(raw)) value = raw.join(", ");
      else if (typeof raw === "boolean") value = raw ? "Yes" : "No";
      else if (f.type === "number" && f.unit) value = `${raw} ${f.unit}`;
      else value = String(raw);
      return { key: f.key, label: f.label, value };
    });
}
