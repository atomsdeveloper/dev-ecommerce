import {
  pgTable,
  text,
  timestamp,
  boolean,
  //   integer,
} from "drizzle-orm/pg-core";

// Define the schema for the user table
// This schema is used by Better Auth for user management
// and should match the structure expected by the auth library.
// Ensure that the column names and types are compatible with Better Auth.
// The user table is used to store user information such as name, email, and profile image.
// The session table is used to manage user sessions, including session expiration and user agent information.
// The account table is used to store account-related information, such as access tokens and provider IDs.
// The verification table is used for email verification purposes, but it is currently commented out.

export const user = pgTable("user", {
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

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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

// export const verification = pgTable("verification", {
//   id: text("id").primaryKey(),
//   identifier: text("identifier").notNull(),
//   value: text("value").notNull(),
//   expiresAt: timestamp("expires_at").notNull(),
//   createdAt: timestamp("created_at").$defaultFn(
//     () => /* @__PURE__ */ new Date(),
//   ),
//   updatedAt: timestamp("updated_at").$defaultFn(
//     () => /* @__PURE__ */ new Date(),
//   ),
// });
