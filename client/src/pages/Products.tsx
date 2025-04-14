import { useState, useEffect } from "react";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ui/product-card";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, ShoppingCart, Filter, Heart } from "lucide-react";

const Products = () => {
  const { products, productPrices, favoriteProducts, searchProducts, addFavoriteProduct } = useProduct();
  const { stores } = useStore();
  const { shoppingLists, addItemToList } = useShoppingList();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [activeTab, setActiveTab] = useState("all");
  
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedList, setSelectedList] = useState<string>("");
  const [isAddToListDialogOpen, setIsAddToListDialogOpen] = useState(false);
  
  // Get unique categories
  const categories = ["all", ...new Set(products.filter(p => p.category).map(p => p.category as string))];

  // Get active shopping lists
  const activeLists = shoppingLists.filter(list => list.status === 'active');
  
  useEffect(() => {
    // On initial load, set search results to all products
    setSearchResults(products);
  }, [products]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setSearchResults(products);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchProducts(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rechercher les produits",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const filterByCategory = (products: any[]) => {
    if (selectedCategory === "all") return products;
    return products.filter(product => product.category === selectedCategory);
  };

  const filterByTab = (products: any[]) => {
    if (activeTab === "all") return products;
    if (activeTab === "favorites") {
      const favoriteProductIds = favoriteProducts.map(f => f.productId);
      return products.filter(product => favoriteProductIds.includes(product.id));
    }
    return products;
  };

  const sortProducts = (products: any[]) => {
    return [...products].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price-asc") {
        const aLowestPrice = Math.min(...productPrices.filter(price => price.productId === a.id).map(price => price.price));
        const bLowestPrice = Math.min(...productPrices.filter(price => price.productId === b.id).map(price => price.price));
        return aLowestPrice - bLowestPrice;
      } else if (sortBy === "price-desc") {
        const aLowestPrice = Math.min(...productPrices.filter(price => price.productId === a.id).map(price => price.price));
        const bLowestPrice = Math.min(...productPrices.filter(price => price.productId === b.id).map(price => price.price));
        return bLowestPrice - aLowestPrice;
      }
      return 0;
    });
  };

  const getProductPrices = (productId: number) => {
    return productPrices
      .filter(price => price.productId === productId)
      .map(price => ({
        storeId: price.storeId,
        price: price.price,
        promo: price.promo,
        oldPrice: price.oldPrice
      }));
  };

  const getProductPurchaseCount = (productId: number) => {
    const favorite = favoriteProducts.find(f => f.productId === productId);
    return favorite ? favorite.purchaseCount : 0;
  };

  const handleAddToList = async () => {
    if (!selectedProduct || !selectedList) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un produit et une liste",
      });
      return;
    }

    try {
      await addItemToList(parseInt(selectedList), selectedProduct);
      setIsAddToListDialogOpen(false);
      setSelectedProduct(null);
      setSelectedList("");
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à la liste avec succès",
      });
    } catch (error) {
      console.error("Error adding product to list:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit à la liste",
      });
    }
  };

  const handleAddToFavorites = async (productId: number) => {
    try {
      await addFavoriteProduct(productId);
      toast({
        title: "Produit ajouté aux favoris",
        description: "Le produit a été ajouté à vos favoris",
      });
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit aux favoris",
      });
    }
  };

  const displayedProducts = sortProducts(filterByTab(filterByCategory(searchResults)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Produits</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Recherche..." : "Rechercher"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex flex-col gap-4 w-full sm:w-64">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Filtres</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Catégorie</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "Toutes les catégories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Trier par</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Nom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nom</SelectItem>
                      <SelectItem value="price-asc">Prix croissant</SelectItem>
                      <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Magasins</h3>
              
              <div className="space-y-2">
                {stores.map(store => (
                  <div key={store.id} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${store.id === 1 ? 'bg-primary' : store.id === 2 ? 'bg-secondary' : 'bg-amber-500'}`}></div>
                    <span>{store.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-grow">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {displayedProducts.length} produits trouvés
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter size={16} className="mr-1" /> Filtres
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map(product => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        brand={product.brand}
                        unit={product.unit}
                        purchaseCount={getProductPurchaseCount(product.id)}
                        prices={getProductPrices(product.id)}
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog open={isAddToListDialogOpen && selectedProduct === product.id} onOpenChange={(open) => {
                          setIsAddToListDialogOpen(open);
                          if (open) setSelectedProduct(product.id);
                          else {
                            setSelectedProduct(null);
                            setSelectedList("");
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                              <ShoppingCart size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ajouter à une liste</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <label className="text-sm font-medium block mb-1">Choisir une liste</label>
                              <Select value={selectedList} onValueChange={setSelectedList}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une liste" />
                                </SelectTrigger>
                                <SelectContent>
                                  {activeLists.map(list => (
                                    <SelectItem key={list.id} value={list.id.toString()}>
                                      {list.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleAddToList} disabled={!selectedList}>Ajouter</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="rounded-full h-8 w-8"
                          onClick={() => handleAddToFavorites(product.id)}
                        >
                          <Heart size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">Aucun produit trouvé</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {displayedProducts.length} produits favoris
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map(product => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        brand={product.brand}
                        unit={product.unit}
                        purchaseCount={getProductPurchaseCount(product.id)}
                        prices={getProductPrices(product.id)}
                        badge={{ text: "Favori", variant: "default" }}
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog open={isAddToListDialogOpen && selectedProduct === product.id} onOpenChange={(open) => {
                          setIsAddToListDialogOpen(open);
                          if (open) setSelectedProduct(product.id);
                          else {
                            setSelectedProduct(null);
                            setSelectedList("");
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                              <ShoppingCart size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ajouter à une liste</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <label className="text-sm font-medium block mb-1">Choisir une liste</label>
                              <Select value={selectedList} onValueChange={setSelectedList}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une liste" />
                                </SelectTrigger>
                                <SelectContent>
                                  {activeLists.map(list => (
                                    <SelectItem key={list.id} value={list.id.toString()}>
                                      {list.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleAddToList} disabled={!selectedList}>Ajouter</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">Aucun produit favori</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Products;
