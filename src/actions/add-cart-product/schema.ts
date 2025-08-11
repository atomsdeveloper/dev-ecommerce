import { z } from "zod";

// Parser Data
export const addProductToCartSchema = z.object({
  productVariantId: z.uuid(),
  quantity: z.number().min(1),
});

// Type Data
export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
