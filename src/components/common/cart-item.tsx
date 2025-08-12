// Next
import Image from "next/image";

// UI Components
import { Button } from "../ui/button";

// Icons
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";

// Helpers
import { formatCentsToBRL } from "@/helpers/money";

// Query
import { useQueryClient, useMutation } from "@tanstack/react-query";

// Actions
import { removeCartProduct } from "@/actions/remove-cart-product";
import { increaseCartProduct } from "@/actions/increase-cart-product";
import { decreaseCartProduct } from "@/actions/decrease-cart-product";

// Toast
import { toast } from "sonner";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantImageUrl,
  productVariantName,
  productVariantPriceInCents,
  quantity,
}: CartItemProps) => {
  const queryClient = useQueryClient();

  // REMOVE
  const removeProductCart = useMutation({
    mutationKey: ["removeProductCart"],
    mutationFn: () => removeCartProduct({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleRemoveProductCart = () => {
    removeProductCart.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido com sucesso da sacola.");
      },
      onError: () => {
        toast.error("Erro ao remover o produto da sacola.");
      },
    });
  };

  // DECREASE
  const decreaseProductCart = useMutation({
    mutationKey: ["decreaseProductCart"],
    mutationFn: () => decreaseCartProduct({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDecreaseProductCart = () => {
    decreaseProductCart.mutate(undefined, {
      onError: () => {
        toast.error("Erro ao diminuir a quantidade do produto na sacola.");
      },
    });
  };

  // INCREASE
  const increaseProductCart = useMutation({
    mutationKey: ["incriseProductCart"],
    mutationFn: () => increaseCartProduct({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleIncreaseProductCart = () => {
    increaseProductCart.mutate(undefined, {
      onError: () => {
        toast.error("Erro ao diminuir a quantidade do produto na sacola.");
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold"> {productName} </p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="m-0 flex w-[100px] items-center justify-start gap-2 rounded-lg p-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDecreaseProductCart}
              className="h-6 w-6 border"
            >
              <MinusIcon className="p-1" />
            </Button>
            <p>{quantity}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleIncreaseProductCart}
              className="h-6 w-6 border"
            >
              <PlusIcon className="p-1" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-4">
        <Button variant="outline" size="icon" onClick={handleRemoveProductCart}>
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
