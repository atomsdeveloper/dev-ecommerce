import { productVariantTable } from "@/db/schema";

import Image from "next/image";
import Link from "next/link";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
  variants,
  selectedVariantSlug,
}: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link href={`product-variant/${variant.slug}`} key={variant.id}>
          <Image
            src={variant.imageUrl}
            width={68}
            height={68}
            alt={variant.name}
            className={
              variant.slug === selectedVariantSlug
                ? "boder border-radius-lg rounded-lg transition"
                : ""
            }
          />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
