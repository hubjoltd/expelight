import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  
  const { data: adminCheck, isLoading: checkLoading, error: checkError } = useQuery<{ isAdmin: boolean; role: string }>({
    queryKey: ["/api/admin/check"],
  });

  useEffect(() => {
    if (!checkLoading && (!adminCheck || !adminCheck.isAdmin || checkError)) {
      setLocation("/admin/login");
    }
  }, [adminCheck, checkLoading, checkError, setLocation]);

  if (checkLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Checking authorization...</div>
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center gap-4 h-14 px-4 border-b border-zinc-800 bg-zinc-900/50">
            <SidebarTrigger data-testid="button-admin-sidebar-toggle" />
            <span className="text-sm text-zinc-400">Admin Panel</span>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
