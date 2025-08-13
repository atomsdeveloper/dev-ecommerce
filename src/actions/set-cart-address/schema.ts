import { z } from "zod";

export const setCartAddressSchema = z.object({
  shippingAddressId: z.uuid(),
});

export type SetCartAddressSchema = z.infer<typeof setCartAddressSchema>;
