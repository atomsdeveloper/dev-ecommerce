// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";

// Constants
import { DELIVERY_FEES } from "@/constants";

// Helpers
import { formatCentsToBRL } from "@/helpers/money";

// Next
import Image from "next/image";
import { cartItemTable, productVariantTable } from "@/db/schema";

type CartItem = (typeof cartItemTable.$inferSelect & {
  productVariant: typeof productVariantTable.$inferSelect;
})[];

interface CartSummaryProps {
  subTotalInCents: number;
  totalInCents: number;
  products: CartItem;
}

const CartSummary = ({
  subTotalInCents,
  totalInCents,
  products,
}: CartSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <p className="text-sm">SubTotal</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(subTotalInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Frete</p>
          <p className="text-sm font-medium text-green-600">
            {formatCentsToBRL(DELIVERY_FEES)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(totalInCents)}
          </p>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        {products.map((product) => {
          const extractUrl = (raw: string): string => {
            const match = raw.match(/https?:\/\/[^"}]+/);
            return match ? match[0] : "";
          };

          const parsedImageUrl: string = extractUrl(
            product.productVariant.imageUrl,
          );

          return (
            <div className="flex items-center justify-between" key={product.id}>
              <div className="flex items-center gap-4">
                <Image
                  src={parsedImageUrl}
                  alt={product.productVariant.name}
                  width={78}
                  height={78}
                  className="rounded-lg"
                />

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">
                    {product.productVariant.name}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">
                    {formatCentsToBRL(product.productVariant.priceInCents)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
