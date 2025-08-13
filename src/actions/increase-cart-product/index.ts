"use server";

// Auth
import { auth } from "@/lib/auth";

// Types Schema
import { increaseCartProductSchema, IncreaseCartProductSchema } from "./schema";

// Headers URL
import { headers } from "next/headers";

// Database
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const increaseCartProduct = async (data: IncreaseCartProductSchema) => {
  // Validade datas types with zod.
  increaseCartProductSchema.parse(data);

  // Get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Get cart in agreement with user logged.
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });

  // Check if the user relation with item of cart has the same id of user logged.
  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;

  if (cartDoesNotBelongToUser) {
    throw new Error("Unathorized.");
  }

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }

  // Set quantity of product in cart from plus.
  await db
    .update(cartItemTable)
    .set({ quantity: cartItem.quantity + 1 })
    .where(eq(cartItemTable.id, cartItem.id));
};
