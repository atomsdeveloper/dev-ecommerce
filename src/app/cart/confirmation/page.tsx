// Components Common
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";

// Constants
import { DELIVERY_FEES } from "@/constants";

// Database
import { db } from "@/db";

// Auth
import { auth } from "@/lib/auth";

// Next
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Components Private
import CartSummary from "../identification/components/cart-summary";
import ButtonFinishOrder from "./components/button-finish-order";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfirmationPage = async () => {
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
  const cartAddress = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true, // pega todos os campos da tabela relacionada
    },
  });

  if (!cartAddress?.shippingAddressId) {
    redirect("/cart/identification");
  }

  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 rounded-2xl border p-6">
              {cartAddress.shippingAddress?.recipientName},{" "}
              {cartAddress.shippingAddress?.street},{" "}
              {cartAddress.shippingAddress?.number} -{" "}
              {cartAddress.shippingAddress?.city}
            </div>
          </CardContent>

          <ButtonFinishOrder />
        </Card>
        <CartSummary
          subTotalInCents={subTotalPriceInCent}
          totalInCents={totalPriceInCents}
          products={cart.items}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmationPage;
