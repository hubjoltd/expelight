import pkg from "pg";
const { Pool } = pkg;

const devPool = new Pool({ connectionString: process.env.DATABASE_URL });
const prodPool = new Pool({ 
  connectionString: "postgresql://neondb_owner:npg_wcW8nVx6CjZa@ep-steep-bread-aiedrkj6.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require" 
});

async function main() {
  const devClient = await devPool.connect();
  const prodClient = await prodPool.connect();
  
  try {
    const { rows: devProducts } = await devClient.query(
      `SELECT id, sku, name, images FROM products ORDER BY id`
    );
    
    console.log(`Found ${devProducts.length} products in dev DB\n`);
    
    let updatedImages = 0;
    let insertedMedia = 0;
    let skipped = 0;
    
    for (const devProduct of devProducts) {
      const { rows: prodProducts } = await prodClient.query(
        `SELECT id, images FROM products WHERE sku = $1`, [devProduct.sku]
      );
      
      if (prodProducts.length === 0) {
        console.log(`  SKIP: ${devProduct.name} (${devProduct.sku}) - not found in prod`);
        skipped++;
        continue;
      }
      
      const prodProduct = prodProducts[0];
      const prodId = prodProduct.id;
      
      const devImages = devProduct.images || [];
      const prodImages = prodProduct.images || [];
      
      const devFirstImage = devImages[0] || '';
      const prodFirstImage = prodImages[0] || '';
      const needsUpdate = devImages.length > prodImages.length || 
                          prodFirstImage.includes('Image_Map') || 
                          prodFirstImage.includes('/category/') ||
                          prodImages.length === 0 ||
                          devFirstImage !== prodFirstImage;
      
      if (needsUpdate && devImages.length > 0) {
        await prodClient.query(
          `UPDATE products SET images = $1 WHERE id = $2`,
          [devImages, prodId]
        );
        
        await prodClient.query(
          `DELETE FROM product_media WHERE product_id = $1 AND (url LIKE '%Image_Map%' OR url LIKE '%/category/%')`,
          [prodId]
        );
        
        const { rows: existingMedia } = await prodClient.query(
          `SELECT url FROM product_media WHERE product_id = $1`, [prodId]
        );
        const existingUrls = new Set(existingMedia.map((m: any) => m.url));
        
        const { rows: devMedia } = await devClient.query(
          `SELECT url, alt_text, media_type, is_primary, sort_order FROM product_media WHERE product_id = $1 ORDER BY sort_order`,
          [devProduct.id]
        );
        
        for (const media of devMedia) {
          if (!existingUrls.has(media.url)) {
            await prodClient.query(
              `INSERT INTO product_media (product_id, url, alt_text, media_type, is_primary, sort_order)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [prodId, media.url, media.alt_text, media.media_type, media.is_primary, media.sort_order]
            );
            insertedMedia++;
          }
        }
        
        console.log(`  Updated: ${devProduct.name} (${devProduct.sku}) - ${devImages.length} images`);
        updatedImages++;
      }
    }
    
    console.log(`\n========= RESULTS =========`);
    console.log(`Products updated: ${updatedImages}`);
    console.log(`Media entries added: ${insertedMedia}`);
    console.log(`Skipped (not in prod): ${skipped}`);
    
    const { rows: prodCheck } = await prodClient.query(`
      SELECT COUNT(*) as total,
             COUNT(*) FILTER (WHERE images = '{}' OR images IS NULL OR array_length(images, 1) IS NULL) as no_images,
             COUNT(*) FILTER (WHERE images[1] LIKE '%Image_Map%' OR images[1] LIKE '%/category/%') as bad_images
      FROM products
    `);
    console.log(`\nProd DB check: ${prodCheck[0].total} products, ${prodCheck[0].no_images} missing images, ${prodCheck[0].bad_images} bad images`);
    
  } finally {
    devClient.release();
    prodClient.release();
    await devPool.end();
    await prodPool.end();
  }
}

main();
