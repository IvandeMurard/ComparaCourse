import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: number;
  name: string;
  location?: string;
  logo?: string;
}

interface StoreContextType {
  stores: Store[];
  isLoading: boolean;
  addStore: (store: Omit<Store, "id">) => Promise<Store>;
  updateStore: (id: number, data: Partial<Store>) => Promise<Store>;
  deleteStore: (id: number) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);

  // Fetch stores
  const { data: storesData, isLoading } = useQuery({
    queryKey: ['/api/stores'],
    queryFn: async () => {
      const res = await fetch('/api/stores');
      if (!res.ok) throw new Error("Failed to fetch stores");
      return res.json();
    },
  });

  useEffect(() => {
    if (storesData) {
      setStores(storesData);
    }
  }, [storesData]);

  // Add store
  const addStoreMutation = useMutation({
    mutationFn: async (store: Omit<Store, "id">) => {
      const res = await apiRequest('POST', '/api/stores', store);
      return res.json();
    },
    onSuccess: (newStore) => {
      setStores((prev) => [...prev, newStore]);
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le magasin",
      });
      console.error(error);
    },
  });

  // Update store
  const updateStoreMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Store> }) => {
      const res = await apiRequest('PUT', `/api/stores/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedStore) => {
      setStores((prev) =>
        prev.map((store) => (store.id === updatedStore.id ? updatedStore : store))
      );
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le magasin",
      });
      console.error(error);
    },
  });

  // Delete store
  const deleteStoreMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/stores/${id}`);
      return true;
    },
    onSuccess: (_, id) => {
      setStores((prev) => prev.filter((store) => store.id !== id));
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le magasin",
      });
      console.error(error);
    },
  });

  const addStore = async (store: Omit<Store, "id">) => {
    return addStoreMutation.mutateAsync(store);
  };

  const updateStore = async (id: number, data: Partial<Store>) => {
    return updateStoreMutation.mutateAsync({ id, data });
  };

  const deleteStore = async (id: number) => {
    return deleteStoreMutation.mutateAsync(id);
  };

  const value = {
    stores,
    isLoading,
    addStore,
    updateStore,
    deleteStore,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
