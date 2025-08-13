"use server";

// Auth
import { auth } from "@/lib/auth";

// Next
import { headers } from "next/headers";

// Database
import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Types Schemas
import { setCartAddressSchema, SetCartAddressSchema } from "./schema";

export const setAddressCart = async (data: SetCartAddressSchema) => {
  // Validade datas
  setCartAddressSchema.parse(data);

  // Get session user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  // Set cart address where user logged is equal userId of cartTable.
  const updateShippingAddressId = await db
    .update(cartTable)
    .set({ shippingAddressId: data.shippingAddressId })
    .where(eq(cartTable.userId, session.user.id));

  if (!updateShippingAddressId) {
    throw new Error("Erro ao atualizar endereço de entrega da sacola.");
  }
};
