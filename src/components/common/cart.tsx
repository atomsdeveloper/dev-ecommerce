"use client";

// Icons
import { LoaderCircleIcon, ShoppingBasketIcon } from "lucide-react";

// UI Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";
import { ScrollArea } from "../ui/scroll-area";

// Query
import { useQuery } from "@tanstack/react-query";

// Actions
import { getCart } from "@/actions/get-cart";

// Components Common
import CartItem from "./cart-item";

// Helpers
import { formatCentsToBRL } from "@/helpers/money";

// Next
import Link from "next/link";

// Constants
import { DELIVERY_FEES } from "@/constants";
import { useState } from "react";

const Cart = () => {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  // Query for fetch datas in database in client side.
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: sheetOpen,
  });

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sacola</SheetTitle>
        </SheetHeader>
        {!!cartIsLoading && (
          <div className="space-y-4 px-5">
            <div className="flex h-full w-full items-center justify-center">
              <LoaderCircleIcon className="animate-spin" />
            </div>
          </div>
        )}
        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {cart?.items?.map((item) => {
                  const extractUrl = (raw: string): string => {
                    const match = raw.match(/https?:\/\/[^"}]+/);
                    return match ? match[0] : "";
                  };

                  const parsedImageUrl: string = extractUrl(
                    item.productVariant.imageUrl,
                  );

                  return (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productName={item.productVariant.name}
                      productVariantImageUrl={parsedImageUrl}
                      productVariantName={item.productVariant.name}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {cart?.items && cart?.items.length > 0 && (
            <div className="flex flex-col gap-1">
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Subtotal</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Taxa</p>
                <p className="text-md font-semibold text-green-500">
                  {formatCentsToBRL(DELIVERY_FEES)}
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Total</p>
                <p>
                  {formatCentsToBRL(
                    (cart?.totalPriceInCents ?? 0) + DELIVERY_FEES,
                  )}
                </p>
              </div>

              <Button asChild className="mt-5 rounded-full">
                <Link href="/cart/identification">Finalizar compra</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default Cart;
