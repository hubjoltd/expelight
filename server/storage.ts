import { 
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Vehicle, type InsertVehicle,
  type Review, type InsertReview
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsBySeries(series: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehiclesByMake(make: string): Promise<Vehicle[]>;
  getCompatibleProducts(vehicleId: string): Promise<Product[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByProductId(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private vehicles: Map<string, Vehicle>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.vehicles = new Map();
    this.reviews = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Products
    const sampleProducts: Product[] = [
      {
        id: "prod-1",
        name: "SS3 3-Inch LED Pod Kit – SAE Fog (Type A/B Fitment)",
        slug: "ss3-led-pod-kit-sae-fog",
        series: "Pro",
        tagline: "The Weekend Warrior",
        shortDescription: "The highest-output 3-inch LED pod on the market. The SS3 features our patented TIR Optics, delivering high-intensity light with a razor-sharp cut-off line. Designed in St. Louis, USA. Tested for the Indian Monsoon.",
        fullDescription: "The SS3 Pro represents the pinnacle of LED lighting technology. Engineered with Total Internal Reflection (TIR) optics, each pod captures 100% of the LED's output and focuses it with surgical precision. Designed in St. Louis, USA and rigorously tested for the Indian Monsoon conditions.",
        price: 24500,
        originalPrice: 28000,
        beamPatterns: ["Fog", "Driving", "Spot"],
        colors: ["White", "Yellow"],
        features: [
          "Zero Glare: SAE-Compliant Fog beam pattern",
          "Bolt-On Fit: Direct replacement for Thar, Scorpio-N, Jimny",
          "TIR Technology: Captures more light than standard reflectors",
          "IP68 Rated: Fully waterproof and dustproof",
          "Polycarbonate Lens: Impact-resistant and UV-stabilized"
        ],
        specs: [
          "LED Output: 4,200 Lumens (pair)",
          "Power Draw: 36W total",
          "Beam Pattern: SAE J583 Fog",
          "Color Temperature: 6000K / 3000K",
          "Operating Voltage: 9-16V DC",
          "Dimensions: 3.0\" x 2.4\" x 2.0\""
        ],
        whatsInBox: [
          "2x SS3 LED Pods",
          "Vehicle-specific mounting brackets",
          "Plug-and-play wiring harness",
          "Switch panel with backlit indicator",
          "Hardware kit (stainless steel)",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["/images/ss3-1.jpg", "/images/ss3-2.jpg"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Maruti Jimny"],
        isPopular: true
      },
      {
        id: "prod-2",
        name: "SS5 LED Light Bar – Combo",
        slug: "ss5-led-light-bar-combo",
        series: "Max",
        tagline: "Competition Grade",
        shortDescription: "Maximum distance for extreme conditions. Used by professional rally teams across India.",
        fullDescription: "The SS5 Max is our flagship light bar, designed for those who venture where roads don't exist. Unmatched distance and output.",
        price: 52000,
        originalPrice: null,
        beamPatterns: ["Combo", "Driving", "Flood"],
        colors: ["White", "Yellow"],
        features: [
          "Maximum output: Over 15,000 lumens",
          "Rally-proven durability",
          "Advanced thermal management",
          "Competition-grade optics",
          "Lifetime LED warranty"
        ],
        specs: [
          "LED Output: 15,200 Lumens",
          "Power Draw: 85W",
          "Beam Pattern: Combo",
          "Color Temperature: 6000K / 3000K",
          "Length: 20 inches"
        ],
        whatsInBox: [
          "1x SS5 LED Light Bar",
          "Universal mounting brackets",
          "Heavy-duty wiring harness",
          "Relay and switch kit",
          "Hardware kit"
        ],
        warrantyYears: 8,
        images: ["/images/ss5-1.jpg"],
        compatibleVehicles: ["Universal Fit"],
        isPopular: true
      },
      {
        id: "prod-3",
        name: "SSC1 LED Pod – Sport",
        slug: "ssc1-led-pod-sport",
        series: "Sport",
        tagline: "The Daily Driver",
        shortDescription: "Perfect entry-level upgrade for city and highway commutes. 2x brighter than stock.",
        fullDescription: "The SSC1 Sport is the ideal upgrade for drivers who want better visibility without breaking the bank.",
        price: 18500,
        originalPrice: 21000,
        beamPatterns: ["Fog", "Driving"],
        colors: ["White"],
        features: [
          "2x brighter than stock lights",
          "Street-legal SAE patterns",
          "Easy plug-and-play installation",
          "Compact design",
          "Budget-friendly performance"
        ],
        specs: [
          "LED Output: 2,100 Lumens (pair)",
          "Power Draw: 20W total",
          "Beam Pattern: SAE Fog",
          "Color Temperature: 6000K"
        ],
        whatsInBox: [
          "2x SSC1 LED Pods",
          "Mounting brackets",
          "Wiring harness",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["/images/ssc1-1.jpg"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Maruti Jimny", "Force Gurkha"],
        isPopular: false
      },
      {
        id: "prod-4",
        name: "SS3 LED Pod Kit – Driving",
        slug: "ss3-led-pod-kit-driving",
        series: "Pro",
        tagline: "The Weekend Warrior",
        shortDescription: "Focused beam for long-distance illumination on dark highways.",
        fullDescription: "The SS3 Driving pattern provides a concentrated beam that extends your vision further down the road.",
        price: 24500,
        originalPrice: null,
        beamPatterns: ["Driving", "Spot"],
        colors: ["White", "Yellow"],
        features: [
          "Long-throw beam pattern",
          "Ideal for highway driving",
          "TIR optics technology",
          "Weatherproof design"
        ],
        specs: [
          "LED Output: 4,600 Lumens (pair)",
          "Power Draw: 38W total",
          "Beam Pattern: Driving",
          "Color Temperature: 6000K / 3000K"
        ],
        whatsInBox: [
          "2x SS3 LED Pods",
          "Mounting brackets",
          "Wiring harness",
          "Switch kit"
        ],
        warrantyYears: 8,
        images: ["/images/ss3-driving-1.jpg"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Toyota Hilux"],
        isPopular: false
      },
      {
        id: "prod-5",
        name: "SSC2 Sport Pod Kit",
        slug: "ssc2-sport-pod-kit",
        series: "Sport",
        tagline: "The Daily Driver",
        shortDescription: "Compact and powerful for any vehicle. Great value performance upgrade.",
        fullDescription: "The SSC2 offers excellent performance in a compact package, perfect for smaller vehicles or supplemental lighting.",
        price: 19500,
        originalPrice: null,
        beamPatterns: ["Fog", "Spot"],
        colors: ["White"],
        features: [
          "Compact form factor",
          "Versatile mounting options",
          "Efficient LED output",
          "Street-legal compliance"
        ],
        specs: [
          "LED Output: 2,400 Lumens (pair)",
          "Power Draw: 22W total",
          "Beam Pattern: Fog/Spot",
          "Color Temperature: 6000K"
        ],
        whatsInBox: [
          "2x SSC2 LED Pods",
          "Universal mounting kit",
          "Wiring harness"
        ],
        warrantyYears: 8,
        images: ["/images/ssc2-1.jpg"],
        compatibleVehicles: ["Universal Fit", "Maruti Jimny", "Force Gurkha"],
        isPopular: false
      },
      {
        id: "prod-6",
        name: "SS3 Max LED Pod Kit",
        slug: "ss3-max-led-pod-kit",
        series: "Max",
        tagline: "Competition Grade",
        shortDescription: "Maximum output from a 3-inch pod. Unmatched performance for serious explorers.",
        fullDescription: "The SS3 Max pushes the boundaries of what's possible in a compact LED pod. Competition-grade performance.",
        price: 54000,
        originalPrice: 58000,
        beamPatterns: ["Driving", "Spot", "Flood"],
        colors: ["White", "Yellow"],
        features: [
          "Maximum 3-inch pod output",
          "Competition-tested durability",
          "Advanced heat management",
          "Premium TIR optics"
        ],
        specs: [
          "LED Output: 6,800 Lumens (pair)",
          "Power Draw: 52W total",
          "Beam Pattern: Multiple options",
          "Color Temperature: 6000K / 3000K"
        ],
        whatsInBox: [
          "2x SS3 Max LED Pods",
          "Premium mounting brackets",
          "Heavy-duty wiring harness",
          "Relay kit",
          "Premium switch panel"
        ],
        warrantyYears: 8,
        images: ["/images/ss3-max-1.jpg"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Toyota Fortuner", "Isuzu V-Cross"],
        isPopular: true
      }
    ];

    sampleProducts.forEach(p => this.products.set(p.id, p));

    // Sample Vehicles
    const sampleVehicles: Vehicle[] = [
      { id: "veh-1", make: "Mahindra", model: "Thar (2020+)", year: "2020-2025", compatibleProductIds: ["prod-1", "prod-3", "prod-4", "prod-6"] },
      { id: "veh-2", make: "Mahindra", model: "Scorpio-N", year: "2022-2025", compatibleProductIds: ["prod-1", "prod-3", "prod-4", "prod-6"] },
      { id: "veh-3", make: "Mahindra", model: "Scorpio Classic", year: "2022-2025", compatibleProductIds: ["prod-3", "prod-5"] },
      { id: "veh-4", make: "Mahindra", model: "XUV700", year: "2021-2025", compatibleProductIds: ["prod-3", "prod-5"] },
      { id: "veh-5", make: "Mahindra", model: "Bolero", year: "2020-2025", compatibleProductIds: ["prod-3", "prod-5"] },
      { id: "veh-6", make: "Maruti Suzuki", model: "Jimny", year: "2023-2025", compatibleProductIds: ["prod-1", "prod-3", "prod-5"] },
      { id: "veh-7", make: "Maruti Suzuki", model: "Gypsy", year: "All Years", compatibleProductIds: ["prod-3", "prod-5"] },
      { id: "veh-8", make: "Toyota", model: "Hilux", year: "2022-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-4", "prod-6"] },
      { id: "veh-9", make: "Toyota", model: "Fortuner", year: "2016-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-6"] },
      { id: "veh-10", make: "Toyota", model: "Land Cruiser", year: "All Years", compatibleProductIds: ["prod-2", "prod-6"] },
      { id: "veh-11", make: "Force", model: "Gurkha", year: "2021-2025", compatibleProductIds: ["prod-3", "prod-5"] },
      { id: "veh-12", make: "Isuzu", model: "V-Cross", year: "2019-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-6"] },
      { id: "veh-13", make: "Isuzu", model: "MU-X", year: "2017-2025", compatibleProductIds: ["prod-1", "prod-6"] }
    ];

    sampleVehicles.forEach(v => this.vehicles.set(v.id, v));

    // Sample Reviews
    const sampleReviews: Review[] = [
      {
        id: "rev-1",
        rating: 5,
        text: "I was skeptical about the price. But the cut-off line on my Scorpio-N is razor sharp. No blinding oncoming traffic, just pure daylight. Worth every rupee.",
        authorName: "Rohan K.",
        authorLocation: "Hyderabad",
        vehicleOwned: "Scorpio-N Z8L",
        isVerified: true,
        productId: "prod-1"
      },
      {
        id: "rev-2",
        rating: 5,
        text: "I tried the cheap '150W' LEDs from Karol Bagh. They were bright but scattered light everywhere. The SS3 Pro from Expelight puts the light exactly where I need it. Night and day difference.",
        authorName: "Vikram S.",
        authorLocation: "Delhi",
        vehicleOwned: "Mahindra Thar",
        isVerified: true,
        productId: "prod-1"
      },
      {
        id: "rev-3",
        rating: 5,
        text: "The installation was incredibly easy - true plug and play. My Jimny now lights up mountain trails like it's noon. Best upgrade I've made to the car.",
        authorName: "Priya M.",
        authorLocation: "Bangalore",
        vehicleOwned: "Maruti Jimny",
        isVerified: true,
        productId: "prod-1"
      },
      {
        id: "rev-4",
        rating: 5,
        text: "After 2 years and countless off-road trips, not a single issue. The warranty gives peace of mind, but these lights are genuinely built to last. American engineering shows.",
        authorName: "Arjun D.",
        authorLocation: "Pune",
        vehicleOwned: "Toyota Hilux",
        isVerified: true,
        productId: "prod-2"
      }
    ];

    sampleReviews.forEach(r => this.reviews.set(r.id, r));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async getProductsBySeries(series: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      p => p.series.toLowerCase() === series.toLowerCase()
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      originalPrice: insertProduct.originalPrice ?? null,
      isPopular: insertProduct.isPopular ?? null,
      warrantyYears: insertProduct.warrantyYears ?? 8
    };
    this.products.set(id, product);
    return product;
  }

  // Vehicle methods
  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehiclesByMake(make: string): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(
      v => v.make.toLowerCase() === make.toLowerCase()
    );
  }

  async getCompatibleProducts(vehicleId: string): Promise<Product[]> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return [];
    
    return Array.from(this.products.values()).filter(
      p => vehicle.compatibleProductIds.includes(p.id)
    );
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = randomUUID();
    const vehicle: Vehicle = { ...insertVehicle, id };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByProductId(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      r => r.productId === productId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id,
      isVerified: insertReview.isVerified ?? null,
      productId: insertReview.productId ?? null
    };
    this.reviews.set(id, review);
    return review;
  }
}

export const storage = new MemStorage();
