// Compoenents Common
import Header from "@/components/common/header";
import Footer from "../../../components/common/footer";

// Components private
import Addresses from "./components/addresses";

// Database
import { db } from "../../../db";
import { cartTable, shippingAddressTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

// Auth
import { auth } from "../../../lib/auth";

// Next
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DELIVERY_FEES } from "@/constants/index";
import CartSummary from "./components/cart-summary";

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
    where: (cartItem, { eq }) => eq(cartItem.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  // Get values of all products in cart and fees.
  const totalPriceInCents = cart?.items.reduce((acc, item) => {
    return acc + item.quantity * item.productVariant.priceInCents;
  }, DELIVERY_FEES);

  const subTotalPriceInCent = totalPriceInCents - DELIVERY_FEES;

  // Fetch data cart user logged.
  const [cartAddress] = await db
    .select()
    .from(cartTable)
    .where(eq(cartTable.userId, session.user.id));

  // Fetch data all address of user logged.
  const addressUser = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  return (
    <div className="h-full">
      <Header />
      <div className="space-y-4">
        <div className="space-y-6 px-5">
          <Addresses
            addressUser={addressUser}
            currentAddressId={cartAddress?.shippingAddressId}
          />

          <CartSummary
            subTotalInCents={subTotalPriceInCent}
            totalInCents={totalPriceInCents}
            products={cart.items}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default IdentificationPage;
