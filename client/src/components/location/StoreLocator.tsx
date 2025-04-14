import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation, Store as StoreIcon, MapIcon, Compass } from "lucide-react";

interface GeoLocation {
  latitude: number;
  longitude: number;
}

interface StoreWithDistance {
  id: number;
  name: string;
  location?: string;
  logo?: string;
  distance: number;
}

// Fonction pour calculer la distance entre deux points (en km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Coordonnées géographiques fictives pour les magasins
const storeCoordinates: Record<string, GeoLocation> = {
  "Carrefour": { latitude: 48.856614, longitude: 2.3522219 },
  "E.Leclerc": { latitude: 48.860611, longitude: 2.337644 },
  "Auchan": { latitude: 48.851905, longitude: 2.343971 },
  "Super U": { latitude: 48.865992, longitude: 2.322787 },
  "Intermarché": { latitude: 48.842007, longitude: 2.361922 },
};

const StoreLocator = () => {
  const { stores } = useStore();
  const { toast } = useToast();
  
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [storesWithDistance, setStoresWithDistance] = useState<StoreWithDistance[]>([]);
  
  const handleLocateMe = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setIsLocating(false);
          
          toast({
            title: "Localisation réussie",
            description: "Votre position a été déterminée avec succès",
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setIsLocating(false);
          
          // Coordonnées par défaut (Paris)
          setUserLocation({ latitude: 48.856614, longitude: 2.3522219 });
          
          toast({
            variant: "destructive",
            title: "Erreur de localisation",
            description: "Impossible d'accéder à votre position. Utilisation d'une position par défaut.",
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        variant: "destructive",
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne prend pas en charge la géolocalisation",
      });
    }
  };
  
  // Calcul des distances pour chaque magasin
  useEffect(() => {
    if (userLocation) {
      const storesWithDistanceCalc = stores.map(store => {
        const storeCoord = storeCoordinates[store.name] || { latitude: 48.856614, longitude: 2.3522219 };
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude, 
          storeCoord.latitude, 
          storeCoord.longitude
        );
        
        return {
          ...store,
          distance: parseFloat(distance.toFixed(1)),
        };
      });
      
      setStoresWithDistance(storesWithDistanceCalc.sort((a, b) => a.distance - b.distance));
    }
  }, [userLocation, stores]);
  
  // Filtrer les magasins en fonction de la distance maximale
  const filteredStores = storesWithDistance.filter(store => store.distance <= maxDistance);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-primary" />
            <span>Magasins à proximité</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLocateMe}
            disabled={isLocating}
          >
            <Navigation className="h-4 w-4" />
            {isLocating ? "Localisation..." : "Me localiser"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!userLocation ? (
          <div className="text-center py-6">
            <Compass className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-1">Localisez-vous</h3>
            <p className="text-sm text-gray-500 mb-4">
              Pour voir les magasins à proximité, veuillez cliquer sur le bouton "Me localiser"
            </p>
            <Button onClick={handleLocateMe} disabled={isLocating}>
              {isLocating ? "Localisation..." : "Me localiser"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Distance maximale: {maxDistance} km</span>
                <span className="text-xs text-gray-500">
                  {filteredStores.length} magasin(s) trouvé(s)
                </span>
              </div>
              <Slider
                value={[maxDistance]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setMaxDistance(value[0])}
              />
            </div>
            
            <div className="space-y-3 mt-4">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <div 
                    key={store.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        store.id === 1 ? 'bg-blue-100 text-blue-600' : 
                        store.id === 2 ? 'bg-green-100 text-green-600' : 
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <StoreIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{store.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {store.location}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {store.distance} km
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Aucun magasin trouvé dans un rayon de {maxDistance} km</p>
                  <p className="text-sm">Essayez d'augmenter la distance</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreLocator;