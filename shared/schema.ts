import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models
export * from "./models/auth";

// Categories with hierarchical structure (Category → Sub-Category → Sub-Sub-Category)
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: varchar("parent_id"), // Self-reference for hierarchy
  level: integer("level").notNull().default(0), // 0=top, 1=sub, 2=sub-sub
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Product Media (images, videos)
export const productMedia = pgTable("product_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  mediaType: text("media_type").notNull().default("image"), // image, video
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductMediaSchema = createInsertSchema(productMedia).omit({ id: true, createdAt: true });
export type InsertProductMedia = z.infer<typeof insertProductMediaSchema>;
export type ProductMedia = typeof productMedia.$inferSelect;

// Product Variants (size, color, beam pattern combinations)
export const productVariants = pgTable("product_variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(), // e.g. "White - Spot Pattern"
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  color: text("color"),
  beamPattern: text("beam_pattern"),
  size: text("size"),
  stockQuantity: integer("stock_quantity").default(0),
  isAvailable: boolean("is_available").default(true),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductVariantSchema = createInsertSchema(productVariants).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;

// Product to Category mapping (many-to-many)
export const productCategories = pgTable("product_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  categoryId: varchar("category_id").notNull(),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).omit({ id: true });
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;

// Invoices for orders
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  subtotal: integer("subtotal").notNull(),
  taxAmount: integer("tax_amount").notNull().default(0),
  shippingAmount: integer("shipping_amount").notNull().default(0),
  discountAmount: integer("discount_amount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  taxBreakdown: text("tax_breakdown"), // JSON with CGST, SGST, IGST breakdown
  pdfUrl: text("pdf_url"),
  status: text("status").notNull().default("generated"), // generated, sent, paid
  sentViaWhatsapp: boolean("sent_via_whatsapp").default(false),
  whatsappSentAt: timestamp("whatsapp_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Product schema for lighting systems
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku"), // Product SKU from Advlust
  series: text("series").notNull(), // Sport, Pro, Max
  tagline: text("tagline").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  price: integer("price").notNull(), // in INR
  originalPrice: integer("original_price"),
  beamPatterns: text("beam_patterns").array().notNull(), // Fog, Driving, Spot
  colors: text("colors").array().notNull(), // White, Yellow
  features: text("features").array().notNull(),
  specs: text("specs").array().notNull(),
  specificationsTable: text("specifications_table"), // JSON for specs table from advlust
  partNumbers: text("part_numbers"), // JSON for part numbers table
  qaContent: text("qa_content"), // JSON for Q&A section
  installationGuide: text("installation_guide"), // JSON for installation info
  whatsInBox: text("whats_in_box").array().notNull(),
  warrantyYears: integer("warranty_years").notNull().default(8),
  images: text("images").array().notNull(),
  compatibleVehicles: text("compatible_vehicles").array().notNull(),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true), // For enabling/disabling products
  advlustProductId: text("advlust_product_id"), // Reference to Advlust product
  advlustHandle: text("advlust_handle"), // Advlust product handle/slug
  videoUrl: text("video_url"), // YouTube video URL for the product
  isPreOrder: boolean("is_pre_order").default(false), // Pre-order items with 6-8 weeks delivery
  preOrderMessage: text("pre_order_message"), // Custom pre-order message
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Vehicle schema for the "Fit Your Vehicle" selector
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  make: text("make").notNull(), // Mahindra, Toyota, Maruti
  model: text("model").notNull(), // Thar, Hilux, Jimny
  year: text("year").notNull(),
  compatibleProductIds: text("compatible_product_ids").array().notNull(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

// Reviews schema
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  authorName: text("author_name").notNull(),
  authorLocation: text("author_location").notNull(),
  vehicleOwned: text("vehicle_owned").notNull(),
  isVerified: boolean("is_verified").default(true),
  productId: varchar("product_id"),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Cart schema
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  variantSku: text("variant_sku"),
  variantPrice: integer("variant_price"),
  variantName: text("variant_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Orders schema
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  items: text("items").notNull(), // JSON string of cart items
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered
  shippingAddress: text("shipping_address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Blog posts schema
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  author: text("author").notNull().default("Expelight Team"),
  category: text("category"), // News, Guides, Reviews, etc.
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
