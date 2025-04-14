import { useState } from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="font-bold text-xl text-primary cursor-pointer">ComparaCourse</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:block relative">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white w-64 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className="h-8 w-8 bg-gray-200 text-gray-500">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
