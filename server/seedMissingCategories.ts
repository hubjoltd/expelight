import { db } from "./db";
import { categories, productCategories, products } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

interface CategorySeed {
  name: string;
  slug: string;
  description?: string;
  parentSlug?: string;
  level: number;
  sortOrder: number;
  imageUrl?: string;
  children?: CategorySeed[];
}

const CATEGORY_TREE: CategorySeed[] = [
  {
    name: "Off-Road",
    slug: "off-road",
    description: "Premium off-road LED lighting solutions for every terrain",
    level: 0,
    sortOrder: 0,
    imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/offroad-banner.jpg?v=1746169190",
    children: [
      {
        name: "LED Light Bars",
        slug: "led-light-bars",
        level: 1,
        sortOrder: 0,
        imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Lightbars-caetgory.jpg",
        children: [
          { name: "Stage Series LED Light Bars", slug: "stage-series-light-bars", level: 2, sortOrder: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Stage-Series-category.jpg" },
          { name: "SS5 CrossLink Light Bars", slug: "ss5-crosslink-light-bars", level: 2, sortOrder: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS5-LED-category.jpg" },
        ],
      },
      {
        name: "LED Pods",
        slug: "led-pods",
        level: 1,
        sortOrder: 1,
        imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Pods-caetgory.jpg",
        children: [
          { name: "SSC1 LED Pods", slug: "ssc1-led-pods", level: 2, sortOrder: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SSC1-category.jpg" },
          { name: "SSC2 LED Pods", slug: "ssc2-led-pods", level: 2, sortOrder: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SSC2-category.jpg" },
          { name: "SS3 LED Pods", slug: "ss3-led-pods", level: 2, sortOrder: 2, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS3-category.jpg" },
          { name: "SS5 LED Pods", slug: "ss5-led-pods", level: 2, sortOrder: 3, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS5-category.jpg" },
        ],
      },
      {
        name: "Brackets & Kits",
        slug: "brackets-kits",
        level: 1,
        sortOrder: 2,
        imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Brackets_Kits-category.jpg",
        children: [
          { name: "Ford Kits", slug: "ford-kits", level: 2, sortOrder: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Ford-category.jpg" },
          { name: "Honda Kits", slug: "honda-kits", level: 2, sortOrder: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Honda-category.jpg" },
          { name: "Jeep Kits", slug: "jeep-kits", level: 2, sortOrder: 2, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Jeep-category.jpg" },
          { name: "Universal Kits", slug: "universal-kits", level: 2, sortOrder: 3, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Roll_Bar_Mount_Kit-category.jpg" },
        ],
      },
      { name: "Switch Panel", slug: "switch-panel", level: 1, sortOrder: 3, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/D-Switch-category.jpg" },
      { name: "Hitch Mount", slug: "hitch-mount", level: 1, sortOrder: 4, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/HitchMount-category.jpg" },
      {
        name: "Rock Lights",
        slug: "rock-lights",
        level: 1,
        sortOrder: 5,
        imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/RockLigh-caetgory.jpg",
        children: [
          { name: "Single Color", slug: "single-color", level: 2, sortOrder: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/RockLigh-caetgory.jpg?v=1746200420" },
          { name: "RGBW", slug: "rgbw", level: 2, sortOrder: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Rock_Lights-hover-category.jpg?v=1746201590" },
        ],
      },
      {
        name: "Accessories",
        slug: "accessories",
        level: 1,
        sortOrder: 6,
        imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Accessories-caetgory.jpg",
        children: [
          { name: "Bezels", slug: "bezels", level: 2, sortOrder: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Bezels-category.jpg?v=1745909229" },
          { name: "Brackets & Mounts", slug: "brackets-mounts", level: 2, sortOrder: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Brackets_Mounts-category.jpg?v=1745909254" },
          { name: "Covers", slug: "covers", level: 2, sortOrder: 2, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Covers-category.jpg?v=1745909326" },
          { name: "Hardware Kits", slug: "hardware-kits", level: 2, sortOrder: 3, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Hardware_Kits-category.jpg?v=1745909344" },
          { name: "Replacement Lenses", slug: "replacement-lenses", level: 2, sortOrder: 4, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Replacement_Lenses-category.jpg?v=1745909377" },
          { name: "Wiring Harnesses", slug: "wiring-harnesses", level: 2, sortOrder: 5, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Wiring_Harnesses-category.jpg?v=1745909415" },
          { name: "Backlight", slug: "backlight", level: 2, sortOrder: 6, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Bezels-category.jpg?v=1745909229" },
        ],
      },
    ],
  },
  {
    name: "Lamps",
    slug: "lamps",
    description: "High-performance automotive lamp replacements and upgrades",
    level: 0,
    sortOrder: 1,
    imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/lamp-banner.jpg?v=1746188637",
    children: [
      { name: "Headlights", slug: "headlights", level: 1, sortOrder: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Headlights-category.jpg?v=1746201827" },
      { name: "Sidemarkers", slug: "sidemarkers", level: 1, sortOrder: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Sidemarkers-category.jpg?v=1746201840" },
      { name: "Turn Signals", slug: "turn-signals", level: 1, sortOrder: 2, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Turn_Signals-category.jpg?v=1746201863" },
      { name: "Fog Lamps", slug: "fog-lamps", level: 1, sortOrder: 3, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Fog_Lamps-category.jpg?v=1746201882" },
    ],
  },
  {
    name: "Extras",
    slug: "extras",
    description: "Controllers, wiring, and installation accessories",
    level: 0,
    sortOrder: 2,
    imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/extra-banner.jpg?v=1746188640",
    children: [
      { name: "Controllers", slug: "controllers", level: 1, sortOrder: 0, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Controllers-category.jpg?v=1746202557" },
      { name: "LED Wiring and Installation", slug: "led-wiring-and-installation", level: 1, sortOrder: 1, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Wiring_and_Installation-category.jpg?v=1750059001" },
      { name: "Anti-Flicker Modules", slug: "anti-flicker-modules", level: 1, sortOrder: 2, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Anti-Flicker_Modules-category.jpg?v=1746202577" },
      { name: "Flashers and Resistors", slug: "flashers-and-resistors", level: 1, sortOrder: 3, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Flashers_and_Resistors-category.jpg?v=1746202624" },
      { name: "Power, Dimmers, and Drivers", slug: "power-dimmers-and-drivers", level: 1, sortOrder: 4, imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Power_Dimmers_and_Drivers-category.jpg?v=1750058931" },
    ],
  },
];

const PRODUCT_CATEGORY_RULES: { test: (name: string) => boolean; slug: string }[] = [
  { test: (n) => n.includes("ss5") && n.includes("crosslink"), slug: "ss5-crosslink-light-bars" },
  { test: (n) => n.includes("stage series") && (n.includes("light bar") || n.includes("6\"") || n.includes("12\"")), slug: "stage-series-light-bars" },
  { test: (n) => n.includes("ss10") || n.includes("ss20") || n.includes("ss30"), slug: "led-light-bars" },
  { test: (n) => n.includes("ssc1"), slug: "ssc1-led-pods" },
  { test: (n) => n.includes("ssc2"), slug: "ssc2-led-pods" },
  { test: (n) => n.includes("ss3"), slug: "ss3-led-pods" },
  { test: (n) => n.includes("ss5") && (n.includes("pod") || n.includes("led")), slug: "ss5-led-pods" },
  { test: (n) => n.includes("c2") && n.includes("pod") && !n.includes("cover"), slug: "led-pods" },
  { test: (n) => n.includes("rock light"), slug: "rock-lights" },
  { test: (n) => n.includes("hitch") || n.includes("hitchmount"), slug: "hitch-mount" },
  { test: (n) => n.includes("switch") || n.includes("d-switch"), slug: "switch-panel" },
  { test: (n) => n.includes("harness") || n.includes("wire") || n.includes("pigtail"), slug: "wiring-harnesses" },
  { test: (n) => n.includes("cover") && n.includes("pod"), slug: "covers" },
  { test: (n) => n.includes("bracket") || n.includes("mount"), slug: "brackets-mounts" },
  { test: (n) => n.includes("controller") || n.includes("relay"), slug: "controllers" },
  { test: (n) => n.includes("ford"), slug: "ford-kits" },
  { test: (n) => n.includes("honda"), slug: "honda-kits" },
  { test: (n) => n.includes("jeep") || n.includes("wrangler"), slug: "jeep-kits" },
  { test: (n) => n.includes("kit") || n.includes("universal"), slug: "universal-kits" },
  { test: (n) => n.includes("bezel"), slug: "bezels" },
  { test: (n) => n.includes("lens") || n.includes("replacement"), slug: "replacement-lenses" },
  { test: (n) => n.includes("backlight"), slug: "backlight" },
];

function flattenTree(tree: CategorySeed[], parentSlug?: string): { cat: CategorySeed; parentSlug?: string }[] {
  const result: { cat: CategorySeed; parentSlug?: string }[] = [];
  for (const node of tree) {
    result.push({ cat: node, parentSlug });
    if (node.children) {
      result.push(...flattenTree(node.children, node.slug));
    }
  }
  return result;
}

export async function seedMissingCategories() {
  try {
    const existing = await db.select().from(categories);
    const existingBySlug = new Map(existing.map((c) => [c.slug, c]));
    const slugToId = new Map(existing.map((c) => [c.slug, c.id]));

    const allSeeds = flattenTree(CATEGORY_TREE);
    let insertedCount = 0;
    let updatedCount = 0;

    for (const level of [0, 1, 2]) {
      const levelSeeds = allSeeds.filter(({ cat }) => cat.level === level);
      for (const { cat, parentSlug } of levelSeeds) {
        const parentId = parentSlug ? slugToId.get(parentSlug) || null : null;
        const match = existingBySlug.get(cat.slug);

        if (match) {
          const updates: Record<string, any> = {};
          if (cat.imageUrl && match.imageUrl !== cat.imageUrl) updates.imageUrl = cat.imageUrl;
          if (parentId && match.parentId !== parentId) updates.parentId = parentId;
          if (match.level !== cat.level) updates.level = cat.level;
          if (match.sortOrder !== cat.sortOrder) updates.sortOrder = cat.sortOrder;
          if (cat.description && match.description !== cat.description) updates.description = cat.description;

          if (Object.keys(updates).length > 0) {
            await db.update(categories).set(updates).where(eq(categories.id, match.id));
            updatedCount++;
          }
          slugToId.set(cat.slug, match.id);
        } else {
          const [inserted] = await db.insert(categories).values({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || null,
            parentId,
            level: cat.level,
            sortOrder: cat.sortOrder,
            isActive: true,
            imageUrl: cat.imageUrl || null,
          }).returning();
          slugToId.set(cat.slug, inserted.id);
          insertedCount++;
        }
      }
    }

    if (insertedCount > 0) {
      console.log(`Seeded ${insertedCount} missing categories.`);
    }
    if (updatedCount > 0) {
      console.log(`Updated ${updatedCount} existing categories.`);
    }

    const allProducts = await db.select().from(products);
    const existingMappings = await db.select().from(productCategories);
    const mappingSet = new Set(existingMappings.map((m) => `${m.productId}::${m.categoryId}`));
    let mappedCount = 0;

    for (const product of allProducts) {
      const name = product.name.toLowerCase();
      let categorySlug: string | null = null;

      for (const rule of PRODUCT_CATEGORY_RULES) {
        if (rule.test(name)) {
          categorySlug = rule.slug;
          break;
        }
      }

      if (!categorySlug) categorySlug = "accessories";

      const categoryId = slugToId.get(categorySlug);
      if (categoryId && !mappingSet.has(`${product.id}::${categoryId}`)) {
        await db.insert(productCategories).values({
          id: sql`gen_random_uuid()`,
          productId: product.id,
          categoryId,
        });
        mappingSet.add(`${product.id}::${categoryId}`);
        mappedCount++;
      }
    }

    if (mappedCount > 0) {
      console.log(`Mapped ${mappedCount} products to categories.`);
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}
