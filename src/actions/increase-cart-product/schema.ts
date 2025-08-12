import { z } from "zod";

// Parser Data
export const increaseCartProductSchema = z.object({
  cartItemId: z.uuid(),
});

// Type Data
export type IncreaseCartProductSchema = z.infer<
  typeof increaseCartProductSchema
>;
