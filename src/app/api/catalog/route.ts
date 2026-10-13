import { NextResponse } from "next/server";
import { listCategories, listProducts } from "@/lib/catalog";

/**
 * GET /api/catalog?category=idols&deity=Ganesh
 * JSON catalog for the future mobile app / WhatsApp bot.
 */
export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const { category, ...filters } = params;
  if (!category) return NextResponse.json({ categories: await listCategories() });
  return NextResponse.json({ products: await listProducts(category, filters) });
}
