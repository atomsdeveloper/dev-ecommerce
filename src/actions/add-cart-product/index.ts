"use server";

// Auth
import { auth } from "@/lib/auth";

// Schema
import { addProductToCartSchema, AddProductToCartSchema } from "./schema";

// Headers URL
import { headers } from "next/headers";

// Database
import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  // Validade datas types with zod.
  addProductToCartSchema.parse(data);

  // Get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if products selected exists in database.
  const productVariant = await db.query.productVariantTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product Variant Not Found.");
  }

  // Get cart in agreement with user logged.
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  // Created cart if the same not exists.
  let cartId = cart?.id;
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: session.user.id })
      .returning();

    cartId = newCart.id;
  }

  if (!cartId) {
    throw new Error("Cart ID is undefined.");
  }

  // Check if the cart already has the product.
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.cartId, cartId) &&
      eq(cartItem.productVariantId, data.productVariantId),
  });

  // If already has product increment your quantity.
  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));

    return;
  }

  // If not already has product added in cart.
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
};
