import { z } from "zod";

// Parser Data
export const removeCartProductSchema = z.object({
  cartItemId: z.uuid(),
});

// Type Data
export type RemoveCartProductSchema = z.infer<typeof removeCartProductSchema>;
