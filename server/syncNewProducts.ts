import pkg from "pg";
const { Pool } = pkg;

const DEV_DB_URL = process.env.DATABASE_URL!;
const PROD_DB_URL = process.argv[2];

if (!PROD_DB_URL) {
  console.error("Usage: npx tsx server/syncNewProducts.ts <PRODUCTION_DATABASE_URL>");
  process.exit(1);
}

async function syncNewProducts() {
  const devPool = new Pool({ connectionString: DEV_DB_URL });
  const prodPool = new Pool({ connectionString: PROD_DB_URL });

  try {
    const devClient = await devPool.connect();
    const prodClient = await prodPool.connect();

    console.log("Connected to both databases.");

    const { rows: devProducts } = await devClient.query("SELECT * FROM products WHERE is_active = true");
    const { rows: prodProducts } = await prodClient.query("SELECT id FROM products");
    const prodIds = new Set(prodProducts.map((p: any) => p.id));

    const missing = devProducts.filter((p: any) => !prodIds.has(p.id));
    console.log(`Found ${missing.length} missing products to sync.`);

    for (const p of missing) {
      await prodClient.query(
        `INSERT INTO products (id, name, slug, sku, series, tagline, short_description, full_description, price, original_price, beam_patterns, colors, features, specs, specifications_table, part_numbers, qa_content, installation_guide, whats_in_box, warranty_years, images, compatible_vehicles, is_popular, is_active, advlust_product_id, advlust_handle, video_url, is_pre_order, pre_order_message, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.slug, p.sku, p.series, p.tagline, p.short_description, p.full_description, p.price, p.original_price, p.beam_patterns, p.colors, p.features, p.specs, p.specifications_table, p.part_numbers, p.qa_content, p.installation_guide, p.whats_in_box, p.warranty_years, p.images, p.compatible_vehicles, p.is_popular, p.is_active, p.advlust_product_id, p.advlust_handle, p.video_url, p.is_pre_order, p.pre_order_message, p.created_at, p.updated_at]
      );
      console.log(`  + Product: ${p.name}`);
    }

    const missingIds = missing.map((p: any) => p.id);
    if (missingIds.length > 0) {
      const { rows: devVariants } = await devClient.query(
        "SELECT * FROM product_variants WHERE product_id = ANY($1)",
        [missingIds]
      );

      const { rows: existingVariants } = await prodClient.query("SELECT sku FROM product_variants");
      const existingSkus = new Set(existingVariants.map((v: any) => v.sku));

      let variantCount = 0;
      for (const v of devVariants) {
        if (existingSkus.has(v.sku)) {
          console.log(`  ~ Skipping variant ${v.sku} (already exists)`);
          continue;
        }
        await prodClient.query(
          `INSERT INTO product_variants (id, product_id, sku, name, price, compare_at_price, color, beam_pattern, size, stock_quantity, is_available, weight, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO NOTHING`,
          [v.id, v.product_id, v.sku, v.name, v.price, v.compare_at_price, v.color, v.beam_pattern, v.size, v.stock_quantity, v.is_available, v.weight, v.created_at, v.updated_at]
        );
        variantCount++;
      }
      console.log(`Synced ${variantCount} new variants.`);

      const { rows: devProdCats } = await devClient.query(
        "SELECT * FROM product_categories WHERE product_id = ANY($1)",
        [missingIds]
      );
      for (const pc of devProdCats) {
        await prodClient.query(
          `INSERT INTO product_categories (id, product_id, category_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
          [pc.id, pc.product_id, pc.category_id]
        );
      }
      console.log(`Synced ${devProdCats.length} product-category links.`);
    }

    console.log("\n--- Verification ---");
    const { rows: finalCount } = await prodClient.query("SELECT COUNT(*) as count FROM products WHERE is_active = true");
    const { rows: varCount } = await prodClient.query("SELECT COUNT(*) as count FROM product_variants");
    console.log(`Production products: ${finalCount[0].count}`);
    console.log(`Production variants: ${varCount[0].count}`);

    devClient.release();
    prodClient.release();
    console.log("\nSync completed successfully!");
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  } finally {
    await devPool.end();
    await prodPool.end();
  }
}

syncNewProducts();
