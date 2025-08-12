// Icons
import { ShoppingBasketIcon } from "lucide-react";

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

const Cart = () => {
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
        {!!cartIsLoading && <p>Carregando...</p>}
        {cart?.items?.map((item) => (
          <div key={item.id}>
            <p>{item.productVariantId}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
};
export default Cart;
