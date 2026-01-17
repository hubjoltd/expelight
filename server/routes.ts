import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
      const makes = [...new Set(vehicles.map(v => v.make))];
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

  return httpServer;
}
