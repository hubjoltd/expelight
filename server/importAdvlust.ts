import { db } from "./db";
import { products, categories, productVariants, productMedia, productCategories } from "@shared/schema";
import { eq } from "drizzle-orm";

interface AdvlustVariant {
  id: number;
  title: string;
  price: string;
  sku: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

interface AdvlustImage {
  id: number;
  src: string;
  position: number;
}

interface AdvlustProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  variants: AdvlustVariant[];
  images: AdvlustImage[];
}

const categoryMappings: Record<string, string[]> = {
  "SS5 LED Pods": ["SS5 LED Pod", "SS5 White", "SS5 Yellow", "SS5 Add-On"],
  "SS5 CrossLink Light Bars": ["SS5 CrossLink"],
  "SS3 LED Pods": ["SS3 LED Pod", "SS3 White", "SS3 Yellow", "SS3 Max", "SS3 Pro", "SS3 Sport"],
  "SSC1 LED Pods": ["SSC1 LED Pod", "SSC1 White", "SSC1 Yellow"],
  "SSC2 LED Pods": ["SSC2 LED Pod", "SSC2 White", "SSC2 Yellow"],
  "Stage Series Light Bars": ["Light Bar", "18\" White", "18\" Amber", "12\" White", "12\" Amber", "6\" White", "6\" Amber"],
  "Rock Lights": ["Rock Light"],
  "Pod Covers": ["LED Pod Cover", "Pod Cover"],
  "Fog Light Mounting Kits": ["Fog Light Mounting", "Type SV", "Type GM", "Type CH", "Type B", "Type FBS"],
  "Ditch Light Kits": ["Ditch Light"],
  "Wiring Harnesses": ["Wiring Harness", "Harness", "Splitter", "Pigtail"],
  "Mounting Brackets": ["Bracket", "Mount Kit", "Mounting Kit"],
  "Bezels & Gaskets": ["Bezel", "Gasket"],
  "Controllers & Switches": ["Controller", "Switch Panel", "D-Switch"],
  "Vehicle-Specific Kits": ["Jeep", "Ford F-150", "Colorado", "Canyon", "Sierra", "Mustang", "Wrangler", "Gladiator"],
  "LED Headlights": ["Elite LED Headlight", "Headlights"],
  "Sidemarkers": ["Sidemarker"],
  "Reverse Light Kits": ["Reverse", "HitchMount"],
};

function getCategoryForProduct(title: string): string {
  for (const [category, keywords] of Object.entries(categoryMappings)) {
    if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  return "Other Accessories";
}

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '';
}

function createSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function importAllAdvlustProducts() {
  console.log("Starting Advlust import...");
  
  const response = await fetch("https://advlust.com/products.json?limit=250");
  const data = await response.json();
  const advlustProducts: AdvlustProduct[] = data.products || [];
  
  console.log(`Found ${advlustProducts.length} products from Advlust.com`);
  
  const categoryNamesSet = new Set<string>();
  advlustProducts.forEach(p => categoryNamesSet.add(getCategoryForProduct(p.title)));
  const categoryNames = Array.from(categoryNamesSet);
  console.log("Categories to create:", categoryNames);
  
  const categoryIdMap: Record<string, string> = {};
  
  for (const name of categoryNames) {
    const slug = createSlug(name);
    
    const existing = await db.select().from(categories).where(eq(categories.slug, slug));
    if (existing.length > 0) {
      categoryIdMap[name] = existing[0].id;
      console.log(`Category exists: ${name}`);
    } else {
      const [newCat] = await db.insert(categories).values({
        name,
        slug,
        level: 0,
        isActive: true,
      }).returning();
      categoryIdMap[name] = newCat.id;
      console.log(`Created category: ${name}`);
    }
  }
  
  let imported = 0;
  let skipped = 0;
  
  for (const advProduct of advlustProducts) {
    const existingProducts = await db.select().from(products)
      .where(eq(products.advlustProductId, String(advProduct.id)));
    
    if (existingProducts.length > 0) {
      skipped++;
      console.log(`Skipping (exists): ${advProduct.title}`);
      continue;
    }
    
    const basePrice = advProduct.variants.length > 0 
      ? Math.round(parseFloat(advProduct.variants[0].price) * 85)
      : 15000;
    
    const series = advProduct.title.includes("SS5") ? "Max" 
      : advProduct.title.includes("SS3") ? "Pro" 
      : advProduct.title.includes("SSC") ? "Sport"
      : "Sport";
    
    const slug = createSlug(advProduct.title) + '-' + advProduct.id;
    const description = stripHtml(advProduct.body_html) || `Premium ${advProduct.title} from Diode Dynamics`;
    const images = advProduct.images.map(img => img.src);
    
    const [newProduct] = await db.insert(products).values({
      name: advProduct.title,
      slug,
      sku: advProduct.variants[0]?.sku || `ADV-${advProduct.id}`,
      series,
      tagline: `Premium ${series} Series LED Lighting`,
      shortDescription: description.substring(0, 200),
      fullDescription: description,
      price: basePrice,
      originalPrice: Math.round(basePrice * 1.2),
      beamPatterns: ["Flood", "Spot"],
      colors: ["White", "Yellow"],
      features: ["SAE/DOT Compliant", "IP68 Rated", "Made in USA"],
      specs: [`Power: ${series === "Max" ? "50W" : series === "Pro" ? "30W" : "20W"}`, "Voltage: 9-16V DC"],
      whatsInBox: ["LED Pod(s)", "Mounting Hardware", "Wiring"],
      warrantyYears: 8,
      images: images.length > 0 ? images : ["https://advlust.com/cdn/shop/files/placeholder.png"],
      compatibleVehicles: [],
      isPopular: false,
      isActive: true,
      advlustProductId: String(advProduct.id),
      advlustHandle: advProduct.handle,
    }).returning();
    
    for (const variant of advProduct.variants) {
      const variantPrice = Math.round(parseFloat(variant.price) * 85);
      const baseSku = variant.sku || `ADV-${advProduct.id}`;
      const uniqueSku = `${baseSku}-${variant.id}`;
      await db.insert(productVariants).values({
        productId: newProduct.id,
        name: variant.title !== "Default Title" ? variant.title : advProduct.title,
        sku: uniqueSku,
        price: variantPrice,
        stockQuantity: 10,
      });
    }
    
    for (let i = 0; i < advProduct.images.length; i++) {
      const img = advProduct.images[i];
      await db.insert(productMedia).values({
        productId: newProduct.id,
        url: img.src,
        mediaType: "image",
        isPrimary: i === 0,
        sortOrder: img.position || i,
      });
    }
    
    const categoryName = getCategoryForProduct(advProduct.title);
    const categoryId = categoryIdMap[categoryName];
    if (categoryId) {
      await db.insert(productCategories).values({
        productId: newProduct.id,
        categoryId,
      });
    }
    
    imported++;
    console.log(`Imported: ${advProduct.title} -> ${categoryName}`);
  }
  
  console.log(`\nImport complete! Imported: ${imported}, Skipped: ${skipped}`);
  return { imported, skipped, total: advlustProducts.length };
}
