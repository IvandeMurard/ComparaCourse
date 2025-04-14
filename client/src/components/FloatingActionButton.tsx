import { Plus } from "lucide-react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FloatingActionButton = () => {
  const [open, setOpen] = useState(false);
  const [listName, setListName] = useState("");
  const { createShoppingList } = useShoppingList();
  const { toast } = useToast();

  const handleCreateList = async () => {
    if (!listName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un nom pour la liste",
      });
      return;
    }

    await createShoppingList(listName);
    setListName("");
    setOpen(false);
    toast({
      title: "Liste créée",
      description: `La liste "${listName}" a été créée avec succès.`,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-20 right-4 md:bottom-8 z-10 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <Plus className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle liste de courses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Nom de la liste
              </label>
              <Input
                id="name"
                placeholder="Ex: Courses hebdomadaires"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateList} className="w-full">
              Créer la liste
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingActionButton;
