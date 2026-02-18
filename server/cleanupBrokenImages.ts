import { db } from "./db";
import { products, productMedia } from "@shared/schema";
import { eq, and, isNull } from "drizzle-orm";

async function isImageValid(url: string): Promise<boolean> {
  try {
    const resp = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000) });
    if (!resp.ok) return false;
    const size = parseInt(resp.headers.get("content-length") || "0");
    if (size <= 20000 && url.includes("cloudfront")) return false;
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("Checking all DD product images for broken/invalid URLs...\n");

  const ddProducts = await db.select().from(products).where(
    and(isNull(products.advlustProductId), isNull(products.advlustHandle), eq(products.isActive, true))
  );

  let fixedCount = 0;
  let removedCount = 0;

  for (const product of ddProducts) {
    if (!product.images || product.images.length === 0) continue;

    const validImages: string[] = [];
    const brokenImages: string[] = [];

    const results = await Promise.all(
      product.images.map(async (url) => {
        const valid = await isImageValid(url);
        return { url, valid };
      })
    );

    for (const r of results) {
      if (r.valid) {
        validImages.push(r.url);
      } else {
        brokenImages.push(r.url);
      }
    }

    if (brokenImages.length > 0) {
      console.log(`${product.name}: removing ${brokenImages.length} broken images (${validImages.length} valid remaining)`);
      brokenImages.forEach(b => console.log(`  BROKEN: ${b}`));

      await db.update(products).set({ images: validImages }).where(eq(products.id, product.id));

      await db.delete(productMedia).where(eq(productMedia.productId, product.id));
      for (let i = 0; i < validImages.length; i++) {
        await db.insert(productMedia).values({
          productId: product.id,
          url: validImages[i],
          altText: `${product.name} - Image ${i + 1}`,
          mediaType: "image",
          isPrimary: i === 0,
          sortOrder: i,
        });
      }

      fixedCount++;
      removedCount += brokenImages.length;
    }
  }

  console.log(`\nDone: Fixed ${fixedCount} products, removed ${removedCount} broken images`);

  const allProducts = await db.select().from(products).where(eq(products.isActive, true));
  let totalWithLowImages = 0;
  for (const p of allProducts) {
    if (!p.images || p.images.length < 2) {
      totalWithLowImages++;
      console.log(`LOW IMAGE: ${p.name} (${p.images?.length || 0} images)`);
    }
  }
  console.log(`\nProducts with < 2 images: ${totalWithLowImages} / ${allProducts.length}`);
}

main().then(() => process.exit(0)).catch(console.error);
