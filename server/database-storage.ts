import { 
  users, type User, type InsertUser,
  stores, type Store, type InsertStore,
  products, type Product, type InsertProduct,
  prices, type Price, type InsertPrice,
  shoppingLists, type ShoppingList, type InsertShoppingList,
  shoppingListItems, type ShoppingListItem, type InsertShoppingListItem,
  favoriteProducts, type FavoriteProduct, type InsertFavoriteProduct,
  priceAlerts, type PriceAlert, type InsertPriceAlert
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db.insert(stores).values(insertStore).returning();
    return store;
  }

  async updateStore(id: number, storeData: Partial<InsertStore>): Promise<Store | undefined> {
    const [updatedStore] = await db
      .update(stores)
      .set(storeData)
      .where(eq(stores.id, id))
      .returning();
    return updatedStore;
  }

  async deleteStore(id: number): Promise<boolean> {
    const result = await db
      .delete(stores)
      .where(eq(stores.id, id));
    return true;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        or(
          like(products.name, `%${query}%`),
          like(products.brand || '', `%${query}%`),
          like(products.category || '', `%${query}%`)
        )
      );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }

  // Prices
  async getPrices(): Promise<Price[]> {
    return await db.select().from(prices);
  }

  async getPrice(id: number): Promise<Price | undefined> {
    const [price] = await db.select().from(prices).where(eq(prices.id, id));
    return price;
  }

  async getPricesByProduct(productId: number): Promise<Price[]> {
    return await db
      .select()
      .from(prices)
      .where(eq(prices.productId, productId));
  }

  async getPricesByStore(storeId: number): Promise<Price[]> {
    return await db
      .select()
      .from(prices)
      .where(eq(prices.storeId, storeId));
  }

  async createPrice(insertPrice: InsertPrice): Promise<Price> {
    const [price] = await db.insert(prices).values(insertPrice).returning();
    return price;
  }

  async updatePrice(id: number, priceData: Partial<InsertPrice>): Promise<Price | undefined> {
    const [updatedPrice] = await db
      .update(prices)
      .set(priceData)
      .where(eq(prices.id, id))
      .returning();
    return updatedPrice;
  }

  async deletePrice(id: number): Promise<boolean> {
    await db.delete(prices).where(eq(prices.id, id));
    return true;
  }

  // Shopping Lists
  async getShoppingLists(userId: number): Promise<ShoppingList[]> {
    return await db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.userId, userId));
  }

  async getShoppingList(id: number): Promise<ShoppingList | undefined> {
    const [shoppingList] = await db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.id, id));
    return shoppingList;
  }

  async createShoppingList(insertShoppingList: InsertShoppingList): Promise<ShoppingList> {
    const [shoppingList] = await db
      .insert(shoppingLists)
      .values(insertShoppingList)
      .returning();
    return shoppingList;
  }

  async updateShoppingList(id: number, shoppingListData: Partial<InsertShoppingList>): Promise<ShoppingList | undefined> {
    const [updatedShoppingList] = await db
      .update(shoppingLists)
      .set(shoppingListData)
      .where(eq(shoppingLists.id, id))
      .returning();
    return updatedShoppingList;
  }

  async deleteShoppingList(id: number): Promise<boolean> {
    await db.delete(shoppingLists).where(eq(shoppingLists.id, id));
    return true;
  }

  // Shopping List Items
  async getShoppingListItems(shoppingListId: number): Promise<ShoppingListItem[]> {
    return await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.shoppingListId, shoppingListId));
  }

  async getShoppingListItem(id: number): Promise<ShoppingListItem | undefined> {
    const [item] = await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.id, id));
    return item;
  }

  async createShoppingListItem(insertShoppingListItem: InsertShoppingListItem): Promise<ShoppingListItem> {
    const [item] = await db
      .insert(shoppingListItems)
      .values(insertShoppingListItem)
      .returning();
    return item;
  }

  async updateShoppingListItem(id: number, shoppingListItemData: Partial<InsertShoppingListItem>): Promise<ShoppingListItem | undefined> {
    const [updatedItem] = await db
      .update(shoppingListItems)
      .set(shoppingListItemData)
      .where(eq(shoppingListItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteShoppingListItem(id: number): Promise<boolean> {
    await db.delete(shoppingListItems).where(eq(shoppingListItems.id, id));
    return true;
  }

  // Favorite Products
  async getFavoriteProducts(userId: number): Promise<FavoriteProduct[]> {
    return await db
      .select()
      .from(favoriteProducts)
      .where(eq(favoriteProducts.userId, userId));
  }

  async getFavoriteProduct(id: number): Promise<FavoriteProduct | undefined> {
    const [favoriteProduct] = await db
      .select()
      .from(favoriteProducts)
      .where(eq(favoriteProducts.id, id));
    return favoriteProduct;
  }

  async createFavoriteProduct(insertFavoriteProduct: InsertFavoriteProduct): Promise<FavoriteProduct> {
    const [favoriteProduct] = await db
      .insert(favoriteProducts)
      .values(insertFavoriteProduct)
      .returning();
    return favoriteProduct;
  }

  async updateFavoriteProduct(id: number, favoriteProductData: Partial<InsertFavoriteProduct>): Promise<FavoriteProduct | undefined> {
    const [updatedFavoriteProduct] = await db
      .update(favoriteProducts)
      .set(favoriteProductData)
      .where(eq(favoriteProducts.id, id))
      .returning();
    return updatedFavoriteProduct;
  }

  async deleteFavoriteProduct(id: number): Promise<boolean> {
    await db.delete(favoriteProducts).where(eq(favoriteProducts.id, id));
    return true;
  }

  // Price Alerts
  async getPriceAlerts(): Promise<PriceAlert[]> {
    return await db.select().from(priceAlerts);
  }

  async getPriceAlert(id: number): Promise<PriceAlert | undefined> {
    const [priceAlert] = await db
      .select()
      .from(priceAlerts)
      .where(eq(priceAlerts.id, id));
    return priceAlert;
  }

  async createPriceAlert(insertPriceAlert: InsertPriceAlert): Promise<PriceAlert> {
    const [priceAlert] = await db
      .insert(priceAlerts)
      .values(insertPriceAlert)
      .returning();
    return priceAlert;
  }

  async deletePriceAlert(id: number): Promise<boolean> {
    await db.delete(priceAlerts).where(eq(priceAlerts.id, id));
    return true;
  }
}