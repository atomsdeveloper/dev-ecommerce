"use client";

// Database
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

// Next
import Image from "next/image";
import Link from "next/link";

interface ProducItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}

const ProductList = ({ product }: ProducItemProps) => {
  const firstVariant = product.variants[0];

  const extractUrl = (raw: string): string => {
    const match = raw.match(/https?:\/\/[^"}]+/);
    return match ? match[0] : "";
  };

  const parsedImageUrl: string = extractUrl(firstVariant.imageUrl);

  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={parsedImageUrl as string}
        alt={firstVariant.slug}
        height={150}
        width={150}
        className="rounded-2xl"
      />
      <div className="flex max-w-[150px] flex-col gap-1">
        <p className="truncate text-sm font-medium"> {product.name} </p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductList;
