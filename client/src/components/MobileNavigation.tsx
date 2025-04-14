import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Home, ListChecks, Search, Store, User } from "lucide-react";

const MobileNavigation = () => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/shopping-lists", label: "Listes", icon: ListChecks },
    { href: "/products", label: "Recherche", icon: Search },
    { href: "/stores", label: "Magasins", icon: Store },
    { href: "/settings", label: "Profil", icon: User },
  ];

  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex flex-col items-center p-3",
                location === item.href ? "text-primary" : "text-gray-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
