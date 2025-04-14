import { useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { CircleDollarSign, ShoppingBag, TrendingUp, ListChecks } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Statistics = () => {
  const { products, productPrices, favoriteProducts } = useProduct();
  const { stores } = useStore();
  
  const [periodFilter, setPeriodFilter] = useState("month");

  // Calculate savings per store 
  const calculateSavingsPerStore = () => {
    return stores.map(store => {
      // In a real app, this would calculate based on actual purchase data
      // For this MVP, we'll just use some dummy data based on store ID
      const savings = store.id === 1 ? 42.75 : store.id === 2 ? 38.50 : 25.30;
      return {
        name: store.name,
        savings,
      };
    });
  };

  // Calculate product categories distribution
  const calculateCategoryDistribution = () => {
    const categories: Record<string, number> = {};
    
    products.forEach(product => {
      if (product.category) {
        categories[product.category] = (categories[product.category] || 0) + 1;
      }
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Get top purchased products
  const getTopPurchasedProducts = () => {
    return favoriteProducts
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 5)
      .map(favorite => {
        const product = products.find(p => p.id === favorite.productId);
        return {
          name: product?.name || `Produit ${favorite.productId}`,
          count: favorite.purchaseCount,
        };
      });
  };

  // Calculate price evolution (mock data for MVP)
  const getPriceEvolution = () => {
    // This would use real historical price data in a production app
    const mockMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = [];
    
    for (let i = 0; i < 12; i++) {
      const base = 100 + Math.sin(i * 0.5) * 20;
      data.push({
        name: mockMonths[i],
        Carrefour: (base * (1 + Math.random() * 0.1)).toFixed(2),
        'E.Leclerc': (base * (0.95 + Math.random() * 0.1)).toFixed(2),
        Auchan: (base * (1.05 + Math.random() * 0.1)).toFixed(2),
      });
    }
    
    return data;
  };

  // Calculate monthly savings (mock data for MVP)
  const getMonthlySavings = () => {
    const mockMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = [];
    
    let previousValue = 25;
    for (let i = 0; i < 12; i++) {
      const randomChange = Math.random() * 15 - 5;
      const value = Math.max(10, previousValue + randomChange);
      previousValue = value;
      
      data.push({
        name: mockMonths[i],
        savings: value.toFixed(2),
      });
    }
    
    return data;
  };

  const calculateTotalSavings = () => {
    // In a real app, this would sum up all actual savings
    return "285,45 €";
  };

  const calculateFavoriteStore = () => {
    // Find store with most products that have the lowest price
    const storeLowestPriceCounts: Record<number, number> = {};
    
    productPrices.forEach(price => {
      const productPrices = productPrices.filter(p => p.productId === price.productId);
      const lowestPrice = Math.min(...productPrices.map(p => p.price));
      
      if (price.price === lowestPrice) {
        storeLowestPriceCounts[price.storeId] = (storeLowestPriceCounts[price.storeId] || 0) + 1;
      }
    });
    
    let maxCount = 0;
    let favoriteStoreId = 0;
    
    Object.entries(storeLowestPriceCounts).forEach(([storeId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteStoreId = parseInt(storeId);
      }
    });
    
    const favoriteStore = stores.find(store => store.id === favoriteStoreId);
    return favoriteStore?.name || "N/A";
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Statistiques</h2>
        
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Économies totales</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{calculateTotalSavings()}</div>
            <p className="text-xs text-gray-500">
              +15% par rapport à la période précédente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits suivis</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-gray-500">
              {favoriteProducts.length} produits favoris
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Magasin préféré</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{calculateFavoriteStore()}</div>
            <p className="text-xs text-gray-500">
              Basé sur les meilleurs prix
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes de prix</CardTitle>
            <ListChecks className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">
              1 baisse et 1 hausse de prix
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="stores">Magasins</TabsTrigger>
          <TabsTrigger value="savings">Économies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Économies par magasin</CardTitle>
                <CardDescription>
                  Comparaison des économies réalisées dans chaque magasin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={calculateSavingsPerStore()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} €`, "Économies"]}
                        labelFormatter={(label) => `Magasin: ${label}`}
                      />
                      <Bar dataKey="savings" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
                <CardDescription>
                  Distribution des produits par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculateCategoryDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {calculateCategoryDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} produits`, "Quantité"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Évolution des économies</CardTitle>
              <CardDescription>
                Économies réalisées au cours des derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getMonthlySavings()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, "Économies"]} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" stroke="#10B981" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produits les plus achetés</CardTitle>
              <CardDescription>
                Classement des produits par nombre d'achats
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getTopPurchasedProducts()}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip formatter={(value) => [`${value} achats`, "Nombre d'achats"]} />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution des catégories</CardTitle>
              <CardDescription>
                Répartition des produits par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculateCategoryDistribution()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {calculateCategoryDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} produits`, "Quantité"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison des prix par magasin</CardTitle>
              <CardDescription>
                Évolution des prix dans les différents magasins
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getPriceEvolution()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, "Prix moyen"]} />
                    <Legend />
                    <Line type="monotone" dataKey="Carrefour" stroke="#3B82F6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="E.Leclerc" stroke="#10B981" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Auchan" stroke="#F59E0B" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Économies par magasin</CardTitle>
              <CardDescription>
                Comparaison des économies réalisées dans chaque magasin
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={calculateSavingsPerStore()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, "Économies"]} />
                    <Bar dataKey="savings" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des économies</CardTitle>
              <CardDescription>
                Économies réalisées au cours des derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getMonthlySavings()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, "Économies"]} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" stroke="#10B981" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Économies cumulées</CardTitle>
              <CardDescription>
                Total des économies réalisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-secondary mb-2">{calculateTotalSavings()}</div>
                  <p className="text-gray-500">Économies totales réalisées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
