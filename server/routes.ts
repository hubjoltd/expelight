import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated, isAdmin } from "./auth";
import { db } from "./db";
import { cartItems, orders, categories, products, productVariants, productMedia, invoices, productCategories, blogPosts } from "@shared/schema";
import { eq, and, desc, isNull, inArray } from "drizzle-orm";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  registerAuthRoutes(app);

  // Categories API (public)
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await storage.getCategories();
      res.json(allCategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Products API with category info
  app.get("/api/products", async (req, res) => {
    try {
      const { series } = req.query;
      let allProducts;
      
      if (series && typeof series === 'string') {
        allProducts = await storage.getProductsBySeries(series);
      } else {
        allProducts = await storage.getProducts();
      }
      
      // Get category mappings for all products
      const categoryMappings = await db
        .select({
          productId: productCategories.productId,
          categoryId: productCategories.categoryId
        })
        .from(productCategories);
      
      // Create a map of productId to categoryIds
      const productCategoryMap = new Map<string, string[]>();
      for (const mapping of categoryMappings) {
        const existing = productCategoryMap.get(mapping.productId) || [];
        existing.push(mapping.categoryId);
        productCategoryMap.set(mapping.productId, existing);
      }
      
      // Add categoryIds to each product
      const productsWithCategories = allProducts.map(product => ({
        ...product,
        categoryIds: productCategoryMap.get(product.id) || []
      }));
      
      res.json(productsWithCategories);
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

  // Get product variants (public)
  app.get("/api/products/:id/variants", async (req, res) => {
    try {
      const variants = await db.select().from(productVariants)
        .where(eq(productVariants.productId, req.params.id));
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch variants" });
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

  // Razorpay - Get key for frontend
  app.get("/api/razorpay/key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  });

  // Razorpay - Create order (server-side price calculation)
  app.post("/api/razorpay/create-order", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const { shippingAddress, phone, email } = req.body;

      if (!shippingAddress || !phone || !email) {
        return res.status(400).json({ error: "Missing required shipping information" });
      }

      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ error: "Payment system is not configured" });
      }

      const userCartItems = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
      if (userCartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const productIds = userCartItems.map(item => item.productId);
      const allProducts = await db.select().from(products).where(inArray(products.id, productIds));

      let subtotal = 0;
      const orderItems = userCartItems.map(item => {
        const product = allProducts.find((p: any) => p?.id === item.productId);
        const price = product?.price || 0;
        subtotal += price * item.quantity;
        return {
          productId: item.productId,
          productName: product?.name || "Unknown",
          quantity: item.quantity,
          price,
        };
      });

      const shipping = subtotal >= 25000 ? 0 : 500;
      const totalAmount = subtotal + shipping;

      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: { userId, email, phone },
      });

      const [order] = await db.insert(orders)
        .values({
          userId,
          items: JSON.stringify(orderItems),
          totalAmount,
          shippingAddress,
          phone,
          email,
          status: "pending",
          razorpayOrderId: razorpayOrder.id,
          paymentStatus: "pending",
        })
        .returning();

      res.json({
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Razorpay - Verify payment (validates ownership and order match)
  app.post("/api/razorpay/verify-payment", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      const [order] = await db.select().from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({ error: "Order ID mismatch" });
      }

      if (order.paymentStatus === "paid") {
        return res.status(400).json({ error: "Payment already completed" });
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        await db.update(orders)
          .set({ paymentStatus: "failed", status: "cancelled" })
          .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));
        return res.status(400).json({ error: "Payment verification failed" });
      }

      const [updatedOrder] = await db.update(orders)
        .set({
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: "paid",
          status: "confirmed",
        })
        .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
        .returning();

      await db.delete(cartItems).where(eq(cartItems.userId, userId));

      res.json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Payment verification failed" });
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
      const orderId = req.params.id; // UUID string
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

  // Generate invoice for an order
  app.post("/api/admin/orders/:id/generate-invoice", isAdmin, async (req: Request, res) => {
    try {
      const orderId = req.params.id; // UUID string
      const { isInterstate = false } = req.body;
      
      // Get the order
      const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Check if invoice already exists
      const [existingInvoice] = await db.select().from(invoices)
        .where(eq(invoices.orderId, orderId));
      if (existingInvoice) {
        return res.json({ 
          success: true, 
          invoice: existingInvoice,
          message: "Invoice already exists"
        });
      }

      // Get user info
      const { users } = await import("@shared/models/auth");
      const [user] = await db.select().from(users).where(eq(users.id, order.userId));

      // Import invoice service
      const { generateInvoiceNumber, calculateTax, generateInvoicePDF } = await import("./invoiceService");

      // Parse order items (stored as JSON string in database)
      let orderItems: Array<{ productId: string; name: string; quantity: number; price: number; variant?: string }>;
      try {
        orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      } catch (parseError) {
        console.error("Failed to parse order items:", parseError);
        return res.status(400).json({ error: "Invalid order items format" });
      }
      
      const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxInfo = calculateTax(subtotal, isInterstate);
      const shippingAmount = subtotal >= 25000 ? 0 : 500;
      const totalWithTax = subtotal + taxInfo.totalTax + shippingAmount;

      // Generate invoice number
      const invoiceNumber = generateInvoiceNumber();

      // Generate PDF
      const pdfUrl = await generateInvoicePDF({
        invoiceNumber,
        order: {
          id: order.id,
          items: orderItems,
          totalAmount: totalWithTax,
          shippingAddress: order.shippingAddress || "",
          phone: order.phone || "",
          email: order.email || "",
          createdAt: order.createdAt!,
          status: order.status,
        },
        user: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email || order.email || "",
        },
        subtotal,
        taxAmount: taxInfo.totalTax,
        shippingAmount,
        discountAmount: 0,
        taxBreakdown: {
          cgst: taxInfo.cgst,
          sgst: taxInfo.sgst,
          igst: taxInfo.igst,
          gstRate: taxInfo.gstRate,
        },
      });

      // Save invoice to database
      const [newInvoice] = await db.insert(invoices).values({
        orderId,
        invoiceNumber,
        subtotal,
        taxAmount: taxInfo.totalTax,
        shippingAmount,
        discountAmount: 0,
        totalAmount: totalWithTax,
        taxBreakdown: JSON.stringify({
          cgst: taxInfo.cgst,
          sgst: taxInfo.sgst,
          igst: taxInfo.igst,
          gstRate: taxInfo.gstRate,
        }),
        pdfUrl,
        status: "generated",
      }).returning();

      res.json({ 
        success: true, 
        invoice: newInvoice,
        pdfUrl,
      });
    } catch (error) {
      console.error("Invoice generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Invoice error details:", errorMessage);
      res.status(500).json({ error: "Failed to generate invoice", details: errorMessage });
    }
  });

  // Send invoice via WhatsApp
  app.post("/api/admin/invoices/:id/send-whatsapp", isAdmin, async (req: Request, res) => {
    try {
      const invoiceId = req.params.id;
      const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
      
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      if (!invoice.pdfUrl) {
        return res.status(400).json({ error: "Invoice PDF not generated yet" });
      }

      // Get the order to find the phone number
      const [order] = await db.select().from(orders).where(eq(orders.id, invoice.orderId));
      if (!order || !order.phone) {
        return res.status(400).json({ error: "Order or phone number not found" });
      }

      // Check if WhatsApp is configured
      const { isWhatsAppConfigured, sendWhatsAppDocument } = await import("./whatsappService");
      
      if (!isWhatsAppConfigured()) {
        return res.status(400).json({ 
          error: "WhatsApp is not configured. Please add WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN to secrets." 
        });
      }

      // Construct the full PDF URL
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : `http://localhost:${process.env.PORT || 5000}`;
      const fullPdfUrl = `${baseUrl}${invoice.pdfUrl}`;

      // Send via WhatsApp
      const result = await sendWhatsAppDocument({
        to: order.phone,
        documentUrl: fullPdfUrl,
        filename: `${invoice.invoiceNumber}.pdf`,
        caption: `Thank you for your order from Expelight! Here is your invoice ${invoice.invoiceNumber}. Total: ₹${invoice.totalAmount.toLocaleString("en-IN")}`,
      });

      // Update invoice status
      await db.update(invoices)
        .set({
          sentViaWhatsapp: true,
          whatsappSentAt: new Date(),
          status: "sent",
        })
        .where(eq(invoices.id, invoiceId));

      res.json({ 
        success: true, 
        messageId: result.messages[0]?.id,
        sentTo: order.phone,
      });
    } catch (error) {
      console.error("WhatsApp send error:", error);
      res.status(500).json({ error: "Failed to send invoice via WhatsApp" });
    }
  });

  // Check WhatsApp configuration status
  app.get("/api/admin/whatsapp/status", isAdmin, async (req: Request, res) => {
    try {
      const { isWhatsAppConfigured } = await import("./whatsappService");
      res.json({ configured: isWhatsAppConfigured() });
    } catch (error) {
      res.json({ configured: false });
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

  // Advlust Product Scraping API
  interface AdvlustProduct {
    id: number;
    title: string;
    handle: string;
    body_html: string;
    vendor: string;
    product_type: string;
    images: Array<{ id: number; src: string; alt: string | null }>;
    variants: Array<{
      id: number;
      title: string;
      sku: string;
      price: string;
      compare_at_price: string | null;
      option1: string | null;
      option2: string | null;
      option3: string | null;
      inventory_quantity?: number;
    }>;
    options: Array<{ name: string; values: string[] }>;
    tags: string;
  }

  // Fetch products from Advlust.com (Shopify JSON endpoint)
  app.get("/api/admin/advlust/products", isAdmin, async (req: Request, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const response = await fetch(`https://advlust.com/products.json?limit=50&page=${page}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json() as { products: AdvlustProduct[] };
      res.json(data.products || []);
    } catch (error) {
      console.error("Advlust fetch error:", error);
      res.status(500).json({ error: "Failed to fetch products from Advlust" });
    }
  });

  // Import a specific product from Advlust
  app.post("/api/admin/advlust/import", isAdmin, async (req: Request, res) => {
    try {
      const { advlustProduct, series = "Pro", categoryId } = req.body as {
        advlustProduct: AdvlustProduct;
        series?: string;
        categoryId?: string;
      };
      
      if (!advlustProduct) {
        return res.status(400).json({ error: "Product data is required" });
      }

      // Check if product already imported
      const [existing] = await db.select().from(products)
        .where(eq(products.advlustProductId, advlustProduct.id.toString()));
      
      if (existing) {
        return res.status(400).json({ error: "Product already imported", existingId: existing.id });
      }

      // Clean up HTML description
      const cleanDescription = (advlustProduct.body_html || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 2000);

      // Extract images
      const images = advlustProduct.images.map(img => img.src);

      // Extract colors and beam patterns from options
      let colors: string[] = ["White"];
      let beamPatterns: string[] = ["Spot"];
      
      if (advlustProduct.options) {
        for (const opt of advlustProduct.options) {
          const optName = opt.name.toLowerCase();
          if (optName.includes("color") || optName.includes("colour")) {
            colors = opt.values.filter(v => v.toLowerCase() !== "default");
          }
          if (optName.includes("beam") || optName.includes("pattern") || optName.includes("optic")) {
            beamPatterns = opt.values.filter(v => v.toLowerCase() !== "default");
          }
        }
      }

      // Get price from first variant
      const firstVariant = advlustProduct.variants[0];
      const price = Math.round(parseFloat(firstVariant?.price || "0"));
      const originalPrice = firstVariant?.compare_at_price 
        ? Math.round(parseFloat(firstVariant.compare_at_price))
        : undefined;

      // Create the product
      const [newProduct] = await db.insert(products).values({
        name: advlustProduct.title,
        slug: advlustProduct.handle,
        sku: firstVariant?.sku || null,
        series,
        tagline: advlustProduct.product_type || "Premium LED Lighting",
        shortDescription: cleanDescription.substring(0, 200),
        fullDescription: cleanDescription,
        price,
        originalPrice,
        beamPatterns: beamPatterns.length > 0 ? beamPatterns : ["Spot"],
        colors: colors.length > 0 ? colors : ["White"],
        features: ["Premium Quality", "Long Warranty", "Easy Installation"],
        specs: ["IP67 Waterproof", "Polycarbonate Lens", "Aluminum Housing"],
        whatsInBox: ["LED Light", "Mounting Hardware", "Wiring Harness"],
        warrantyYears: 8,
        images,
        compatibleVehicles: advlustProduct.tags.split(",").map(t => t.trim()).filter(t => t),
        isActive: true,
        advlustProductId: advlustProduct.id.toString(),
        advlustHandle: advlustProduct.handle,
      }).returning();

      // Create variants for each Advlust variant
      if (advlustProduct.variants.length > 0) {
        for (const variant of advlustProduct.variants) {
          await db.insert(productVariants).values({
            productId: newProduct.id,
            sku: variant.sku || `${newProduct.id}-${variant.id}`,
            name: variant.title || "Default",
            price: Math.round(parseFloat(variant.price || "0")),
            compareAtPrice: variant.compare_at_price 
              ? Math.round(parseFloat(variant.compare_at_price))
              : null,
            color: variant.option1,
            beamPattern: variant.option2,
            size: variant.option3,
            stockQuantity: variant.inventory_quantity || 0,
            isAvailable: true,
          });
        }
      }

      // Create images as product media
      for (let i = 0; i < advlustProduct.images.length; i++) {
        const img = advlustProduct.images[i];
        await db.insert(productMedia).values({
          productId: newProduct.id,
          url: img.src,
          altText: img.alt || advlustProduct.title,
          mediaType: "image",
          isPrimary: i === 0,
          sortOrder: i,
        });
      }

      // Associate with category if provided
      if (categoryId) {
        await db.insert(productCategories).values({
          productId: newProduct.id,
          categoryId,
        });
      }

      res.json({ 
        success: true, 
        product: newProduct,
        variantsImported: advlustProduct.variants.length,
        mediaImported: advlustProduct.images.length,
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to import product from Advlust" });
    }
  });

  // Bulk import all products from Advlust
  app.post("/api/admin/advlust/import-all", isAdmin, async (req: Request, res) => {
    try {
      const { importAllAdvlustProducts } = await import("./importAdvlust");
      const result = await importAllAdvlustProducts();
      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Bulk import error:", error);
      res.status(500).json({ error: "Failed to bulk import products" });
    }
  });

  // Sync/update an existing product from Advlust
  app.post("/api/admin/advlust/sync/:productId", isAdmin, async (req: Request, res) => {
    try {
      const productId = req.params.productId;
      const [product] = await db.select().from(products).where(eq(products.id, productId));
      
      if (!product || !product.advlustHandle) {
        return res.status(404).json({ error: "Product not found or not linked to Advlust" });
      }

      // Fetch latest data from Advlust
      const response = await fetch(`https://advlust.com/products/${product.advlustHandle}.json`);
      if (!response.ok) {
        throw new Error("Failed to fetch from Advlust");
      }
      
      const data = await response.json() as { product: AdvlustProduct };
      const advlustProduct = data.product;

      // Update price from first variant
      const firstVariant = advlustProduct.variants[0];
      const price = Math.round(parseFloat(firstVariant?.price || "0"));
      const originalPrice = firstVariant?.compare_at_price 
        ? Math.round(parseFloat(firstVariant.compare_at_price))
        : undefined;

      // Update images
      const images = advlustProduct.images.map(img => img.src);

      await db.update(products)
        .set({
          price,
          originalPrice,
          images,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId));

      res.json({ success: true, message: "Product synced successfully" });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ error: "Failed to sync product" });
    }
  });

  // Blog routes - public
  app.get("/api/blog", async (_req: Request, res) => {
    const posts = await db.select().from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
    res.json(posts);
  });

  app.get("/api/blog/:slug", async (req: Request, res) => {
    const [post] = await db.select().from(blogPosts)
      .where(eq(blogPosts.slug, req.params.slug));
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  // Blog admin routes
  app.get("/api/admin/blog", isAdmin, async (_req: Request, res) => {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    res.json(posts);
  });

  app.post("/api/admin/blog", isAdmin, async (req: Request, res) => {
    try {
      const { title, slug, excerpt, content, featuredImage, author, category, tags, isPublished } = req.body;
      const [post] = await db.insert(blogPosts).values({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt,
        content,
        featuredImage,
        author: author || "Expelight Team",
        category,
        tags: tags || [],
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      }).returning();
      res.json(post);
    } catch (error) {
      console.error("Blog create error:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.patch("/api/admin/blog/:id", isAdmin, async (req: Request, res) => {
    try {
      const { title, slug, excerpt, content, featuredImage, author, category, tags, isPublished } = req.body;
      const updateData: any = { updatedAt: new Date() };
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (content !== undefined) updateData.content = content;
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
      if (author !== undefined) updateData.author = author;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (isPublished !== undefined) {
        updateData.isPublished = isPublished;
        if (isPublished) updateData.publishedAt = new Date();
      }
      
      const [post] = await db.update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, req.params.id))
        .returning();
      res.json(post);
    } catch (error) {
      console.error("Blog update error:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", isAdmin, async (req: Request, res) => {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Blog delete error:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  app.get("/api/admin/import-missing-skus", isAdmin, async (req: Request, res) => {
    try {
      const { importMissingSKUs } = await import("./importMissingSKUs");
      const results = await importMissingSKUs();
      res.json(results);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to import missing SKUs" });
    }
  });

  return httpServer;
}
