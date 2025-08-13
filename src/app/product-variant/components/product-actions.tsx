"use client";

// UI Components
import { Button } from "../../../components/ui/button";

// Components Private
import AddCartButton from "./add-cart-button";

// Icons
import { MinusIcon, PlusIcon } from "lucide-react";

// React
import { useState } from "react";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };
  return (
    <>
      <div className="space-y-4">
        <h3 className="font-medium">Quantidade</h3>
        <div className="mb-4 flex w-[100px] items-center justify-between rounded-lg p-0">
          <Button size="icon" variant="ghost" onClick={handleDecrement}>
            <MinusIcon />
          </Button>
          <p>{quantity}</p>
          <Button size="icon" variant="ghost" onClick={handleIncrement}>
            <PlusIcon />
          </Button>
        </div>
      </div>

      <AddCartButton productVariantId={productVariantId} quantity={quantity} />
    </>
  );
};

export default ProductActions;
