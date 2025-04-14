import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertStoreSchema, 
  insertPriceSchema,
  insertShoppingListSchema,
  insertShoppingListItemSchema,
  insertFavoriteProductSchema,
  insertPriceAlertSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Users
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password in the response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Stores
  app.get("/api/stores", async (req: Request, res: Response) => {
    const stores = await storage.getStores();
    res.json(stores);
  });

  app.get("/api/stores/:id", async (req: Request, res: Response) => {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }
    
    const store = await storage.getStore(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    res.json(store);
  });

  app.post("/api/stores", async (req: Request, res: Response) => {
    try {
      const storeData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(storeData);
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid store data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  app.put("/api/stores/:id", async (req: Request, res: Response) => {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }
    
    try {
      const storeData = insertStoreSchema.partial().parse(req.body);
      const updatedStore = await storage.updateStore(storeId, storeData);
      if (!updatedStore) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(updatedStore);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid store data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update store" });
    }
  });

  app.delete("/api/stores/:id", async (req: Request, res: Response) => {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }
    
    const deleted = await storage.deleteStore(storeId);
    if (!deleted) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    res.status(204).end();
  });

  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    const query = req.query.q as string | undefined;
    
    if (query) {
      const products = await storage.searchProducts(query);
      return res.json(products);
    }
    
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(productId, productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const deleted = await storage.deleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(204).end();
  });

  // Prices
  app.get("/api/prices", async (req: Request, res: Response) => {
    const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
    const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : undefined;
    
    if (productId && !isNaN(productId)) {
      const prices = await storage.getPricesByProduct(productId);
      return res.json(prices);
    }
    
    if (storeId && !isNaN(storeId)) {
      const prices = await storage.getPricesByStore(storeId);
      return res.json(prices);
    }
    
    const prices = await storage.getPrices();
    res.json(prices);
  });

  app.get("/api/prices/:id", async (req: Request, res: Response) => {
    const priceId = parseInt(req.params.id);
    if (isNaN(priceId)) {
      return res.status(400).json({ message: "Invalid price ID" });
    }
    
    const price = await storage.getPrice(priceId);
    if (!price) {
      return res.status(404).json({ message: "Price not found" });
    }
    
    res.json(price);
  });

  app.post("/api/prices", async (req: Request, res: Response) => {
    try {
      const priceData = insertPriceSchema.parse(req.body);
      const price = await storage.createPrice(priceData);
      res.status(201).json(price);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create price" });
    }
  });

  app.put("/api/prices/:id", async (req: Request, res: Response) => {
    const priceId = parseInt(req.params.id);
    if (isNaN(priceId)) {
      return res.status(400).json({ message: "Invalid price ID" });
    }
    
    try {
      const priceData = insertPriceSchema.partial().parse(req.body);
      const updatedPrice = await storage.updatePrice(priceId, priceData);
      if (!updatedPrice) {
        return res.status(404).json({ message: "Price not found" });
      }
      res.json(updatedPrice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update price" });
    }
  });

  app.delete("/api/prices/:id", async (req: Request, res: Response) => {
    const priceId = parseInt(req.params.id);
    if (isNaN(priceId)) {
      return res.status(400).json({ message: "Invalid price ID" });
    }
    
    const deleted = await storage.deletePrice(priceId);
    if (!deleted) {
      return res.status(404).json({ message: "Price not found" });
    }
    
    res.status(204).end();
  });

  // Shopping Lists
  app.get("/api/users/:userId/shopping-lists", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const shoppingLists = await storage.getShoppingLists(userId);
    res.json(shoppingLists);
  });

  app.get("/api/shopping-lists/:id", async (req: Request, res: Response) => {
    const listId = parseInt(req.params.id);
    if (isNaN(listId)) {
      return res.status(400).json({ message: "Invalid shopping list ID" });
    }
    
    const shoppingList = await storage.getShoppingList(listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }
    
    res.json(shoppingList);
  });

  app.post("/api/shopping-lists", async (req: Request, res: Response) => {
    try {
      const listData = insertShoppingListSchema.parse(req.body);
      const shoppingList = await storage.createShoppingList(listData);
      res.status(201).json(shoppingList);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shopping list data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create shopping list" });
    }
  });

  app.put("/api/shopping-lists/:id", async (req: Request, res: Response) => {
    const listId = parseInt(req.params.id);
    if (isNaN(listId)) {
      return res.status(400).json({ message: "Invalid shopping list ID" });
    }
    
    try {
      const listData = insertShoppingListSchema.partial().parse(req.body);
      const updatedList = await storage.updateShoppingList(listId, listData);
      if (!updatedList) {
        return res.status(404).json({ message: "Shopping list not found" });
      }
      res.json(updatedList);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shopping list data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update shopping list" });
    }
  });

  app.delete("/api/shopping-lists/:id", async (req: Request, res: Response) => {
    const listId = parseInt(req.params.id);
    if (isNaN(listId)) {
      return res.status(400).json({ message: "Invalid shopping list ID" });
    }
    
    const deleted = await storage.deleteShoppingList(listId);
    if (!deleted) {
      return res.status(404).json({ message: "Shopping list not found" });
    }
    
    res.status(204).end();
  });

  // Shopping List Items
  app.get("/api/shopping-lists/:listId/items", async (req: Request, res: Response) => {
    const listId = parseInt(req.params.listId);
    if (isNaN(listId)) {
      return res.status(400).json({ message: "Invalid shopping list ID" });
    }
    
    const items = await storage.getShoppingListItems(listId);
    res.json(items);
  });

  app.get("/api/shopping-list-items/:id", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid shopping list item ID" });
    }
    
    const item = await storage.getShoppingListItem(itemId);
    if (!item) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }
    
    res.json(item);
  });

  app.post("/api/shopping-list-items", async (req: Request, res: Response) => {
    try {
      const itemData = insertShoppingListItemSchema.parse(req.body);
      const item = await storage.createShoppingListItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shopping list item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create shopping list item" });
    }
  });

  app.put("/api/shopping-list-items/:id", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid shopping list item ID" });
    }
    
    try {
      const itemData = insertShoppingListItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateShoppingListItem(itemId, itemData);
      if (!updatedItem) {
        return res.status(404).json({ message: "Shopping list item not found" });
      }
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shopping list item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update shopping list item" });
    }
  });

  app.delete("/api/shopping-list-items/:id", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid shopping list item ID" });
    }
    
    const deleted = await storage.deleteShoppingListItem(itemId);
    if (!deleted) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }
    
    res.status(204).end();
  });

  // Favorite Products
  app.get("/api/users/:userId/favorite-products", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const favorites = await storage.getFavoriteProducts(userId);
    res.json(favorites);
  });

  app.post("/api/favorite-products", async (req: Request, res: Response) => {
    try {
      const favoriteData = insertFavoriteProductSchema.parse(req.body);
      const favorite = await storage.createFavoriteProduct(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create favorite product" });
    }
  });

  app.put("/api/favorite-products/:id", async (req: Request, res: Response) => {
    const favoriteId = parseInt(req.params.id);
    if (isNaN(favoriteId)) {
      return res.status(400).json({ message: "Invalid favorite product ID" });
    }
    
    try {
      const favoriteData = insertFavoriteProductSchema.partial().parse(req.body);
      const updatedFavorite = await storage.updateFavoriteProduct(favoriteId, favoriteData);
      if (!updatedFavorite) {
        return res.status(404).json({ message: "Favorite product not found" });
      }
      res.json(updatedFavorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update favorite product" });
    }
  });

  app.delete("/api/favorite-products/:id", async (req: Request, res: Response) => {
    const favoriteId = parseInt(req.params.id);
    if (isNaN(favoriteId)) {
      return res.status(400).json({ message: "Invalid favorite product ID" });
    }
    
    const deleted = await storage.deleteFavoriteProduct(favoriteId);
    if (!deleted) {
      return res.status(404).json({ message: "Favorite product not found" });
    }
    
    res.status(204).end();
  });

  // Price Alerts
  app.get("/api/price-alerts", async (req: Request, res: Response) => {
    const alerts = await storage.getPriceAlerts();
    res.json(alerts);
  });

  app.post("/api/price-alerts", async (req: Request, res: Response) => {
    try {
      const alertData = insertPriceAlertSchema.parse(req.body);
      const alert = await storage.createPriceAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create price alert" });
    }
  });

  app.delete("/api/price-alerts/:id", async (req: Request, res: Response) => {
    const alertId = parseInt(req.params.id);
    if (isNaN(alertId)) {
      return res.status(400).json({ message: "Invalid price alert ID" });
    }
    
    const deleted = await storage.deletePriceAlert(alertId);
    if (!deleted) {
      return res.status(404).json({ message: "Price alert not found" });
    }
    
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
