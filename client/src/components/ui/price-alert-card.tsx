import { Card } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { useProduct } from "@/context/ProductContext";
import { Bell, AlertTriangle } from "lucide-react";

interface PriceAlertCardProps {
  id: number;
  productId: number;
  storeId: number;
  oldPrice: number;
  newPrice: number;
  alertType: "increase" | "decrease";
  createdAt: Date;
}

const PriceAlertCard = ({
  id,
  productId,
  storeId,
  oldPrice,
  newPrice,
  alertType,
  createdAt,
}: PriceAlertCardProps) => {
  const { stores } = useStore();
  const { products } = useProduct();

  const store = stores.find((s) => s.id === storeId);
  const product = products.find((p) => p.id === productId);

  const percentChange = Math.abs(((newPrice - oldPrice) / oldPrice) * 100).toFixed(0);
  
  if (!store || !product) return null;

  return (
    <div className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <div className={`${alertType === 'decrease' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'} p-2 rounded-lg mr-3`}>
          {alertType === 'decrease' ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-500">
            {alertType === 'decrease' 
              ? `Prix en baisse chez ${store.name}` 
              : `Prix en hausse chez ${store.name}`}
          </p>
        </div>
      </div>
      <div>
        <div className={`flex items-center font-medium ${alertType === 'decrease' ? 'text-secondary' : 'text-red-500'}`}>
          <span className="text-sm line-through mr-1">{oldPrice.toFixed(2)} €</span>
          <span>{newPrice.toFixed(2)} €</span>
        </div>
        <p className={`text-xs ${alertType === 'decrease' ? 'text-secondary' : 'text-red-500'}`}>
          {alertType === 'decrease' ? '-' : '+'}
          {percentChange}%
        </p>
      </div>
    </div>
  );
};

export default PriceAlertCard;
