import { db } from "./db";
import { categories } from "@shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("=== Updating category images to match advlust.com ===\n");

  const accessoriesParent = await db.select().from(categories).where(eq(categories.slug, "accessories"));
  if (!accessoriesParent.length) {
    console.log("Accessories category not found!");
    return;
  }
  const accessoriesId = accessoriesParent[0].id;

  const existingChildren = await db.select().from(categories).where(eq(categories.parentId, accessoriesId));
  for (const child of existingChildren) {
    await db.delete(categories).where(eq(categories.id, child.id));
    console.log(`  Removed old subcategory: ${child.name}`);
  }

  const accessoriesSubcats = [
    {
      name: "Bezels",
      slug: "bezels",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Bezels-category.jpg?v=1745909229",
    },
    {
      name: "Brackets & Mounts",
      slug: "brackets-mounts",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Brackets_Mounts-category.jpg?v=1745909254",
    },
    {
      name: "Covers",
      slug: "covers",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Covers-category.jpg?v=1745909326",
    },
    {
      name: "Hardware Kits",
      slug: "hardware-kits",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Hardware_Kits-category.jpg?v=1745909344",
    },
    {
      name: "Replacement Lenses",
      slug: "replacement-lenses",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Replacement_Lenses-category.jpg?v=1745909377",
    },
    {
      name: "Wiring Harnesses",
      slug: "wiring-harnesses",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Wiring_Harnesses-category.jpg?v=1745909415",
    },
    {
      name: "Backlight",
      slug: "backlight",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Bezels-category.jpg?v=1745909229",
    },
  ];

  for (let i = 0; i < accessoriesSubcats.length; i++) {
    const sub = accessoriesSubcats[i];
    const existing = await db.select().from(categories).where(eq(categories.slug, sub.slug));
    if (existing.length > 0) {
      await db.update(categories).set({
        parentId: accessoriesId,
        level: 2,
        sortOrder: i,
        imageUrl: sub.imageUrl,
        isActive: true,
      }).where(eq(categories.id, existing[0].id));
      console.log(`  Updated "${sub.name}" under Accessories`);
    } else {
      await db.insert(categories).values({
        name: sub.name,
        slug: sub.slug,
        parentId: accessoriesId,
        level: 2,
        sortOrder: i,
        isActive: true,
        imageUrl: sub.imageUrl,
      });
      console.log(`  Created "${sub.name}" under Accessories`);
    }
  }

  const rockLightsImages: Record<string, string> = {
    "single-color": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/RockLigh-caetgory.jpg?v=1746200420",
    "rgbw": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Rock_Lights-hover-category.jpg?v=1746201590",
  };

  for (const [slug, imageUrl] of Object.entries(rockLightsImages)) {
    const existing = await db.select().from(categories).where(eq(categories.slug, slug));
    if (existing.length > 0) {
      await db.update(categories).set({ imageUrl }).where(eq(categories.id, existing[0].id));
      console.log(`  Updated image for "${slug}"`);
    }
  }

  const bracketKitsImages: Record<string, string> = {
    "jeep-kits": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Jeep-category.jpg",
    "ford-kits": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Ford-category.jpg",
    "honda-kits": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Honda-category.jpg",
    "universal-kits": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Roll_Bar_Mount_Kit-category.jpg",
  };

  for (const [slug, imageUrl] of Object.entries(bracketKitsImages)) {
    const existing = await db.select().from(categories).where(eq(categories.slug, slug));
    if (existing.length > 0 && !existing[0].imageUrl) {
      await db.update(categories).set({ imageUrl }).where(eq(categories.id, existing[0].id));
      console.log(`  Updated image for "${slug}"`);
    }
  }

  const all = await db.select().from(categories);
  const withImages = all.filter(c => c.imageUrl);
  const withoutImages = all.filter(c => !c.imageUrl);
  console.log(`\nTotal: ${all.length} categories, ${withImages.length} with images, ${withoutImages.length} without`);
  if (withoutImages.length > 0) {
    console.log("Without images:", withoutImages.map(c => `${c.name} (${c.slug})`).join(", "));
  }
}

main().then(() => process.exit(0)).catch(console.error);
