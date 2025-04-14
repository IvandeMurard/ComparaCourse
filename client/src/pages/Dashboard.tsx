import { useState } from "react";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/ui/stats-card";
import ShoppingListTable from "@/components/ui/shopping-list-table";
import PriceAlertCard from "@/components/ui/price-alert-card";
import ProductCard from "@/components/ui/product-card";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { Search } from "lucide-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { shoppingLists } = useShoppingList();
  const { products, productPrices, favoriteProducts, priceAlerts } = useProduct();
  const { stores } = useStore();

  const activeShoppingList = shoppingLists.find(list => list.status === 'active');

  // Function to calculate total savings
  const calculateSavings = () => {
    // In a real implementation, this would calculate actual savings
    // For now, return a fixed value as shown in the design
    return "42,75 €";
  };

  // Function to find the best store (most savings)
  const findBestStore = () => {
    // This would calculate which store provides the most savings
    // For now, just return a fixed value as shown in the design
    return stores.length > 0 ? stores[0].name : "N/A";
  };

  // Get top favorite products for display
  const getTopFavoriteProducts = () => {
    // Sort by purchase count and take the top 3
    return favoriteProducts
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 3)
      .map(favorite => {
        const product = products.find(p => p.id === favorite.productId);
        if (!product) return null;

        const productPricesForStores = productPrices.filter(price => 
          price.productId === product.id
        );

        return {
          product,
          purchaseCount: favorite.purchaseCount,
          prices: productPricesForStores.map(price => ({
            storeId: price.storeId,
            price: price.price,
            promo: price.promo,
            oldPrice: price.oldPrice
          }))
        };
      })
      .filter(Boolean);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      
      {/* Mobile search bar (visible on small screens) */}
      <div className="mb-4 md:hidden relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un produit..."
          className="pl-10 pr-4 py-2 rounded-full bg-gray-100 w-full focus:bg-white transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard 
          title="Économies du mois" 
          value={calculateSavings()} 
          icon="savings" 
          variant="secondary" 
        />
        <StatsCard 
          title="Listes actives" 
          value={shoppingLists.filter(list => list.status === 'active').length} 
          icon="lists" 
          variant="primary" 
        />
        <StatsCard 
          title="Meilleur magasin" 
          value={findBestStore()} 
          icon="store" 
          variant="accent" 
        />
      </div>
      
      {/* Current shopping list */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Ma liste actuelle</h3>
          <div className="flex space-x-2">
            <button className="flex items-center text-primary px-3 py-1.5 rounded hover:bg-blue-50 text-sm">
              <span className="mr-1">+</span>
              Ajouter
            </button>
            <button className="text-primary px-3 py-1.5 rounded hover:bg-blue-50 text-sm">Voir tout</button>
          </div>
        </div>
        
        {activeShoppingList ? (
          <ShoppingListTable shoppingListId={activeShoppingList.id} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">Vous n'avez pas de liste active. Créez-en une pour commencer.</p>
          </div>
        )}
      </div>
      
      {/* Price alerts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Alertes prix</h3>
          <button className="text-primary px-3 py-1.5 rounded hover:bg-blue-50 text-sm">Voir tout</button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {priceAlerts.length > 0 ? (
              priceAlerts.slice(0, 2).map((alert) => (
                <PriceAlertCard 
                  key={alert.id}
                  id={alert.id}
                  productId={alert.productId}
                  storeId={alert.storeId}
                  oldPrice={alert.oldPrice}
                  newPrice={alert.newPrice}
                  alertType={alert.alertType as "increase" | "decrease"}
                  createdAt={new Date(alert.createdAt)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-4">
                <p className="text-gray-500">Aucune alerte prix pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Popular products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Produits populaires</h3>
          <button className="text-primary px-3 py-1.5 rounded hover:bg-blue-50 text-sm">Voir tout</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getTopFavoriteProducts().map((item, index) => (
            <ProductCard
              key={item.product.id}
              id={item.product.id}
              name={item.product.name}
              category={item.product.category}
              brand={item.product.brand}
              unit={item.product.unit}
              purchaseCount={item.purchaseCount}
              listCount={3} // Dummy value for now
              badge={index === 0 
                ? { text: "Tendance", variant: "default" } 
                : index === 1 
                  ? { text: "Promotion", variant: "secondary" } 
                  : { text: "Régulier", variant: "outline" }
              }
              prices={item.prices}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
