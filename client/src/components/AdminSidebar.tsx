import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Download, 
  LogOut,
  Home,
  FileText
} from "lucide-react";
import expelightLogo from "@assets/10241024_1769145107961.png";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Blog",
    url: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Advlust Import",
    url: "/admin/advlust",
    icon: Download,
  },
];

export function AdminSidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      window.location.href = "/admin/login";
    } catch (error) {
      window.location.href = "/admin/login";
    }
  };

  return (
    <Sidebar className="border-r border-zinc-800">
      <SidebarHeader className="border-b border-zinc-800 p-4">
        <Link href="/admin" className="flex items-center gap-2">
          <img 
            src={expelightLogo} 
            alt="Expelight Admin" 
            className="h-10 w-auto"
          />
          <span className="text-sm font-semibold text-zinc-400">Admin</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`admin-nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-800 p-4 space-y-2">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start" data-testid="button-view-site">
            <Home className="h-4 w-4 mr-2" />
            View Site
          </Button>
        </Link>
        <Button 
          variant="destructive" 
          className="w-full justify-start"
          onClick={handleLogout}
          data-testid="button-admin-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
