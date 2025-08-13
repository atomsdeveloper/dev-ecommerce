"use server";

// Auth
import { auth } from "@/lib/auth";

// Types Schema
import { decreaseCartProductSchema, DecreaseCartProductSchema } from "./schema";

// Headers URL
import { headers } from "next/headers";

// Database
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const decreaseCartProduct = async (data: DecreaseCartProductSchema) => {
  // Validade datas types with zod.
  decreaseCartProductSchema.parse(data);

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

  if (cartItem.quantity === 1) {
    // Deleted item of cart where the id of item in table it is the same as id clicked in cart current.
    await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
    return;
  }

  // Set quantity of product in cart for minus.
  await db
    .update(cartItemTable)
    .set({ quantity: cartItem.quantity - 1 })
    .where(eq(cartItemTable.id, cartItem.id));
};
