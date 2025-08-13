"use server";

// Auth
import { auth } from "@/lib/auth";

// Types Schema
import { removeCartProductSchema, RemoveCartProductSchema } from "./schema";

// Headers URL
import { headers } from "next/headers";

// Database
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const removeCartProduct = async (data: RemoveCartProductSchema) => {
  // Validade datas types with zod.
  removeCartProductSchema.parse(data);

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

  // Deleted item of cart where the id of item in table it is the same as id clicked in cart current.
  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
