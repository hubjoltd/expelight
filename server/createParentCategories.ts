import { db } from "./db";
import { categories } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

async function main() {
  console.log("Creating parent category groups: Off-Road, Lamps, Extras\n");

  const parentGroups = [
    {
      name: "Off-Road",
      slug: "off-road",
      description: "Premium off-road LED lighting solutions for every terrain",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/offroad-banner.jpg?v=1746169190",
      childSlugs: ["led-light-bars", "led-pods", "brackets-kits", "switch-panel", "hitch-mount", "rock-lights", "accessories"],
    },
    {
      name: "Lamps",
      slug: "lamps",
      description: "High-performance automotive lamp replacements and upgrades",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/lamp-banner.jpg?v=1746188637",
      childSlugs: ["headlights", "sidemarkers", "turn-signals", "fog-lamps"],
    },
    {
      name: "Extras",
      slug: "extras",
      description: "Controllers, wiring, and installation accessories",
      imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/extra-banner.jpg?v=1746188640",
      childSlugs: ["controllers", "led-wiring-and-installation", "anti-flicker-modules", "flashers-and-resistors", "power-dimmers-and-drivers"],
    },
  ];

  const lampsSubcategories = [
    { name: "Headlights", slug: "headlights", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Headlights-category.jpg?v=1746201827" },
    { name: "Sidemarkers", slug: "sidemarkers", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Sidemarkers-category.jpg?v=1746201840" },
    { name: "Turn Signals", slug: "turn-signals", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Turn_Signals-category.jpg?v=1746201863" },
    { name: "Fog Lamps", slug: "fog-lamps", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Fog_Lamps-category.jpg?v=1746201882" },
  ];

  const extrasSubcategories = [
    { name: "Controllers", slug: "controllers", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Controllers-category.jpg?v=1746202557" },
    { name: "LED Wiring and Installation", slug: "led-wiring-and-installation", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Wiring_and_Installation-category.jpg?v=1750059001" },
    { name: "Anti-Flicker Modules", slug: "anti-flicker-modules", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Anti-Flicker_Modules-category.jpg?v=1746202577" },
    { name: "Flashers and Resistors", slug: "flashers-and-resistors", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Flashers_and_Resistors-category.jpg?v=1746202624" },
    { name: "Power, Dimmers, and Drivers", slug: "power-dimmers-and-drivers", imageUrl: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Power_Dimmers_and_Drivers-category.jpg?v=1750058931" },
  ];

  for (const group of parentGroups) {
    const existing = await db.select().from(categories).where(eq(categories.slug, group.slug));
    let parentId: string;

    if (existing.length > 0) {
      parentId = existing[0].id;
      console.log(`  Parent "${group.name}" already exists (${parentId})`);
    } else {
      const [inserted] = await db.insert(categories).values({
        name: group.name,
        slug: group.slug,
        description: group.description,
        level: 0,
        sortOrder: parentGroups.indexOf(group),
        isActive: true,
        imageUrl: group.imageUrl,
      }).returning();
      parentId = inserted.id;
      console.log(`  Created parent "${group.name}" (${parentId})`);
    }

    if (group.slug === "off-road") {
      const currentTopLevel = await db.select().from(categories).where(eq(categories.level, 0));
      for (const topCat of currentTopLevel) {
        if (group.childSlugs.includes(topCat.slug)) {
          await db.update(categories).set({ parentId: parentId, level: 1 }).where(eq(categories.id, topCat.id));
          console.log(`    Moved "${topCat.name}" under Off-Road`);
        }
      }
    }

    if (group.slug === "lamps") {
      for (const sub of lampsSubcategories) {
        const existing = await db.select().from(categories).where(eq(categories.slug, sub.slug));
        if (existing.length === 0) {
          await db.insert(categories).values({
            name: sub.name,
            slug: sub.slug,
            parentId: parentId,
            level: 1,
            sortOrder: lampsSubcategories.indexOf(sub),
            isActive: true,
            imageUrl: sub.imageUrl,
          });
          console.log(`    Created "${sub.name}" under Lamps`);
        } else {
          await db.update(categories).set({ parentId: parentId, level: 1 }).where(eq(categories.id, existing[0].id));
          console.log(`    Updated "${sub.name}" under Lamps`);
        }
      }
    }

    if (group.slug === "extras") {
      for (const sub of extrasSubcategories) {
        const existing = await db.select().from(categories).where(eq(categories.slug, sub.slug));
        if (existing.length === 0) {
          await db.insert(categories).values({
            name: sub.name,
            slug: sub.slug,
            parentId: parentId,
            level: 1,
            sortOrder: extrasSubcategories.indexOf(sub),
            isActive: true,
            imageUrl: sub.imageUrl,
          });
          console.log(`    Created "${sub.name}" under Extras`);
        } else {
          await db.update(categories).set({ parentId: parentId, level: 1 }).where(eq(categories.id, existing[0].id));
          console.log(`    Updated "${sub.name}" under Extras`);
        }
      }
    }
  }

  const existingOffRoadChildren = await db.select().from(categories).where(eq(categories.level, 1));
  for (const child of existingOffRoadChildren) {
    const grandchildren = await db.select().from(categories).where(eq(categories.parentId, child.id));
    for (const gc of grandchildren) {
      await db.update(categories).set({ level: 2 }).where(eq(categories.id, gc.id));
    }
  }

  const all = await db.select().from(categories);
  console.log(`\nTotal categories: ${all.length}`);
  console.log("Level 0 (parent groups):", all.filter(c => c.level === 0).map(c => c.name).join(", "));
  console.log("Level 1 (subcategories):", all.filter(c => c.level === 1).length);
  console.log("Level 2 (sub-subcategories):", all.filter(c => c.level === 2).length);
}

main().then(() => process.exit(0)).catch(console.error);
