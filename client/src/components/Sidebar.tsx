import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Home, ListChecks, ShoppingBag, Store, BarChart2, Settings } from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/shopping-lists", label: "Mes listes", icon: ListChecks },
    { href: "/products", label: "Produits", icon: ShoppingBag },
    { href: "/stores", label: "Magasins", icon: Store },
    { href: "/statistics", label: "Statistiques", icon: BarChart2 },
    { href: "/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-full">
      <nav className="px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-2 py-2 rounded-lg transition-colors",
                    location === item.href
                      ? "text-primary bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
