import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated, isAdmin } from "./auth";
import { db } from "./db";
import { cartItems, orders, categories, products, productVariants, productMedia, invoices, productCategories } from "@shared/schema";
import { eq, and, desc, isNull } from "drizzle-orm";

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
      const cartItemId = parseInt(req.params.id, 10);
      
      const [updated] = await db.update(cartItems)
        .set({ quantity })
        .where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, userId)))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const cartItemId = parseInt(req.params.id, 10);
      await db.delete(cartItems)
        .where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, userId)));
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

  // ==================== ADMIN ROUTES ====================

  // Admin Dashboard Stats
  app.get("/api/admin/stats", isAdmin, async (req: Request, res) => {
    try {
      const allProducts = await db.select().from(products);
      const allOrders = await db.select().from(orders);
      const allCategories = await db.select().from(categories);
      
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = allOrders.filter(o => o.status === "confirmed" || o.status === "processing").length;
      
      res.json({
        totalProducts: allProducts.length,
        activeProducts: allProducts.filter(p => p.isActive).length,
        totalOrders: allOrders.length,
        pendingOrders,
        totalCategories: allCategories.length,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin Categories API
  app.get("/api/admin/categories", isAdmin, async (req: Request, res) => {
    try {
      const allCategories = await db.select().from(categories).orderBy(categories.level, categories.name);
      res.json(allCategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/admin/categories", isAdmin, async (req: Request, res) => {
    try {
      const { name, slug, description, parentId, level, imageUrl, isActive } = req.body;
      
      const [newCategory] = await db.insert(categories)
        .values({
          name,
          slug,
          description: description || null,
          parentId: parentId || null,
          level: level || 1,
          imageUrl: imageUrl || null,
          isActive: isActive !== false,
        })
        .returning();
      
      res.json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/admin/categories/:id", isAdmin, async (req: Request, res) => {
    try {
      const categoryId = req.params.id; // UUID string
      const updates = req.body;
      
      const [updated] = await db.update(categories)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(categories.id, categoryId))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", isAdmin, async (req: Request, res) => {
    try {
      const categoryId = req.params.id; // UUID string
      await db.delete(categories).where(eq(categories.id, categoryId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Admin Products API
  app.get("/api/admin/products", isAdmin, async (req: Request, res) => {
    try {
      const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", isAdmin, async (req: Request, res) => {
    try {
      const productData = req.body;
      const now = new Date();
      
      const [newProduct] = await db.insert(products)
        .values({
          ...productData,
          isActive: productData.isActive !== false,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      
      res.json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/admin/products/:id", isAdmin, async (req: Request, res) => {
    try {
      const productId = req.params.id;
      const updates = req.body;
      
      const [updated] = await db.update(products)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(products.id, productId))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAdmin, async (req: Request, res) => {
    try {
      const productId = req.params.id;
      // Soft delete - just disable the product
      const [updated] = await db.update(products)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(products.id, productId))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Admin Product Variants API
  app.get("/api/admin/products/:productId/variants", isAdmin, async (req: Request, res) => {
    try {
      const variants = await db.select().from(productVariants)
        .where(eq(productVariants.productId, req.params.productId));
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch variants" });
    }
  });

  app.post("/api/admin/products/:productId/variants", isAdmin, async (req: Request, res) => {
    try {
      const variantData = req.body;
      
      const [newVariant] = await db.insert(productVariants)
        .values({
          ...variantData,
          productId: req.params.productId,
        })
        .returning();
      
      res.json(newVariant);
    } catch (error) {
      console.error("Error creating variant:", error);
      res.status(500).json({ error: "Failed to create variant" });
    }
  });

  app.patch("/api/admin/variants/:id", isAdmin, async (req: Request, res) => {
    try {
      const variantId = req.params.id; // UUID string
      const updates = req.body;
      
      const [updated] = await db.update(productVariants)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(productVariants.id, variantId))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update variant" });
    }
  });

  app.delete("/api/admin/variants/:id", isAdmin, async (req: Request, res) => {
    try {
      const variantId = req.params.id; // UUID string
      await db.delete(productVariants).where(eq(productVariants.id, variantId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete variant" });
    }
  });

  // Admin Product Media API
  app.get("/api/admin/products/:productId/media", isAdmin, async (req: Request, res) => {
    try {
      const media = await db.select().from(productMedia)
        .where(eq(productMedia.productId, req.params.productId))
        .orderBy(productMedia.sortOrder);
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.post("/api/admin/products/:productId/media", isAdmin, async (req: Request, res) => {
    try {
      const mediaData = req.body;
      
      const [newMedia] = await db.insert(productMedia)
        .values({
          ...mediaData,
          productId: req.params.productId,
        })
        .returning();
      
      res.json(newMedia);
    } catch (error) {
      console.error("Error creating media:", error);
      res.status(500).json({ error: "Failed to create media" });
    }
  });

  app.delete("/api/admin/media/:id", isAdmin, async (req: Request, res) => {
    try {
      const mediaId = req.params.id; // UUID string
      await db.delete(productMedia).where(eq(productMedia.id, mediaId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete media" });
    }
  });

  // Admin Orders API
  app.get("/api/admin/orders", isAdmin, async (req: Request, res) => {
    try {
      const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
      res.json(allOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id", isAdmin, async (req: Request, res) => {
    try {
      const orderId = parseInt(req.params.id, 10);
      const { status } = req.body;
      
      const [updated] = await db.update(orders)
        .set({ status })
        .where(eq(orders.id, orderId))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Admin Invoices API
  app.get("/api/admin/invoices", isAdmin, async (req: Request, res) => {
    try {
      const allInvoices = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
      res.json(allInvoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/admin/invoices/:id", isAdmin, async (req: Request, res) => {
    try {
      const invoiceId = req.params.id; // UUID string
      const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
      
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  // Check admin status endpoint
  app.get("/api/admin/check", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const { users } = await import("@shared/models/auth");
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
      
      res.json({ 
        isAdmin: currentUser?.role === "admin",
        role: currentUser?.role || "user"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check admin status" });
    }
  });

  return httpServer;
}
