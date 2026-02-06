import pkg from "pg";
const { Pool } = pkg;

const DEV_DB_URL = process.env.DATABASE_URL!;
const PROD_DB_URL = process.argv[2];

if (!PROD_DB_URL) {
  console.error("Usage: npx tsx server/migrateToProduction.ts <PRODUCTION_DATABASE_URL>");
  process.exit(1);
}

async function migrate() {
  const devPool = new Pool({ connectionString: DEV_DB_URL });
  const prodPool = new Pool({ connectionString: PROD_DB_URL });

  try {
    console.log("Connecting to development database...");
    const devClient = await devPool.connect();
    console.log("Connecting to production database...");
    const prodClient = await prodPool.connect();

    console.log("\n--- Step 1: Creating tables in production ---");

    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        parent_id VARCHAR,
        level INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        sku TEXT,
        series TEXT NOT NULL,
        tagline TEXT NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        price INTEGER NOT NULL,
        original_price INTEGER,
        beam_patterns TEXT[] NOT NULL,
        colors TEXT[] NOT NULL,
        features TEXT[] NOT NULL,
        specs TEXT[] NOT NULL,
        specifications_table TEXT,
        part_numbers TEXT,
        qa_content TEXT,
        installation_guide TEXT,
        whats_in_box TEXT[],
        warranty_years INTEGER NOT NULL DEFAULT 5,
        images TEXT[] NOT NULL,
        compatible_vehicles TEXT[] NOT NULL,
        is_popular BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        advlust_product_id TEXT,
        advlust_handle TEXT,
        video_url TEXT,
        is_pre_order BOOLEAN DEFAULT false,
        pre_order_message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS product_variants (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id VARCHAR NOT NULL,
        sku TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        compare_at_price INTEGER,
        color TEXT,
        beam_pattern TEXT,
        size TEXT,
        stock_quantity INTEGER DEFAULT 0,
        is_available BOOLEAN DEFAULT true,
        weight DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS product_categories (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id VARCHAR NOT NULL,
        category_id VARCHAR NOT NULL
      );

      CREATE TABLE IF NOT EXISTS product_media (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id VARCHAR NOT NULL,
        url TEXT NOT NULL,
        alt_text TEXT,
        media_type TEXT NOT NULL DEFAULT 'image',
        is_primary BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year TEXT NOT NULL,
        compatible_product_ids TEXT[] NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        rating INTEGER NOT NULL,
        text TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_location TEXT NOT NULL,
        vehicle_owned TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT true,
        product_id VARCHAR
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        full_name TEXT,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        product_id VARCHAR NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        items TEXT NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id VARCHAR NOT NULL,
        invoice_number TEXT NOT NULL UNIQUE,
        subtotal INTEGER NOT NULL,
        tax_amount INTEGER NOT NULL DEFAULT 0,
        shipping_amount INTEGER NOT NULL DEFAULT 0,
        discount_amount INTEGER NOT NULL DEFAULT 0,
        total_amount INTEGER NOT NULL,
        tax_breakdown TEXT,
        pdf_url TEXT,
        status TEXT NOT NULL DEFAULT 'generated',
        sent_via_whatsapp BOOLEAN DEFAULT false,
        whatsapp_sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image TEXT,
        author TEXT NOT NULL DEFAULT 'Expelight Team',
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await prodClient.query(createTablesSQL);
    console.log("Tables created successfully!");

    console.log("\n--- Step 2: Clearing existing production data ---");
    await prodClient.query("DELETE FROM product_media");
    await prodClient.query("DELETE FROM product_categories");
    await prodClient.query("DELETE FROM product_variants");
    await prodClient.query("DELETE FROM products");
    await prodClient.query("DELETE FROM categories");
    console.log("Production data cleared.");

    console.log("\n--- Step 3: Migrating categories ---");
    const { rows: categories } = await devClient.query("SELECT * FROM categories");
    for (const cat of categories) {
      await prodClient.query(
        `INSERT INTO categories (id, name, slug, description, parent_id, level, sort_order, is_active, image_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [cat.id, cat.name, cat.slug, cat.description, cat.parent_id, cat.level, cat.sort_order, cat.is_active, cat.image_url, cat.created_at, cat.updated_at]
      );
    }
    console.log(`Migrated ${categories.length} categories.`);

    console.log("\n--- Step 4: Migrating products ---");
    const { rows: products } = await devClient.query("SELECT * FROM products");
    for (const p of products) {
      await prodClient.query(
        `INSERT INTO products (id, name, slug, sku, series, tagline, short_description, full_description, price, original_price, beam_patterns, colors, features, specs, specifications_table, part_numbers, qa_content, installation_guide, whats_in_box, warranty_years, images, compatible_vehicles, is_popular, is_active, advlust_product_id, advlust_handle, video_url, is_pre_order, pre_order_message, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.slug, p.sku, p.series, p.tagline, p.short_description, p.full_description, p.price, p.original_price, p.beam_patterns, p.colors, p.features, p.specs, p.specifications_table, p.part_numbers, p.qa_content, p.installation_guide, p.whats_in_box, p.warranty_years, p.images, p.compatible_vehicles, p.is_popular, p.is_active, p.advlust_product_id, p.advlust_handle, p.video_url, p.is_pre_order, p.pre_order_message, p.created_at, p.updated_at]
      );
    }
    console.log(`Migrated ${products.length} products.`);

    console.log("\n--- Step 5: Migrating product_variants ---");
    const { rows: variants } = await devClient.query("SELECT * FROM product_variants");
    for (const v of variants) {
      await prodClient.query(
        `INSERT INTO product_variants (id, product_id, sku, name, price, compare_at_price, color, beam_pattern, size, stock_quantity, is_available, weight, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (id) DO NOTHING`,
        [v.id, v.product_id, v.sku, v.name, v.price, v.compare_at_price, v.color, v.beam_pattern, v.size, v.stock_quantity, v.is_available, v.weight, v.created_at, v.updated_at]
      );
    }
    console.log(`Migrated ${variants.length} product variants.`);

    console.log("\n--- Step 6: Migrating product_categories ---");
    const { rows: prodCats } = await devClient.query("SELECT * FROM product_categories");
    for (const pc of prodCats) {
      await prodClient.query(
        `INSERT INTO product_categories (id, product_id, category_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [pc.id, pc.product_id, pc.category_id]
      );
    }
    console.log(`Migrated ${prodCats.length} product-category links.`);

    console.log("\n--- Step 7: Migrating product_media ---");
    const { rows: media } = await devClient.query("SELECT * FROM product_media");
    let mediaCount = 0;
    for (const m of media) {
      await prodClient.query(
        `INSERT INTO product_media (id, product_id, url, alt_text, media_type, is_primary, sort_order, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [m.id, m.product_id, m.url, m.alt_text, m.media_type, m.is_primary, m.sort_order, m.created_at]
      );
      mediaCount++;
      if (mediaCount % 100 === 0) console.log(`  ... ${mediaCount}/${media.length} media items`);
    }
    console.log(`Migrated ${media.length} product media items.`);

    console.log("\n--- Step 8: Verifying production data ---");
    const verifyTables = ["categories", "products", "product_variants", "product_categories", "product_media"];
    for (const table of verifyTables) {
      const { rows } = await prodClient.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${rows[0].count} rows`);
    }

    devClient.release();
    prodClient.release();

    console.log("\nMigration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await devPool.end();
    await prodPool.end();
  }
}

migrate();
