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

// Query
import { useQuery } from "@tanstack/react-query";

// Actions
import { getCart } from "@/actions/get-cart";
import CartItem from "./cart-item";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { formatCentsToBRL } from "@/helpers/money";

const Cart = () => {
  // Query for fetch datas in database in client side.
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  return (
    <Sheet>
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
                {cart?.items?.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    productName={item.productVariant.name}
                    productVariantImageUrl={item.productVariant.imageUrl}
                    productVariantName={item.productVariant.name}
                    productVariantPriceInCents={
                      item.productVariant.priceInCents
                    }
                    quantity={item.quantity}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {cart?.items && cart?.items.length > 0 && (
            <div className="flex flex-col gap-1">
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>subtotal</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>entrega</p>
                <p className="text-md font-semibold text-green-500">
                  {formatCentsToBRL(cart?.deleveryFees)}
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>total</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Button>Finalizar compra</Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default Cart;
