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
  // Validade datas types.
  addProductToCartSchema.parse(data);

  // Get User session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check Product add to Cart exists
  const productVariant = await db.query.productVariantTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product Variant Not Found.");
  }

  // Get Cart
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  // Created Cart if not exists
  let cartId = cart?.id;
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: session.user.id })
      .returning();

    cartId = newCart.id;
  }

  // Get Product of Cart
  if (!cartId) {
    throw new Error("Cart ID is undefined.");
  }
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.cartId, cartId) &&
      eq(cartItem.productVariantId, data.productVariantId),
  });

  // If exists product set quantity in Cart.
  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));

    return;
  }

  // Else insert product in Cart.
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
};
