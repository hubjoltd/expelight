import { db } from "./db";
import { products, productVariants, productMedia, categories, productCategories } from "@shared/schema";
import pg from "pg";

const PROD_DB_URL = "postgresql://neondb_owner:npg_JGT7EkRs0Vya@ep-dark-term-afjsr81p.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require";

async function main() {
  console.log("=== Syncing Development DB to Production DB ===\n");

  const prodPool = new pg.Pool({ connectionString: PROD_DB_URL, ssl: { rejectUnauthorized: false } });
  const prodClient = await prodPool.connect();

  try {
    console.log("Clearing existing production data...");
    await prodClient.query("DELETE FROM product_categories");
    await prodClient.query("DELETE FROM product_media");
    await prodClient.query("DELETE FROM product_variants");
    await prodClient.query("DELETE FROM products");
    await prodClient.query("DELETE FROM categories");
    console.log("  Done.\n");

    const allCategories = await db.select().from(categories);
    console.log(`Syncing ${allCategories.length} categories...`);
    for (const cat of allCategories) {
      await prodClient.query(
        `INSERT INTO categories (id, name, slug, description, parent_id, level, sort_order, is_active, image_url, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [cat.id, cat.name, cat.slug, cat.description, cat.parentId, cat.level, cat.sortOrder, cat.isActive, cat.imageUrl, cat.createdAt, cat.updatedAt]
      );
    }
    console.log("  Done.\n");

    const allProducts = await db.select().from(products);
    console.log(`Syncing ${allProducts.length} products...`);
    let count = 0;
    for (const p of allProducts) {
      await prodClient.query(
        `INSERT INTO products (id, name, slug, sku, series, tagline, short_description, full_description, price, original_price,
         beam_patterns, colors, features, specs, specifications_table, part_numbers, qa_content, installation_guide,
         whats_in_box, warranty_years, images, compatible_vehicles, is_popular, is_active, advlust_product_id, advlust_handle,
         video_url, is_pre_order, pre_order_message, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)`,
        [p.id, p.name, p.slug, p.sku, p.series, p.tagline, p.shortDescription, p.fullDescription, p.price, p.originalPrice,
         p.beamPatterns, p.colors, p.features, p.specs, p.specificationsTable, p.partNumbers, p.qaContent, p.installationGuide,
         p.whatsInBox, p.warrantyYears, p.images, p.compatibleVehicles, p.isPopular, p.isActive, p.advlustProductId, p.advlustHandle,
         p.videoUrl, p.isPreOrder, p.preOrderMessage, p.createdAt, p.updatedAt]
      );
      count++;
      if (count % 50 === 0) console.log(`  ${count}/${allProducts.length}...`);
    }
    console.log(`  ${count} products synced.\n`);

    const allVariants = await db.select().from(productVariants);
    console.log(`Syncing ${allVariants.length} variants in batches...`);
    const BATCH = 20;
    for (let i = 0; i < allVariants.length; i += BATCH) {
      const batch = allVariants.slice(i, i + BATCH);
      const values: any[] = [];
      const placeholders: string[] = [];
      let paramIdx = 1;
      for (const v of batch) {
        placeholders.push(`($${paramIdx},$${paramIdx+1},$${paramIdx+2},$${paramIdx+3},$${paramIdx+4},$${paramIdx+5},$${paramIdx+6},$${paramIdx+7},$${paramIdx+8},$${paramIdx+9},$${paramIdx+10},$${paramIdx+11},$${paramIdx+12},$${paramIdx+13},$${paramIdx+14})`);
        values.push(v.id, v.productId, v.sku, v.name, v.price, v.compareAtPrice, v.color, v.beamPattern, v.size, v.stockQuantity, v.isAvailable, v.weight, v.imageUrl, v.createdAt, v.updatedAt);
        paramIdx += 15;
      }
      await prodClient.query(
        `INSERT INTO product_variants (id, product_id, sku, name, price, compare_at_price, color, beam_pattern, size, stock_quantity, is_available, weight, image_url, created_at, updated_at)
         VALUES ${placeholders.join(",")}`,
        values
      );
      if ((i + BATCH) % 100 === 0) console.log(`  ${Math.min(i + BATCH, allVariants.length)}/${allVariants.length}...`);
    }
    console.log(`  ${allVariants.length} variants synced.\n`);

    const allMedia = await db.select().from(productMedia);
    console.log(`Syncing ${allMedia.length} media entries in batches...`);
    for (let i = 0; i < allMedia.length; i += BATCH) {
      const batch = allMedia.slice(i, i + BATCH);
      const values: any[] = [];
      const placeholders: string[] = [];
      let paramIdx = 1;
      for (const m of batch) {
        placeholders.push(`($${paramIdx},$${paramIdx+1},$${paramIdx+2},$${paramIdx+3},$${paramIdx+4},$${paramIdx+5},$${paramIdx+6},$${paramIdx+7})`);
        values.push(m.id, m.productId, m.url, m.altText, m.mediaType, m.isPrimary, m.sortOrder, m.createdAt);
        paramIdx += 8;
      }
      await prodClient.query(
        `INSERT INTO product_media (id, product_id, url, alt_text, media_type, is_primary, sort_order, created_at)
         VALUES ${placeholders.join(",")}`,
        values
      );
      if ((i + BATCH) % 200 === 0) console.log(`  ${Math.min(i + BATCH, allMedia.length)}/${allMedia.length}...`);
    }
    console.log(`  ${allMedia.length} media entries synced.\n`);

    const allProdCats = await db.select().from(productCategories);
    console.log(`Syncing ${allProdCats.length} product-category mappings...`);
    for (let i = 0; i < allProdCats.length; i += BATCH) {
      const batch = allProdCats.slice(i, i + BATCH);
      const values: any[] = [];
      const placeholders: string[] = [];
      let paramIdx = 1;
      for (const pc of batch) {
        placeholders.push(`($${paramIdx},$${paramIdx+1},$${paramIdx+2})`);
        values.push(pc.id, pc.productId, pc.categoryId);
        paramIdx += 3;
      }
      await prodClient.query(
        `INSERT INTO product_categories (id, product_id, category_id) VALUES ${placeholders.join(",")}`,
        values
      );
    }
    console.log("  Done.\n");

    const res = await prodClient.query("SELECT COUNT(*) FROM products WHERE is_active = true");
    const varRes = await prodClient.query("SELECT COUNT(*) FROM product_variants");
    const mediaRes = await prodClient.query("SELECT COUNT(*) FROM product_media");
    const catRes = await prodClient.query("SELECT COUNT(*) FROM categories");

    console.log("=== Production DB Verification ===");
    console.log(`Products: ${res.rows[0].count}`);
    console.log(`Variants: ${varRes.rows[0].count}`);
    console.log(`Media: ${mediaRes.rows[0].count}`);
    console.log(`Categories: ${catRes.rows[0].count}`);
    console.log("\nSync complete!");
  } finally {
    prodClient.release();
    await prodPool.end();
  }
}

main().then(() => process.exit(0)).catch(e => { console.error("Error:", e); process.exit(1); });
