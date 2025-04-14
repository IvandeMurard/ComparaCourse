import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@shared/schema';
import { ShoppingBag, TrendingUp, Star, History, Clock, Lightbulb } from 'lucide-react';

interface RecommendedProduct extends Product {
  score: number;
  reason: string;
}

export default function ProductRecommendations() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/recommendations'],
    // En production, on appellerait l'API de recommandations
    queryFn: async () => {
      // Simulons les recommandations pour la démo
      return [
        {
          id: 1,
          name: 'Lait demi-écrémé 1L',
          category: 'Produits Laitiers',
          brand: 'Lactel',
          score: 0.95,
          reason: 'achat-frequent',
          unit: 'L',
          description: 'Lait demi-écrémé UHT',
        },
        {
          id: 3,
          name: 'Pain de mie complet',
          category: 'Boulangerie',
          brand: 'Jacquet',
          score: 0.85,
          reason: 'promotion',
          unit: 'g',
          description: 'Pain de mie complet en tranches',
        },
        {
          id: 4,
          name: 'Yaourt nature x4',
          category: 'Produits Laitiers',
          brand: 'Danone',
          score: 0.82,
          reason: 'souvent-ensemble',
          unit: 'pcs',
          description: 'Lot de 4 yaourts nature',
        },
        {
          id: 2,
          name: 'Œufs frais x6',
          category: 'Produits Frais',
          brand: 'Fermiers de France',
          score: 0.78,
          reason: 'saisonnier',
          unit: 'pcs',
          description: 'Œufs frais de poules élevées en plein air',
        },
      ] as RecommendedProduct[];
    },
  });

  const reasonIcons = useMemo(() => ({
    'achat-frequent': <History className="h-4 w-4 mr-1" />,
    'promotion': <TrendingUp className="h-4 w-4 mr-1" />,
    'souvent-ensemble': <ShoppingBag className="h-4 w-4 mr-1" />,
    'saisonnier': <Clock className="h-4 w-4 mr-1" />,
    'nouveau': <Star className="h-4 w-4 mr-1" />,
    'default': <Lightbulb className="h-4 w-4 mr-1" />,
  }), []);

  const reasonLabels = useMemo(() => ({
    'achat-frequent': 'Achat fréquent',
    'promotion': 'En promotion',
    'souvent-ensemble': 'Souvent achetés ensemble',
    'saisonnier': 'Produit de saison',
    'nouveau': 'Nouveau produit',
    'default': 'Recommandé pour vous',
  }), []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recommandations personnalisées</CardTitle>
          <CardDescription>Chargement des recommandations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recommandations personnalisées</CardTitle>
          <CardDescription>Une erreur est survenue lors du chargement des recommandations.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recommandations personnalisées</CardTitle>
        <CardDescription>Basées sur votre historique d'achats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((product) => (
            <div key={product.id} className="flex items-start space-x-4">
              <div className="bg-muted h-12 w-12 rounded-md flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">{product.brand}</div>
                <Badge variant="outline" className="flex items-center mt-1">
                  {reasonIcons[product.reason as keyof typeof reasonIcons] || reasonIcons.default}
                  {reasonLabels[product.reason as keyof typeof reasonLabels] || reasonLabels.default}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}