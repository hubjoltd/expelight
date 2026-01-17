import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product schema for lighting systems
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
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
  whatsInBox: text("whats_in_box").array().notNull(),
  warrantyYears: integer("warranty_years").notNull().default(8),
  images: text("images").array().notNull(),
  compatibleVehicles: text("compatible_vehicles").array().notNull(),
  isPopular: boolean("is_popular").default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
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

// Users schema (keeping existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
