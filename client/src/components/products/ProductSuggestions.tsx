import { useState, useEffect } from "react";
import { useProduct } from "@/context/ProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Plus, ShoppingBag, Tag, TrendingUp } from "lucide-react";

interface SuggestedProduct {
  id: number;
  name: string;
  category?: string;
  brand?: string;
  bestPrice: {
    price: number;
    storeName: string;
    storeId: number;
    promo: boolean;
  };
  matchScore: number; // Score de pertinence (0-100)
  reason: string; // Raison de la suggestion
}

const reasonTypes = {
  popular: "Très populaire",
  priceDrop: "Baisse de prix",
  promo: "En promotion",
  complement: "Complète votre panier",
  seasonal: "Produit de saison"
};

const ProductSuggestions = () => {
  const { products, productPrices, favoriteProducts, addFavoriteProduct } = useProduct();
  const { toast } = useToast();
  
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  
  // Générer des suggestions basées sur les comportements d'achat et les prix
  useEffect(() => {
    // Préparer les données
    const suggestions: SuggestedProduct[] = [];
    
    // 1. Suggestions basées sur les promotions
    products.forEach(product => {
      const productPricesData = productPrices.filter(price => price.productId === product.id);
      
      if (productPricesData.length === 0) return;
      
      // Trouver le meilleur prix pour ce produit
      const bestPrice = productPricesData.reduce((best, current) => 
        current.price < best.price ? current : best
      );
      
      const storeData = { storeId: bestPrice.storeId, storeName: `Magasin ${bestPrice.storeId}` };
      
      // Vérifier si le produit est en promotion
      if (bestPrice.promo) {
        const suggestionPromo: SuggestedProduct = {
          ...product,
          bestPrice: {
            price: bestPrice.price,
            storeName: storeData.storeName,
            storeId: storeData.storeId,
            promo: true
          },
          matchScore: 85,
          reason: reasonTypes.promo
        };
        suggestions.push(suggestionPromo);
      }
      
      // Vérifier les baisses de prix (pour cet exemple on utilise des données fictives)
      // Dans une app réelle, on comparerait avec un historique de prix
      if (product.id % 5 === 0) {
        const suggestionPriceDrop: SuggestedProduct = {
          ...product,
          bestPrice: {
            price: bestPrice.price,
            storeName: storeData.storeName,
            storeId: storeData.storeId,
            promo: bestPrice.promo
          },
          matchScore: 75,
          reason: reasonTypes.priceDrop
        };
        suggestions.push(suggestionPriceDrop);
      }
      
      // Produits populaires (basés sur le compteur d'achat)
      const isFavorite = favoriteProducts.some(fav => fav.productId === product.id);
      const purchaseCount = favoriteProducts.find(fav => fav.productId === product.id)?.purchaseCount || 0;
      
      if (purchaseCount > 2 || (product.id % 7 === 0 && !isFavorite)) {
        const suggestionPopular: SuggestedProduct = {
          ...product,
          bestPrice: {
            price: bestPrice.price,
            storeName: storeData.storeName,
            storeId: storeData.storeId,
            promo: bestPrice.promo
          },
          matchScore: 90,
          reason: reasonTypes.popular
        };
        suggestions.push(suggestionPopular);
      }
      
      // Produits complémentaires (exemple : pâtes -> sauce tomate)
      // Note: Dans une app réelle, ces relations seraient définies dans une base de données
      const complementaryProducts: Record<string, string[]> = {
        "Pâtes": ["Sauce tomate", "Fromage râpé"],
        "Pain": ["Beurre", "Confiture"],
        "Café": ["Lait", "Sucre"],
        "Viande": ["Légumes", "Épices"],
        "Riz": ["Sauce soja", "Légumes"]
      };
      
      if (favoriteProducts.length > 0) {
        // Chercher si ce produit complète un produit favori
        favoriteProducts.forEach(fav => {
          const favoriteProduct = products.find(p => p.id === fav.productId);
          if (favoriteProduct && favoriteProduct.name) {
            Object.entries(complementaryProducts).forEach(([mainProduct, complements]) => {
              if (favoriteProduct.name.includes(mainProduct) && complements.some(c => product.name.includes(c))) {
                const suggestionComplement: SuggestedProduct = {
                  ...product,
                  bestPrice: {
                    price: bestPrice.price,
                    storeName: storeData.storeName,
                    storeId: storeData.storeId,
                    promo: bestPrice.promo
                  },
                  matchScore: 80,
                  reason: reasonTypes.complement
                };
                suggestions.push(suggestionComplement);
              }
            });
          }
        });
      }
      
      // Produits saisonniers (exemple simple basé sur des mois)
      const currentMonth = new Date().getMonth();
      const seasonalCategories: Record<number, string[]> = {
        // Printemps (mars-mai)
        2: ["Fruits", "Légumes", "Fraises"],
        3: ["Fruits", "Légumes", "Asperges"],
        4: ["Fruits", "Légumes", "Cerises"],
        // Été (juin-août)
        5: ["Fruits", "Légumes", "Pastèque"],
        6: ["Fruits", "Légumes", "Pêches"],
        7: ["Fruits", "Légumes", "Tomates"],
        // Automne (sept-nov)
        8: ["Fruits", "Légumes", "Champignons"],
        9: ["Fruits", "Légumes", "Potiron"],
        10: ["Fruits", "Légumes", "Châtaignes"],
        // Hiver (déc-fév)
        11: ["Fruits", "Légumes", "Agrumes"],
        0: ["Fruits", "Légumes", "Endives"],
        1: ["Fruits", "Légumes", "Choux"]
      };
      
      const currentSeasonalItems = seasonalCategories[currentMonth] || [];
      
      if (product.category && currentSeasonalItems.includes(product.category) ||
          currentSeasonalItems.some(item => product.name.includes(item))) {
        const suggestionSeasonal: SuggestedProduct = {
          ...product,
          bestPrice: {
            price: bestPrice.price,
            storeName: storeData.storeName,
            storeId: storeData.storeId,
            promo: bestPrice.promo
          },
          matchScore: 70,
          reason: reasonTypes.seasonal
        };
        suggestions.push(suggestionSeasonal);
      }
    });
    
    // Dedupliquer et trier par score de correspondance
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.id === suggestion.id)
      )
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8); // Limiter à 8 suggestions
    
    setSuggestedProducts(uniqueSuggestions);
  }, [products, productPrices, favoriteProducts]);
  
  const handleAddToFavorites = async (productId: number) => {
    try {
      await addFavoriteProduct(productId);
      toast({
        title: "Produit ajouté aux favoris",
        description: "Le produit a été ajouté à vos favoris avec succès",
      });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit aux favoris",
      });
    }
  };
  
  // Obtenir les suggestions regroupées par raison
  const groupedSuggestions: Record<string, SuggestedProduct[]> = {};
  
  Object.values(reasonTypes).forEach(reason => {
    groupedSuggestions[reason] = suggestedProducts.filter(product => product.reason === reason);
  });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Suggestions personnalisées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedSuggestions).map(([reason, products]) => 
            products.length > 0 && (
              <div key={reason} className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  {reason === reasonTypes.promo && <Tag className="h-4 w-4 text-red-500" />}
                  {reason === reasonTypes.priceDrop && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {reason === reasonTypes.popular && <ShoppingBag className="h-4 w-4 text-blue-500" />}
                  {reason === reasonTypes.complement && <Plus className="h-4 w-4 text-purple-500" />}
                  {reason === reasonTypes.seasonal && <Lightbulb className="h-4 w-4 text-amber-500" />}
                  {reason}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {products.map(product => (
                    <div key={product.id} className="border rounded-md p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="text-sm text-gray-500">
                            {product.brand && <span>{product.brand}</span>}
                            {product.category && (
                              <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 ml-1">
                                {product.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge 
                          className={`${
                            product.matchScore >= 90 ? 'bg-green-100 text-green-600' :
                            product.matchScore >= 80 ? 'bg-blue-100 text-blue-600' :
                            product.matchScore >= 70 ? 'bg-amber-100 text-amber-600' :
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.matchScore}%
                        </Badge>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Meilleur prix:</span>
                          <span className="font-bold">
                            {product.bestPrice.price.toFixed(2)} €
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.bestPrice.storeName}
                          {product.bestPrice.promo && (
                            <Badge className="ml-1 bg-red-100 text-red-600 text-xs">
                              Promo
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => handleAddToFavorites(product.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter aux favoris
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
          
          {suggestedProducts.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium">Aucune suggestion disponible</p>
              <p className="text-sm">
                Ajoutez des produits à vos favoris pour obtenir des suggestions personnalisées
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSuggestions;