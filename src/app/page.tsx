// Components Common
import CategorySelector from "../components/common/category-selector";
import Header from "../components/common/header";
import ProductList from "../components/common/product-list";
import Footer from "../components/common/footer";

// Database
import { db } from "../db";
import { desc } from "drizzle-orm";
import { productTable } from "../db/schema";

// Next
import Image from "next/image";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />

      <div className="space-y-6">
        <div className="px-5">
          <Image
            src="/banner-01.png"
            alt="Leve uma vida com estilo."
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5">
          <ProductList products={products} title="Mais vendidos" />
        </div>

        <div className="px-5">
          <Image
            src="/banner-02.png"
            alt="Leve uma vida com estilo."
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />

          <ProductList products={newlyCreatedProducts} title="Talvez goste" />

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
