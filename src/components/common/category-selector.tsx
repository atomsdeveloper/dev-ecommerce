import { categoryTable } from "@/db/schema";
import { Button } from "../ui/button";
import { Link } from "lucide-react";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Link href={`/category/${category.slug}`}>
            <Button
              asChild
              key={category.id}
              variant="ghost"
              className="rounded-full bg-white text-xs font-semibold"
            >
              {category.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
