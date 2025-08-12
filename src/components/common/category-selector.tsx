// Database
import { categoryTable } from "@/db/schema";

// UI Components
import { Button } from "../ui/button";

// Next
import Link from "next/link";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Link
            href={`/category/${category.slug}`}
            key={category.id}
            className="flex items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-600"
          >
            <Button
              asChild
              variant="ghost"
              className="rounded-full text-xs font-semibold"
            >
              <p>{category.name}</p>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
