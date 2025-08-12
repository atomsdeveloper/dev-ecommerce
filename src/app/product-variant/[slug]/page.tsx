// Components Common
import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import Footer from "@/components/common/footer";
import VariantSelector from "@/components/common/variant-selector";

// Database
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Next
import { notFound } from "next/navigation";
import Image from "next/image";

// Helpers
import { formatCentsToBRL } from "@/helpers/money";

// UI Componets
import ProductActions from "../components/product-actions";

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
    where: eq(productTable.categoryId, productVariant.product.categoryId),
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

        {/* PRODUCT ACTIONS */}
        <div className="px-5">
          <ProductActions productVariantId={productVariant.id} />
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
