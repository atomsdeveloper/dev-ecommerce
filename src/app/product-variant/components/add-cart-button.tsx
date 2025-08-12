"use client";

// Actions
import { addProductToCart } from "@/actions/add-cart-product";

// UI components
import { Button } from "@/components/ui/button";

// Query
import { QueryClient, useMutation } from "@tanstack/react-query";

// Icons
import { LoaderCircleIcon } from "lucide-react";

interface AddCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddCartButton = ({ productVariantId, quantity }: AddCartButtonProps) => {
  const queryClient = new QueryClient();

  // Query for change database datas in client side.
  const { mutate, isPending: AddCartButtonIsLoading } = useMutation({
    mutationKey: ["addCartButton", productVariantId, quantity],
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["cart"] }); // Call all queries that get name 'cart' in 'queryKey'.
    },
  });

  return (
    <div className="space-y-4">
      <Button className="w-full rounded-full" size="lg" variant="default">
        Comprar agora
      </Button>
      <Button
        className="w-full rounded-full"
        size="lg"
        variant="ghost"
        onClick={() => mutate()}
      >
        {AddCartButtonIsLoading && (
          <LoaderCircleIcon className="animate-spin" />
        )}
        Adicionar à sacola
      </Button>
    </div>
  );
};

export default AddCartButton;
