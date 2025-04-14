import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Store model
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  logo: text("logo"),
  longitude: doublePrecision("longitude"),
  latitude: doublePrecision("latitude"),
  openingHours: text("opening_hours"),
  website: text("website"),
  hasOnlineShopping: boolean("has_online_shopping").default(false),
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  location: true,
  logo: true,
  longitude: true,
  latitude: true,
  openingHours: true,
  website: true,
  hasOnlineShopping: true,
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
  image: text("image"),
  barcode: text("barcode"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  category: true,
  brand: true,
  unit: true,
  description: true,
  image: true,
  barcode: true,
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
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  oldPrice: doublePrecision("old_price").notNull(),
  newPrice: doublePrecision("new_price").notNull(),
  alertType: text("alert_type").notNull(), // 'increase' or 'decrease'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).pick({
  userId: true,
  productId: true,
  storeId: true,
  oldPrice: true,
  newPrice: true,
  alertType: true,
});

export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;

// Purchase History
export const purchaseHistory = pgTable("purchase_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  storeId: integer("store_id").notNull().references(() => stores.id),
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").default(1),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPurchaseHistorySchema = createInsertSchema(purchaseHistory).pick({
  userId: true,
  productId: true,
  storeId: true,
  price: true,
  quantity: true,
  purchaseDate: true,
});

export type InsertPurchaseHistory = z.infer<typeof insertPurchaseHistorySchema>;
export type PurchaseHistory = typeof purchaseHistory.$inferSelect;

// Product Recommendations
export const productRecommendations = pgTable("product_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  score: doublePrecision("score").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductRecommendationSchema = createInsertSchema(productRecommendations).pick({
  userId: true,
  productId: true,
  score: true,
  reason: true,
});

export type InsertProductRecommendation = z.infer<typeof insertProductRecommendationSchema>;
export type ProductRecommendation = typeof productRecommendations.$inferSelect;

// Price Accuracy Ratings
export const priceAccuracyRatings = pgTable("price_accuracy_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  priceId: integer("price_id").notNull().references(() => prices.id),
  isAccurate: boolean("is_accurate").notNull(),
  actualPrice: doublePrecision("actual_price"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPriceAccuracyRatingSchema = createInsertSchema(priceAccuracyRatings).pick({
  userId: true,
  priceId: true,
  isAccurate: true,
  actualPrice: true,
  comment: true,
});

export type InsertPriceAccuracyRating = z.infer<typeof insertPriceAccuracyRatingSchema>;
export type PriceAccuracyRating = typeof priceAccuracyRatings.$inferSelect;

// API Keys for public API access
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  apiKey: text("api_key").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  userId: true,
  apiKey: true,
  description: true,
  isActive: true,
});

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  shoppingLists: many(shoppingLists),
  favoriteProducts: many(favoriteProducts),
  priceAlerts: many(priceAlerts),
  purchaseHistory: many(purchaseHistory),
  productRecommendations: many(productRecommendations),
  priceAccuracyRatings: many(priceAccuracyRatings),
  apiKeys: many(apiKeys),
}));

export const storesRelations = relations(stores, ({ many }) => ({
  prices: many(prices),
  priceAlerts: many(priceAlerts),
  purchaseHistory: many(purchaseHistory),
}));

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
  shoppingListItems: many(shoppingListItems),
  favoriteProducts: many(favoriteProducts),
  priceAlerts: many(priceAlerts),
  purchaseHistory: many(purchaseHistory),
  productRecommendations: many(productRecommendations),
}));

export const pricesRelations = relations(prices, ({ one, many }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [prices.storeId],
    references: [stores.id],
  }),
  priceAccuracyRatings: many(priceAccuracyRatings),
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
  user: one(users, {
    fields: [priceAlerts.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [priceAlerts.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [priceAlerts.storeId],
    references: [stores.id],
  })
}));

export const purchaseHistoryRelations = relations(purchaseHistory, ({ one }) => ({
  user: one(users, {
    fields: [purchaseHistory.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [purchaseHistory.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [purchaseHistory.storeId],
    references: [stores.id],
  })
}));

export const productRecommendationsRelations = relations(productRecommendations, ({ one }) => ({
  user: one(users, {
    fields: [productRecommendations.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [productRecommendations.productId],
    references: [products.id],
  })
}));

export const priceAccuracyRatingsRelations = relations(priceAccuracyRatings, ({ one }) => ({
  user: one(users, {
    fields: [priceAccuracyRatings.userId],
    references: [users.id],
  }),
  price: one(prices, {
    fields: [priceAccuracyRatings.priceId],
    references: [prices.id],
  })
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  })
}));
