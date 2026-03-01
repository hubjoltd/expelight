import { db } from "./db";
import { products, productVariants, productMedia } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import crypto from "crypto";

interface RawSeedProduct {
  name: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string;
  price: number;
  images?: string[];
  features?: string[];
  beamPatterns?: string[];
  colors?: string[];
  series?: string;
  variants?: RawSeedVariant[];
  media?: RawSeedMedia[];
}

interface RawSeedVariant {
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  beamPattern?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean | null;
}

interface RawSeedMedia {
  url: string;
  sortOrder?: number | null;
}

interface SeedProduct {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  series: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice: number | null;
  beamPatterns: string[];
  colors: string[];
  features: string[];
  specs: string[];
  specificationsTable: string | null;
  partNumbers: string | null;
  qaContent: string | null;
  installationGuide: string | null;
  whatsInBox: string[];
  warrantyYears: number;
  images: string[];
  compatibleVehicles: string[];
  isPopular: boolean;
  isActive: boolean;
  advlustProductId: string | null;
  advlustHandle: string | null;
  videoUrl: string | null;
  isPreOrder: boolean;
  preOrderMessage: string | null;
}

interface SeedVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  color: string | null;
  beamPattern: string | null;
  size: string | null;
  stockQuantity: number | null;
  isAvailable: boolean | null;
  weight: string | null;
  imageUrl: string | null;
}

interface SeedMedia {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  mediaType: string;
  isPrimary: boolean | null;
  sortOrder: number | null;
}

interface SeedData {
  products: SeedProduct[];
  variants: SeedVariant[];
  media: SeedMedia[];
}

function deterministicUuid(input: string): string {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    ((parseInt(hash.slice(16, 17), 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

function loadSeedData(): SeedData {
  const filePath = path.join(process.cwd(), "server", "seedData.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    return parsed as SeedData;
  }

  const rawProducts: RawSeedProduct[] = parsed;
  const allProducts: SeedProduct[] = [];
  const allVariants: SeedVariant[] = [];
  const allMedia: SeedMedia[] = [];

  for (const rp of rawProducts) {
    const productId = deterministicUuid(`product:${rp.slug}`);

    allProducts.push({
      id: productId,
      name: rp.name,
      slug: rp.slug,
      sku: rp.sku ?? null,
      series: rp.series ?? "Standard",
      tagline: rp.shortDescription ?? rp.name,
      shortDescription: rp.shortDescription ?? "",
      fullDescription: rp.shortDescription ?? "",
      price: rp.price,
      originalPrice: null,
      beamPatterns: rp.beamPatterns ?? [],
      colors: rp.colors ?? [],
      features: rp.features ?? [],
      specs: [],
      specificationsTable: null,
      partNumbers: null,
      qaContent: null,
      installationGuide: null,
      whatsInBox: [],
      warrantyYears: 8,
      images: rp.images ?? [],
      compatibleVehicles: [],
      isPopular: false,
      isActive: true,
      advlustProductId: null,
      advlustHandle: null,
      videoUrl: null,
      isPreOrder: false,
      preOrderMessage: null,
    });

    if (rp.variants) {
      for (const rv of rp.variants) {
        allVariants.push({
          id: deterministicUuid(`variant:${rv.sku}`),
          productId,
          sku: rv.sku,
          name: rv.name,
          price: rv.price,
          compareAtPrice: rv.compareAtPrice ?? null,
          color: rv.color ?? null,
          beamPattern: rv.beamPattern ?? null,
          size: null,
          stockQuantity: 0,
          isAvailable: rv.isAvailable ?? true,
          weight: null,
          imageUrl: rv.imageUrl ?? null,
        });
      }
    }

    if (rp.media) {
      for (let i = 0; i < rp.media.length; i++) {
        const rm = rp.media[i];
        allMedia.push({
          id: deterministicUuid(`media:${rp.slug}:${i}`),
          productId,
          url: rm.url,
          altText: rp.name,
          mediaType: rm.url.includes("youtube") || rm.url.includes("youtu.be") ? "video" : "image",
          isPrimary: i === 0,
          sortOrder: rm.sortOrder ?? i,
        });
      }
    }
  }

  return { products: allProducts, variants: allVariants, media: allMedia };
}

export async function seedMissingProducts() {
  try {
    const seedData = loadSeedData();

    const existingProducts = await db.select({ id: products.id, slug: products.slug }).from(products);
    const existingIds = new Set(existingProducts.map((p) => p.id));
    const existingSlugs = new Set(existingProducts.map((p) => p.slug));

    const existingVariantRows = await db.select({ sku: productVariants.sku }).from(productVariants);
    const existingSkus = new Set(existingVariantRows.map((v) => v.sku));

    const existingMediaRows = await db.select({ id: productMedia.id }).from(productMedia);
    const existingMediaIds = new Set(existingMediaRows.map((m) => m.id));

    let productsAdded = 0;
    let variantsAdded = 0;
    let mediaAdded = 0;

    for (const p of seedData.products) {
      if (existingIds.has(p.id) || existingSlugs.has(p.slug)) continue;

      await db.insert(products).values({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        series: p.series,
        tagline: p.tagline,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        price: p.price,
        originalPrice: p.originalPrice,
        beamPatterns: p.beamPatterns,
        colors: p.colors,
        features: p.features,
        specs: p.specs,
        specificationsTable: p.specificationsTable,
        partNumbers: p.partNumbers,
        qaContent: p.qaContent,
        installationGuide: p.installationGuide,
        whatsInBox: p.whatsInBox,
        warrantyYears: p.warrantyYears,
        images: p.images,
        compatibleVehicles: p.compatibleVehicles,
        isPopular: p.isPopular ?? false,
        isActive: p.isActive ?? true,
        advlustProductId: p.advlustProductId,
        advlustHandle: p.advlustHandle,
        videoUrl: p.videoUrl,
        isPreOrder: p.isPreOrder ?? false,
        preOrderMessage: p.preOrderMessage,
      });
      productsAdded++;
    }

    const seededProductIds = new Set(seedData.products.map(p => p.id));

    for (const v of seedData.variants) {
      if (existingSkus.has(v.sku)) continue;
      if (!existingIds.has(v.productId) && !seededProductIds.has(v.productId)) {
        console.warn(`  Skipping variant ${v.sku}: parent product ${v.productId} not found`);
        continue;
      }

      try {
        await db.insert(productVariants).values({
          id: v.id,
          productId: v.productId,
          sku: v.sku,
          name: v.name,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          color: v.color,
          beamPattern: v.beamPattern,
          size: v.size,
          stockQuantity: v.stockQuantity ?? 0,
          isAvailable: v.isAvailable ?? true,
          weight: v.weight,
          imageUrl: v.imageUrl,
        });
        variantsAdded++;
      } catch (e: any) {
        console.warn(`  Failed to seed variant ${v.sku}: ${e.message}`);
      }
    }

    for (const m of seedData.media) {
      if (existingMediaIds.has(m.id)) continue;
      if (!existingIds.has(m.productId) && !seededProductIds.has(m.productId)) continue;

      try {
        await db.insert(productMedia).values({
          id: m.id,
          productId: m.productId,
          url: m.url,
          altText: m.altText,
          mediaType: m.mediaType,
          isPrimary: m.isPrimary ?? false,
          sortOrder: m.sortOrder ?? 0,
        });
        mediaAdded++;
      } catch (e: any) {
        console.warn(`  Failed to seed media ${m.id}: ${e.message}`);
      }
    }

    if (productsAdded > 0 || variantsAdded > 0 || mediaAdded > 0) {
      console.log(`Seeded: ${productsAdded} products, ${variantsAdded} variants, ${mediaAdded} media entries.`);
    }
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}
