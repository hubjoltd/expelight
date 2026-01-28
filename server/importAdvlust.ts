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

const categoryMappings: Record<string, { keywords: string[] }> = {
  "SS5 LED Pods": { keywords: ["SS5 LED Pod", "SS5 White", "SS5 Yellow", "SS5 Add-On", "SS5 Pro"] },
  "SS5 CrossLink Light Bars": { keywords: ["SS5 CrossLink"] },
  "SS3 LED Pods": { keywords: ["SS3 LED Pod", "SS3 White", "SS3 Yellow", "SS3 Max", "SS3 Pro", "SS3 Sport"] },
  "SSC1 LED Pods": { keywords: ["SSC1 LED Pod", "SSC1 White", "SSC1 Yellow", "SSC1"] },
  "SSC2 LED Pods": { keywords: ["SSC2 LED Pod", "SSC2 White", "SSC2 Yellow", "SSC2"] },
  "Stage Series Light Bars": { keywords: ["Light Bar", "Stage Series 6", "Stage Series 12", "Stage Series 18"] },
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

function extractSection(html: string, sectionName: string): string[] {
  const results: string[] = [];
  const regex = new RegExp(`<h[23][^>]*>\\s*${sectionName}\\s*<\\/h[23]>([\\s\\S]*?)(?=<h[23]|$)`, 'gi');
  const matches = html.match(regex);
  if (matches) {
    matches.forEach(match => {
      const listItems = match.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      if (listItems) {
        listItems.forEach(li => {
          const text = extractTextContent(li).trim();
          if (text && text.length > 2) {
            results.push(text);
          }
        });
      }
    });
  }
  return results;
}

function extractFeatures(html: string): string[] {
  const features = extractSection(html, 'Features');
  if (features.length > 0) return features;
  
  const defaultFeatures: string[] = [];
  const text = html.toLowerCase();
  if (text.includes('ip68') || text.includes('waterproof')) defaultFeatures.push("IP68 Waterproof Rating");
  if (text.includes('sae') || text.includes('dot')) defaultFeatures.push("SAE/DOT Compliant");
  if (text.includes('tir') || text.includes('optic')) defaultFeatures.push("Advanced TIR Optics");
  if (text.includes('made in usa') || text.includes('assembled in usa')) defaultFeatures.push("Made in USA");
  if (text.includes('aluminum')) defaultFeatures.push("Durable Aluminum Construction");
  if (text.includes('warranty')) defaultFeatures.push("Industry-Leading Warranty");
  
  return defaultFeatures.length > 0 ? defaultFeatures : ["Premium Quality", "High Efficiency LED", "Easy Installation"];
}

function extractSpecs(html: string): string[] {
  const specs = extractSection(html, 'Specifications');
  if (specs.length > 0) return specs;
  
  const specSection = extractSection(html, 'Specs');
  if (specSection.length > 0) return specSection;
  
  const text = extractTextContent(html);
  const extractedSpecs: string[] = [];
  
  const powerMatch = text.match(/(\d+)\s*(?:watts?|W)\b/i);
  if (powerMatch) extractedSpecs.push(`Power: ${powerMatch[1]}W`);
  
  const voltageMatch = text.match(/(\d+(?:-\d+)?)\s*V\s*DC/i);
  if (voltageMatch) extractedSpecs.push(`Voltage: ${voltageMatch[1]}V DC`);
  
  const ipMatch = text.match(/IP\d+/i);
  if (ipMatch) extractedSpecs.push(`Rating: ${ipMatch[0]}`);
  
  const lumensMatch = text.match(/(\d+,?\d*)\s*lumens?/i);
  if (lumensMatch) extractedSpecs.push(`Output: ${lumensMatch[1]} Lumens`);
  
  return extractedSpecs.length > 0 ? extractedSpecs : ["Premium LED Technology"];
}

function extractInstallation(html: string): string[] {
  const installation = extractSection(html, 'Installation');
  if (installation.length > 0) return installation;
  
  const whatsIncluded = extractSection(html, "What's Included");
  if (whatsIncluded.length > 0) return whatsIncluded;
  
  return ["Mounting Hardware Included", "Complete Installation Guide", "Plug & Play Wiring"];
}

function createSlug(title: string): string {
  return title.toLowerCase()
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
    if (opt.name.toLowerCase().includes('pattern') || opt.name.toLowerCase().includes('beam')) {
      opt.values.forEach(v => patterns.add(v));
    }
  });
  
  if (patterns.size === 0) {
    const beamKeywords = ["Driving", "Fog", "Flood", "Spot", "Combo", "Wide"];
    variants.forEach(v => {
      beamKeywords.forEach(kw => {
        if (v.title.includes(kw) || v.option1?.includes(kw) || v.option2?.includes(kw)) {
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
    if (opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('temp')) {
      opt.values.forEach(v => colors.add(v));
    }
  });
  
  if (colors.size === 0) {
    const colorKeywords = ["White", "Yellow", "Amber", "Red", "Blue"];
    variants.forEach(v => {
      colorKeywords.forEach(kw => {
        if (v.title.includes(kw) || v.option1?.includes(kw) || v.option2?.includes(kw)) {
          colors.add(kw);
        }
      });
    });
  }
  
  return colors.size > 0 ? Array.from(colors) : ["White"];
}

export async function importAllAdvlustProducts() {
  console.log("Starting full Advlust import with complete details...");
  
  const response = await fetch("https://advlust.com/products.json?limit=250");
  const data = await response.json();
  const advlustProducts: AdvlustProduct[] = data.products || [];
  
  console.log(`Found ${advlustProducts.length} products from Advlust.com`);
  
  const categoryNamesSet = new Set<string>();
  advlustProducts.forEach(p => categoryNamesSet.add(getCategoryForProduct(p.title, p.product_type)));
  const categoryNames = Array.from(categoryNamesSet);
  
  const categoryIdMap: Record<string, string> = {};
  
  for (const name of categoryNames) {
    const slug = createSlug(name);
    const existing = await db.select().from(categories).where(eq(categories.slug, slug));
    if (existing.length > 0) {
      categoryIdMap[name] = existing[0].id;
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
      continue;
    }
    
    const baseVariant = advProduct.variants[0];
    const basePrice = baseVariant ? Math.round(parseFloat(baseVariant.price)) : 15000;
    const comparePrice = baseVariant?.compare_at_price 
      ? Math.round(parseFloat(baseVariant.compare_at_price))
      : Math.round(basePrice * 1.2);
    
    const series = getSeriesFromTitle(advProduct.title);
    const slug = createSlug(advProduct.title) + '-' + advProduct.handle;
    
    const fullDescription = extractTextContent(advProduct.body_html);
    const shortDescription = fullDescription.substring(0, 250).trim();
    const features = extractFeatures(advProduct.body_html);
    const specs = extractSpecs(advProduct.body_html);
    const whatsInBox = extractInstallation(advProduct.body_html);
    const beamPatterns = getBeamPatternsFromOptions(advProduct.options || [], advProduct.variants);
    const colors = getColorsFromOptions(advProduct.options || [], advProduct.variants);
    const images = advProduct.images.map(img => img.src);
    
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
      
      let beamPattern: string | null = null;
      let color: string | null = null;
      
      const beamKeywords = ["Driving", "Fog", "Flood", "Spot", "Combo", "Wide"];
      const colorKeywords = ["White", "Yellow", "Amber", "Red", "Blue"];
      
      beamKeywords.forEach(kw => {
        if (variant.title.includes(kw) || variant.option1?.includes(kw) || variant.option2?.includes(kw)) {
          beamPattern = kw;
        }
      });
      
      colorKeywords.forEach(kw => {
        if (variant.title.includes(kw) || variant.option1?.includes(kw) || variant.option2?.includes(kw)) {
          color = kw;
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
    console.log(`Imported: ${advProduct.title}`);
  }
  
  console.log(`\nImport complete! Imported: ${imported}, Skipped: ${skipped}`);
  return { imported, skipped, total: advlustProducts.length };
}
