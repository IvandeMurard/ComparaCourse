import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Store model
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  logo: text("logo"),
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  location: true,
  logo: true,
});

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  brand: text("brand"),
  unit: text("unit"),
  description: text("description"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  category: true,
  brand: true,
  unit: true,
  description: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Price model - connects products to stores with a price
export const prices = pgTable("prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  price: doublePrecision("price").notNull(),
  promo: boolean("promo").default(false),
  oldPrice: doublePrecision("old_price"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPriceSchema = createInsertSchema(prices).pick({
  productId: true,
  storeId: true,
  price: true,
  promo: true,
  oldPrice: true,
});

export type InsertPrice = z.infer<typeof insertPriceSchema>;
export type Price = typeof prices.$inferSelect;

// Shopping list model
export const shoppingLists = pgTable("shopping_lists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertShoppingListSchema = createInsertSchema(shoppingLists).pick({
  userId: true,
  name: true,
  status: true,
});

export type InsertShoppingList = z.infer<typeof insertShoppingListSchema>;
export type ShoppingList = typeof shoppingLists.$inferSelect;

// Shopping list item model
export const shoppingListItems = pgTable("shopping_list_items", {
  id: serial("id").primaryKey(),
  shoppingListId: integer("shopping_list_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").default(1),
  checked: boolean("checked").default(false),
});

export const insertShoppingListItemSchema = createInsertSchema(shoppingListItems).pick({
  shoppingListId: true,
  productId: true,
  quantity: true,
  checked: true,
});

export type InsertShoppingListItem = z.infer<typeof insertShoppingListItemSchema>;
export type ShoppingListItem = typeof shoppingListItems.$inferSelect;

// User favorite products
export const favoriteProducts = pgTable("favorite_products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  purchaseCount: integer("purchase_count").default(0),
  lastPurchased: timestamp("last_purchased"),
});

export const insertFavoriteProductSchema = createInsertSchema(favoriteProducts).pick({
  userId: true,
  productId: true,
  purchaseCount: true,
  lastPurchased: true,
});

export type InsertFavoriteProduct = z.infer<typeof insertFavoriteProductSchema>;
export type FavoriteProduct = typeof favoriteProducts.$inferSelect;

// Price alert model
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  oldPrice: doublePrecision("old_price").notNull(),
  newPrice: doublePrecision("new_price").notNull(),
  alertType: text("alert_type").notNull(), // 'increase' or 'decrease'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).pick({
  productId: true,
  storeId: true,
  oldPrice: true,
  newPrice: true,
  alertType: true,
});

export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  shoppingLists: many(shoppingLists),
  favoriteProducts: many(favoriteProducts)
}));

export const storesRelations = relations(stores, ({ many }) => ({
  prices: many(prices),
  priceAlerts: many(priceAlerts)
}));

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
  shoppingListItems: many(shoppingListItems),
  favoriteProducts: many(favoriteProducts),
  priceAlerts: many(priceAlerts)
}));

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [prices.storeId],
    references: [stores.id],
  })
}));

export const shoppingListsRelations = relations(shoppingLists, ({ one, many }) => ({
  user: one(users, {
    fields: [shoppingLists.userId],
    references: [users.id],
  }),
  items: many(shoppingListItems)
}));

export const shoppingListItemsRelations = relations(shoppingListItems, ({ one }) => ({
  shoppingList: one(shoppingLists, {
    fields: [shoppingListItems.shoppingListId],
    references: [shoppingLists.id],
  }),
  product: one(products, {
    fields: [shoppingListItems.productId],
    references: [products.id],
  })
}));

export const favoriteProductsRelations = relations(favoriteProducts, ({ one }) => ({
  user: one(users, {
    fields: [favoriteProducts.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favoriteProducts.productId],
    references: [products.id],
  })
}));

export const priceAlertsRelations = relations(priceAlerts, ({ one }) => ({
  product: one(products, {
    fields: [priceAlerts.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [priceAlerts.storeId],
    references: [stores.id],
  })
}));
