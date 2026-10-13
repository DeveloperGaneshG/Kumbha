import { NextResponse } from "next/server";
import { quoteRequestSchema } from "@/lib/validation";
import { estimateQuote } from "@/lib/quotes";
import { getProduct } from "@/lib/catalog";
import { formatINR } from "@/lib/money";

/** POST /api/quotes — create a quote request and return an instant estimate. */
export async function POST(req: Request) {
  const parsed = quoteRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const input = parsed.data;

  let estimate;
  try {
    estimate = await estimateQuote(input);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  let quoteId: string | null = null;
  if (process.env.DATABASE_URL) {
    const { db } = await import("@/db");
    const { customers, quoteRequests } = await import("@/db/schema");
    const [customer] = await db
      .insert(customers)
      .values({ phone: input.phone, name: input.name, gstin: input.gstin || null, isBusiness: Boolean(input.gstin) })
      .onConflictDoUpdate({ target: customers.phone, set: { name: input.name } })
      .returning({ id: customers.id });
    const lines = await Promise.all(
      input.lines.map(async (l) => {
        const p = await getProduct(l.productSlug);
        return { productId: l.productSlug, quantity: l.quantity, unit: p?.unit ?? "piece" };
      }),
    );
    const [q] = await db
      .insert(quoteRequests)
      .values({
        customerId: customer.id,
        lines,
        siteAddress: `${input.siteAddress}, ${input.pincode}`,
        siteLat: input.siteLat,
        siteLng: input.siteLng,
        distanceKm: estimate.delivery?.km,
        neededBy: input.neededBy ? new Date(input.neededBy) : null,
        notes: input.notes,
      })
      .returning({ id: quoteRequests.id });
    quoteId = q.id;
  }

  // TODO: notify staff + customer on WhatsApp (Interakt / Meta Cloud API) using WHATSAPP_API_KEY
  const summary = [
    `Quote request${quoteId ? ` #${quoteId.slice(0, 8)}` : ""} from ${input.name} (${input.phone})`,
    ...estimate.lines.map((l) => `• ${l.name}: ${l.quantity} × ${l.unit}`),
    `Site: ${input.siteAddress}, ${input.pincode}`,
    `Estimate: ${formatINR(estimate.total)}`,
  ].join("\n");

  return NextResponse.json({ quoteId, estimate, summary }, { status: 201 });
}
