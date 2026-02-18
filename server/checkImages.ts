import { db } from "./db";
import { products } from "@shared/schema";
import { isNull, and, eq } from "drizzle-orm";

async function main() {
  const ddProducts = await db.select().from(products).where(
    and(isNull(products.advlustProductId), isNull(products.advlustHandle), eq(products.isActive, true))
  );

  console.log(`Checking ${ddProducts.length} DD products for placeholder images...\n`);

  const PLACEHOLDER_SIZE = 18318;
  let totalFake = 0;
  let totalReal = 0;

  for (const p of ddProducts) {
    if (!p.images || p.images.length === 0) {
      console.log(`${p.name}: NO IMAGES`);
      continue;
    }

    const realImages: string[] = [];
    const fakeImages: string[] = [];

    for (const img of p.images) {
      try {
        const resp = await fetch(img, { method: "HEAD" });
        const size = parseInt(resp.headers.get("content-length") || "0");
        if (size > 20000) {
          realImages.push(img);
        } else {
          fakeImages.push(img);
        }
      } catch (e) {
        fakeImages.push(img);
      }
    }

    totalReal += realImages.length;
    totalFake += fakeImages.length;

    if (fakeImages.length > 0) {
      console.log(`${p.name}: ${realImages.length} real, ${fakeImages.length} PLACEHOLDER`);
      fakeImages.forEach(f => console.log(`  FAKE: ${f}`));
    } else {
      console.log(`${p.name}: ${realImages.length} real images OK`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total real images: ${totalReal}`);
  console.log(`Total placeholder images: ${totalFake}`);
}

main().then(() => process.exit(0)).catch(console.error);
