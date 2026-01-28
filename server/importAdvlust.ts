import { db } from "./db";
import { products, categories, productVariants, productMedia, productCategories } from "@shared/schema";
import { eq } from "drizzle-orm";

interface AdvlustVariant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  sku: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  weight: number;
  weight_unit: string;
}

interface AdvlustImage {
  id: number;
  src: string;
  position: number;
  alt: string | null;
}

interface AdvlustOption {
  name: string;
  position: number;
  values: string[];
}

interface AdvlustProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: AdvlustVariant[];
  images: AdvlustImage[];
  options: AdvlustOption[];
}

const categoryMappings: Record<string, { keywords: string[], parentCategory?: string }> = {
  "SS5 LED Pods": { keywords: ["SS5 LED Pod", "SS5 White", "SS5 Yellow", "SS5 Add-On", "SS5 Pro"] },
  "SS5 CrossLink Light Bars": { keywords: ["SS5 CrossLink"] },
  "SS3 LED Pods": { keywords: ["SS3 LED Pod", "SS3 White", "SS3 Yellow", "SS3 Max", "SS3 Pro", "SS3 Sport"] },
  "SSC1 LED Pods": { keywords: ["SSC1 LED Pod", "SSC1 White", "SSC1 Yellow", "SSC1"] },
  "SSC2 LED Pods": { keywords: ["SSC2 LED Pod", "SSC2 White", "SSC2 Yellow", "SSC2"] },
  "Stage Series Light Bars": { keywords: ["Light Bar", "18\" White", "18\" Amber", "12\" White", "12\" Amber", "6\" White", "6\" Amber", "Stage Series 6", "Stage Series 12", "Stage Series 18"] },
  "Rock Lights": { keywords: ["Rock Light"] },
  "Pod Covers": { keywords: ["LED Pod Cover", "Pod Cover"] },
  "Fog Light Mounting Kits": { keywords: ["Fog Light Mounting", "Type SV", "Type GM", "Type CH", "Type B", "Type FBS"] },
  "Ditch Light Kits": { keywords: ["Ditch Light", "Ditch Bracket"] },
  "Wiring Harnesses": { keywords: ["Wiring Harness", "Harness", "Splitter", "Pigtail"] },
  "Mounting Brackets": { keywords: ["Bracket", "Mount Kit", "Mounting Kit", "A-Pillar"] },
  "Bezels & Gaskets": { keywords: ["Bezel", "Gasket"] },
  "Controllers & Switches": { keywords: ["Controller", "Switch Panel", "D-Switch"] },
  "Vehicle-Specific Kits": { keywords: ["Jeep", "Ford F-150", "Colorado", "Canyon", "Sierra", "Mustang", "Wrangler", "Gladiator", "Bronco", "Ranger", "Tacoma", "4Runner", "Tundra"] },
  "LED Headlights": { keywords: ["Elite LED Headlight", "Headlights", "LED Headlight"] },
  "Sidemarkers": { keywords: ["Sidemarker", "Side Marker"] },
  "Reverse Light Kits": { keywords: ["Reverse", "HitchMount", "Backup"] },
  "Interior Lighting": { keywords: ["Interior", "Dome", "Map Light", "Trunk Light"] },
  "Turn Signal Lights": { keywords: ["Turn Signal", "Blinker", "Switchback"] },
  "Tail Lights": { keywords: ["Tail Light", "Brake Light", "Stop Light"] },
  "Accessories": { keywords: ["Accessory", "Cover", "Cap", "Extension"] },
};

function getCategoryForProduct(title: string, productType: string): string {
  for (const [category, config] of Object.entries(categoryMappings)) {
    if (config.keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  if (productType && productType.trim()) {
    return productType;
  }
  return "Other Accessories";
}

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() || '';
}

function createSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractSpecifications(bodyHtml: string): string[] {
  const specs: string[] = [];
  const text = stripHtml(bodyHtml);
  
  const patterns = [
    /(\d+W|\d+ Watts?)/gi,
    /(\d+-\d+V DC|\d+V DC)/gi,
    /(IP\d+)/gi,
    /(SAE[\/\s]?(?:J\d+)?|DOT)/gi,
    /(\d+K|\d+,?\d*\s*Lumens?)/gi,
    /(Aluminum|Polycarbonate|Steel|ABS)/gi,
    /(\d+"|\d+\s*inch)/gi,
  ];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(m => {
        if (!specs.includes(m.trim())) {
          specs.push(m.trim());
        }
      });
    }
  });
  
  return specs.length > 0 ? specs : ["Premium LED Technology", "High Efficiency Design"];
}

function extractFeatures(bodyHtml: string): string[] {
  const features: string[] = [];
  const text = stripHtml(bodyHtml);
  
  if (text.toLowerCase().includes('ip68') || text.toLowerCase().includes('waterproof')) {
    features.push("IP68 Waterproof Rating");
  }
  if (text.toLowerCase().includes('sae') || text.toLowerCase().includes('dot')) {
    features.push("SAE/DOT Compliant");
  }
  if (text.toLowerCase().includes('tir') || text.toLowerCase().includes('optic')) {
    features.push("Advanced TIR Optics");
  }
  if (text.toLowerCase().includes('made in usa') || text.toLowerCase().includes('diode dynamics')) {
    features.push("Made in USA by Diode Dynamics");
  }
  if (text.toLowerCase().includes('aluminum') || text.toLowerCase().includes('billet')) {
    features.push("Durable Aluminum Housing");
  }
  if (text.toLowerCase().includes('warranty')) {
    features.push("Industry-Leading Warranty");
  }
  
  if (features.length === 0) {
    features.push("Premium Quality Construction", "High Efficiency LED", "Easy Installation");
  }
  
  return features;
}

function getSeriesFromTitle(title: string): string {
  if (title.includes("SS5") || title.includes("Max")) return "Max";
  if (title.includes("SS3") || title.includes("Pro")) return "Pro";
  if (title.includes("SSC") || title.includes("Sport")) return "Sport";
  if (title.includes("Elite")) return "Max";
  return "Pro";
}

function getBeamPatternsFromVariants(variants: AdvlustVariant[], options: AdvlustOption[]): string[] {
  const beamPatterns = new Set<string>();
  const beamKeywords = ["Driving", "Fog", "Flood", "Spot", "Combo", "Wide", "SAE", "DOT"];
  
  const beamOption = options.find(o => 
    o.name.toLowerCase().includes('pattern') || 
    o.name.toLowerCase().includes('beam') ||
    o.name.toLowerCase().includes('type')
  );
  
  if (beamOption) {
    beamOption.values.forEach(v => beamPatterns.add(v));
  }
  
  variants.forEach(v => {
    beamKeywords.forEach(keyword => {
      if (v.title.includes(keyword) || v.option1?.includes(keyword) || v.option2?.includes(keyword)) {
        beamPatterns.add(keyword);
      }
    });
  });
  
  return beamPatterns.size > 0 ? Array.from(beamPatterns) : ["Standard"];
}

function getColorsFromVariants(variants: AdvlustVariant[], options: AdvlustOption[]): string[] {
  const colors = new Set<string>();
  const colorKeywords = ["White", "Yellow", "Amber", "Red", "Blue", "Green", "RGB"];
  
  const colorOption = options.find(o => 
    o.name.toLowerCase().includes('color') || 
    o.name.toLowerCase().includes('temp')
  );
  
  if (colorOption) {
    colorOption.values.forEach(v => colors.add(v));
  }
  
  variants.forEach(v => {
    colorKeywords.forEach(keyword => {
      if (v.title.includes(keyword) || v.option1?.includes(keyword) || v.option2?.includes(keyword)) {
        colors.add(keyword);
      }
    });
  });
  
  return colors.size > 0 ? Array.from(colors) : ["White"];
}

export async function importAllAdvlustProducts() {
  console.log("Starting full Advlust import with all details...");
  
  const response = await fetch("https://advlust.com/products.json?limit=250");
  const data = await response.json();
  const advlustProducts: AdvlustProduct[] = data.products || [];
  
  console.log(`Found ${advlustProducts.length} products from Advlust.com`);
  
  const categoryNamesSet = new Set<string>();
  advlustProducts.forEach(p => categoryNamesSet.add(getCategoryForProduct(p.title, p.product_type)));
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
  let updated = 0;
  
  for (const advProduct of advlustProducts) {
    const existingProducts = await db.select().from(products)
      .where(eq(products.advlustProductId, String(advProduct.id)));
    
    if (existingProducts.length > 0) {
      skipped++;
      console.log(`Skipping (exists): ${advProduct.title}`);
      continue;
    }
    
    const baseVariant = advProduct.variants[0];
    const basePrice = baseVariant 
      ? Math.round(parseFloat(baseVariant.price))
      : 15000;
    const comparePrice = baseVariant?.compare_at_price 
      ? Math.round(parseFloat(baseVariant.compare_at_price))
      : Math.round(basePrice * 1.2);
    
    const series = getSeriesFromTitle(advProduct.title);
    const slug = createSlug(advProduct.title) + '-' + advProduct.handle;
    const description = stripHtml(advProduct.body_html) || `Premium ${advProduct.title} from Diode Dynamics`;
    const images = advProduct.images.map(img => img.src);
    const specs = extractSpecifications(advProduct.body_html);
    const features = extractFeatures(advProduct.body_html);
    const beamPatterns = getBeamPatternsFromVariants(advProduct.variants, advProduct.options || []);
    const colors = getColorsFromVariants(advProduct.variants, advProduct.options || []);
    
    const [newProduct] = await db.insert(products).values({
      name: advProduct.title,
      slug,
      sku: baseVariant?.sku || `DD-${advProduct.id}`,
      series,
      tagline: `Premium ${series} Series LED Lighting`,
      shortDescription: description.substring(0, 250),
      fullDescription: description,
      price: basePrice,
      originalPrice: comparePrice,
      beamPatterns,
      colors,
      features,
      specs,
      whatsInBox: ["LED Unit(s)", "Mounting Hardware", "Wiring Harness", "Installation Instructions"],
      warrantyYears: 8,
      images: images.length > 0 ? images : ["https://advlust.com/cdn/shop/files/placeholder.png"],
      compatibleVehicles: [],
      isPopular: advProduct.variants.length > 3,
      isActive: true,
      advlustProductId: String(advProduct.id),
      advlustHandle: advProduct.handle,
    }).returning();
    
    for (const variant of advProduct.variants) {
      const variantPrice = Math.round(parseFloat(variant.price));
      const variantComparePrice = variant.compare_at_price 
        ? Math.round(parseFloat(variant.compare_at_price)) 
        : null;
      
      let beamPattern: string | null = null;
      let color: string | null = null;
      
      const beamKeywords = ["Driving", "Fog", "Flood", "Spot", "Combo", "Wide", "SAE", "DOT"];
      const colorKeywords = ["White", "Yellow", "Amber", "Red", "Blue"];
      
      beamKeywords.forEach(keyword => {
        if (variant.title.includes(keyword) || variant.option1?.includes(keyword) || variant.option2?.includes(keyword)) {
          beamPattern = keyword;
        }
      });
      
      colorKeywords.forEach(keyword => {
        if (variant.title.includes(keyword) || variant.option1?.includes(keyword) || variant.option2?.includes(keyword)) {
          color = keyword;
        }
      });
      
      const uniqueSku = `${variant.sku || 'DD'}-${advProduct.id}-${variant.id}`;
      await db.insert(productVariants).values({
        productId: newProduct.id,
        name: variant.title !== "Default Title" ? variant.title : advProduct.title,
        sku: uniqueSku,
        price: variantPrice,
        compareAtPrice: variantComparePrice,
        beamPattern,
        color,
        stockQuantity: 10,
        isAvailable: true,
        weight: variant.weight ? String(variant.weight) : null,
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
        altText: img.alt || advProduct.title,
      });
    }
    
    const categoryName = getCategoryForProduct(advProduct.title, advProduct.product_type);
    const categoryId = categoryIdMap[categoryName];
    if (categoryId) {
      await db.insert(productCategories).values({
        productId: newProduct.id,
        categoryId,
      });
    }
    
    imported++;
    console.log(`Imported: ${advProduct.title} (${advProduct.variants.length} variants, ${advProduct.images.length} images)`);
  }
  
  console.log(`\nImport complete!`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total products on Advlust: ${advlustProducts.length}`);
  
  return { imported, skipped, updated, total: advlustProducts.length };
}
