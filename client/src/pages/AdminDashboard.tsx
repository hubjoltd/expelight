import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, FolderTree, IndianRupee, ArrowRight, Download } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalCategories: number;
  totalRevenue: number;
}

function AdminDashboardContent() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-zinc-400">Loading dashboard...</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage your products, orders, and categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Products</CardTitle>
              <Package className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-zinc-500">{stats?.activeProducts || 0} active</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-zinc-500">{stats?.pendingOrders || 0} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Categories</CardTitle>
              <FolderTree className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalCategories || 0}</div>
              <p className="text-xs text-zinc-500">Hierarchical structure</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-zinc-500">All time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800 hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Package className="w-5 h-5 text-red-500" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 mb-4">
                Manage your product catalog, add new products, update pricing and variants.
              </p>
              <Link href="/admin/products">
                <Button className="w-full" data-testid="link-admin-products">
                  Manage Products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FolderTree className="w-5 h-5 text-red-500" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 mb-4">
                Organize products into hierarchical categories and subcategories.
              </p>
              <Link href="/admin/categories">
                <Button className="w-full" data-testid="link-admin-categories">
                  Manage Categories
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 mb-4">
                View and manage customer orders, update status and generate invoices.
              </p>
              <Link href="/admin/orders">
                <Button className="w-full" data-testid="link-admin-orders">
                  Manage Orders
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Download className="w-5 h-5 text-red-500" />
                Advlust Import
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 mb-4">
                Import products directly from Advlust.com with images and variants.
              </p>
              <Link href="/admin/advlust">
                <Button className="w-full" data-testid="link-admin-advlust">
                  Import Products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
}
