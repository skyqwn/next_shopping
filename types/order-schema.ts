import { z } from "zod";

export const CrateOrderSchema = z.object({
  total: z.number(),
  status: z.string(),
  products: z.array(
    z.object({
      productId: z.number(),
      variantId: z.number(),
      quantity: z.number(),
    })
  ),
});

export type zCreateOrderSchema = z.infer<typeof CrateOrderSchema>;
