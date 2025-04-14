import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import ShoppingLists from "@/pages/ShoppingLists";
import Products from "@/pages/Products";
import Stores from "@/pages/Stores";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileNavigation from "./components/MobileNavigation";
import FloatingActionButton from "./components/FloatingActionButton";
import { ShoppingListProvider } from "./context/ShoppingListContext";
import { ProductProvider } from "./context/ProductContext";
import { StoreProvider } from "./context/StoreContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/shopping-lists" component={ShoppingLists} />
      <Route path="/products" component={Products} />
      <Route path="/stores" component={Stores} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ProductProvider>
          <ShoppingListProvider>
            <div className="h-screen flex flex-col">
              <Header />
              <main className="flex-1 overflow-y-auto">
                <div className="md:flex">
                  <Sidebar />
                  <div className="flex-1 px-4 py-6 md:px-8 mb-16 md:mb-0">
                    <Router />
                  </div>
                </div>
              </main>
              <MobileNavigation />
              <FloatingActionButton />
            </div>
            <Toaster />
          </ShoppingListProvider>
        </ProductProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
