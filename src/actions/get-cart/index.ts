"use server";

// Database
import { db } from "@/db";
import { cartTable } from "@/db/schema";

// Auth
import { auth } from "@/lib/auth";

// Next
import { headers } from "next/headers";

export const getCart = async () => {
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
      items: {
        with: {
          productVariant: {
            with: {
              product: {
                with: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // If not cart found create one to user logged-in user and return it with empty items.
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: session.user.id })
      .returning();

    return {
      ...newCart,
      items: [],
    };
  }

  return cart;
};
