// Compoenents Common
import Header from "@/components/common/header";

// Components private
import Addresses from "./components/addresses";

// Database
import { db } from "@/db";

// Auth
import { auth } from "@/lib/auth";

// Next
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { shippingAddressTable } from "@/db/schema";

const IdentificationPage = async () => {
  // Get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  // Get cart in agreement with user logged.
  const cart = await db.query.cartTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, session.user.id),
    with: {
      items: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  // Busca todos os endereços do usuário
  const addressUser = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  return (
    <div>
      <Header />
      <Addresses addressUser={addressUser} />
    </div>
  );
};

export default IdentificationPage;
