// Database
import { productVariantTable } from "@/db/schema";

// Next
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
      {variants.map((variant) => {
        const extractUrl = (raw: string): string => {
          const match = raw.match(/https?:\/\/[^"}]+/);
          return match ? match[0] : "";
        };

        const parsedImageUrl: string = extractUrl(variant.imageUrl);

        return (
          <Link href={`product-variant/${variant.slug}`} key={variant.id}>
            <Image
              src={parsedImageUrl as string}
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
        );
      })}
    </div>
  );
};

export default VariantSelector;
