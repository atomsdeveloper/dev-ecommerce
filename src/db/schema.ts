import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// TABLE USERS
export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Relations for user table to be used in queries and joins with other tables
export const userRelations = relations(userTable, ({ many }) => ({
  // Table of products with relations where...
  shippingAddress: many(shippingAddressTable), // references the shipping address table to join datas.
}));

// TABLE SESSION
export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// Relations for user table to be used in queries and joins with other tables
export const sessionRelations = relations(sessionTable, ({ many }) => ({
  users: many(userTable),
}));

// TABLE ACCOUNT
export const accountTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Relations for user table to be used in queries and joins with other tables
export const accountRelations = relations(accountTable, ({ many }) => ({
  users: many(userTable),
}));

// TABLE CATEGORY
export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations for category table to be used in queries and joins with other tables
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
    .references(() => categoryTable.id, { onDelete: "set null" }),
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

// TABLE PRODUCT VARIANT
export const productVariantTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  name: text().notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  color: text().notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  slug: text().notNull().unique(),
});

// Relations for product variant table to be used in queries and joins with other tables
export const productVariantRelations = relations(
  productVariantTable,
  ({ one }) => ({
    // Table of products variants with relations where...
    product: one(productTable, {
      fields: [productVariantTable.productId], // field `productId`
      references: [productTable.id], // references the `id` field of the `productTable`
    }),
  }),
);

// TABLE VERIFICATION
export const verificationTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("update_at").notNull().defaultNow(),
});

// TABLE ADDRESS
export const shippingAddressTable = pgTable("shipping_address", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  recipientName: text().notNull(),
  street: text().notNull(),
  number: text().notNull(),
  complement: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  neighborhood: text().notNull(),
  zipCode: text().notNull(),
  country: text().notNull(),
  phone: text().notNull(),
  email: text().notNull(),
  cpfOrCnpj: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations for product table to be used in queries and joins with other tables
export const shippingAddressRelations = relations(
  shippingAddressTable,
  ({ one }) => ({
    // Table of products with relations where...
    user: one(userTable, {
      fields: [shippingAddressTable.userId], // field `userId`
      references: [userTable.id], // references the `id` field of the `userTable`
    }),
  }),
);
