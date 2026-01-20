import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Science from "@/pages/Science";
import VehicleFitPage from "@/pages/VehicleFitPage";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Orders from "@/pages/Orders";
import InstallationGuides from "@/pages/InstallationGuides";
import WarrantyClaims from "@/pages/WarrantyClaims";
import Shipping from "@/pages/Shipping";
import TrackOrder from "@/pages/TrackOrder";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import AdminCategories from "@/pages/AdminCategories";
import AdminOrders from "@/pages/AdminOrders";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/science" component={Science} />
      <Route path="/vehicle-fit" component={VehicleFitPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/orders" component={Orders} />
      <Route path="/guides" component={InstallationGuides} />
      <Route path="/warranty" component={WarrantyClaims} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/track" component={TrackOrder} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
