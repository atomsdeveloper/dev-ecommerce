// Components Common
import Header from "@/components/common/header";

// Database
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Next
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCentsToBRL } from "@/helpers/money";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/common/product-list";
import Footer from "@/components/common/footer";
import VariantSelector from "@/components/common/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.id),
    with: {
      variants: true,
    },
  });

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
        <VariantSelector
          selectedVariantSlug={productVariant.slug}
          variants={productVariant.product.variants}
        />

        {/* INFORMATIONS */}
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
          <Button className="w-full rounded-full" size="lg" variant="default">
            Comprar agora
          </Button>
          <Button className="w-full rounded-full" size="lg" variant="ghost">
            Adicionar à sacola
          </Button>
        </div>

        {/* DESCRIPTION */}
        <p className="text-shadow-amber-600">
          {productVariant.product.description}{" "}
        </p>

        {/* PRODDUCTS */}
        <ProductList title="Talvez goste" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
