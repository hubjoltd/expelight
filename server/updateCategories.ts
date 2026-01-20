import { db } from "./db";
import { categories, productCategories, products } from "@shared/schema";
import { eq, ilike, or, sql } from "drizzle-orm";

interface CategoryDef {
  name: string;
  slug: string;
  parentSlug?: string;
  level: number;
  imageUrl?: string;
}

const categoryStructure: CategoryDef[] = [
  // Main Categories (Level 0)
  { name: "LED Light Bars", slug: "led-light-bars", level: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Lightbars-caetgory.jpg" },
  { name: "LED Pods", slug: "led-pods", level: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Pods-caetgory.jpg" },
  { name: "Brackets & Kits", slug: "brackets-kits", level: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Brackets_Kits-category.jpg" },
  { name: "Switch Panel", slug: "switch-panel", level: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/D-Switch-category.jpg" },
  { name: "Hitch Mount", slug: "hitch-mount", level: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/HitchMount-category.jpg" },
  { name: "Rock Lights", slug: "rock-lights", level: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/RockLigh-caetgory.jpg" },
  { name: "Accessories", slug: "accessories", level: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Accessories-caetgory.jpg" },
  
  // LED Light Bars Subcategories (Level 1)
  { name: "Stage Series LED Light Bars", slug: "stage-series-light-bars", parentSlug: "led-light-bars", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Stage-Series-category.jpg" },
  { name: "SS5 CrossLink Light Bars", slug: "ss5-crosslink-light-bars", parentSlug: "led-light-bars", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS5-LED-category.jpg" },
  
  // LED Pods Subcategories (Level 1)
  { name: "SSC1 LED Pods", slug: "ssc1-led-pods", parentSlug: "led-pods", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SSC1-category.jpg" },
  { name: "SSC2 LED Pods", slug: "ssc2-led-pods", parentSlug: "led-pods", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SSC2-category.jpg" },
  { name: "SS3 LED Pods", slug: "ss3-led-pods", parentSlug: "led-pods", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS3-category.jpg" },
  { name: "SS5 LED Pods", slug: "ss5-led-pods", parentSlug: "led-pods", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS5-category.jpg" },
  
  // Brackets & Kits Subcategories (Level 1)
  { name: "Ford Kits", slug: "ford-kits", parentSlug: "brackets-kits", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Ford-category.jpg" },
  { name: "Honda Kits", slug: "honda-kits", parentSlug: "brackets-kits", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Honda-category.jpg" },
  { name: "Jeep Kits", slug: "jeep-kits", parentSlug: "brackets-kits", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Jeep-category.jpg" },
  { name: "Universal Kits", slug: "universal-kits", parentSlug: "brackets-kits", level: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Roll_Bar_Mount_Kit-category.jpg" },
  
  // Accessories Subcategories (Level 1)
  { name: "Wiring Harnesses", slug: "wiring-harnesses", parentSlug: "accessories", level: 1 },
  { name: "Pod Covers", slug: "pod-covers", parentSlug: "accessories", level: 1 },
  { name: "Mounting Brackets", slug: "mounting-brackets", parentSlug: "accessories", level: 1 },
  { name: "Controllers & Switches", slug: "controllers-switches", parentSlug: "accessories", level: 1 },
];

async function updateCategories() {
  console.log("Starting category restructure...");
  
  // First, delete all existing categories and product-category mappings
  await db.delete(productCategories);
  await db.delete(categories);
  console.log("Cleared existing categories");
  
  // Create a map to store category IDs by slug
  const categoryIdMap = new Map<string, string>();
  
  // Insert level 0 categories first
  for (const cat of categoryStructure.filter(c => c.level === 0)) {
    const [inserted] = await db.insert(categories).values({
      id: sql`gen_random_uuid()`,
      name: cat.name,
      slug: cat.slug,
      level: 0,
      parentId: null,
      imageUrl: cat.imageUrl || null,
      isActive: true,
    }).returning();
    categoryIdMap.set(cat.slug, inserted.id);
    console.log(`Created category: ${cat.name}`);
  }
  
  // Insert level 1 categories
  for (const cat of categoryStructure.filter(c => c.level === 1)) {
    const parentId = cat.parentSlug ? categoryIdMap.get(cat.parentSlug) : null;
    const [inserted] = await db.insert(categories).values({
      id: sql`gen_random_uuid()`,
      name: cat.name,
      slug: cat.slug,
      level: 1,
      parentId: parentId || null,
      imageUrl: cat.imageUrl || null,
      isActive: true,
    }).returning();
    categoryIdMap.set(cat.slug, inserted.id);
    console.log(`Created subcategory: ${cat.name} (parent: ${cat.parentSlug})`);
  }
  
  // Now assign products to categories based on their names
  const allProducts = await db.select().from(products);
  console.log(`\nAssigning ${allProducts.length} products to categories...`);
  
  for (const product of allProducts) {
    const name = product.name.toLowerCase();
    let categorySlug: string | null = null;
    
    // Determine category based on product name
    if (name.includes("ss5") && name.includes("crosslink")) {
      categorySlug = "ss5-crosslink-light-bars";
    } else if (name.includes("stage series") && (name.includes("light bar") || name.includes("6\"") || name.includes("12\""))) {
      categorySlug = "stage-series-light-bars";
    } else if (name.includes("ssc1")) {
      categorySlug = "ssc1-led-pods";
    } else if (name.includes("ssc2")) {
      categorySlug = "ssc2-led-pods";
    } else if (name.includes("ss3")) {
      categorySlug = "ss3-led-pods";
    } else if (name.includes("ss5") && (name.includes("pod") || name.includes("led"))) {
      categorySlug = "ss5-led-pods";
    } else if (name.includes("rock light")) {
      categorySlug = "rock-lights";
    } else if (name.includes("hitch") || name.includes("hitchmount")) {
      categorySlug = "hitch-mount";
    } else if (name.includes("switch") || name.includes("d-switch")) {
      categorySlug = "switch-panel";
    } else if (name.includes("harness") || name.includes("wire") || name.includes("pigtail")) {
      categorySlug = "wiring-harnesses";
    } else if (name.includes("cover") && name.includes("pod")) {
      categorySlug = "pod-covers";
    } else if (name.includes("bracket") || name.includes("mount")) {
      categorySlug = "mounting-brackets";
    } else if (name.includes("controller") || name.includes("relay")) {
      categorySlug = "controllers-switches";
    } else if (name.includes("ford")) {
      categorySlug = "ford-kits";
    } else if (name.includes("honda")) {
      categorySlug = "honda-kits";
    } else if (name.includes("jeep") || name.includes("wrangler")) {
      categorySlug = "jeep-kits";
    } else if (name.includes("kit") || name.includes("universal")) {
      categorySlug = "universal-kits";
    } else {
      categorySlug = "accessories";
    }
    
    const categoryId = categoryIdMap.get(categorySlug);
    if (categoryId) {
      await db.insert(productCategories).values({
        id: sql`gen_random_uuid()`,
        productId: product.id,
        categoryId: categoryId,
      });
    }
  }
  
  console.log("\nCategory restructure complete!");
  
  // Print summary
  const cats = await db.select().from(categories);
  console.log(`\nTotal categories: ${cats.length}`);
  for (const cat of cats.filter(c => c.level === 0)) {
    const subs = cats.filter(c => c.parentId === cat.id);
    console.log(`- ${cat.name} (${subs.length} subcategories)`);
    for (const sub of subs) {
      console.log(`  - ${sub.name}`);
    }
  }
}

updateCategories()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
