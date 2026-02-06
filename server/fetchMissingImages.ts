import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fetchProductImages(sku: string, productName: string): Promise<string[]> {
  const slug = productName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/\(pair\)/g, 'pair')
    .replace(/\(one\)/g, 'one');
  
  const skuLower = sku.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const urls = [
    `https://www.diodedynamics.com/${slug}.html`,
    `https://www.diodedynamics.com/${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.html`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) continue;
      
      const html = await response.text();
      
      const images: string[] = [];
      
      const patterns = [
        /data-src="(https?:\/\/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
        /src="(https?:\/\/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
        /"full":"(https?:\/\/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
        /"img":"(https?:\/\/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const imgUrl = match[1];
          if (imgUrl.includes('diodedynamics') || imgUrl.includes('cloudfront') || imgUrl.includes('magento')) {
            if (!imgUrl.includes('logo') && !imgUrl.includes('icon') && !imgUrl.includes('banner') && 
                !imgUrl.includes('placeholder') && !imgUrl.includes('favicon') && !imgUrl.includes('sprite') &&
                !imgUrl.includes('1x1') && !imgUrl.includes('pixel')) {
              if (!images.includes(imgUrl)) {
                images.push(imgUrl);
              }
            }
          }
        }
      }
      
      if (images.length > 0) {
        return images.slice(0, 10);
      }
    } catch (e) {
      continue;
    }
  }
  
  return [];
}

async function buildDDUrlFromSku(sku: string, name: string): Promise<string[]> {
  const cloudFrontBase = "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/514be37cf1810d98075a71c32f7b6a0f/dd/";
  
  const namePart = name.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  
  const skuLower = sku.toLowerCase();
  
  const possibleUrls = [
    `${cloudFrontBase}${skuLower}_${namePart}.jpg`,
    `${cloudFrontBase}${skuLower}_1.jpg`,
  ];
  
  const validUrls: string[] = [];
  for (const url of possibleUrls) {
    try {
      const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      if (resp.ok) {
        validUrls.push(url);
      }
    } catch {}
  }
  
  return validUrls;
}

async function main() {
  const client = await pool.connect();
  
  try {
    const { rows: productsNoImages } = await client.query(`
      SELECT p.id, p.name, p.slug, p.sku 
      FROM products p 
      WHERE (p.images = '{}' OR p.images IS NULL OR array_length(p.images, 1) IS NULL)
      ORDER BY p.name
    `);
    
    const { rows: productsLowMedia } = await client.query(`
      SELECT p.id, p.name, p.slug, p.sku,
             (SELECT COUNT(*) FROM product_media pm WHERE pm.product_id = p.id)::int as media_count
      FROM products p 
      WHERE (SELECT COUNT(*) FROM product_media pm WHERE pm.product_id = p.id) < 2
      ORDER BY p.name
    `);
    
    const allProducts = [...productsNoImages];
    for (const p of productsLowMedia) {
      if (!allProducts.find(x => x.id === p.id)) {
        allProducts.push(p);
      }
    }
    
    console.log(`Found ${allProducts.length} products needing images\n`);
    
    let updated = 0;
    let failed = 0;
    
    for (const product of allProducts) {
      console.log(`Processing: ${product.name} (${product.sku || 'no-sku'})...`);
      
      let images = await fetchProductImages(product.sku || '', product.name);
      
      if (images.length === 0 && product.sku) {
        images = await buildDDUrlFromSku(product.sku, product.name);
      }
      
      if (images.length > 0) {
        await client.query(
          `UPDATE products SET images = $1 WHERE id = $2`,
          [images, product.id]
        );
        
        const { rows: existingMedia } = await client.query(
          `SELECT url FROM product_media WHERE product_id = $1`,
          [product.id]
        );
        const existingUrls = new Set(existingMedia.map((m: any) => m.url));
        
        for (let i = 0; i < images.length; i++) {
          if (!existingUrls.has(images[i])) {
            await client.query(
              `INSERT INTO product_media (product_id, url, alt_text, media_type, is_primary, sort_order)
               VALUES ($1, $2, $3, 'image', $4, $5)`,
              [product.id, images[i], product.name, i === 0, i]
            );
          }
        }
        
        console.log(`  -> Found ${images.length} images`);
        updated++;
      } else {
        console.log(`  -> No images found`);
        failed++;
      }
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`\n--- Results ---`);
    console.log(`Updated: ${updated} products`);
    console.log(`Failed: ${failed} products`);
    
    const { rows: stillMissing } = await client.query(`
      SELECT p.name, p.sku FROM products p 
      WHERE (p.images = '{}' OR p.images IS NULL OR array_length(p.images, 1) IS NULL)
      ORDER BY p.name
    `);
    
    if (stillMissing.length > 0) {
      console.log(`\nStill missing images (${stillMissing.length}):`);
      stillMissing.forEach((p: any) => console.log(`  - ${p.name} (${p.sku})`));
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main();
