import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useStore } from "@/context/StoreContext";
import { useProduct } from "@/context/ProductContext";
import { ChevronDown } from "lucide-react";

interface ShoppingListTableProps {
  shoppingListId: number;
  compact?: boolean;
}

const ShoppingListTable = ({ shoppingListId, compact = false }: ShoppingListTableProps) => {
  const { shoppingLists, shoppingListItems, toggleItemChecked } = useShoppingList();
  const { stores } = useStore();
  const { products, productPrices } = useProduct();

  const shoppingList = shoppingLists.find(list => list.id === shoppingListId);
  const items = shoppingListItems.filter(item => item.shoppingListId === shoppingListId);

  const getProductById = (productId: number) => {
    return products.find(product => product.id === productId);
  };

  const getPriceByProductAndStore = (productId: number, storeId: number) => {
    return productPrices.find(
      price => price.productId === productId && price.storeId === storeId
    )?.price || 0;
  };

  const getBestPriceStore = (productId: number) => {
    const productPricesForStores = productPrices
      .filter(price => price.productId === productId)
      .sort((a, b) => a.price - b.price);
    
    if (productPricesForStores.length === 0) return null;
    
    const bestPrice = productPricesForStores[0];
    return {
      storeName: stores.find(store => store.id === bestPrice.storeId)?.name || "",
      storeId: bestPrice.storeId,
      price: bestPrice.price
    };
  };

  const calculateTotalByStore = (storeId: number) => {
    return items.reduce((total, item) => {
      if (item.checked) return total;
      const price = getPriceByProductAndStore(item.productId, storeId);
      return total + (price * item.quantity);
    }, 0);
  };

  const findBestStore = () => {
    if (stores.length === 0) return null;
    
    const storeTotals = stores.map(store => ({
      storeId: store.id,
      storeName: store.name,
      total: calculateTotalByStore(store.id)
    }));
    
    return storeTotals.sort((a, b) => a.total - b.total)[0];
  };

  const bestStore = findBestStore();

  if (!shoppingList || items.length === 0) {
    return <div className="text-center py-8 text-gray-500">Cette liste est vide</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="font-medium">{shoppingList.name}</p>
          <p className="text-sm text-gray-500">
            {items.length} produits · Mise à jour il y a {Math.floor(Math.random() * 24)}h
          </p>
        </div>
        <div>
          <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">
            {shoppingList.status === 'active' ? 'En cours' : 'Complétée'}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-left text-xs font-medium text-gray-500 uppercase">Produit</TableHead>
              {!compact && stores.map(store => (
                <TableHead key={store.id} className="text-left text-xs font-medium text-gray-500 uppercase">{store.name}</TableHead>
              ))}
              <TableHead className="text-left text-xs font-medium text-gray-500 uppercase">Meilleur prix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {items.map(item => {
              const product = getProductById(item.productId);
              const bestPrice = getBestPriceStore(item.productId);
              
              if (!product || !bestPrice) return null;
              
              return (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <Checkbox 
                        id={`item-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={() => toggleItemChecked(item.id)}
                        className="mr-3 h-4 w-4 rounded text-primary focus:ring-primary"
                      />
                      <label 
                        htmlFor={`item-${item.id}`}
                        className={`${item.checked ? 'line-through text-gray-400' : ''}`}
                      >
                        {product.name}
                      </label>
                    </div>
                  </TableCell>
                  
                  {!compact && stores.map(store => {
                    const price = getPriceByProductAndStore(item.productId, store.id);
                    const isBestPrice = bestPrice.storeId === store.id;
                    
                    return (
                      <TableCell 
                        key={store.id}
                        className={isBestPrice ? 'font-medium text-secondary' : ''}
                      >
                        {price.toFixed(2)} €
                      </TableCell>
                    );
                  })}
                  
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium text-secondary">{bestPrice.storeName}</span>
                      <ChevronDown className="text-secondary ml-1 h-4 w-4" />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Prix total estimé</p>
          <div className="flex items-center space-x-4 mt-1">
            {stores.map(store => {
              const total = calculateTotalByStore(store.id);
              const isBestStore = bestStore?.storeId === store.id;
              
              return (
                <div key={store.id} className="flex items-center">
                  <span className="font-medium text-sm">{store.name}:</span>
                  <span className={`ml-1 text-sm ${isBestStore ? 'text-secondary font-bold' : ''}`}>
                    {total.toFixed(2)} €
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <Button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Liste complète
        </Button>
      </div>
    </div>
  );
};

export default ShoppingListTable;
