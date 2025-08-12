"use server";

import { auth } from "@/lib/auth";

import { db } from "@/db";

import { addShippingAddressSchema } from "./schema";

import { headers } from "next/headers";
import { shippingAddressTable } from "@/db/schema";

export const addShippingAddress = async (data: unknown) => {
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
  await db.insert(shippingAddressTable).values({
    ...parsed,
    userId: session.user.id,
  });
};
