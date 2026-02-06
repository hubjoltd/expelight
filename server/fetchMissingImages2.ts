import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function isGoodProductImage(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes('image_map')) return false;
  if (lower.includes('/category/') && !lower.includes('/product/')) return false;
  if (lower.includes('logo')) return false;
  if (lower.includes('icon')) return false;
  if (lower.includes('banner')) return false;
  if (lower.includes('placeholder')) return false;
  if (lower.includes('favicon')) return false;
  if (lower.includes('sprite')) return false;
  if (lower.includes('1x1')) return false;
  if (lower.includes('pixel')) return false;
  if (lower.includes('payment')) return false;
  if (lower.includes('trust_badge')) return false;
  if (lower.includes('social')) return false;
  if (lower.includes('newsletter')) return false;
  if (lower.includes('footer')) return false;
  if (lower.includes('header')) return false;
  if (lower.includes('nav_')) return false;
  if (lower.includes('menu_')) return false;
  if (lower.includes('button_')) return false;
  if (lower.includes('close.')) return false;
  if (lower.includes('search.')) return false;
  if (lower.includes('arrow')) return false;
  return true;
}

async function fetchFromDiodeDynamics(sku: string, productName: string): Promise<string[]> {
  const slugVariants = [
    productName.toLowerCase()
      .replace(/\s*\(pair\)\s*/g, '-pair')
      .replace(/\s*\(one\)\s*/g, '-one')
      .replace(/,\s*/g, '-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
    productName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  ];
  
  for (const slug of slugVariants) {
    const url = `https://www.diodedynamics.com/${slug}.html`;
    try {
      console.log(`  Trying: ${url}`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(15000),
        redirect: 'follow',
      });
      
      if (!response.ok) continue;
      
      const html = await response.text();
      
      if (html.includes('404') && html.includes('page you requested was not found')) continue;
      
      const images: string[] = [];
      
      const galleryMatch = html.match(/\[data-gallery-role=gallery-placeholder\].*?"data":\s*(\[[\s\S]*?\])/);
      if (galleryMatch) {
        try {
          const galleryData = JSON.parse(galleryMatch[1]);
          for (const item of galleryData) {
            if (item.full || item.img) {
              const imgUrl = item.full || item.img;
              if (isGoodProductImage(imgUrl)) {
                images.push(imgUrl);
              }
            }
          }
        } catch {}
      }
      
      const jsonPatterns = [
        /"full"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
        /"img"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
        /"large"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
        /"medium"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
      ];
      
      for (const pattern of jsonPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const imgUrl = match[1].replace(/\\\//g, '/');
          if (isGoodProductImage(imgUrl) && !images.includes(imgUrl)) {
            if (imgUrl.includes('cloudfront') || imgUrl.includes('diodedynamics') || imgUrl.includes('magento')) {
              images.push(imgUrl);
            }
          }
        }
      }
      
      const skuLower = sku.toLowerCase();
      const productImgPatterns = [
        new RegExp(`src="(https?://[^"]*${skuLower}[^"]*\\.(?:jpg|jpeg|png|webp)[^"]*)"`, 'gi'),
        new RegExp(`data-src="(https?://[^"]*${skuLower}[^"]*\\.(?:jpg|jpeg|png|webp)[^"]*)"`, 'gi'),
      ];
      
      for (const pattern of productImgPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const imgUrl = match[1];
          if (isGoodProductImage(imgUrl) && !images.includes(imgUrl)) {
            images.push(imgUrl);
          }
        }
      }
      
      if (images.length > 0) {
        return images.slice(0, 10);
      }
    } catch (e: any) {
      console.log(`  Error: ${e.message}`);
      continue;
    }
  }
  
  return [];
}

async function tryCloudFrontDirectUrl(sku: string, name: string): Promise<string[]> {
  const cloudFrontBase = "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/514be37cf1810d98075a71c32f7b6a0f/dd/";
  const skuLower = sku.toLowerCase();
  
  const nameParts = name.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  
  const candidates = [
    `${cloudFrontBase}${skuLower}_${nameParts}.jpg`,
    `${cloudFrontBase}${skuLower}_1.jpg`,
    `${cloudFrontBase}${skuLower}.jpg`,
  ];
  
  const valid: string[] = [];
  for (const url of candidates) {
    try {
      const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      if (resp.ok) {
        const contentType = resp.headers.get('content-type');
        if (contentType && contentType.includes('image')) {
          valid.push(url);
        }
      }
    } catch {}
  }
  
  return valid;
}

async function tryShopifyPattern(sku: string): Promise<string[]> {
  const skuLower = sku.toLowerCase();
  const shopifyBase = "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/";
  
  const candidates = [
    `${shopifyBase}${skuLower}.jpg`,
    `${shopifyBase}${skuLower}_1.jpg`,
  ];
  
  const valid: string[] = [];
  for (const url of candidates) {
    try {
      const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      if (resp.ok) {
        const len = resp.headers.get('content-length');
        if (len && parseInt(len) > 5000) {
          valid.push(url);
        }
      }
    } catch {}
  }
  
  return valid;
}

async function main() {
  const client = await pool.connect();
  
  try {
    const { rows: badProducts } = await client.query(`
      SELECT p.id, p.name, p.slug, p.sku 
      FROM products p 
      WHERE p.images[1] LIKE '%Image_Map%' 
         OR p.images[1] LIKE '%/category/%'
         OR (p.images = '{}' OR p.images IS NULL OR array_length(p.images, 1) IS NULL)
      ORDER BY p.name
    `);
    
    console.log(`Found ${badProducts.length} products with bad/missing images\n`);
    
    let updated = 0;
    let failed = 0;
    
    for (const product of badProducts) {
      console.log(`\n[${updated + failed + 1}/${badProducts.length}] ${product.name} (${product.sku || 'no-sku'})`);
      
      let images = await fetchFromDiodeDynamics(product.sku || '', product.name);
      
      if (images.length === 0 && product.sku) {
        console.log(`  Trying CloudFront direct...`);
        images = await tryCloudFrontDirectUrl(product.sku, product.name);
      }
      
      if (images.length === 0 && product.sku) {
        console.log(`  Trying Shopify CDN...`);
        images = await tryShopifyPattern(product.sku);
      }
      
      if (images.length > 0) {
        await client.query(`UPDATE products SET images = $1 WHERE id = $2`, [images, product.id]);
        
        await client.query(`DELETE FROM product_media WHERE product_id = $1 AND (url LIKE '%Image_Map%' OR url LIKE '%/category/%')`, [product.id]);
        
        const { rows: existingMedia } = await client.query(
          `SELECT url FROM product_media WHERE product_id = $1`, [product.id]
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
        
        console.log(`  -> Updated with ${images.length} product images`);
        updated++;
      } else {
        console.log(`  -> FAILED: No product images found`);
        failed++;
      }
      
      await new Promise(r => setTimeout(r, 800));
    }
    
    console.log(`\n\n========= RESULTS =========`);
    console.log(`Updated: ${updated} products`);
    console.log(`Failed: ${failed} products`);
    
    const { rows: stillBad } = await client.query(`
      SELECT p.name, p.sku FROM products p 
      WHERE p.images[1] LIKE '%Image_Map%' 
         OR p.images[1] LIKE '%/category/%'
         OR (p.images = '{}' OR p.images IS NULL OR array_length(p.images, 1) IS NULL)
      ORDER BY p.name
    `);
    
    if (stillBad.length > 0) {
      console.log(`\nStill need images (${stillBad.length}):`);
      stillBad.forEach((p: any) => console.log(`  - ${p.name} (${p.sku})`));
    } else {
      console.log(`\nAll products now have valid images!`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main();
