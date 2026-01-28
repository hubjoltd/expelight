import { db } from "./db";
import { products, categories, productVariants, productMedia, productCategories } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

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

const tagToCategorySlug: Record<string, string> = {
  "SS5 LED Light Pods": "ss5-led-light-pods",
  "SS5 LED Pods": "ss5-led-light-pods",
  "SS5 LED Light Bars": "ss5-led-light-bars",
  "SS3 LED Pods": "ss3-led-light-pods",
  "SS3-Standard": "ss3-led-light-pods",
  "SS3-Flush": "ss3-led-light-pods",
  "SSC2 LED Pods": "ssc2-led-pods",
  "SSC2-Standard": "ssc2-led-pods",
  "SSC2-Flush": "ssc2-led-pods",
  "SSC1 LED Pods": "ssc1-led-pods",
  "SSC1-Standard": "ssc1-led-pods",
  "SSC1-Flush": "ssc1-led-pods",
  "Stage Series LED Light Bars": "stage-series-light-bars",
  "Rock Lights": "rock-lights",
  "Single-Color": "rock-lights",
  "RGBW": "rgbw",
  "Covers": "covers",
  "No Backlight": "wiring-harnesses",
  "Bezels": "bezels",
  "Backlight": "backlight",
  "Controllers": "controllers",
  "D - Switch": "d-switch",
  "Headlights": "headlights",
  "LED Wiring and Installation": "led-wiring-installation",
  "Replacement Brackets": "universal-kits",
  "Roll Bar Mount Kit": "universal-kits",
  "Flush Mount Reverse": "universal-kits",
  "HitchMount": "hitch-mount",
  "Ford": "ford",
  "Jeep": "jeep",
  "Chevrolet": "chevrolet",
  "GMC": "gmc",
  "Replacement Lenses": "replacement-lenses",
  "Sidemarkers": "fog-lamps",
};

function getCategorySlugFromTags(tags: string[]): string | null {
  for (const tag of tags) {
    const slug = tagToCategorySlug[tag];
    if (slug) return slug;
  }
  return null;
}

function extractTextContent(html: string): string {
  if (!html) return '';
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

function extractListItems(html: string, sectionName: string): string[] {
  const results: string[] = [];
  const regex = new RegExp(`<h[23][^>]*>\\s*${sectionName}\\s*<\\/h[23]>([\\s\\S]*?)(?=<h[23]|$)`, 'gi');
  const match = regex.exec(html);
  if (match) {
    const listItems = match[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (listItems) {
      listItems.forEach(li => {
        const text = extractTextContent(li).trim();
        if (text && text.length > 2) {
          results.push(text);
        }
      });
    }
  }
  return results;
}

function extractFeatures(html: string): string[] {
  const features = extractListItems(html, 'Features');
  if (features.length > 0) return features.slice(0, 8);
  
  const defaultFeatures: string[] = [];
  const text = html.toLowerCase();
  if (text.includes('ip68') || text.includes('waterproof')) defaultFeatures.push("IP68 Waterproof Rating");
  if (text.includes('sae') || text.includes('dot')) defaultFeatures.push("SAE/DOT Compliant");
  if (text.includes('tir') || text.includes('optic')) defaultFeatures.push("Advanced TIR Optics");
  if (text.includes('made in usa') || text.includes('assembled in usa')) defaultFeatures.push("Assembled in USA");
  if (text.includes('aluminum')) defaultFeatures.push("Durable Aluminum Construction");
  if (text.includes('warranty')) defaultFeatures.push("Industry-Leading Warranty");
  
  return defaultFeatures.length > 0 ? defaultFeatures : ["Premium Quality", "High Efficiency LED", "Easy Installation"];
}

function extractSpecs(html: string, options: AdvlustOption[], variants: AdvlustVariant[]): string[] {
  const specs: string[] = [];
  
  options.forEach(opt => {
    if (opt.values.length > 0) {
      specs.push(`${opt.name}: ${opt.values.join(', ')}`);
    }
  });
  
  const text = extractTextContent(html);
  const powerMatch = text.match(/(\d+)\s*(?:watts?|W)\b/i);
  if (powerMatch) specs.push(`Power: ${powerMatch[1]}W`);
  
  const ipMatch = text.match(/IP\d+/i);
  if (ipMatch) specs.push(`Rating: ${ipMatch[0]}`);
  
  const lumensMatch = text.match(/(\d+,?\d*)\s*lumens?/i);
  if (lumensMatch) specs.push(`Output: ${lumensMatch[1]} Lumens`);
  
  return specs.length > 0 ? specs : ["Premium LED Technology"];
}

function extractSpecificationsTable(html: string): object | null {
  const specs: Record<string, string> = {};
  const text = extractTextContent(html);
  
  const patterns = [
    { key: "Main Beam Power (watts)", pattern: /Main Beam Power[^:]*:\s*([^\n]+)/i },
    { key: "Backlight Power (watts)", pattern: /Backlight Power[^:]*:\s*([^\n]+)/i },
    { key: "Main Beam Current (amps @ 12.8V)", pattern: /Main Beam Current[^:]*:\s*([^\n]+)/i },
    { key: "Backlight Current (amps @ 12.8V)", pattern: /Backlight Current[^:]*:\s*([^\n]+)/i },
    { key: "Color Temp (CCT)", pattern: /Color Temp[^:]*:\s*([^\n]+)/i },
    { key: "Operating Voltage", pattern: /Operating Voltage[^:]*:\s*([^\n]+)/i },
    { key: "Polarity", pattern: /Polarity[^:]*:\s*([^\n]+)/i },
    { key: "Operating Temperature", pattern: /Operating Temperature[^:]*:\s*([^\n]+)/i },
    { key: "LED Emitter", pattern: /LED Emitter[^:]*:\s*([^\n]+)/i },
    { key: "Connector(s)", pattern: /Connector[^:]*:\s*([^\n]+)/i },
    { key: "Driver Features", pattern: /Driver Features[^:]*:\s*([^\n]+)/i },
    { key: "Materials", pattern: /Materials[^:]*:\s*([^\n]+)/i },
    { key: "Cooling", pattern: /Cooling[^:]*:\s*([^\n]+)/i },
    { key: "Intrusion Ratings", pattern: /Intrusion Rating[^:]*:\s*([^\n]+)/i },
  ];
  
  for (const { key, pattern } of patterns) {
    const match = text.match(pattern);
    if (match) {
      specs[key] = match[1].trim();
    }
  }
  
  return Object.keys(specs).length > 0 ? specs : null;
}

function extractPartNumbers(variants: AdvlustVariant[], title: string): object[] {
  return variants.map(v => ({
    sku: v.sku,
    price: Math.round(parseFloat(v.price)),
    name: v.title !== "Default Title" ? v.title : title,
    weight: v.weight ? `${v.weight / 1000} lbs` : null,
  }));
}

function extractInstallationGuide(html: string): object {
  const text = extractTextContent(html);
  const guide: Record<string, string> = {
    installationTime: "30-60 minutes",
    toolsNeeded: "Basic Toolset",
    note: "We recommend using 5 ft-lbs of torque to install the long-end bolts, and adding Loctite to prevent the bolts from loosening after installation."
  };
  
  const timeMatch = text.match(/Installation Time[^:]*:\s*([^\n]+)/i);
  if (timeMatch) guide.installationTime = timeMatch[1].trim();
  
  const toolsMatch = text.match(/Tools Needed[^:]*:\s*([^\n]+)/i);
  if (toolsMatch) guide.toolsNeeded = toolsMatch[1].trim();
  
  return guide;
}

function extractWhatsInBox(html: string): string[] {
  const results: string[] = [];
  
  const boxMatch = html.match(/<strong>In the Box:<\/strong>\s*<ul>([\s\S]*?)<\/ul>/i);
  if (boxMatch) {
    const listItems = boxMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (listItems) {
      listItems.forEach(li => {
        const text = extractTextContent(li).trim();
        if (text && text.length > 2) {
          results.push(text);
        }
      });
    }
  }
  
  if (results.length === 0) {
    const items = extractListItems(html, 'In the Box');
    if (items.length > 0) return items.slice(0, 10);
  }
  
  if (results.length === 0) {
    const included = extractListItems(html, "What's Included");
    if (included.length > 0) return included.slice(0, 10);
  }
  
  return results.length > 0 ? results : ["Mounting Hardware Included", "Installation Guide", "Wiring Connector"];
}

function createSlug(title: string, handle: string): string {
  return handle || title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getSeriesFromTitle(title: string): string {
  if (title.includes("SS5") || title.includes("Max")) return "Max";
  if (title.includes("SS3") || title.includes("Pro")) return "Pro";
  if (title.includes("SSC") || title.includes("Sport")) return "Sport";
  if (title.includes("Elite")) return "Max";
  return "Pro";
}

function getBeamPatternsFromOptions(options: AdvlustOption[], variants: AdvlustVariant[]): string[] {
  const patterns = new Set<string>();
  
  options.forEach(opt => {
    const optName = opt.name.toLowerCase();
    if (optName.includes('optic') || optName.includes('pattern') || optName.includes('beam')) {
      opt.values.forEach(v => patterns.add(v));
    }
  });
  
  if (patterns.size === 0) {
    variants.forEach(v => {
      if (v.option1) patterns.add(v.option1);
    });
  }
  
  if (patterns.size === 0) {
    const beamKeywords = ["Driving", "Fog", "Flood", "Spot", "Combo", "Wide"];
    variants.forEach(v => {
      beamKeywords.forEach(kw => {
        if (v.title.includes(kw)) {
          patterns.add(kw);
        }
      });
    });
  }
  
  return patterns.size > 0 ? Array.from(patterns) : ["Standard"];
}

function getColorsFromOptions(options: AdvlustOption[], variants: AdvlustVariant[]): string[] {
  const colors = new Set<string>();
  
  options.forEach(opt => {
    const optName = opt.name.toLowerCase();
    if (optName.includes('color') && !optName.includes('optic')) {
      opt.values.forEach(v => colors.add(v));
    }
  });
  
  if (colors.size === 0) {
    options.forEach(opt => {
      const optName = opt.name.toLowerCase();
      if (optName.includes('power') || optName.includes('level') || optName.includes('watt')) {
        opt.values.forEach(v => colors.add(v));
      }
    });
  }
  
  if (colors.size === 0) {
    const colorKeywords = ["White", "Yellow", "Amber", "Red", "Blue"];
    variants.forEach(v => {
      colorKeywords.forEach(kw => {
        if (v.title.includes(kw) || v.option2?.includes(kw)) {
          colors.add(kw);
        }
      });
    });
  }
  
  return colors.size > 0 ? Array.from(colors) : ["White"];
}

export async function importAllAdvlustProducts() {
  console.log("Starting full Advlust import with complete variant details...");
  
  const response = await fetch("https://advlust.com/products.json?limit=250");
  const data = await response.json();
  const advlustProducts: AdvlustProduct[] = data.products || [];
  
  console.log(`Found ${advlustProducts.length} products from Advlust.com`);
  
  const allCategories = await db.select().from(categories);
  const categorySlugMap: Record<string, string> = {};
  allCategories.forEach(cat => {
    categorySlugMap[cat.slug] = cat.id;
  });
  console.log(`Loaded ${allCategories.length} existing categories`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const advProduct of advlustProducts) {
    const existingProducts = await db.select().from(products)
      .where(eq(products.advlustProductId, String(advProduct.id)));
    
    if (existingProducts.length > 0) {
      skipped++;
      continue;
    }
    
    const baseVariant = advProduct.variants[0];
    const basePrice = baseVariant ? Math.round(parseFloat(baseVariant.price)) : 15000;
    const comparePrice = baseVariant?.compare_at_price 
      ? Math.round(parseFloat(baseVariant.compare_at_price))
      : Math.round(basePrice * 1.2);
    
    const series = getSeriesFromTitle(advProduct.title);
    const slug = createSlug(advProduct.title, advProduct.handle);
    
    const fullDescription = extractTextContent(advProduct.body_html);
    const shortDescription = fullDescription.substring(0, 300).trim();
    const features = extractFeatures(advProduct.body_html);
    const specs = extractSpecs(advProduct.body_html, advProduct.options || [], advProduct.variants);
    const whatsInBox = extractWhatsInBox(advProduct.body_html);
    const beamPatterns = getBeamPatternsFromOptions(advProduct.options || [], advProduct.variants);
    const colors = getColorsFromOptions(advProduct.options || [], advProduct.variants);
    const images = advProduct.images.map(img => img.src);
    
    const specificationsTable = extractSpecificationsTable(advProduct.body_html);
    const partNumbers = extractPartNumbers(advProduct.variants, advProduct.title);
    const installationGuide = extractInstallationGuide(advProduct.body_html);
    
    const [newProduct] = await db.insert(products).values({
      name: advProduct.title,
      slug,
      sku: baseVariant?.sku || `DD-${advProduct.id}`,
      series,
      tagline: `Premium ${series} Series LED Lighting`,
      shortDescription: shortDescription || `Premium ${advProduct.title} from Diode Dynamics`,
      fullDescription: fullDescription || advProduct.title,
      price: basePrice,
      originalPrice: comparePrice,
      beamPatterns,
      colors,
      features,
      specs,
      specificationsTable: specificationsTable ? JSON.stringify(specificationsTable) : null,
      partNumbers: JSON.stringify(partNumbers),
      installationGuide: JSON.stringify(installationGuide),
      whatsInBox,
      warrantyYears: 8,
      images: images.length > 0 ? images : [],
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
      
      const beamPattern = variant.option1 || null;
      const color = variant.option2 || variant.option3 || null;
      
      const baseSku = variant.sku || `DD-${advProduct.id}`;
      
      const existingVariant = await db.select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.sku, baseSku))
        .limit(1);
      
      const finalSku = existingVariant.length > 0 
        ? `${baseSku}-${variant.id}` 
        : baseSku;
      
      await db.insert(productVariants).values({
        productId: newProduct.id,
        name: variant.title !== "Default Title" ? variant.title : advProduct.title,
        sku: finalSku,
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
    
    const categorySlug = getCategorySlugFromTags(advProduct.tags);
    if (categorySlug && categorySlugMap[categorySlug]) {
      await db.insert(productCategories).values({
        productId: newProduct.id,
        categoryId: categorySlugMap[categorySlug],
      });
    }
    
    imported++;
    console.log(`Imported: ${advProduct.title} (${advProduct.variants.length} variants)`);
  }
  
  console.log(`\nImport complete! Imported: ${imported}, Skipped: ${skipped}`);
  return { imported, skipped, total: advlustProducts.length };
}

export async function reimportAllProducts() {
  console.log("Deleting existing imported products...");
  
  const importedProducts = await db.select({ id: products.id })
    .from(products)
    .where(sql`advlust_product_id IS NOT NULL`);
  
  console.log(`Found ${importedProducts.length} products to delete`);
  
  for (const p of importedProducts) {
    await db.delete(productVariants).where(eq(productVariants.productId, p.id));
    await db.delete(productMedia).where(eq(productMedia.productId, p.id));
    await db.delete(productCategories).where(eq(productCategories.productId, p.id));
    await db.delete(products).where(eq(products.id, p.id));
  }
  
  console.log("Deleted. Now re-importing...");
  return await importAllAdvlustProducts();
}
