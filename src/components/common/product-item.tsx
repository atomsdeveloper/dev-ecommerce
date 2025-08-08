"use client";

// Database
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { cn } from "@/lib/utils";

// Next
import Image from "next/image";
import Link from "next/link";

interface ProducItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  textContainerClass?: string;
}

const ProductItem = ({ product, textContainerClass }: ProducItemProps) => {
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
        height={0}
        width={0}
        sizes="100vw"
        className="h-auto w-full rounded-2xl"
      />
      <div
        className={cn("flex max-w-[150px] flex-col gap-1", textContainerClass)}
      >
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

export default ProductItem;
