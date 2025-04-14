import { useState, useEffect } from "react";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingBag, TrendingDown } from "lucide-react";

interface ProductPriceComparison {
  id: number;
  name: string;
  category?: string;
  brand?: string;
  unit?: string;
  priceComparison: {
    storeId: number;
    storeName: string;
    price: number;
    promo: boolean;
    oldPrice?: number;
    difference?: number; // Différence en pourcentage avec le prix moyen
  }[];
  lowestPrice: {
    storeId: number;
    storeName: string;
    price: number;
  };
  averagePrice: number;
  priceVariation: number; // Écart entre le prix le plus bas et le plus élevé en pourcentage
}

const PriceComparisonWidget = () => {
  const { products, productPrices } = useProduct();
  const { stores } = useStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [priceComparisons, setPriceComparisons] = useState<ProductPriceComparison[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Calculer des comparaisons de prix pour tous les produits
  useEffect(() => {
    const comparisons = products.map(product => {
      // Récupérer tous les prix pour ce produit
      const prices = productPrices
        .filter(price => price.productId === product.id)
        .map(price => {
          const store = stores.find(s => s.id === price.storeId);
          return {
            storeId: price.storeId,
            storeName: store?.name || `Magasin ${price.storeId}`,
            price: price.price,
            promo: price.promo,
            oldPrice: price.oldPrice,
          };
        });
      
      // Calculer le prix moyen
      const totalPrice = prices.reduce((sum, item) => sum + item.price, 0);
      const averagePrice = prices.length > 0 ? totalPrice / prices.length : 0;
      
      // Identifier le prix le plus bas
      const lowestPrice = prices.reduce(
        (lowest, current) => (current.price < lowest.price ? current : lowest),
        { storeId: 0, storeName: "", price: Infinity }
      );
      
      // Calculer l'écart entre le prix le plus bas et le plus élevé
      const highestPrice = prices.reduce(
        (highest, current) => (current.price > highest.price ? current : highest),
        { storeId: 0, storeName: "", price: 0 }
      );
      
      const priceVariation = highestPrice.price > 0 
        ? parseFloat((((highestPrice.price - lowestPrice.price) / highestPrice.price) * 100).toFixed(1))
        : 0;
      
      // Ajouter la différence en pourcentage avec le prix moyen
      const priceComparisonWithDiff = prices.map(price => ({
        ...price,
        difference: averagePrice > 0 
          ? parseFloat((((price.price - averagePrice) / averagePrice) * 100).toFixed(1))
          : 0
      }));
      
      return {
        ...product,
        priceComparison: priceComparisonWithDiff,
        lowestPrice,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        priceVariation,
      };
    });
    
    setPriceComparisons(comparisons);
  }, [products, productPrices, stores]);
  
  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = priceComparisons
    .filter(product => 
      (searchTerm === "" || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(product => 
      selectedCategory === "all" || product.category === selectedCategory
    )
    .sort((a, b) => b.priceVariation - a.priceVariation); // Tri par variation de prix (décroissant)
  
  // Extraire toutes les catégories uniques
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean) as string[])];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          Comparaison détaillée des prix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </Button>
              )}
            </div>
            
            <Tabs 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
              className="w-full sm:w-auto"
            >
              <TabsList className="w-full">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category === "all" ? "Tous" : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="text-sm text-gray-500">
                        {product.brand && <span>{product.brand} • </span>}
                        {product.category && <span>{product.category}</span>}
                        {product.unit && <span> • {product.unit}</span>}
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        Prix moyen: {product.averagePrice.toFixed(2)} €
                      </Badge>
                      <Badge 
                        className={`${
                          product.priceVariation >= 20 ? 'bg-green-100 text-green-600' :
                          product.priceVariation >= 10 ? 'bg-amber-100 text-amber-600' :
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Écart: {product.priceVariation}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {product.priceComparison.map((comparison) => {
                      const isLowestPrice = comparison.storeId === product.lowestPrice.storeId;
                      return (
                        <div 
                          key={`${product.id}-${comparison.storeId}`}
                          className={`p-2 rounded-md border ${
                            isLowestPrice ? 'border-green-200 bg-green-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{comparison.storeName}</span>
                            {isLowestPrice && (
                              <Badge className="bg-green-100 text-green-600 text-xs">
                                Meilleur prix
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-1">
                            {comparison.promo && comparison.oldPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="line-through text-gray-500">
                                  {comparison.oldPrice.toFixed(2)} €
                                </span>
                                <span className="font-bold text-red-500">
                                  {comparison.price.toFixed(2)} €
                                </span>
                                <Badge variant="outline" className="bg-red-50 text-red-500 text-xs ml-auto">
                                  -{(((comparison.oldPrice - comparison.price) / comparison.oldPrice) * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className={isLowestPrice ? "font-bold" : ""}>
                                  {comparison.price.toFixed(2)} €
                                </span>
                                {comparison.difference !== undefined && (
                                  <Badge 
                                    variant="outline" 
                                    className={`ml-auto text-xs ${
                                      comparison.difference < 0 
                                        ? 'bg-green-50 text-green-600' 
                                        : comparison.difference > 0 
                                          ? 'bg-red-50 text-red-500' 
                                          : 'bg-gray-50 text-gray-500'
                                    }`}
                                  >
                                    {comparison.difference > 0 ? '+' : ''}
                                    {comparison.difference}%
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Search className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p className="text-lg font-medium">Aucun produit trouvé</p>
              <p className="text-sm">Essayez d'autres termes de recherche ou catégories</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceComparisonWidget;