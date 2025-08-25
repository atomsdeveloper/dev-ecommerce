"use server";

import { DELIVERY_FEES } from "@/constants/index";

// Database
import { db } from "@/db";
import {
  cartItemTable,
  cartTable,
  orderItemTable,
  orderTable,
} from "@/db/schema";

// Auth
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Next
import { headers } from "next/headers";

export const finishOrder = async () => {
  // Get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Selected cart with all datas, like, cart data and items with products and categories.
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const totalPriceInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    DELIVERY_FEES,
  );

  // Atomicity ensure that all tables insert datas are executed or nerver is escexuted.
  await db.transaction(async (tx) => {
    if (!cart.shippingAddress) {
      throw new Error("Cart not found.");
    }

    // Insert datas of order table.
    const [order] = await tx
      .insert(orderTable)
      .values({
        shippingAddressId: cart.shippingAddressId,
        recipientName: cart.shippingAddress.recipientName,
        street: cart.shippingAddress.street,
        number: cart.shippingAddress.number,
        complement: cart.shippingAddress.complement,
        city: cart.shippingAddress.city,
        state: cart.shippingAddress.state,
        neighborhood: cart.shippingAddress.neighborhood,
        zipCode: cart.shippingAddress.zipCode,
        country: cart.shippingAddress.country,
        phone: cart.shippingAddress.phone,
        email: cart.shippingAddress.email,
        cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
        userId: session.user.id!,
        totalFeesInCents: DELIVERY_FEES,
        totalPriceInCents: totalPriceInCents,
        status: "pending",
      })
      .returning();

    if (!order) {
      throw new Error("Order not exists");
    }

    // Insert datas of order items table.
    await tx.insert(orderItemTable).values(
      // To each item in cart is created register from order item table.
      cart.items.map((item) => {
        return {
          orderId: order.id,
          productVariantId: item.productVariant.id,
          quantity: item.quantity,
          priceInCents: item.productVariant.priceInCents,
        };
      }),
    );

    // Delete cart and cart item on created order and order items.
    tx.delete(cartTable).where(eq(cartTable.id, cart.id));
    tx.delete(cartItemTable).where(eq(cartItemTable.id, cart.id));
  });
};
