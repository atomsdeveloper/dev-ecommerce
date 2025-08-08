// Components Common
import Header from "@/components/common/header";

// Database
import { db } from "@/db";
import { productVariantTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Next
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCentsToBRL } from "@/helpers/money";
import { Button } from "@/components/ui/button";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: true,
    },
  });

  if (!productVariant) {
    return notFound();
  }

  return (
    <>
      <Header />

      <div className="flex flex-col space-y-6 px-5">
        {/* IMAGE */}
        <div className="h-[300px] w-full">
          <Image
            src={productVariant.imageUrl}
            alt={productVariant.name}
            fill
            className="rounded-full object-cover"
          />
        </div>

        {/* VARIANTS */}
        <div>variants</div>

        {/* DESCRIPTION */}
        <div>
          <div className="text-lg font-semibold">
            {productVariant.product.name}
          </div>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>

        {/* QUANTITY */}
        <div className=""></div>

        {/* BUTTONS */}
        <div className="space-y-4">
          <Button className="w-full" variant="default">
            Comprar agora
          </Button>
          <Button className="w-full" variant="ghost">
            Adicionar à sacola
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductVariantPage;
