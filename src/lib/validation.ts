import { z } from "zod";

/** Indian mobile number: 10 digits starting 6–9, optional +91 / 0 prefix. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"));

export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, "Invalid GSTIN")
    .optional()
    .or(z.literal("")),
  lines: z
    .array(z.object({ productSlug: z.string().min(1), quantity: z.number().positive() }))
    .min(1),
  siteAddress: z.string().trim().min(5).max(300),
  pincode: z.string().regex(/^\d{6}$/, "6-digit pincode"),
  siteLat: z.number().min(-90).max(90).optional(),
  siteLng: z.number().min(-180).max(180).optional(),
  neededBy: z.string().date().optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
