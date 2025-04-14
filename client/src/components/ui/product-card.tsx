import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { Circle, ShoppingBasket, List } from "lucide-react";

interface ProductPrice {
  storeId: number;
  price: number;
  promo: boolean;
  oldPrice?: number;
}

interface ProductCardProps {
  id: number;
  name: string;
  category?: string;
  brand?: string;
  unit?: string;
  purchaseCount?: number;
  listCount?: number;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
  prices: ProductPrice[];
}

const ProductCard = ({
  id,
  name,
  category,
  brand,
  unit,
  purchaseCount = 0,
  listCount = 0,
  badge,
  prices,
}: ProductCardProps) => {
  const { stores } = useStore();

  const getBestPrice = () => {
    if (prices.length === 0) return null;
    return prices.reduce((best, current) => (current.price < best.price ? current : best));
  };

  const bestPrice = getBestPrice();
  const bestStoreId = bestPrice?.storeId;
  const bestStore = stores.find((store) => store.id === bestStoreId);

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium">{name}</h4>
          {badge && (
            <Badge variant={badge.variant} className={`text-xs px-2 py-1 rounded-full ${badge.variant === 'default' ? 'bg-blue-100 text-primary' : badge.variant === 'secondary' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
              {badge.text}
            </Badge>
          )}
        </div>
        <div className="flex space-x-3 mb-3">
          {purchaseCount > 0 && (
            <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
              <ShoppingBasket className="text-gray-500 h-3 w-3 mr-1" />
              {purchaseCount} achats
            </div>
          )}
          {listCount > 0 && (
            <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
              <List className="text-gray-500 h-3 w-3 mr-1" />
              {listCount} listes
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 pt-3 mt-2">
          {prices.map((price) => {
            const store = stores.find((s) => s.id === price.storeId);
            const isLowestPrice = bestStoreId === price.storeId;
            return (
              <div key={price.storeId} className="flex items-center justify-between mb-2">
                <span className="flex items-center">
                  <Circle className={`h-3 w-3 mr-2 fill-current ${price.storeId === 1 ? 'text-primary' : price.storeId === 2 ? 'text-secondary' : 'text-accent'}`} />
                  <span className="text-sm">{store?.name}</span>
                </span>
                <span className={`text-sm font-medium ${isLowestPrice ? 'text-secondary' : ''}`}>
                  {price.price.toFixed(2)} €
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">Meilleur prix</span>
        {bestStore && (
          <span className="font-medium text-secondary flex items-center">
            {bestStore.name}
            <svg className="h-5 w-5 text-secondary ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </span>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
