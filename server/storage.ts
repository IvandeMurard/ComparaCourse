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

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Prices
  getPrices(): Promise<Price[]>;
  getPrice(id: number): Promise<Price | undefined>;
  getPricesByProduct(productId: number): Promise<Price[]>;
  getPricesByStore(storeId: number): Promise<Price[]>;
  createPrice(price: InsertPrice): Promise<Price>;
  updatePrice(id: number, price: Partial<InsertPrice>): Promise<Price | undefined>;
  deletePrice(id: number): Promise<boolean>;

  // Shopping Lists
  getShoppingLists(userId: number): Promise<ShoppingList[]>;
  getShoppingList(id: number): Promise<ShoppingList | undefined>;
  createShoppingList(shoppingList: InsertShoppingList): Promise<ShoppingList>;
  updateShoppingList(id: number, shoppingList: Partial<InsertShoppingList>): Promise<ShoppingList | undefined>;
  deleteShoppingList(id: number): Promise<boolean>;

  // Shopping List Items
  getShoppingListItems(shoppingListId: number): Promise<ShoppingListItem[]>;
  getShoppingListItem(id: number): Promise<ShoppingListItem | undefined>;
  createShoppingListItem(shoppingListItem: InsertShoppingListItem): Promise<ShoppingListItem>;
  updateShoppingListItem(id: number, shoppingListItem: Partial<InsertShoppingListItem>): Promise<ShoppingListItem | undefined>;
  deleteShoppingListItem(id: number): Promise<boolean>;
  
  // Favorite Products
  getFavoriteProducts(userId: number): Promise<FavoriteProduct[]>;
  getFavoriteProduct(id: number): Promise<FavoriteProduct | undefined>;
  createFavoriteProduct(favoriteProduct: InsertFavoriteProduct): Promise<FavoriteProduct>;
  updateFavoriteProduct(id: number, favoriteProduct: Partial<InsertFavoriteProduct>): Promise<FavoriteProduct | undefined>;
  deleteFavoriteProduct(id: number): Promise<boolean>;

  // Price Alerts
  getPriceAlerts(): Promise<PriceAlert[]>;
  getPriceAlert(id: number): Promise<PriceAlert | undefined>;
  createPriceAlert(priceAlert: InsertPriceAlert): Promise<PriceAlert>;
  deletePriceAlert(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stores: Map<number, Store>;
  private products: Map<number, Product>;
  private prices: Map<number, Price>;
  private shoppingLists: Map<number, ShoppingList>;
  private shoppingListItems: Map<number, ShoppingListItem>;
  private favoriteProducts: Map<number, FavoriteProduct>;
  private priceAlerts: Map<number, PriceAlert>;
  
  private userIdCounter: number;
  private storeIdCounter: number;
  private productIdCounter: number;
  private priceIdCounter: number;
  private shoppingListIdCounter: number;
  private shoppingListItemIdCounter: number;
  private favoriteProductIdCounter: number;
  private priceAlertIdCounter: number;

  constructor() {
    this.users = new Map();
    this.stores = new Map();
    this.products = new Map();
    this.prices = new Map();
    this.shoppingLists = new Map();
    this.shoppingListItems = new Map();
    this.favoriteProducts = new Map();
    this.priceAlerts = new Map();
    
    this.userIdCounter = 1;
    this.storeIdCounter = 1;
    this.productIdCounter = 1;
    this.priceIdCounter = 1;
    this.shoppingListIdCounter = 1;
    this.shoppingListItemIdCounter = 1;
    this.favoriteProductIdCounter = 1;
    this.priceAlertIdCounter = 1;
    
    // Initialize with some sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Add stores
    const carrefour = this.createStore({ name: 'Carrefour', location: 'Centre commercial', logo: 'carrefour' });
    const leclerc = this.createStore({ name: 'E.Leclerc', location: 'Zone industrielle', logo: 'leclerc' });
    const auchan = this.createStore({ name: 'Auchan', location: 'Centre ville', logo: 'auchan' });

    // Add products
    const lait = this.createProduct({ name: 'Lait demi-écrémé 1L', category: 'Produits laitiers', brand: 'Lactel', unit: '1L' });
    const yaourt = this.createProduct({ name: 'Yaourt nature x4', category: 'Produits laitiers', brand: 'Danone', unit: 'pack de 4' });
    const pain = this.createProduct({ name: 'Pain complet', category: 'Boulangerie', brand: 'Jacquet', unit: '500g' });
    const pates = this.createProduct({ name: 'Pâtes 500g', category: 'Épicerie', brand: 'Panzani', unit: '500g' });
    const huile = this.createProduct({ name: 'Huile d\'olive 75cl', category: 'Huiles', brand: 'Puget', unit: '75cl' });
    const cafe = this.createProduct({ name: 'Café moulu 250g', category: 'Boissons', brand: 'Carte Noire', unit: '250g' });

    // Add prices
    this.createPrice({ productId: lait.id, storeId: carrefour.id, price: 0.95 });
    this.createPrice({ productId: lait.id, storeId: leclerc.id, price: 0.89 });
    this.createPrice({ productId: lait.id, storeId: auchan.id, price: 0.99 });
    
    this.createPrice({ productId: yaourt.id, storeId: carrefour.id, price: 1.15 });
    this.createPrice({ productId: yaourt.id, storeId: leclerc.id, price: 1.29 });
    this.createPrice({ productId: yaourt.id, storeId: auchan.id, price: 1.25 });
    
    this.createPrice({ productId: pain.id, storeId: carrefour.id, price: 1.90 });
    this.createPrice({ productId: pain.id, storeId: leclerc.id, price: 1.75 });
    this.createPrice({ productId: pain.id, storeId: auchan.id, price: 1.65 });
    
    this.createPrice({ productId: pates.id, storeId: carrefour.id, price: 0.95 });
    this.createPrice({ productId: pates.id, storeId: leclerc.id, price: 0.75 });
    this.createPrice({ productId: pates.id, storeId: auchan.id, price: 0.89 });
    
    this.createPrice({ productId: huile.id, storeId: carrefour.id, price: 5.45, promo: true, oldPrice: 6.95 });
    this.createPrice({ productId: huile.id, storeId: leclerc.id, price: 5.95 });
    this.createPrice({ productId: huile.id, storeId: auchan.id, price: 6.25 });
    
    this.createPrice({ productId: cafe.id, storeId: carrefour.id, price: 3.45 });
    this.createPrice({ productId: cafe.id, storeId: leclerc.id, price: 3.75, promo: false, oldPrice: 3.25 });
    this.createPrice({ productId: cafe.id, storeId: auchan.id, price: 3.50 });

    // Create a user
    const user = this.createUser({ username: 'user', password: 'password' });

    // Create a shopping list
    const shoppingList = this.createShoppingList({ userId: user.id, name: 'Courses hebdomadaires', status: 'active' });

    // Add items to shopping list
    this.createShoppingListItem({ shoppingListId: shoppingList.id, productId: lait.id, quantity: 1, checked: false });
    this.createShoppingListItem({ shoppingListId: shoppingList.id, productId: yaourt.id, quantity: 1, checked: true });
    this.createShoppingListItem({ shoppingListId: shoppingList.id, productId: pain.id, quantity: 1, checked: false });
    this.createShoppingListItem({ shoppingListId: shoppingList.id, productId: pates.id, quantity: 1, checked: false });

    // Add favorite products
    this.createFavoriteProduct({ userId: user.id, productId: lait.id, purchaseCount: 12 });
    this.createFavoriteProduct({ userId: user.id, productId: yaourt.id, purchaseCount: 8 });
    this.createFavoriteProduct({ userId: user.id, productId: pain.id, purchaseCount: 15 });

    // Add price alerts
    this.createPriceAlert({ 
      productId: huile.id, 
      storeId: carrefour.id, 
      oldPrice: 6.95, 
      newPrice: 5.45, 
      alertType: 'decrease' 
    });
    
    this.createPriceAlert({ 
      productId: cafe.id, 
      storeId: leclerc.id, 
      oldPrice: 3.25, 
      newPrice: 3.75, 
      alertType: 'increase' 
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = this.storeIdCounter++;
    const store: Store = { ...insertStore, id };
    this.stores.set(id, store);
    return store;
  }

  async updateStore(id: number, storeData: Partial<InsertStore>): Promise<Store | undefined> {
    const store = this.stores.get(id);
    if (!store) return undefined;
    
    const updatedStore = { ...store, ...storeData };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }

  async deleteStore(id: number): Promise<boolean> {
    return this.stores.delete(id);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.brand?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Prices
  async getPrices(): Promise<Price[]> {
    return Array.from(this.prices.values());
  }

  async getPrice(id: number): Promise<Price | undefined> {
    return this.prices.get(id);
  }

  async getPricesByProduct(productId: number): Promise<Price[]> {
    return Array.from(this.prices.values()).filter(price => price.productId === productId);
  }

  async getPricesByStore(storeId: number): Promise<Price[]> {
    return Array.from(this.prices.values()).filter(price => price.storeId === storeId);
  }

  async createPrice(insertPrice: InsertPrice): Promise<Price> {
    const id = this.priceIdCounter++;
    const price: Price = { 
      ...insertPrice, 
      id, 
      updatedAt: new Date() 
    };
    this.prices.set(id, price);
    return price;
  }

  async updatePrice(id: number, priceData: Partial<InsertPrice>): Promise<Price | undefined> {
    const price = this.prices.get(id);
    if (!price) return undefined;
    
    const updatedPrice = { 
      ...price, 
      ...priceData, 
      updatedAt: new Date() 
    };
    this.prices.set(id, updatedPrice);
    return updatedPrice;
  }

  async deletePrice(id: number): Promise<boolean> {
    return this.prices.delete(id);
  }

  // Shopping Lists
  async getShoppingLists(userId: number): Promise<ShoppingList[]> {
    return Array.from(this.shoppingLists.values()).filter(list => list.userId === userId);
  }

  async getShoppingList(id: number): Promise<ShoppingList | undefined> {
    return this.shoppingLists.get(id);
  }

  async createShoppingList(insertShoppingList: InsertShoppingList): Promise<ShoppingList> {
    const id = this.shoppingListIdCounter++;
    const now = new Date();
    const shoppingList: ShoppingList = { 
      ...insertShoppingList, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.shoppingLists.set(id, shoppingList);
    return shoppingList;
  }

  async updateShoppingList(id: number, shoppingListData: Partial<InsertShoppingList>): Promise<ShoppingList | undefined> {
    const shoppingList = this.shoppingLists.get(id);
    if (!shoppingList) return undefined;
    
    const updatedShoppingList = { 
      ...shoppingList, 
      ...shoppingListData, 
      updatedAt: new Date() 
    };
    this.shoppingLists.set(id, updatedShoppingList);
    return updatedShoppingList;
  }

  async deleteShoppingList(id: number): Promise<boolean> {
    return this.shoppingLists.delete(id);
  }

  // Shopping List Items
  async getShoppingListItems(shoppingListId: number): Promise<ShoppingListItem[]> {
    return Array.from(this.shoppingListItems.values()).filter(item => item.shoppingListId === shoppingListId);
  }

  async getShoppingListItem(id: number): Promise<ShoppingListItem | undefined> {
    return this.shoppingListItems.get(id);
  }

  async createShoppingListItem(insertShoppingListItem: InsertShoppingListItem): Promise<ShoppingListItem> {
    const id = this.shoppingListItemIdCounter++;
    const shoppingListItem: ShoppingListItem = { 
      ...insertShoppingListItem, 
      id
    };
    this.shoppingListItems.set(id, shoppingListItem);
    return shoppingListItem;
  }

  async updateShoppingListItem(id: number, shoppingListItemData: Partial<InsertShoppingListItem>): Promise<ShoppingListItem | undefined> {
    const shoppingListItem = this.shoppingListItems.get(id);
    if (!shoppingListItem) return undefined;
    
    const updatedShoppingListItem = { 
      ...shoppingListItem, 
      ...shoppingListItemData
    };
    this.shoppingListItems.set(id, updatedShoppingListItem);
    return updatedShoppingListItem;
  }

  async deleteShoppingListItem(id: number): Promise<boolean> {
    return this.shoppingListItems.delete(id);
  }

  // Favorite Products
  async getFavoriteProducts(userId: number): Promise<FavoriteProduct[]> {
    return Array.from(this.favoriteProducts.values()).filter(fav => fav.userId === userId);
  }

  async getFavoriteProduct(id: number): Promise<FavoriteProduct | undefined> {
    return this.favoriteProducts.get(id);
  }

  async createFavoriteProduct(insertFavoriteProduct: InsertFavoriteProduct): Promise<FavoriteProduct> {
    const id = this.favoriteProductIdCounter++;
    const favoriteProduct: FavoriteProduct = { 
      ...insertFavoriteProduct, 
      id
    };
    this.favoriteProducts.set(id, favoriteProduct);
    return favoriteProduct;
  }

  async updateFavoriteProduct(id: number, favoriteProductData: Partial<InsertFavoriteProduct>): Promise<FavoriteProduct | undefined> {
    const favoriteProduct = this.favoriteProducts.get(id);
    if (!favoriteProduct) return undefined;
    
    const updatedFavoriteProduct = { 
      ...favoriteProduct, 
      ...favoriteProductData
    };
    this.favoriteProducts.set(id, updatedFavoriteProduct);
    return updatedFavoriteProduct;
  }

  async deleteFavoriteProduct(id: number): Promise<boolean> {
    return this.favoriteProducts.delete(id);
  }

  // Price Alerts
  async getPriceAlerts(): Promise<PriceAlert[]> {
    return Array.from(this.priceAlerts.values());
  }

  async getPriceAlert(id: number): Promise<PriceAlert | undefined> {
    return this.priceAlerts.get(id);
  }

  async createPriceAlert(insertPriceAlert: InsertPriceAlert): Promise<PriceAlert> {
    const id = this.priceAlertIdCounter++;
    const now = new Date();
    const priceAlert: PriceAlert = { 
      ...insertPriceAlert, 
      id, 
      createdAt: now
    };
    this.priceAlerts.set(id, priceAlert);
    return priceAlert;
  }

  async deletePriceAlert(id: number): Promise<boolean> {
    return this.priceAlerts.delete(id);
  }
}

// import { MemStorage } from "./mem-storage";
// export const storage = new MemStorage();

import { DatabaseStorage } from "./database-storage";
export const storage = new DatabaseStorage();
