import { Card } from "@/components/ui/card";
import { CircleDollarSign, CheckCircle, Store } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: "savings" | "lists" | "store";
  variant: "primary" | "secondary" | "accent";
}

const StatsCard = ({ title, value, icon, variant }: StatsCardProps) => {
  const getIconColor = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-100 text-primary";
      case "secondary":
        return "bg-green-100 text-green-600";
      case "accent":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-green-600";
      case "accent":
        return "text-amber-600";
      default:
        return "text-gray-900";
    }
  };

  const renderIcon = () => {
    const colorClass = getIconColor();
    
    switch (icon) {
      case "savings":
        return (
          <div className={`${colorClass} p-2 rounded-lg`}>
            <CircleDollarSign className="h-5 w-5" />
          </div>
        );
      case "lists":
        return (
          <div className={`${colorClass} p-2 rounded-lg`}>
            <CheckCircle className="h-5 w-5" />
          </div>
        );
      case "store":
        return (
          <div className={`${colorClass} p-2 rounded-lg`}>
            <Store className="h-5 w-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${getValueColor()}`}>{value}</p>
        </div>
        {renderIcon()}
      </div>
    </Card>
  );
};

export default StatsCard;
