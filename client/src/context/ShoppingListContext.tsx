import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Dummy user ID for MVP
const CURRENT_USER_ID = 1;

interface ShoppingList {
  id: number;
  userId: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ShoppingListItem {
  id: number;
  shoppingListId: number;
  productId: number;
  quantity: number;
  checked: boolean;
}

interface ShoppingListContextType {
  shoppingLists: ShoppingList[];
  shoppingListItems: ShoppingListItem[];
  isLoading: boolean;
  createShoppingList: (name: string) => Promise<ShoppingList>;
  updateShoppingList: (id: number, data: Partial<ShoppingList>) => Promise<ShoppingList>;
  deleteShoppingList: (id: number) => Promise<boolean>;
  addItemToList: (shoppingListId: number, productId: number, quantity?: number) => Promise<ShoppingListItem>;
  removeItemFromList: (itemId: number) => Promise<boolean>;
  toggleItemChecked: (itemId: number) => Promise<ShoppingListItem>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<ShoppingListItem>;
}

const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);

  // Fetch shopping lists
  const { data: listsData, isLoading: listsLoading } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'shopping-lists'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${CURRENT_USER_ID}/shopping-lists`);
      if (!res.ok) throw new Error("Failed to fetch shopping lists");
      return res.json();
    },
  });

  // Fetch shopping list items when lists are loaded
  const { isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/shopping-list-items', listsData],
    queryFn: async () => {
      if (!listsData || listsData.length === 0) return [];
      
      const allItems: ShoppingListItem[] = [];
      
      for (const list of listsData) {
        const res = await fetch(`/api/shopping-lists/${list.id}/items`);
        if (!res.ok) throw new Error(`Failed to fetch items for list ${list.id}`);
        const items = await res.json();
        allItems.push(...items);
      }
      
      return allItems;
    },
    enabled: !!listsData,
  });

  useEffect(() => {
    if (listsData) {
      setShoppingLists(listsData);
    }
  }, [listsData]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!listsData || listsData.length === 0) return;
      
      const allItems: ShoppingListItem[] = [];
      
      for (const list of listsData) {
        try {
          const res = await fetch(`/api/shopping-lists/${list.id}/items`);
          if (!res.ok) throw new Error(`Failed to fetch items for list ${list.id}`);
          const items = await res.json();
          allItems.push(...items);
        } catch (error) {
          console.error(error);
        }
      }
      
      setShoppingListItems(allItems);
    };
    
    fetchItems();
  }, [listsData]);

  // Create shopping list
  const createListMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest('POST', '/api/shopping-lists', {
        userId: CURRENT_USER_ID,
        name,
        status: 'active',
      });
      return res.json();
    },
    onSuccess: (newList) => {
      setShoppingLists((prev) => [...prev, newList]);
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'shopping-lists'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la liste de courses",
      });
      console.error(error);
    },
  });

  // Update shopping list
  const updateListMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ShoppingList> }) => {
      const res = await apiRequest('PUT', `/api/shopping-lists/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedList) => {
      setShoppingLists((prev) =>
        prev.map((list) => (list.id === updatedList.id ? updatedList : list))
      );
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'shopping-lists'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la liste de courses",
      });
      console.error(error);
    },
  });

  // Delete shopping list
  const deleteListMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/shopping-lists/${id}`);
      return true;
    },
    onSuccess: (_, id) => {
      setShoppingLists((prev) => prev.filter((list) => list.id !== id));
      setShoppingListItems((prev) => prev.filter((item) => item.shoppingListId !== id));
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'shopping-lists'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la liste de courses",
      });
      console.error(error);
    },
  });

  // Add item to list
  const addItemMutation = useMutation({
    mutationFn: async ({
      shoppingListId,
      productId,
      quantity = 1,
    }: {
      shoppingListId: number;
      productId: number;
      quantity?: number;
    }) => {
      const res = await apiRequest('POST', '/api/shopping-list-items', {
        shoppingListId,
        productId,
        quantity,
        checked: false,
      });
      return res.json();
    },
    onSuccess: (newItem) => {
      setShoppingListItems((prev) => [...prev, newItem]);
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-list-items'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'article à la liste",
      });
      console.error(error);
    },
  });

  // Remove item from list
  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/shopping-list-items/${id}`);
      return true;
    },
    onSuccess: (_, id) => {
      setShoppingListItems((prev) => prev.filter((item) => item.id !== id));
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-list-items'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'article de la liste",
      });
      console.error(error);
    },
  });

  // Toggle item checked status
  const toggleItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const item = shoppingListItems.find((item) => item.id === id);
      if (!item) throw new Error("Item not found");
      
      const res = await apiRequest('PUT', `/api/shopping-list-items/${id}`, {
        checked: !item.checked,
      });
      return res.json();
    },
    onSuccess: (updatedItem) => {
      setShoppingListItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-list-items'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'état de l'article",
      });
      console.error(error);
    },
  });

  // Update item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest('PUT', `/api/shopping-list-items/${id}`, {
        quantity,
      });
      return res.json();
    },
    onSuccess: (updatedItem) => {
      setShoppingListItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-list-items'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
      });
      console.error(error);
    },
  });

  const createShoppingList = async (name: string) => {
    return createListMutation.mutateAsync(name);
  };

  const updateShoppingList = async (id: number, data: Partial<ShoppingList>) => {
    return updateListMutation.mutateAsync({ id, data });
  };

  const deleteShoppingList = async (id: number) => {
    return deleteListMutation.mutateAsync(id);
  };

  const addItemToList = async (shoppingListId: number, productId: number, quantity?: number) => {
    return addItemMutation.mutateAsync({ shoppingListId, productId, quantity });
  };

  const removeItemFromList = async (itemId: number) => {
    return removeItemMutation.mutateAsync(itemId);
  };

  const toggleItemChecked = async (itemId: number) => {
    return toggleItemMutation.mutateAsync(itemId);
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    return updateQuantityMutation.mutateAsync({ id: itemId, quantity });
  };

  const value = {
    shoppingLists,
    shoppingListItems,
    isLoading: listsLoading || itemsLoading,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    addItemToList,
    removeItemFromList,
    toggleItemChecked,
    updateItemQuantity,
  };

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>;
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
};
