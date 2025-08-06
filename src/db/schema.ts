import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

// TABLE USERS
export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
});

// TABLE CATEGORY
export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations for user table to be used in queries and joins with other tables
export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productTable),
}));

// TABLE PRODUCTS
export const productTable = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoryTable.id),
});

// Relations for product table to be used in queries and joins with other tables
export const productRelations = relations(productTable, ({ one, many }) => ({
  // Table of products with relations where...
  category: one(categoryTable, {
    fields: [productTable.categoryId], // field `categoryId`
    references: [categoryTable.id], // references the `id` field of the `categoryTable`
  }),
  variants: many(productVariantTable), // one product can have many variants
}));

export const productVariantTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id),
  name: text().notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  color: text().notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  slug: text().notNull().unique(),
});

// Relations for product table to be used in queries and joins with other tables
export const productVariantRelations = relations(
  productVariantTable,
  ({ one }) => ({
    // Table of products with relations where...
    product: one(productTable, {
      fields: [productVariantTable.productId], // field `productId`
      references: [productTable.id], // references the `id` field of the `productTable`
    }),
  }),
);
