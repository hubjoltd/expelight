import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, ShoppingBag, User, LogOut, Shield, ChevronDown, ChevronRight, Grid3X3, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import expelightLogo from "@assets/Copy_of_Expelight_logo_1769590561985.png";
import type { Category, Product } from "@shared/schema";

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [expandedMobileSubcategory, setExpandedMobileSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Build hierarchical category structure with 3 levels
  const parentCategories = categories.filter(c => c.level === 0);
  const categoriesWithChildren: CategoryWithChildren[] = parentCategories.map(parent => {
    const children = categories.filter(c => c.parentId === parent.id);
    return {
      ...parent,
      children: children.map(child => ({
        ...child,
        children: categories.filter(c => c.parentId === child.id)
      }))
    };
  });

  // Get Off-Road category with full hierarchy for mega menu
  const offRoadCategory = categoriesWithChildren.find(c => c.slug === 'off-road');
  const lampsCategory = categoriesWithChildren.find(c => c.slug === 'lamps');
  const extrasCategory = categoriesWithChildren.find(c => c.slug === 'extras');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.shortDescription?.toLowerCase().includes(query)
    );
  }).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/science", label: "Science of Light" },
    { href: "/vehicle-fit", label: "Fit Your Vehicle" },
  ];

  const getInitials = (firstName?: string | null, lastName?: string | null, username?: string) => {
    if (firstName || lastName) {
      const f = firstName?.charAt(0) || '';
      const l = lastName?.charAt(0) || '';
      return (f + l).toUpperCase() || 'U';
    }
    return username?.charAt(0).toUpperCase() || 'U';
  };

  const featuredProducts = products.slice(0, 3);


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050505]/95 backdrop-blur-md border-b border-zinc-800/30"
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center" data-testid="logo-link">
            <img 
              src={expelightLogo} 
              alt="Expelight" 
              className="h-auto w-auto"
              style={{ height: '180px' }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-primary"
                    : "text-zinc-400 hover:text-white"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  location.startsWith("/product")
                    ? "text-primary"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsMegaMenuOpen(!isMegaMenuOpen);
                  }
                  if (e.key === "Escape") {
                    setIsMegaMenuOpen(false);
                  }
                }}
                onFocus={() => setIsMegaMenuOpen(true)}
                aria-expanded={isMegaMenuOpen}
                aria-haspopup="menu"
                data-testid="nav-link-products"
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isMegaMenuOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                  style={{ minWidth: "1000px" }}
                >
                  <div className="bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Shop by Category</h3>
                        <Link
                          href="/products"
                          className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          <Grid3X3 className="w-3 h-3" />
                          View All Products
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6">
                        {/* Off-Road Column */}
                        {offRoadCategory && (
                          <div className="col-span-2">
                            <Link
                              href={`/category/${offRoadCategory.slug}`}
                              className="text-sm font-semibold text-white hover:text-primary transition-colors mb-3 block"
                              onClick={() => setIsMegaMenuOpen(false)}
                            >
                              {offRoadCategory.name}
                            </Link>
                            <div className="grid grid-cols-2 gap-4">
                              {offRoadCategory.children?.map((subcat) => (
                                <div key={subcat.id} className="space-y-2">
                                  <Link
                                    href={`/category/${subcat.slug}`}
                                    className="text-xs font-medium text-zinc-300 hover:text-primary transition-colors flex items-center gap-1"
                                    onClick={() => setIsMegaMenuOpen(false)}
                                  >
                                    <ChevronRight className="w-3 h-3" />
                                    {subcat.name}
                                  </Link>
                                  {subcat.children && subcat.children.length > 0 && (
                                    <div className="pl-4 space-y-1">
                                      {subcat.children.slice(0, 5).map((child) => (
                                        <Link
                                          key={child.id}
                                          href={`/category/${child.slug}`}
                                          className="block text-xs text-zinc-500 hover:text-white transition-colors"
                                          onClick={() => setIsMegaMenuOpen(false)}
                                        >
                                          {child.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Lamps Column */}
                        {lampsCategory && (
                          <div>
                            <Link
                              href={`/category/${lampsCategory.slug}`}
                              className="text-sm font-semibold text-white hover:text-primary transition-colors mb-3 block"
                              onClick={() => setIsMegaMenuOpen(false)}
                            >
                              {lampsCategory.name}
                            </Link>
                            <div className="space-y-2">
                              {lampsCategory.children?.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/category/${subcat.slug}`}
                                  className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 py-1"
                                  onClick={() => setIsMegaMenuOpen(false)}
                                >
                                  <ChevronRight className="w-3 h-3" />
                                  {subcat.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Extras Column */}
                        {extrasCategory && (
                          <div>
                            <Link
                              href={`/category/${extrasCategory.slug}`}
                              className="text-sm font-semibold text-white hover:text-primary transition-colors mb-3 block"
                              onClick={() => setIsMegaMenuOpen(false)}
                            >
                              {extrasCategory.name}
                            </Link>
                            <div className="space-y-2">
                              {extrasCategory.children?.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/category/${subcat.slug}`}
                                  className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 py-1"
                                  onClick={() => setIsMegaMenuOpen(false)}
                                >
                                  <ChevronRight className="w-3 h-3" />
                                  {subcat.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-48 lg:w-64 pl-9 h-9 bg-zinc-900 border-zinc-800 text-sm placeholder:text-zinc-500 focus:border-zinc-700"
                  data-testid="input-search"
                />
              </form>
              
              {showSearchResults && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}
                      data-testid={`search-result-${product.id}`}
                    >
                      <div className="w-10 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-primary/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-zinc-500">SKU: {product.sku}</p>
                        )}
                      </div>
                      <p className="text-sm text-primary font-medium">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </Link>
                  ))}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    className="block p-3 text-center text-sm text-primary hover:bg-zinc-800 border-t border-zinc-800"
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                    data-testid="search-view-all"
                  >
                    View all results
                  </Link>
                </div>
              )}
              
              {showSearchResults && searchQuery && filteredProducts.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-4 text-center z-50">
                  <p className="text-sm text-zinc-400">No products found</p>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              data-testid="mobile-search-toggle"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-zinc-400 hover:text-white"
                data-testid="cart-button"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs">
                        {getInitials(user.firstName, user.lastName, user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-foreground">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer" data-testid="admin-link">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="cursor-pointer text-red-500"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  data-testid="login-button"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-zinc-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden bg-[#050505]/98 backdrop-blur-lg border-t border-zinc-800/30 p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 bg-zinc-900 border-zinc-800 text-sm placeholder:text-zinc-500"
              data-testid="input-mobile-search"
              autoFocus
            />
          </form>
          {searchQuery && filteredProducts.length > 0 && (
            <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{product.name}</p>
                    {product.sku && (
                      <p className="text-xs text-zinc-500">SKU: {product.sku}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-[#050505]/98 backdrop-blur-lg border-t border-zinc-800/30 max-h-[80vh] overflow-y-auto"
          data-testid="mobile-menu"
        >
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <h4 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Categories</h4>
              {categoriesWithChildren.map((parent) => (
                <div key={parent.id}>
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md"
                    onClick={() => setExpandedMobileCategory(
                      expandedMobileCategory === parent.id ? null : parent.id
                    )}
                  >
                    <span>{parent.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      expandedMobileCategory === parent.id ? "rotate-180" : ""
                    }`} />
                  </button>
                  {expandedMobileCategory === parent.id && parent.children && (
                    <div className="ml-4 border-l border-zinc-800">
                      <Link
                        href={`/category/${parent.slug}`}
                        className="block px-4 py-2 text-xs text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        View All {parent.name}
                      </Link>
                      {parent.children.map((child) => (
                        <div key={child.id}>
                          {child.children && child.children.length > 0 ? (
                            <>
                              <button
                                className="flex items-center justify-between w-full px-4 py-2 text-xs text-zinc-300 hover:text-white font-medium"
                                onClick={() => setExpandedMobileSubcategory(
                                  expandedMobileSubcategory === child.id ? null : child.id
                                )}
                              >
                                <span className="flex items-center gap-1">
                                  <ChevronRight className={`w-3 h-3 transition-transform ${
                                    expandedMobileSubcategory === child.id ? "rotate-90" : ""
                                  }`} />
                                  {child.name}
                                </span>
                                <span className="text-zinc-600 text-[10px]">{child.children.length}</span>
                              </button>
                              {expandedMobileSubcategory === child.id && (
                                <div className="ml-4 border-l border-zinc-800">
                                  <Link
                                    href={`/category/${child.slug}`}
                                    className="block px-4 py-1.5 text-xs text-primary"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    View All {child.name}
                                  </Link>
                                  {child.children.map((subChild) => (
                                    <Link
                                      key={subChild.id}
                                      href={`/category/${subChild.slug}`}
                                      className="block px-4 py-1.5 text-xs text-zinc-500 hover:text-white"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subChild.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={`/category/${child.slug}`}
                              className="flex items-center gap-1 px-4 py-2 text-xs text-zinc-300 hover:text-white font-medium"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <ChevronRight className="w-3 h-3" />
                              {child.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="flex items-center gap-2 px-4 py-3 text-sm text-primary mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Grid3X3 className="w-4 h-4" />
              View All Products
            </Link>
            
            {!isAuthenticated && (
              <Link
                href="/login"
                className="px-4 py-3 rounded-md text-sm font-medium text-primary bg-primary/10 mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login / Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
