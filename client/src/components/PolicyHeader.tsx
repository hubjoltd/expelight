import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface PolicyHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function PolicyHeader({ title, breadcrumbs }: PolicyHeaderProps) {
  return (
    <div className="relative w-full bg-gradient-to-b from-zinc-900 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 pt-28 pb-12">
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-6" data-testid="breadcrumb">
          <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-zinc-300">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl md:text-5xl font-bold text-white">{title}</h1>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}
