import { db } from "./db";
import { products, productMedia } from "@shared/schema";
import { eq } from "drizzle-orm";

async function syncMediaTable() {
  console.log("Syncing product_media table with product images arrays...\n");

  const allProducts = await db.select().from(products);
  let synced = 0;
  let totalNewMedia = 0;

  for (const product of allProducts) {
    if (!product.images || product.images.length === 0) continue;

    const existingMedia = await db.select().from(productMedia).where(eq(productMedia.productId, product.id));
    const existingUrls = new Set(existingMedia.map(m => m.url));

    const missingImages = product.images.filter(url => !existingUrls.has(url));

    if (missingImages.length === 0) continue;

    const hasPrimary = existingMedia.some(m => m.isPrimary);
    const maxSortOrder = existingMedia.length > 0 ? Math.max(...existingMedia.map(m => m.sortOrder || 0)) : -1;

    const newEntries = missingImages.map((url, i) => ({
      productId: product.id,
      url,
      altText: `${product.name} - Image ${existingMedia.length + i + 1}`,
      mediaType: "image",
      isPrimary: !hasPrimary && i === 0,
      sortOrder: maxSortOrder + i + 1,
    }));

    await db.insert(productMedia).values(newEntries);
    synced++;
    totalNewMedia += newEntries.length;

    if (missingImages.length > 3) {
      console.log(`  ${product.name}: +${missingImages.length} media entries`);
    }
  }

  console.log(`\nSynced ${synced} products, added ${totalNewMedia} new media entries`);

  const totalMedia = await db.select({ count: productMedia.id }).from(productMedia);
  console.log(`Total product_media entries: ${totalMedia.length}`);
}

syncMediaTable().then(() => process.exit(0)).catch(console.error);
