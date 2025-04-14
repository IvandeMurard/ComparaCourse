import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Settings as SettingsIcon, Bell, ShieldCheck, Smartphone, Database, Sun, Moon } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  
  const [username, setUsername] = useState("user");
  const [email, setEmail] = useState("");
  const [maxDistance, setMaxDistance] = useState("10");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    promoAlerts: true,
    listReminders: false,
    email: false,
  });
  
  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Préférences mises à jour",
      description: "Vos préférences ont été enregistrées avec succès",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications mises à jour",
      description: "Vos préférences de notifications ont été enregistrées",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportation des données",
      description: "Vos données ont été exportées avec succès",
    });
  };

  const handleDeleteData = () => {
    toast({
      variant: "destructive",
      title: "Attention",
      description: "Cette fonctionnalité n'est pas encore disponible",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Paramètres</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Confidentialité
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  L'email est utilisé pour les notifications et la récupération de compte
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value="********" disabled />
                <Button variant="link" className="p-0 h-auto">
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences générales</CardTitle>
              <CardDescription>
                Personnalisez l'affichage et l'utilisation de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Choisir un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>Clair</span>
                    </SelectItem>
                    <SelectItem value="dark" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>Sombre</span>
                    </SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Le thème sera appliqué à toute l'application
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distance">Distance maximale des magasins (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  min="1"
                  max="50"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Limite la recherche aux magasins situés à moins de cette distance
                </p>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Mode hors ligne</h4>
                  <p className="text-sm text-gray-500">
                    Stocke les données pour une utilisation sans connexion
                  </p>
                </div>
                <Switch id="offline-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Gérez les notifications que vous recevez
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Alertes de baisse de prix</h4>
                  <p className="text-sm text-gray-500">
                    Recevez des notifications lorsque le prix d'un produit diminue
                  </p>
                </div>
                <Switch 
                  id="price-alerts" 
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, priceAlerts: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Alertes de promotions</h4>
                  <p className="text-sm text-gray-500">
                    Recevez des notifications pour les promotions sur vos produits favoris
                  </p>
                </div>
                <Switch 
                  id="promo-alerts" 
                  checked={notifications.promoAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, promoAlerts: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Rappels de liste de courses</h4>
                  <p className="text-sm text-gray-500">
                    Recevez des rappels pour vos listes de courses non complétées
                  </p>
                </div>
                <Switch 
                  id="list-reminders" 
                  checked={notifications.listReminders}
                  onCheckedChange={(checked) => setNotifications({...notifications, listReminders: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Notifications par email</h4>
                  <p className="text-sm text-gray-500">
                    Recevez également les notifications par email
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>
                Gérez vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Localisation</h4>
                  <p className="text-sm text-gray-500">
                    Autoriser l'accès à votre localisation pour trouver les magasins à proximité
                  </p>
                </div>
                <Switch id="location" />
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium">Exportation de données</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Téléchargez une copie de vos données (listes, produits favoris, etc.)
                </p>
                <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Exporter mes données
                </Button>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium">Suppression de compte</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Supprimer votre compte et toutes vos données de manière permanente
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteData}
                  className="flex items-center gap-2"
                >
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
