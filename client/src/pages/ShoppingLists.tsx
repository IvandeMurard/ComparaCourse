import { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useProduct } from "@/context/ProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShoppingListTable from "@/components/ui/shopping-list-table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, Edit, Plus, Trash } from "lucide-react";

const ShoppingLists = () => {
  const { shoppingLists, shoppingListItems, createShoppingList, deleteShoppingList, updateShoppingList, addItemToList } = useShoppingList();
  const { products, searchProducts } = useProduct();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("active");
  const [newListName, setNewListName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<number | null>(null);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) return;
    
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
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast({
        variant: "destructive", 
        title: "Erreur", 
        description: "Veuillez entrer un nom pour la liste"
      });
      return;
    }

    try {
      await createShoppingList(newListName);
      setNewListName("");
      setIsCreateListDialogOpen(false);
      toast({
        title: "Liste créée",
        description: `La liste "${newListName}" a été créée avec succès`,
      });
    } catch (error) {
      console.error("Error creating list:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la liste",
      });
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      await deleteShoppingList(listId);
      toast({
        title: "Liste supprimée",
        description: "La liste a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la liste",
      });
    }
  };

  const handleAddItemToList = async () => {
    if (!selectedList || !selectedProduct) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une liste et un produit",
      });
      return;
    }

    try {
      await addItemToList(selectedList, selectedProduct, productQuantity);
      setIsAddItemDialogOpen(false);
      setSelectedProduct(null);
      setProductQuantity(1);
      setSearchTerm("");
      setSearchResults([]);
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à la liste avec succès",
      });
    } catch (error) {
      console.error("Error adding item to list:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit à la liste",
      });
    }
  };

  const handleUpdateListStatus = async (listId: number, status: string) => {
    try {
      await updateShoppingList(listId, { status });
      toast({
        title: "Liste mise à jour",
        description: "Le statut de la liste a été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating list status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la liste",
      });
    }
  };

  const activeLists = shoppingLists.filter(list => list.status === 'active');
  const completedLists = shoppingLists.filter(list => list.status === 'completed');

  const getListItemCount = (listId: number) => {
    return shoppingListItems.filter(item => item.shoppingListId === listId).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes listes de courses</h2>
        
        <Dialog open={isCreateListDialogOpen} onOpenChange={setIsCreateListDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nouvelle liste
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle liste</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="listName" className="text-sm font-medium leading-none">
                  Nom de la liste
                </label>
                <Input
                  id="listName"
                  placeholder="Ex: Courses hebdomadaires"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateList}>Créer la liste</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">Listes actives ({activeLists.length})</TabsTrigger>
          <TabsTrigger value="completed">Listes terminées ({completedLists.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeLists.length > 0 ? (
            activeLists.map(list => (
              <Card key={list.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {list.name}
                      <Badge className="bg-blue-100 text-primary">En cours</Badge>
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Créée le {formatDate(list.createdAt.toString())}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isAddItemDialogOpen && selectedList === list.id} onOpenChange={(open) => {
                      setIsAddItemDialogOpen(open);
                      if (open) setSelectedList(list.id);
                      else {
                        setSelectedList(null);
                        setSearchTerm("");
                        setSearchResults([]);
                        setSelectedProduct(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Plus size={16} className="mr-1" /> Ajouter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajouter un produit à la liste</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Rechercher un produit..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button onClick={handleSearch} type="button">Rechercher</Button>
                          </div>
                          
                          {searchResults.length > 0 && (
                            <div className="max-h-48 overflow-y-auto border rounded-md">
                              {searchResults.map(product => (
                                <div
                                  key={product.id}
                                  className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedProduct === product.id ? 'bg-blue-50' : ''}`}
                                  onClick={() => setSelectedProduct(product.id)}
                                >
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.brand}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {selectedProduct && (
                            <div className="space-y-2">
                              <label htmlFor="quantity" className="text-sm font-medium">
                                Quantité
                              </label>
                              <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddItemToList} disabled={!selectedProduct}>
                            Ajouter à la liste
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleUpdateListStatus(list.id, 'completed')}
                    >
                      <CheckCircle size={16} className="mr-1" /> Terminer
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <ShoppingListTable shoppingListId={list.id} />
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <p className="text-gray-500 mb-4">Vous n'avez aucune liste active</p>
                <Button onClick={() => setIsCreateListDialogOpen(true)}>
                  <Plus size={16} className="mr-1" /> Créer une liste
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedLists.length > 0 ? (
            completedLists.map(list => (
              <Card key={list.id}>
                <CardHeader className="flex flex-row items-start justify-between p-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {list.name}
                      <Badge className="bg-green-100 text-green-600">Terminée</Badge>
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Complétée le {formatDate(list.updatedAt.toString())}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {getListItemCount(list.id)} produits
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleUpdateListStatus(list.id, 'active')}
                    >
                      <Edit size={16} className="mr-1" /> Réactiver
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <p className="text-gray-500">Vous n'avez aucune liste terminée</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShoppingLists;
