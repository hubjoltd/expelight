import { db } from "./db";
import { products, productMedia } from "@shared/schema";
import { eq, isNull, and, sql } from "drizzle-orm";

const PLACEHOLDER_SIZE = 18318;

async function isRealImage(url: string): Promise<boolean> {
  try {
    const resp = await fetch(url, { method: "HEAD" });
    const size = parseInt(resp.headers.get("content-length") || "0");
    return size > 20000;
  } catch {
    return false;
  }
}

async function findRealImages(baseUrl: string, sku: string, productName: string): Promise<string[]> {
  const CDN = "https://dxv0kh7euhy9z.cloudfront.net/catalog/product";
  const realImages: string[] = [];

  const candidates: string[] = [];
  const skuLower = sku.toLowerCase();
  const firstChar = skuLower[0];
  const secondChar = skuLower[1];
  const prefix = `${CDN}/${firstChar}/${secondChar}/`;

  candidates.push(`${prefix}${skuLower}_1.jpg`);
  candidates.push(`${prefix}${skuLower}_2.jpg`);
  candidates.push(`${prefix}${skuLower}_3.jpg`);

  const batchSize = 10;
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(async (url) => {
      const real = await isRealImage(url);
      return { url, real };
    }));
    for (const r of results) {
      if (r.real) realImages.push(r.url);
    }
  }

  return realImages;
}

const ADVLUST_FAMILY_IMAGES: Record<string, string[]> = {};

async function fetchAdvlustImages(): Promise<void> {
  console.log("Fetching Advlust.com product images for cross-reference...");
  try {
    const resp = await fetch("https://advlust.com/products.json?limit=250");
    const data = await resp.json();
    const shopifyProducts = data.products || [];

    for (const sp of shopifyProducts) {
      const images = (sp.images || []).map((img: any) => img.src).filter((src: string) => src);
      if (images.length === 0) continue;

      const title = sp.title.toLowerCase();
      const handle = sp.handle;
      ADVLUST_FAMILY_IMAGES[handle] = images;
    }
    console.log(`  Loaded ${Object.keys(ADVLUST_FAMILY_IMAGES).length} advlust products with images`);
  } catch (e) {
    console.error("Failed to fetch advlust images:", e);
  }
}

function findAdvlustMatch(productName: string, productSlug: string): string[] {
  const name = productName.toLowerCase();

  const directMatches: Record<string, string> = {
    "ss3-led-pod-cover-clear-one": "ss3-led-pod-replacement-front-bezel",
    "ss5-led-pod-cover-black-one": "ss5-led-pod-cover-clear-one",
    "ss5-white-pro-led-pod-one": "ss5-white-sport-led-pod-single-no-bracket",
    "ssc1-yellow-sport-led-pod-pair": "ssc1-yellow-pro-standard-led-pod-pair",
    "ssc1-white-sae-fog-led-pod-pair": "ssc1-white-fog-standard-led-pod-pair",
    "ssc1-flush-mount-mounting-kit": "ssc1-type-fbs-fog-light-mounting-kit",
    "ss3-sae-dot-white-sport-led-pod-pair": "ss3-white-sport-led-pod-pair",
    "ss3-sae-dot-white-sport-led-pod-one": "ss3-white-sport-led-pod-pair",
    "ss3-sae-dot-white-pro-led-pod-pair": "ss3-white-pro-led-pod-pair",
    "ss3-sae-white-max-led-pod-pair": "ss3-white-max-led-pod-pair",
    "ss3-sae-yellow-max-led-pod-pair": "ss3-yellow-max-led-pod-pair",
    "ss5-crosslink-3-pod-18-5-inch-led-light-bar-one": "ss5-crosslink-3-pod-led-light-bar-one",
    "ss5-crosslink-5-pod-31-5-inch-led-light-bar-one": "ss5-crosslink-5-pod-led-light-bar-one",
    "ss5-crosslink-6-pod-37-5-inch-led-light-bar-one": "ss5-crosslink-6-pod-led-light-bar-one",
    "ss5-crosslink-endmount-kit": "ss5-crosslink-universal-bracket-kit-set",
    "c2r-white-flood-flush-mount-led-pod-pair": "stage-series-c1r-white-flood-flush-mount-led-pod-pair",
    "c2r-white-flood-led-pod-pair": "stage-series-c1r-white-flood-standard-led-pod-pair",
    "ss10-sae-dot-white-led-light-bar-one": "stage-series-12-white-light-bar-one",
    "ss10-yellow-led-light-bar": "stage-series-12-amber-light-bar-one",
    "ss6-sae-dot-white-led-light-bar-one": "stage-series-6-sae-dot-white-light-bar-one",
    "ss20-white-led-light-bar-one": "stage-series-18-white-light-bar",
    "ss20-white-led-light-bar": "stage-series-18-amber-light-bar",
    "ss30-white-led-light-bar-one": "stage-series-18-white-light-bar",
    "ss30-white-led-light-bar": "stage-series-18-amber-light-bar",
    "stage-series-led-light-bar-cover": "stage-series-c1-led-pod-cover-clear-one",
    "light-duty-dual-output-2-pin-offroad-wiring-harness": "heavy-duty-single-output-2-pin-offroad-wiring-harness",
    "light-duty-dual-output-4-pin-wiring-harness": "heavy-duty-dual-output-4-pin-wiring-harness",
    "dt-4-pin-extension-wire-1m": "deutsch-4-pin-10cm-dt-female-wire-pigtail-one",
    "reverse-light-wiring-kit-w-running-light": "heavy-duty-single-output-2-pin-offroad-wiring-harness",
    "ultra-heavy-duty-single-output-4-pin-wiring-harness": "ultra-heavy-duty-dual-output-4-pin-wiring-harness",
    "ss3-security-hardware-kit": "ss3-dual-pod-bracket-kit",
    "mini-crosslink-endmount-kit": "ss5-crosslink-universal-bracket-kit-set",
    "stage-series-led-light-bar-universal-bracket-kit": "stage-series-ss5-universal-bracket-kit",
    "c2-2-0-sae-dot-white-sport-led-pod-pair": "ssc2-white-pro-standard-led-pod-pair",
    "c2-2-0-sae-dot-white-max-led-pod-pair": "ssc2-white-pro-standard-led-pod-pair",
    "c2-2-0-yellow-sport-led-pod-pair": "ssc2-yellow-sport-standard-led-pod-pair",
    "c2-2-0-yellow-pro-led-pod-pair": "ssc2-yellow-pro-standard-led-pod-pair",
    "c2-2-0-yellow-max-led-pod-pair": "ssc2-yellow-pro-standard-led-pod-pair",
    "c2-2-0-led-pod-replacement-front-bezel-one": "ssc2-led-pod-replacement-front-bezel-one",
    "c2-2-0-led-pod-cover-clear": "stage-series-c1-led-pod-cover-clear-one",
    "stage-series-rock-light-surface-mount-kit-one": "stage-series-rock-light-magnet-mount-adapter-kit-one",
    "ss30-dual-color-led-light-bar-one": "stage-series-18-white-light-bar",
    "ss40-dual-color-led-light-bar-one": "stage-series-18-white-light-bar",
  };

  const matchHandle = directMatches[productSlug];
  if (matchHandle && ADVLUST_FAMILY_IMAGES[matchHandle]) {
    return ADVLUST_FAMILY_IMAGES[matchHandle];
  }

  for (const [handle, images] of Object.entries(ADVLUST_FAMILY_IMAGES)) {
    if (handle.includes(productSlug) || productSlug.includes(handle)) {
      return images;
    }
  }

  return [];
}

async function main() {
  console.log("=== Fixing DD Product Images ===\n");

  await fetchAdvlustImages();

  const ddProducts = await db.select().from(products).where(
    and(isNull(products.advlustProductId), isNull(products.advlustHandle), eq(products.isActive, true))
  );

  console.log(`\nFound ${ddProducts.length} DD products to fix\n`);

  let fixed = 0;
  let totalRemoved = 0;
  let totalAdded = 0;

  for (const product of ddProducts) {
    const currentImages = product.images || [];
    if (currentImages.length === 0) {
      console.log(`  ${product.name}: NO IMAGES - finding from advlust`);
    }

    const validImages: string[] = [];
    const placeholderImages: string[] = [];

    const checkResults = await Promise.all(
      currentImages.map(async (url) => {
        const real = await isRealImage(url);
        return { url, real };
      })
    );

    for (const r of checkResults) {
      if (r.real) {
        validImages.push(r.url);
      } else {
        placeholderImages.push(r.url);
      }
    }

    if (placeholderImages.length === 0 && validImages.length >= 4) {
      console.log(`  OK: ${product.name} - ${validImages.length} real images`);
      continue;
    }

    const advlustImages = findAdvlustMatch(product.name, product.slug);

    const newImageSet = new Set(validImages);
    let addedFromAdvlust = 0;

    for (const img of advlustImages) {
      if (!newImageSet.has(img) && newImageSet.size < 12) {
        newImageSet.add(img);
        addedFromAdvlust++;
      }
    }

    const finalImages = Array.from(newImageSet);

    if (finalImages.length !== currentImages.length || placeholderImages.length > 0) {
      await db.update(products).set({ images: finalImages }).where(eq(products.id, product.id));

      await db.delete(productMedia).where(eq(productMedia.productId, product.id));

      for (let i = 0; i < finalImages.length; i++) {
        await db.insert(productMedia).values({
          productId: product.id,
          url: finalImages[i],
          altText: `${product.name} - Image ${i + 1}`,
          mediaType: "image",
          isPrimary: i === 0,
          sortOrder: i,
        });
      }

      fixed++;
      totalRemoved += placeholderImages.length;
      totalAdded += addedFromAdvlust;
      console.log(`  FIXED: ${product.name}: removed ${placeholderImages.length} placeholders, added ${addedFromAdvlust} from advlust -> ${finalImages.length} total images`);
    } else {
      console.log(`  ${product.name}: ${validImages.length} real images (no changes needed)`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Fixed ${fixed} products`);
  console.log(`Removed ${totalRemoved} placeholder images`);
  console.log(`Added ${totalAdded} real images from advlust.com`);

  const stats = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      AVG(array_length(images, 1))::int as avg_imgs,
      MIN(array_length(images, 1)) as min_imgs,
      MAX(array_length(images, 1)) as max_imgs,
      COUNT(CASE WHEN array_length(images, 1) <= 2 THEN 1 END) as low_img_count
    FROM products WHERE is_active = true AND advlust_product_id IS NULL AND advlust_handle IS NULL
  `);
  console.log("DD Product image stats:", stats.rows[0]);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
