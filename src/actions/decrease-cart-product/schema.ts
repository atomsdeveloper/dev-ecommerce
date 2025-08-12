import { z } from "zod";

// Parser Data
export const decreaseCartProductSchema = z.object({
  cartItemId: z.uuid(),
});

// Type Data
export type DecreaseCartProductSchema = z.infer<
  typeof decreaseCartProductSchema
>;
