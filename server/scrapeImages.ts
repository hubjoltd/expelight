import puppeteer from "puppeteer-core";
import { db } from "./db";
import { products, productMedia } from "@shared/schema";
import { eq, sql, isNull, and } from "drizzle-orm";

const CHROMIUM_PATH = "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium";

const DD_PRODUCT_URLS: Record<string, string> = {
  "light-duty-dual-output-2-pin-offroad-wiring-harness": "https://www.diodedynamics.com/light-duty-dual-output-offroad-wiring-harness.html",
  "light-duty-dual-output-4-pin-wiring-harness": "https://www.diodedynamics.com/light-duty-dual-output-4-pin-wiring-harness.html",
  "dt-4-pin-extension-wire-1m": "https://www.diodedynamics.com/dt-4-pin-extension-wire-1m.html",
  "reverse-light-wiring-kit-w-running-light": "https://www.diodedynamics.com/reverse-light-wiring-kit-w-running-light.html",
  "ultra-heavy-duty-single-output-4-pin-wiring-harness": "https://www.diodedynamics.com/ultra-heavy-duty-single-output-4-pin-wiring-harness.html",
  "ss3-led-pod-cover-clear-one": "https://www.diodedynamics.com/ss3-led-pod-cover-clear-one.html",
  "ssc1-yellow-sport-led-pod-pair": "https://www.diodedynamics.com/ssc1-yellow-sport-led-pod-pair.html",
  "ssc1-flush-mount-mounting-kit": "https://www.diodedynamics.com/ssc1-flush-mount-mounting-kit.html",
  "ss5-white-pro-led-pod-one": "https://www.diodedynamics.com/ss5-white-pro-led-pod-one.html",
  "ss5-crosslink-3-pod-18-5-inch-led-light-bar-one": "https://www.diodedynamics.com/ss5-crosslink-3-pod-18-5-inch-led-light-bar-one.html",
  "ss5-crosslink-endmount-kit": "https://www.diodedynamics.com/ss5-crosslink-endmount-kit.html",
  "ssc1-white-sae-fog-led-pod-pair": "https://www.diodedynamics.com/ssc1-white-sae-fog-led-pod-pair.html",
  "ss3-sae-dot-white-sport-led-pod-one": "https://www.diodedynamics.com/ss3-sae-dot-white-sport-led-pod-one.html",
  "ss3-sae-dot-white-sport-led-pod-pair": "https://www.diodedynamics.com/ss3-sae-dot-white-sport-led-pod-pair.html",
  "ss3-sae-dot-white-pro-led-pod-pair": "https://www.diodedynamics.com/ss3-sae-dot-white-pro-led-pod-pair.html",
  "ss3-sae-white-max-led-pod-pair": "https://www.diodedynamics.com/ss3-sae-white-max-led-pod-pair.html",
  "ss3-sae-yellow-max-led-pod-pair": "https://www.diodedynamics.com/ss3-sae-yellow-max-led-pod-pair.html",
  "ss5-led-pod-cover-black-one": "https://www.diodedynamics.com/ss5-led-pod-cover-black-one.html",
  "ss5-crosslink-5-pod-31-5-inch-led-light-bar-one": "https://www.diodedynamics.com/ss5-crosslink-5-pod-31-5-inch-led-light-bar-one.html",
  "stage-series-rock-light-surface-mount-kit-one": "https://www.diodedynamics.com/stage-series-rock-light-surface-mount-adapter-kit-one.html",
  "ss3-security-hardware-kit": "https://www.diodedynamics.com/ss3-security-hardware-kit.html",
  "stage-series-led-light-bar-cover": "https://www.diodedynamics.com/stage-series-led-light-bar-cover.html",
  "c2-2-0-sae-dot-white-sport-led-pod-pair": "https://www.diodedynamics.com/c2-2-0-sae-dot-white-sport-led-pod-pair.html",
  "c2-2-0-yellow-sport-led-pod-pair": "https://www.diodedynamics.com/c2-2-0-sae-dot-white-sport-led-pod-pair.html",
  "c2-2-0-yellow-pro-led-pod-pair": "https://www.diodedynamics.com/c2-2-0-sae-dot-white-sport-led-pod-pair.html",
  "c2-2-0-yellow-max-led-pod-pair": "https://www.diodedynamics.com/c2-2-0-sae-dot-white-sport-led-pod-pair.html",
  "c2-2-0-sae-dot-white-max-led-pod-pair": "https://www.diodedynamics.com/c2-2-0-sae-dot-white-max-led-pod-pair.html",
  "ss6-sae-dot-white-led-light-bar-one": "https://www.diodedynamics.com/ss6-sae-dot-white-led-light-bar-one.html",
  "ss10-sae-dot-white-led-light-bar-one": "https://www.diodedynamics.com/ss10-sae-dot-white-led-light-bar-one.html",
  "ss10-yellow-led-light-bar": "https://www.diodedynamics.com/ss10-sae-dot-white-led-light-bar-one.html",
  "ss20-white-led-light-bar-one": "https://www.diodedynamics.com/ss20-white-led-light-bar-one.html",
  "ss20-white-led-light-bar": "https://www.diodedynamics.com/ss20-white-led-light-bar-one.html",
  "ss30-white-led-light-bar-one": "https://www.diodedynamics.com/ss30-white-led-light-bar-one.html",
  "ss30-white-led-light-bar": "https://www.diodedynamics.com/ss30-white-led-light-bar-one.html",
  "ss30-dual-color-led-light-bar-one": "https://www.diodedynamics.com/ss30-dual-color-led-light-bar-one.html",
  "ss40-dual-color-led-light-bar-one": "https://www.diodedynamics.com/ss40-dual-color-led-light-bar-one.html",
  "c2r-white-flood-led-pod-pair": "https://www.diodedynamics.com/c2r-white-flood-standard-led-pod-pair.html",
  "mini-crosslink-endmount-kit": "https://www.diodedynamics.com/mini-crosslink-endmount-kit.html",
  "c2-2-0-led-pod-replacement-front-bezel-one": "https://www.diodedynamics.com/c2-2-0-led-pod-replacement-front-bezel-one.html",
  "c2-2-0-led-pod-cover-clear": "https://www.diodedynamics.com/c2-2-0-led-pod-replacement-front-bezel-one.html",
  "c2r-white-flood-flush-mount-led-pod-pair": "https://www.diodedynamics.com/c2r-white-flood-flush-mount-led-pod-pair.html",
  "stage-series-led-light-bar-universal-bracket-kit": "https://www.diodedynamics.com/stage-series-led-light-bar-universal-bracket-kit.html",
  "ss5-crosslink-6-pod-37-5-inch-led-light-bar-one": "https://www.diodedynamics.com/ss5-crosslink-6-pod-37-5-inch-led-light-bar-one.html",
};

async function scrapeProductImages(browser: any, url: string): Promise<string[]> {
  const page = await browser.newPage();
  try {
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });

    await page.waitForSelector("img", { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));

    const images: string[] = await page.evaluate(() => {
      const results: string[] = [];

      const galleryImgs = document.querySelectorAll(".fotorama__stage img, .fotorama__thumb img, .gallery-placeholder img, [data-gallery-role] img, .product.media img");
      galleryImgs.forEach((img: any) => {
        const src = img.src || img.getAttribute("data-src") || img.getAttribute("data-lazy");
        if (src && src.includes("catalog/product") && !src.includes("placeholder")) {
          results.push(src);
        }
      });

      if (results.length === 0) {
        document.querySelectorAll("img").forEach((img: any) => {
          const src = img.src || img.getAttribute("data-src") || img.getAttribute("data-lazy");
          if (src && src.includes("cloudfront") && src.includes("catalog/product") && !src.includes("placeholder")) {
            results.push(src);
          }
        });
      }

      const fotoramaData = document.querySelector("[data-fotorama]");
      if (fotoramaData) {
        const data = fotoramaData.getAttribute("data-fotorama");
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              parsed.forEach((item: any) => {
                if (item.img) results.push(item.img);
                if (item.full) results.push(item.full);
                if (item.thumb) results.push(item.thumb);
              });
            }
          } catch (e) {}
        }
      }

      const scripts = document.querySelectorAll("script");
      scripts.forEach((script) => {
        const text = script.textContent || "";
        const imgMatches = text.match(/https:\/\/dxv0kh7euhy9z\.cloudfront\.net\/catalog\/product[^"'\s)]+\.(jpg|png|webp)/gi);
        if (imgMatches) {
          imgMatches.forEach(url => results.push(url));
        }
      });

      const allImageSources = document.querySelectorAll("source[srcset*='catalog/product'], img[srcset*='catalog/product']");
      allImageSources.forEach((el: any) => {
        const srcset = el.srcset || el.getAttribute("srcset") || "";
        const matches = srcset.match(/https:\/\/[^\s,]+catalog\/product[^\s,]+/g);
        if (matches) results.push(...matches);
      });

      return results;
    });

    const cleanedImages: string[] = [];
    const seen = new Set<string>();
    for (const img of images) {
      const cleaned = img.replace(/\/cache\/[^\/]+\//, "/").split("?")[0];
      if (!seen.has(cleaned) && cleaned.includes("catalog/product") && !cleaned.includes("placeholder")) {
        seen.add(cleaned);
        cleanedImages.push(cleaned);
      }
    }

    return cleanedImages;
  } catch (e) {
    console.error(`Error scraping ${url}:`, e);
    return [];
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("Starting comprehensive DD image scrape with Puppeteer...\n");

  const ddProducts = await db.select().from(products).where(
    and(isNull(products.advlustProductId), isNull(products.advlustHandle), eq(products.isActive, true))
  );

  console.log(`Found ${ddProducts.length} DD products to check\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });

  let updated = 0;
  let totalNewImages = 0;
  const urlsScraped = new Set<string>();
  const urlImageCache = new Map<string, string[]>();

  for (const product of ddProducts) {
    const ddUrl = DD_PRODUCT_URLS[product.slug];
    if (!ddUrl) {
      console.log(`  SKIP: No DD URL mapped for ${product.slug}`);
      continue;
    }

    const currentImgCount = product.images?.length || 0;
    if (currentImgCount >= 6) {
      console.log(`  OK: ${product.name} already has ${currentImgCount} images`);
      continue;
    }

    let images: string[];
    if (urlImageCache.has(ddUrl)) {
      images = urlImageCache.get(ddUrl)!;
      console.log(`  CACHE: Using cached images for ${product.name} (${images.length} from ${ddUrl})`);
    } else {
      console.log(`  SCRAPING: ${product.name} from ${ddUrl}...`);
      images = await scrapeProductImages(browser, ddUrl);
      urlImageCache.set(ddUrl, images);
      console.log(`    Found ${images.length} images`);
      await new Promise(r => setTimeout(r, 2000));
    }

    if (images.length > currentImgCount) {
      const existingSet = new Set(product.images || []);
      const newImages = images.filter(img => !existingSet.has(img));
      const allImages = [...(product.images || []), ...newImages];

      await db.update(products).set({ images: allImages }).where(eq(products.id, product.id));

      for (let i = 0; i < newImages.length; i++) {
        const existingMedia = await db.select().from(productMedia)
          .where(and(eq(productMedia.productId, product.id), eq(productMedia.url, newImages[i])));
        if (existingMedia.length === 0) {
          await db.insert(productMedia).values({
            productId: product.id,
            url: newImages[i],
            altText: `${product.name} - Image ${currentImgCount + i + 1}`,
            mediaType: "image",
            isPrimary: false,
            sortOrder: currentImgCount + i + 1,
          });
        }
      }

      updated++;
      totalNewImages += newImages.length;
      console.log(`    UPDATED: ${product.name}: ${currentImgCount} -> ${allImages.length} images (+${newImages.length})`);
    } else {
      console.log(`    No additional images found for ${product.name}`);
    }
  }

  await browser.close();

  console.log(`\n=== Summary ===`);
  console.log(`Updated ${updated} products with ${totalNewImages} new images`);

  const stats = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      AVG(array_length(images, 1)) as avg_imgs,
      MIN(array_length(images, 1)) as min_imgs,
      MAX(array_length(images, 1)) as max_imgs
    FROM products WHERE is_active = true AND advlust_product_id IS NULL AND advlust_handle IS NULL
  `);
  console.log("DD Product image stats:", stats.rows[0]);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
