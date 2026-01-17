import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import type { Product } from "@shared/schema";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

interface LocalCartItem {
  productId: string;
  quantity: number;
}

const CART_STORAGE_KEY = "expelight_cart";

// Local storage helpers
function getLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: LocalCartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function clearLocalCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

export function useCart() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [localCart, setLocalCartState] = useState<LocalCartItem[]>([]);

  // Load local cart on mount
  useEffect(() => {
    setLocalCartState(getLocalCart());
  }, []);

  // Sync local cart to state when storage changes
  useEffect(() => {
    const handleStorage = () => {
      setLocalCartState(getLocalCart());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Server cart for authenticated users
  const { data: serverCart = [], isLoading: serverLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  // Fetch products for local cart items
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Enrich local cart with product data
  const enrichedLocalCart: CartItem[] = localCart.map((item, index) => ({
    id: `local-${index}`,
    productId: item.productId,
    quantity: item.quantity,
    product: products.find((p) => p.id === item.productId),
  }));

  // Use server cart if authenticated, otherwise local cart
  const cartItems = isAuthenticated ? serverCart : enrichedLocalCart;
  const isLoading = isAuthenticated ? serverLoading : false;

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add to cart (local or server)
  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (isAuthenticated) {
        // Add to server
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
          credentials: "include",
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        }
      } else {
        // Add to local cart
        const current = getLocalCart();
        const existingIndex = current.findIndex((item) => item.productId === productId);
        
        if (existingIndex >= 0) {
          current[existingIndex].quantity += quantity;
        } else {
          current.push({ productId, quantity });
        }
        
        setLocalCart(current);
        setLocalCartState(current);
      }
    },
    [isAuthenticated, queryClient]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (isAuthenticated) {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
          credentials: "include",
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        }
      } else {
        // Update local cart
        const index = parseInt(itemId.replace("local-", ""));
        const current = getLocalCart();
        if (current[index]) {
          current[index].quantity = quantity;
          setLocalCart(current);
          setLocalCartState(current);
        }
      }
    },
    [isAuthenticated, queryClient]
  );

  // Remove item
  const removeItem = useCallback(
    async (itemId: string) => {
      if (isAuthenticated) {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        }
      } else {
        // Remove from local cart
        const index = parseInt(itemId.replace("local-", ""));
        const current = getLocalCart();
        current.splice(index, 1);
        setLocalCart(current);
        setLocalCartState(current);
      }
    },
    [isAuthenticated, queryClient]
  );

  // Merge local cart to server on login
  const mergeLocalCartToServer = useCallback(async () => {
    const local = getLocalCart();
    if (local.length === 0) return;

    for (const item of local) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
        credentials: "include",
      });
    }
    
    clearLocalCart();
    setLocalCartState([]);
    queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
  }, [queryClient]);

  // Clear cart
  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      clearLocalCart();
      setLocalCartState([]);
    }
  }, [isAuthenticated]);

  return {
    cartItems,
    cartCount,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    mergeLocalCartToServer,
    clearCart,
  };
}
