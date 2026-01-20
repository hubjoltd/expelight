import { 
  type User, type UpsertUser,
  type Product, type InsertProduct,
  type Vehicle, type InsertVehicle,
  type Review, type InsertReview,
  type Category, type InsertCategory,
  type ProductVariant, type InsertProductVariant,
  type ProductMedia, type InsertProductMedia,
  type Invoice, type InsertInvoice,
  type ProductCategory, type InsertProductCategory
} from "@shared/schema";

type InsertUser = UpsertUser;
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getChildCategories(parentId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getActiveProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsBySeries(series: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  toggleProductActive(id: string, isActive: boolean): Promise<Product | undefined>;
  
  // Product Variants
  getProductVariants(productId: string): Promise<ProductVariant[]>;
  getVariantById(id: string): Promise<ProductVariant | undefined>;
  getVariantBySku(sku: string): Promise<ProductVariant | undefined>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: string, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined>;
  deleteProductVariant(id: string): Promise<boolean>;
  
  // Product Media
  getProductMedia(productId: string): Promise<ProductMedia[]>;
  createProductMedia(media: InsertProductMedia): Promise<ProductMedia>;
  updateProductMedia(id: string, media: Partial<InsertProductMedia>): Promise<ProductMedia | undefined>;
  deleteProductMedia(id: string): Promise<boolean>;
  
  // Product Categories
  getProductCategories(productId: string): Promise<Category[]>;
  setProductCategories(productId: string, categoryIds: string[]): Promise<void>;
  
  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | undefined>;
  getInvoiceByOrderId(orderId: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  
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
  private categories: Map<string, Category>;
  private productVariants: Map<string, ProductVariant>;
  private productMediaItems: Map<string, ProductMedia>;
  private invoices: Map<string, Invoice>;
  private productCategoryMappings: Map<string, ProductCategory>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.vehicles = new Map();
    this.reviews = new Map();
    this.categories = new Map();
    this.productVariants = new Map();
    this.productMediaItems = new Map();
    this.invoices = new Map();
    this.productCategoryMappings = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const now = new Date();
    // Real Products from advlust.com / Diode Dynamics
    const sampleProducts: Product[] = [
      {
        id: "prod-1",
        name: "Stage Series 6\" White Light Bar",
        slug: "stage-series-6-white-light-bar",
        sku: "DD-SS6-WLB",
        series: "Sport",
        tagline: "Compact Performance",
        shortDescription: "From compact pods to full-size light bars. The perfect entry-level light bar for city and highway use.",
        fullDescription: "The Stage Series 6\" Light Bar delivers impressive output in a compact package. SAE/DOT compliant with a crisp white beam that illuminates the road ahead without blinding oncoming traffic.",
        price: 16499,
        originalPrice: null,
        beamPatterns: ["Driving", "Combo"],
        colors: ["White"],
        features: [
          "SAE/DOT Compliant beam pattern",
          "Compact 6-inch form factor",
          "Plug-and-play installation",
          "IP68 Waterproof rating",
          "Durable aluminum housing"
        ],
        specs: [
          "Length: 6 inches",
          "LED Output: 3,000 Lumens",
          "Power Draw: 18W",
          "Color Temperature: 6000K",
          "Operating Voltage: 9-16V DC"
        ],
        whatsInBox: [
          "1x Stage Series 6\" Light Bar",
          "Mounting brackets",
          "Wiring harness",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["https://advlust.com/cdn/shop/files/Lightbars-category.jpg?v=1747475023&width=533"],
        compatibleVehicles: ["Universal Fit", "Mahindra Thar", "Scorpio-N", "Maruti Jimny"],
        isPopular: false,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "prod-2",
        name: "Stage Series 12\" White Light Bar",
        slug: "stage-series-12-white-light-bar",
        sku: "DD-SS12-WLB",
        series: "Pro",
        tagline: "The Weekend Warrior",
        shortDescription: "Double the length, double the output. Perfect for dark highways and weekend trail runs.",
        fullDescription: "The Stage Series 12\" Light Bar is the sweet spot between compact and full-size. Delivers excellent coverage for highway driving and trail exploration.",
        price: 25299,
        originalPrice: null,
        beamPatterns: ["Driving", "Combo", "Flood"],
        colors: ["White"],
        features: [
          "Extended 12-inch coverage",
          "Combo beam pattern option",
          "Premium aluminum construction",
          "Integrated thermal management",
          "SAE/DOT street legal"
        ],
        specs: [
          "Length: 12 inches",
          "LED Output: 6,000 Lumens",
          "Power Draw: 36W",
          "Color Temperature: 6000K",
          "Operating Voltage: 9-16V DC"
        ],
        whatsInBox: [
          "1x Stage Series 12\" Light Bar",
          "Universal mounting brackets",
          "Heavy-duty wiring harness",
          "Switch kit",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["https://advlust.com/cdn/shop/files/dd5015s_12in_drivingpattern_b_1-StageSeries12.jpg?v=1747474461&width=533"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Toyota Hilux", "Force Gurkha"],
        isPopular: true,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "prod-3",
        name: "SSC1 White Pro Standard LED Pod (pair)",
        slug: "ssc1-white-pro-led-pod-pair",
        sku: "DD-SSC1-WP",
        series: "Sport",
        tagline: "The Daily Driver",
        shortDescription: "Compact LED pods perfect for fog light replacement. 2x brighter than stock with SAE compliance.",
        fullDescription: "The SSC1 Pro LED Pod is the ideal fog light replacement. Compact, powerful, and street-legal. Perfect for daily drivers who want better visibility.",
        price: 26399,
        originalPrice: null,
        beamPatterns: ["Spot", "Wide"],
        colors: ["White"],
        features: [
          "Compact pod design",
          "Direct fog light replacement",
          "SAE compliant output",
          "Plug-and-play for most vehicles",
          "Aircraft-grade aluminum"
        ],
        specs: [
          "LED Output: 2,800 Lumens (pair)",
          "Power Draw: 24W total",
          "Beam Pattern: Spot/Wide",
          "Color Temperature: 6000K",
          "Dimensions: 2.5\" x 2.0\""
        ],
        whatsInBox: [
          "2x SSC1 LED Pods",
          "Mounting brackets",
          "Wiring harness with switch",
          "Hardware kit",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["https://advlust.com/cdn/shop/files/dd6464p_ssc1_pro_spot_white_wbl_standard_pair_front_titled.jpg?v=1748492382&width=533"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Maruti Jimny", "Force Gurkha"],
        isPopular: false,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "prod-4",
        name: "SSC2 White Pro Standard LED Pod (pair)",
        slug: "ssc2-white-pro-led-pod-pair",
        sku: "DD-SSC2-WP",
        series: "Pro",
        tagline: "The Weekend Warrior",
        shortDescription: "Mid-size LED pods with impressive output. The sweet spot between compact and maximum power.",
        fullDescription: "The SSC2 Pro delivers more output in a slightly larger package. Perfect for those who need serious illumination for weekend adventures.",
        price: 37399,
        originalPrice: null,
        beamPatterns: ["Combo", "Driving", "Flood"],
        colors: ["White"],
        features: [
          "High-output mid-size design",
          "Multiple beam pattern options",
          "TIR optics technology",
          "Advanced thermal management",
          "IP68 waterproof"
        ],
        specs: [
          "LED Output: 4,200 Lumens (pair)",
          "Power Draw: 36W total",
          "Beam Pattern: Combo/Driving",
          "Color Temperature: 6000K",
          "Dimensions: 3.0\" x 2.5\""
        ],
        whatsInBox: [
          "2x SSC2 LED Pods",
          "Universal mounting brackets",
          "Heavy-duty wiring harness",
          "Relay and switch kit",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["https://advlust.com/cdn/shop/files/dd6408p_c2_pro_white_combo_standard_wbl_-_pro_titled.jpg?v=1747829476&width=533"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Toyota Hilux", "Isuzu V-Cross"],
        isPopular: true,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "prod-5",
        name: "SS3 White Pro LED Pod (pair)",
        slug: "ss3-white-pro-led-pod-pair",
        sku: "DD-SS3-WP",
        series: "Max",
        tagline: "Competition Grade",
        shortDescription: "The highest-output 3-inch LED pod on the market. Used by professional rally teams across India.",
        fullDescription: "The SS3 Pro represents the pinnacle of LED pod technology. Maximum output with precision TIR optics for the most demanding conditions. Competition-grade durability.",
        price: 39999,
        originalPrice: 43999,
        beamPatterns: ["Driving", "Spot", "Flood", "SAE Fog"],
        colors: ["White", "Yellow"],
        features: [
          "Maximum 3-inch pod output",
          "Patented TIR optics",
          "Rally-proven durability",
          "Zero glare SAE patterns available",
          "8-year manufacturer warranty"
        ],
        specs: [
          "LED Output: 6,800 Lumens (pair)",
          "Power Draw: 52W total",
          "Beam Pattern: Multiple options",
          "Color Temperature: 6000K / 3000K",
          "Dimensions: 3.0\" x 2.4\" x 2.0\""
        ],
        whatsInBox: [
          "2x SS3 Pro LED Pods",
          "Premium mounting brackets",
          "Heavy-duty wiring harness",
          "Premium relay kit",
          "Backlit switch panel",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["https://advlust.com/cdn/shop/files/dd6128p_ss3_pro.jpg?v=1755069600&width=533"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Toyota Hilux", "Toyota Fortuner"],
        isPopular: true,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "prod-6",
        name: "Stage Series 18\" Amber Light Bar",
        slug: "stage-series-18-amber-light-bar",
        sku: "DD-SS18-ALB",
        series: "Max",
        tagline: "Fog Dominator",
        shortDescription: "18-inch amber light bar for extreme fog and rain conditions. Cuts through the worst weather.",
        fullDescription: "The Stage Series 18\" Amber is designed specifically for fog, rain, and dust conditions. The amber light cuts through particles that white light cannot.",
        price: 52999,
        originalPrice: null,
        beamPatterns: ["Combo", "Flood"],
        colors: ["Amber"],
        features: [
          "Amber light for fog/rain/dust",
          "18-inch full coverage",
          "Doesn't reflect back in fog",
          "Competition-grade build",
          "Used by Hilux owners in Nilgiris"
        ],
        specs: [
          "Length: 18 inches",
          "LED Output: 9,500 Lumens",
          "Power Draw: 72W",
          "Color Temperature: 3000K Amber",
          "Operating Voltage: 9-16V DC"
        ],
        whatsInBox: [
          "1x Stage Series 18\" Light Bar (Amber)",
          "Heavy-duty mounting brackets",
          "Professional wiring harness",
          "Relay and switch kit",
          "Installation guide"
        ],
        warrantyYears: 8,
        images: ["https://advlust.com/cdn/shop/files/Lightbars-category.jpg?v=1747475023&width=533"],
        compatibleVehicles: ["Toyota Hilux", "Toyota Fortuner", "Isuzu V-Cross", "Mahindra Thar"],
        isPopular: false,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "prod-7",
        name: "SS3 Max LED Pod Kit",
        slug: "ss3-max-led-pod-kit",
        sku: "DD-SS3-MAX",
        series: "Max",
        tagline: "Ultimate Power",
        shortDescription: "Maximum output from a 3-inch pod. Unmatched performance for serious explorers and rally teams.",
        fullDescription: "The SS3 Max pushes the boundaries of what's possible in a compact LED pod. Competition-grade performance with unmatched output.",
        price: 54000,
        originalPrice: 58000,
        beamPatterns: ["Driving", "Spot", "Flood"],
        colors: ["White", "Yellow"],
        features: [
          "Maximum 3-inch pod output ever",
          "Competition-tested durability",
          "Advanced heat management",
          "Premium TIR optics",
          "Used by professional rally teams"
        ],
        specs: [
          "LED Output: 8,200 Lumens (pair)",
          "Power Draw: 68W total",
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
        images: ["https://advlust.com/cdn/shop/files/dd6128p_ss3_pro.jpg?v=1755069600&width=533"],
        compatibleVehicles: ["Mahindra Thar (2020+)", "Scorpio-N", "Toyota Fortuner", "Isuzu V-Cross"],
        isPopular: true,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        createdAt: now,
        updatedAt: now
      }
    ];

    sampleProducts.forEach(p => this.products.set(p.id, p));

    // Sample Vehicles
    const sampleVehicles: Vehicle[] = [
      { id: "veh-1", make: "Mahindra", model: "Thar (2020+)", year: "2020-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6", "prod-7"] },
      { id: "veh-2", make: "Mahindra", model: "Scorpio-N", year: "2022-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-7"] },
      { id: "veh-3", make: "Mahindra", model: "Scorpio Classic", year: "2022-2025", compatibleProductIds: ["prod-1", "prod-3"] },
      { id: "veh-4", make: "Mahindra", model: "XUV700", year: "2021-2025", compatibleProductIds: ["prod-1", "prod-3"] },
      { id: "veh-5", make: "Mahindra", model: "Bolero", year: "2020-2025", compatibleProductIds: ["prod-1", "prod-3"] },
      { id: "veh-6", make: "Maruti Suzuki", model: "Jimny", year: "2023-2025", compatibleProductIds: ["prod-1", "prod-3"] },
      { id: "veh-7", make: "Maruti Suzuki", model: "Gypsy", year: "All Years", compatibleProductIds: ["prod-1", "prod-3"] },
      { id: "veh-8", make: "Toyota", model: "Hilux", year: "2022-2025", compatibleProductIds: ["prod-2", "prod-4", "prod-5", "prod-6", "prod-7"] },
      { id: "veh-9", make: "Toyota", model: "Fortuner", year: "2016-2025", compatibleProductIds: ["prod-2", "prod-5", "prod-6", "prod-7"] },
      { id: "veh-10", make: "Toyota", model: "Land Cruiser", year: "All Years", compatibleProductIds: ["prod-5", "prod-6", "prod-7"] },
      { id: "veh-11", make: "Force", model: "Gurkha", year: "2021-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3"] },
      { id: "veh-12", make: "Isuzu", model: "V-Cross", year: "2019-2025", compatibleProductIds: ["prod-2", "prod-4", "prod-6", "prod-7"] },
      { id: "veh-13", make: "Isuzu", model: "MU-X", year: "2017-2025", compatibleProductIds: ["prod-2", "prod-5", "prod-7"] }
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
        productId: "prod-5"
      },
      {
        id: "rev-2",
        rating: 5,
        text: "I use my Hilux in very foggy conditions in the mountains. The 18 inch Combo Amber lightbar provides excellent visibility in fog and rain.",
        authorName: "Jagadish Kumar",
        authorLocation: "Nilgiris",
        vehicleOwned: "Toyota Hilux",
        isVerified: true,
        productId: "prod-6"
      },
      {
        id: "rev-3",
        rating: 5,
        text: "The installation was incredibly easy - true plug and play. My Jimny now lights up mountain trails like it's noon. Best upgrade I've made to the car.",
        authorName: "Priya M.",
        authorLocation: "Bangalore",
        vehicleOwned: "Maruti Jimny",
        isVerified: true,
        productId: "prod-3"
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
      },
      {
        id: "rev-5",
        rating: 5,
        text: "The SS3 Pro pods completely transformed my Thar's night driving capability. The TIR optics focus light exactly where needed - no scatter, no glare for oncoming traffic.",
        authorName: "Vikram S.",
        authorLocation: "Delhi",
        vehicleOwned: "Mahindra Thar",
        isVerified: true,
        productId: "prod-5"
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      id,
      username: insertUser.username,
      email: insertUser.email,
      passwordHash: insertUser.passwordHash,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      role: insertUser.role ?? "user",
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, role, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }

  async getChildCategories(parentId: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.parentId === parentId);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const now = new Date();
    const category: Category = {
      ...insertCategory,
      id,
      description: insertCategory.description ?? null,
      parentId: insertCategory.parentId ?? null,
      level: insertCategory.level ?? 0,
      sortOrder: insertCategory.sortOrder ?? 0,
      isActive: insertCategory.isActive ?? true,
      imageUrl: insertCategory.imageUrl ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    const updated: Category = { ...existing, ...category, updatedAt: new Date() };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getActiveProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive !== false);
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
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id,
      sku: insertProduct.sku ?? null,
      originalPrice: insertProduct.originalPrice ?? null,
      isPopular: insertProduct.isPopular ?? false,
      isActive: insertProduct.isActive ?? true,
      advlustProductId: insertProduct.advlustProductId ?? null,
      advlustHandle: insertProduct.advlustHandle ?? null,
      warrantyYears: insertProduct.warrantyYears ?? 8,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated: Product = { ...existing, ...product, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async toggleProductActive(id: string, isActive: boolean): Promise<Product | undefined> {
    return this.updateProduct(id, { isActive });
  }

  // Product Variant methods
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return Array.from(this.productVariants.values()).filter(v => v.productId === productId);
  }

  async getVariantById(id: string): Promise<ProductVariant | undefined> {
    return this.productVariants.get(id);
  }

  async getVariantBySku(sku: string): Promise<ProductVariant | undefined> {
    return Array.from(this.productVariants.values()).find(v => v.sku === sku);
  }

  async createProductVariant(insertVariant: InsertProductVariant): Promise<ProductVariant> {
    const id = randomUUID();
    const now = new Date();
    const variant: ProductVariant = {
      ...insertVariant,
      id,
      compareAtPrice: insertVariant.compareAtPrice ?? null,
      color: insertVariant.color ?? null,
      beamPattern: insertVariant.beamPattern ?? null,
      size: insertVariant.size ?? null,
      stockQuantity: insertVariant.stockQuantity ?? 0,
      isAvailable: insertVariant.isAvailable ?? true,
      weight: insertVariant.weight ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.productVariants.set(id, variant);
    return variant;
  }

  async updateProductVariant(id: string, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined> {
    const existing = this.productVariants.get(id);
    if (!existing) return undefined;
    const updated: ProductVariant = { ...existing, ...variant, updatedAt: new Date() };
    this.productVariants.set(id, updated);
    return updated;
  }

  async deleteProductVariant(id: string): Promise<boolean> {
    return this.productVariants.delete(id);
  }

  // Product Media methods
  async getProductMedia(productId: string): Promise<ProductMedia[]> {
    return Array.from(this.productMediaItems.values())
      .filter(m => m.productId === productId)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async createProductMedia(insertMedia: InsertProductMedia): Promise<ProductMedia> {
    const id = randomUUID();
    const media: ProductMedia = {
      ...insertMedia,
      id,
      altText: insertMedia.altText ?? null,
      mediaType: insertMedia.mediaType ?? "image",
      isPrimary: insertMedia.isPrimary ?? false,
      sortOrder: insertMedia.sortOrder ?? 0,
      createdAt: new Date()
    };
    this.productMediaItems.set(id, media);
    return media;
  }

  async updateProductMedia(id: string, media: Partial<InsertProductMedia>): Promise<ProductMedia | undefined> {
    const existing = this.productMediaItems.get(id);
    if (!existing) return undefined;
    const updated: ProductMedia = { ...existing, ...media };
    this.productMediaItems.set(id, updated);
    return updated;
  }

  async deleteProductMedia(id: string): Promise<boolean> {
    return this.productMediaItems.delete(id);
  }

  // Product Categories methods
  async getProductCategories(productId: string): Promise<Category[]> {
    const mappings = Array.from(this.productCategoryMappings.values())
      .filter(m => m.productId === productId);
    return mappings
      .map(m => this.categories.get(m.categoryId))
      .filter((c): c is Category => c !== undefined);
  }

  async setProductCategories(productId: string, categoryIds: string[]): Promise<void> {
    // Remove existing mappings for this product
    Array.from(this.productCategoryMappings.entries())
      .filter(([_, m]) => m.productId === productId)
      .forEach(([key]) => this.productCategoryMappings.delete(key));
    
    // Add new mappings
    categoryIds.forEach(categoryId => {
      const id = randomUUID();
      this.productCategoryMappings.set(id, { id, productId, categoryId });
    });
  }

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoiceById(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceByOrderId(orderId: string): Promise<Invoice | undefined> {
    return Array.from(this.invoices.values()).find(i => i.orderId === orderId);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      taxAmount: insertInvoice.taxAmount ?? 0,
      shippingAmount: insertInvoice.shippingAmount ?? 0,
      discountAmount: insertInvoice.discountAmount ?? 0,
      taxBreakdown: insertInvoice.taxBreakdown ?? null,
      pdfUrl: insertInvoice.pdfUrl ?? null,
      status: insertInvoice.status ?? "generated",
      sentViaWhatsapp: insertInvoice.sentViaWhatsapp ?? false,
      whatsappSentAt: insertInvoice.whatsappSentAt ?? null,
      createdAt: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;
    const updated: Invoice = { ...existing, ...invoice };
    this.invoices.set(id, updated);
    return updated;
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
