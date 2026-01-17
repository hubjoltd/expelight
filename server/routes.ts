import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth";
import { db } from "./db";
import { cartItems, orders } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  registerAuthRoutes(app);

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { series } = req.query;
      let products;
      
      if (series && typeof series === 'string') {
        products = await storage.getProductsBySeries(series);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Vehicles API
  app.get("/api/vehicles", async (req, res) => {
    try {
      const { make } = req.query;
      let vehicles;
      
      if (make && typeof make === 'string') {
        vehicles = await storage.getVehiclesByMake(make);
      } else {
        vehicles = await storage.getVehicles();
      }
      
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id/compatible-products", async (req, res) => {
    try {
      const products = await storage.getCompatibleProducts(req.params.id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compatible products" });
    }
  });

  // Reviews API
  app.get("/api/reviews", async (req, res) => {
    try {
      const { productId } = req.query;
      let reviews;
      
      if (productId && typeof productId === 'string') {
        reviews = await storage.getReviewsByProductId(productId);
      } else {
        reviews = await storage.getReviews();
      }
      
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Vehicle makes endpoint for dropdown
  app.get("/api/vehicle-makes", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      const makes = Array.from(new Set(vehicles.map(v => v.make)));
      res.json(makes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle makes" });
    }
  });

  // Vehicle models by make endpoint for dropdown
  app.get("/api/vehicle-models/:make", async (req, res) => {
    try {
      const vehicles = await storage.getVehiclesByMake(req.params.make);
      const models = vehicles.map(v => ({ id: v.id, model: v.model, year: v.year }));
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle models" });
    }
  });

  // Cart API (requires authentication)
  app.get("/api/cart", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
      
      // Enrich with product data
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(enrichedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const { productId, quantity = 1 } = req.body;
      
      // Check if item already in cart
      const existing = await db.select().from(cartItems)
        .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
      
      if (existing.length > 0) {
        // Update quantity
        const [updated] = await db.update(cartItems)
          .set({ quantity: existing[0].quantity + quantity })
          .where(eq(cartItems.id, existing[0].id))
          .returning();
        res.json(updated);
      } else {
        // Add new item
        const [item] = await db.insert(cartItems)
          .values({ userId, productId, quantity })
          .returning();
        res.json(item);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const { quantity } = req.body;
      
      const [updated] = await db.update(cartItems)
        .set({ quantity })
        .where(and(eq(cartItems.id, req.params.id), eq(cartItems.userId, userId)))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      await db.delete(cartItems)
        .where(and(eq(cartItems.id, req.params.id), eq(cartItems.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  // Orders API
  app.post("/api/orders", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const { items, totalAmount, shippingAddress, phone, email } = req.body;
      
      const [order] = await db.insert(orders)
        .values({
          userId,
          items: JSON.stringify(items),
          totalAmount,
          shippingAddress,
          phone,
          email,
          status: "confirmed"
        })
        .returning();
      
      // Clear cart after order
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
      res.json(userOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  return httpServer;
}
