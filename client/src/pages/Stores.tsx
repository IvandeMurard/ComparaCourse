import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useProduct } from "@/context/ProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, ShoppingBag, Pencil, Store as StoreIcon } from "lucide-react";

const Stores = () => {
  const { stores, addStore, updateStore } = useStore();
  const { products, productPrices } = useProduct();
  const { toast } = useToast();
  
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreLocation, setNewStoreLocation] = useState("");
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>(stores[0]?.id.toString() || "");
  
  const handleCreateStore = async () => {
    if (!newStoreName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un nom pour le magasin",
      });
      return;
    }

    try {
      await addStore({
        name: newStoreName,
        location: newStoreLocation,
        logo: newStoreName.toLowerCase().replace(/\s+/g, ''),
      });
      setNewStoreName("");
      setNewStoreLocation("");
      setIsDialogOpen(false);
      toast({
        title: "Magasin ajouté",
        description: `Le magasin "${newStoreName}" a été ajouté avec succès`,
      });
    } catch (error) {
      console.error("Error creating store:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le magasin",
      });
    }
  };
  
  const handleEditStore = async (id: number, name: string, location: string) => {
    try {
      await updateStore(id, {
        name,
        location,
      });
      setSelectedStore(null);
      toast({
        title: "Magasin mis à jour",
        description: "Le magasin a été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating store:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le magasin",
      });
    }
  };

  // Get products with prices for a specific store
  const getProductsForStore = (storeId: number) => {
    const productsWithPrices = productPrices
      .filter(price => price.storeId === storeId)
      .map(price => {
        const product = products.find(p => p.id === price.productId);
        return {
          ...product,
          price: price.price,
          promo: price.promo,
          oldPrice: price.oldPrice,
        };
      })
      .filter(Boolean);
    
    if (searchTerm) {
      return productsWithPrices.filter(product => 
        product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return productsWithPrices;
  };

  const getLowestPriceStore = (productId: number) => {
    const prices = productPrices.filter(price => price.productId === productId);
    if (prices.length === 0) return null;
    
    const lowestPrice = prices.reduce((prev, current) => 
      prev.price < current.price ? prev : current
    );
    
    return lowestPrice.storeId;
  };

  const calculateStoreStats = (storeId: number) => {
    const storeProducts = getProductsForStore(storeId);
    const lowestPriceCount = storeProducts.filter(
      product => getLowestPriceStore(product?.id as number) === storeId
    ).length;
    
    const promoCount = storeProducts.filter(product => product?.promo).length;
    
    return {
      productCount: storeProducts.length,
      lowestPriceCount,
      promoCount,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Magasins</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Ajouter un magasin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau magasin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="storeName" className="text-sm font-medium leading-none">
                  Nom du magasin
                </label>
                <Input
                  id="storeName"
                  placeholder="Ex: Intermarché"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="storeLocation" className="text-sm font-medium leading-none">
                  Emplacement (optionnel)
                </label>
                <Input
                  id="storeLocation"
                  placeholder="Ex: Rue de la Paix, Paris"
                  value={newStoreLocation}
                  onChange={(e) => setNewStoreLocation(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateStore}>Ajouter le magasin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stores.map(store => {
          const stats = calculateStoreStats(store.id);
          return (
            <Card key={store.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${store.id === 1 ? 'bg-primary' : store.id === 2 ? 'bg-secondary' : 'bg-amber-500'}`}></div>
                    {store.name}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le magasin</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor={`editStoreName-${store.id}`} className="text-sm font-medium leading-none">
                            Nom du magasin
                          </label>
                          <Input
                            id={`editStoreName-${store.id}`}
                            defaultValue={store.name}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`editStoreLocation-${store.id}`} className="text-sm font-medium leading-none">
                            Emplacement
                          </label>
                          <Input
                            id={`editStoreLocation-${store.id}`}
                            defaultValue={store.location || ""}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          const nameInput = document.getElementById(`editStoreName-${store.id}`) as HTMLInputElement;
                          const locationInput = document.getElementById(`editStoreLocation-${store.id}`) as HTMLInputElement;
                          handleEditStore(store.id, nameInput.value, locationInput.value);
                        }}>
                          Enregistrer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                {store.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {store.location}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-lg">{stats.productCount}</span>
                    <span className="text-gray-500">produits</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-lg text-secondary">{stats.lowestPriceCount}</span>
                    <span className="text-gray-500">meilleurs prix</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-lg text-amber-500">{stats.promoCount}</span>
                    <span className="text-gray-500">promos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              {stores.map(store => (
                <TabsTrigger key={store.id} value={store.id.toString()}>
                  {store.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Rechercher un produit dans ce magasin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchTerm("")}
                  disabled={!searchTerm}
                >
                  {searchTerm ? "×" : ""}
                </Button>
              </div>
            </div>
            
            {stores.map(store => (
              <TabsContent key={store.id} value={store.id.toString()} className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <StoreIcon className="h-5 w-5" />
                      Produits chez {store.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Marque</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getProductsForStore(store.id).length > 0 ? (
                          getProductsForStore(store.id).map((product: any) => {
                            const isLowestPrice = getLowestPriceStore(product.id) === store.id;
                            return (
                              <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category || '—'}</TableCell>
                                <TableCell>{product.brand || '—'}</TableCell>
                                <TableCell>
                                  {product.promo && product.oldPrice ? (
                                    <div>
                                      <span className="line-through text-gray-500 mr-2">
                                        {product.oldPrice.toFixed(2)} €
                                      </span>
                                      <span className="font-bold text-secondary">
                                        {product.price.toFixed(2)} €
                                      </span>
                                    </div>
                                  ) : (
                                    <span className={isLowestPrice ? 'font-bold text-secondary' : ''}>
                                      {product.price.toFixed(2)} €
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {product.promo ? (
                                    <Badge className="bg-amber-100 text-amber-600">Promo</Badge>
                                  ) : isLowestPrice ? (
                                    <Badge className="bg-green-100 text-green-600">Meilleur prix</Badge>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                              Aucun produit trouvé
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Stores;
