"use server";

// Auth
import { auth } from "@/lib/auth";

// Database
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

// Types Schemas
import { addShippingAddressSchema, AddShippingAddressSchema } from "./schema";

// Next
import { headers } from "next/headers";

export const addShippingAddress = async (data: AddShippingAddressSchema) => {
  // Validade datas
  const parsed = addShippingAddressSchema.parse(data);

  // Get session user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  // Insert datas in database in table.
  const [address] = await db
    .insert(shippingAddressTable)
    .values({
      ...parsed,
      userId: session.user.id,
    })
    .returning();

  if (!address) {
    throw new Error("Erro ao inserir endereço.");
  }

  return address;
};
