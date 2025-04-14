import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Dummy user ID for MVP
const CURRENT_USER_ID = 1;

interface Product {
  id: number;
  name: string;
  category?: string;
  brand?: string;
  unit?: string;
  description?: string;
}

interface Price {
  id: number;
  productId: number;
  storeId: number;
  price: number;
  promo: boolean;
  oldPrice?: number;
  updatedAt: Date;
}

interface FavoriteProduct {
  id: number;
  userId: number;
  productId: number;
  purchaseCount: number;
  lastPurchased?: Date;
}

interface PriceAlert {
  id: number;
  productId: number;
  storeId: number;
  oldPrice: number;
  newPrice: number;
  alertType: string;
  createdAt: Date;
}

interface ProductContextType {
  products: Product[];
  productPrices: Price[];
  favoriteProducts: FavoriteProduct[];
  priceAlerts: PriceAlert[];
  isLoading: boolean;
  searchProducts: (query: string) => Promise<Product[]>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (id: number, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<boolean>;
  updatePrice: (id: number, data: Partial<Price>) => Promise<Price>;
  addFavoriteProduct: (productId: number) => Promise<FavoriteProduct>;
  removeFavoriteProduct: (id: number) => Promise<boolean>;
  updateFavoriteProduct: (id: number, data: Partial<FavoriteProduct>) => Promise<FavoriteProduct>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [productPrices, setProductPrices] = useState<Price[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  // Fetch prices
  const { data: pricesData, isLoading: pricesLoading } = useQuery({
    queryKey: ['/api/prices'],
    queryFn: async () => {
      const res = await fetch('/api/prices');
      if (!res.ok) throw new Error("Failed to fetch prices");
      return res.json();
    },
  });

  // Fetch favorite products
  const { data: favoritesData, isLoading: favoritesLoading } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'favorite-products'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${CURRENT_USER_ID}/favorite-products`);
      if (!res.ok) throw new Error("Failed to fetch favorite products");
      return res.json();
    },
  });

  // Fetch price alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/price-alerts'],
    queryFn: async () => {
      const res = await fetch('/api/price-alerts');
      if (!res.ok) throw new Error("Failed to fetch price alerts");
      return res.json();
    },
  });

  useEffect(() => {
    if (productsData) setProducts(productsData);
  }, [productsData]);

  useEffect(() => {
    if (pricesData) setProductPrices(pricesData);
  }, [pricesData]);

  useEffect(() => {
    if (favoritesData) setFavoriteProducts(favoritesData);
  }, [favoritesData]);

  useEffect(() => {
    if (alertsData) setPriceAlerts(alertsData);
  }, [alertsData]);

  // Search products
  const searchProductsMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to search products");
      return res.json();
    },
  });

  // Add product
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const res = await apiRequest('POST', '/api/products', product);
      return res.json();
    },
    onSuccess: (newProduct) => {
      setProducts((prev) => [...prev, newProduct]);
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit",
      });
      console.error(error);
    },
  });

  // Update product
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      const res = await apiRequest('PUT', `/api/products/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedProduct) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
      });
      console.error(error);
    },
  });

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/products/${id}`);
      return true;
    },
    onSuccess: (_, id) => {
      setProducts((prev) => prev.filter((product) => product.id !== id));
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit",
      });
      console.error(error);
    },
  });

  // Update price
  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Price> }) => {
      const res = await apiRequest('PUT', `/api/prices/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedPrice) => {
      setProductPrices((prev) =>
        prev.map((price) => (price.id === updatedPrice.id ? updatedPrice : price))
      );
      queryClient.invalidateQueries({ queryKey: ['/api/prices'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le prix",
      });
      console.error(error);
    },
  });

  // Add favorite product
  const addFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest('POST', '/api/favorite-products', {
        userId: CURRENT_USER_ID,
        productId,
        purchaseCount: 1,
      });
      return res.json();
    },
    onSuccess: (newFavorite) => {
      setFavoriteProducts((prev) => [...prev, newFavorite]);
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'favorite-products'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit aux favoris",
      });
      console.error(error);
    },
  });

  // Remove favorite product
  const removeFavoriteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/favorite-products/${id}`);
      return true;
    },
    onSuccess: (_, id) => {
      setFavoriteProducts((prev) => prev.filter((favorite) => favorite.id !== id));
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'favorite-products'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit des favoris",
      });
      console.error(error);
    },
  });

  // Update favorite product
  const updateFavoriteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<FavoriteProduct> }) => {
      const res = await apiRequest('PUT', `/api/favorite-products/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedFavorite) => {
      setFavoriteProducts((prev) =>
        prev.map((favorite) => (favorite.id === updatedFavorite.id ? updatedFavorite : favorite))
      );
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'favorite-products'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit favori",
      });
      console.error(error);
    },
  });

  const searchProducts = async (query: string) => {
    return searchProductsMutation.mutateAsync(query);
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    return addProductMutation.mutateAsync(product);
  };

  const updateProduct = async (id: number, data: Partial<Product>) => {
    return updateProductMutation.mutateAsync({ id, data });
  };

  const deleteProduct = async (id: number) => {
    return deleteProductMutation.mutateAsync(id);
  };

  const updatePrice = async (id: number, data: Partial<Price>) => {
    return updatePriceMutation.mutateAsync({ id, data });
  };

  const addFavoriteProduct = async (productId: number) => {
    return addFavoriteMutation.mutateAsync(productId);
  };

  const removeFavoriteProduct = async (id: number) => {
    return removeFavoriteMutation.mutateAsync(id);
  };

  const updateFavoriteProduct = async (id: number, data: Partial<FavoriteProduct>) => {
    return updateFavoriteMutation.mutateAsync({ id, data });
  };

  const value = {
    products,
    productPrices,
    favoriteProducts,
    priceAlerts,
    isLoading: productsLoading || pricesLoading || favoritesLoading || alertsLoading,
    searchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updatePrice,
    addFavoriteProduct,
    removeFavoriteProduct,
    updateFavoriteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
