import { db } from "./db";
import { products, productVariants, productMedia, productCategories, categories } from "@shared/schema";
import { eq, sql, inArray } from "drizzle-orm";

const USD_TO_INR = 85;

interface DDProduct {
  url: string;
  name: string;
  description: string;
  variants: { sku: string; price: number; name: string; weight: string | null }[];
  images: string[];
  features: string[];
  whatsInBox: string[];
  warranty: number;
  categorySlug: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function getCategorySlug(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('c2') && n.includes('pod')) return 'ssc2-led-pods';
  if (n.includes('c2r') || n.includes('c1r')) return 'ssc1-led-pods';
  if (n.includes('ss5') && n.includes('light bar')) return 'ss5-crosslink-light-bars';
  if (n.includes('ss5') && n.includes('pod')) return 'ss5-led-pods';
  if (n.includes('ss3') && n.includes('pod')) return 'ss3-led-pods';
  if (n.includes('ssc2') && n.includes('pod')) return 'ssc2-led-pods';
  if (n.includes('ssc1') && n.includes('pod')) return 'ssc1-led-pods';
  if (n.includes('light bar') && (n.includes('ss6') || n.includes('ss10') || n.includes('ss20') || n.includes('ss30') || n.includes('ss40') || n.includes('ss50'))) return 'stage-series-light-bars';
  if (n.includes('light bar')) return 'stage-series-light-bars';
  if (n.includes('cover')) return 'pod-covers';
  if (n.includes('bracket') || n.includes('mount')) return 'mounting-brackets';
  if (n.includes('wiring') || n.includes('harness') || n.includes('extension') || n.includes('pigtail')) return 'wiring-harnesses';
  if (n.includes('bezel')) return 'pod-covers';
  if (n.includes('rock light')) return 'rock-lights';
  if (n.includes('security') || n.includes('hardware')) return 'mounting-brackets';
  if (n.includes('endmount') || n.includes('crosslink')) return 'mounting-brackets';
  if (n.includes('switch') || n.includes('controller')) return 'controllers-switches';
  return 'mounting-brackets';
}

function extractTextContent(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getSeriesFromName(name: string): string {
  if (name.includes("Max")) return "Max";
  if (name.includes("Pro")) return "Pro";
  if (name.includes("Sport")) return "Sport";
  if (name.includes("SS5")) return "Pro";
  if (name.includes("SS3")) return "Pro";
  return "Pro";
}

function getBeamPatterns(variants: { name: string }[]): string[] {
  const patterns = new Set<string>();
  const keywords = ["Driving", "Fog", "Flood", "Spot", "Combo", "Wide", "SAE"];
  for (const v of variants) {
    for (const kw of keywords) {
      if (v.name.includes(kw)) patterns.add(kw);
    }
  }
  return patterns.size > 0 ? Array.from(patterns) : ["Standard"];
}

function getColors(name: string, variants: { name: string }[]): string[] {
  const colors = new Set<string>();
  const colorKw = ["White", "Yellow", "Amber", "Red", "Green", "Blue", "Black", "Clear", "Smoked"];
  for (const kw of colorKw) {
    if (name.includes(kw)) colors.add(kw);
  }
  for (const v of variants) {
    for (const kw of colorKw) {
      if (v.name.includes(kw)) colors.add(kw);
    }
  }
  return colors.size > 0 ? Array.from(colors) : ["White"];
}

async function fetchProductPage(url: string): Promise<DDProduct | null> {
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    const nameMatch = html.match(/<h1[^>]*class="page-title"[^>]*>\s*<span[^>]*>([^<]+)<\/span>/i) ||
                       html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const name = nameMatch ? nameMatch[1].trim() : '';
    if (!name) return null;

    const variants: { sku: string; price: number; name: string; weight: string | null }[] = [];
    const skuRegex = /SKU:<[^>]*>\s*(\w+).*?Price:<[^>]*>\s*\$([\d.]+).*?Name:<[^>]*>\s*([^<]+)/gs;
    let m;
    while ((m = skuRegex.exec(html)) !== null) {
      variants.push({
        sku: m[1].trim(),
        price: Math.round(parseFloat(m[2]) * USD_TO_INR * 100) / 100,
        name: m[3].trim(),
        weight: null
      });
    }

    if (variants.length === 0) {
      const tableRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>[\s\S]*?SKU[^<]*<br\s*\/?>[\s\S]*?(\w+DD\w+|\w+)[\s\S]*?<\/td>[\s\S]*?<td[^>]*>[\s\S]*?Price[^<]*<br\s*\/?>[\s\S]*?\$([\d.]+)[\s\S]*?<\/td>[\s\S]*?<td[^>]*>[\s\S]*?Name[^<]*<br\s*\/?>[\s\S]*?([^<]+)<\/td>/gi;
      while ((m = tableRegex.exec(html)) !== null) {
        variants.push({
          sku: m[1].trim(),
          price: Math.round(parseFloat(m[2]) * USD_TO_INR * 100) / 100,
          name: m[3].trim(),
          weight: null
        });
      }
    }

    const images: string[] = [];
    const imgRegex = /https:\/\/dxv0kh7euhy9z\.cloudfront\.net\/catalog\/product[^"'\s)]+\.(jpg|png|webp)/gi;
    while ((m = imgRegex.exec(html)) !== null) {
      const imgUrl = m[0].replace(/\/cache\/[^\/]+\//, '/');
      if (!images.includes(imgUrl) && !imgUrl.includes('placeholder')) {
        images.push(imgUrl);
      }
    }

    const descMatch = html.match(/<div[^>]*class="[^"]*product[^"]*description[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*tab|<div[^>]*id="tab)/i);
    const description = descMatch ? descMatch[1] : '';

    const features: string[] = [];
    const featMatch = html.match(/<h3[^>]*>\s*Features?\s*<\/h3>\s*<ul>([\s\S]*?)<\/ul>/i);
    if (featMatch) {
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      while ((m = liRegex.exec(featMatch[1])) !== null) {
        const t = extractTextContent(m[1]).trim();
        if (t.length > 2) features.push(t);
      }
    }

    const whatsInBox: string[] = [];
    const boxMatch = html.match(/In the Box[^<]*<\/strong>\s*<ul>([\s\S]*?)<\/ul>/i) ||
                     html.match(/What's Included[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
    if (boxMatch) {
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      while ((m = liRegex.exec(boxMatch[1])) !== null) {
        const t = extractTextContent(m[1]).trim();
        if (t.length > 2) whatsInBox.push(t);
      }
    }

    const warrantyMatch = html.match(/(\d+)\s*[Yy]ear\s*(?:[Ll]imited\s*)?[Ww]arranty/);
    const warranty = warrantyMatch ? parseInt(warrantyMatch[1]) : 8;

    return {
      url,
      name,
      description,
      variants,
      images: images.slice(0, 12),
      features: features.length > 0 ? features : ["Premium LED Technology", "Advanced Optics", "Easy Installation"],
      whatsInBox: whatsInBox.length > 0 ? whatsInBox : ["Product as described", "Mounting Hardware"],
      warranty,
      categorySlug: getCategorySlug(name)
    };
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
    return null;
  }
}

const productPages: { url: string; representativeSkus: string[] }[] = [
  { url: "https://www.diodedynamics.com/light-duty-dual-output-offroad-wiring-harness.html", representativeSkus: ["DD4033"] },
  { url: "https://www.diodedynamics.com/light-duty-dual-output-4-pin-wiring-harness.html", representativeSkus: ["DD4092"] },
  { url: "https://www.diodedynamics.com/dt-4-pin-extension-wire-1m.html", representativeSkus: ["DD4098","DD4099"] },
  { url: "https://www.diodedynamics.com/reverse-light-wiring-kit-w-running-light.html", representativeSkus: ["DD4102","DD4103","DD4104"] },
  { url: "https://www.diodedynamics.com/ultra-heavy-duty-single-output-4-pin-wiring-harness.html", representativeSkus: ["DD4123","DD4125"] },
  { url: "https://www.diodedynamics.com/ss3-led-pod-cover-clear-one.html", representativeSkus: ["DD6261","DD6262","DD6263","DD6264"] },
  { url: "https://www.diodedynamics.com/ssc1-yellow-sport-led-pod-pair.html", representativeSkus: ["DD6443P"] },
  { url: "https://www.diodedynamics.com/ssc1-flush-mount-mounting-kit.html", representativeSkus: ["DD6621S"] },
  { url: "https://www.diodedynamics.com/ss5-white-pro-led-pod-one.html", representativeSkus: ["DD6774S","DD6774SNB","DD6775S","DD6775SNB","DD6782SNB"] },
  { url: "https://www.diodedynamics.com/ss5-crosslink-3-pod-18-5-inch-led-light-bar-one.html", representativeSkus: ["DD6792","DD7204"] },
  { url: "https://www.diodedynamics.com/ss5-crosslink-endmount-kit.html", representativeSkus: ["DD6804","DD6805","DD6806"] },
  { url: "https://www.diodedynamics.com/stage-series-ss5-universal-bracket-kit.html", representativeSkus: ["DD6814S"] },
  { url: "https://www.diodedynamics.com/ssc1-white-sae-fog-led-pod-pair.html", representativeSkus: ["DD6847P"] },
  { url: "https://www.diodedynamics.com/ss3-sae-dot-white-sport-led-pod-one.html", representativeSkus: ["DD6858S"] },
  { url: "https://www.diodedynamics.com/ss3-sae-dot-white-sport-led-pod-pair.html", representativeSkus: ["DD6865P"] },
  { url: "https://www.diodedynamics.com/ss3-sae-dot-white-pro-led-pod-pair.html", representativeSkus: ["DD6878P"] },
  { url: "https://www.diodedynamics.com/ss3-sae-white-max-led-pod-pair.html", representativeSkus: ["DD6899P"] },
  { url: "https://www.diodedynamics.com/ss3-sae-yellow-max-led-pod-pair.html", representativeSkus: ["DD6910P"] },
  { url: "https://www.diodedynamics.com/ss5-led-pod-cover-black-one.html", representativeSkus: ["DD7217","DD7218"] },
  { url: "https://www.diodedynamics.com/ss5-crosslink-5-pod-31-5-inch-led-light-bar-one.html", representativeSkus: ["DD7242","DD7254"] },
  { url: "https://www.diodedynamics.com/stage-series-rock-light-surface-mount-adapter-kit-one.html", representativeSkus: ["DD7462","DD7463"] },
  { url: "https://www.diodedynamics.com/ss3-security-hardware-kit.html", representativeSkus: ["DD7529","DD7530","DD7531","DD7532"] },
  { url: "https://www.diodedynamics.com/stage-series-led-light-bar-cover.html", representativeSkus: ["DD7777","DD7778","DD7779","DD7780","DD7781","DD7782","DD7783","DD7784","DD7785","DD7786","DD7787","DD7788","DD8643","DD8644","DD8645"] },
  { url: "https://www.diodedynamics.com/c2-2-0-sae-dot-white-sport-led-pod-pair.html", representativeSkus: ["DD8088P","DD8089P","DD8090P","DD8091P","DD8092P","DD8094P","DD8095P","DD8096P","DD8097P","DD8098P","DD8099P","DD8100P","DD8101P","DD8102P","DD8103P","DD8104P","DD8106P","DD8107P","DD8110P","DD8111P","DD8112P","DD8114P","DD8115P","DD8118P","DD8119P","DD8120P"] },
  { url: "https://www.diodedynamics.com/ss6-sae-dot-white-led-light-bar-one.html", representativeSkus: ["DD8132S","DD8133S","DD8134S","DD8135S","DD8136S","DD8137S","DD8138S","DD8139S","DD8140S","DD8142S","DD8143S","DD8144S","DD8145S","DD8146S","DD8147S","DD8148S","DD8150S","DD8154S","DD8155S","DD8156S","DD8157S","DD8159S","DD8160S","DD8162S","DD8166S","DD8168S"] },
  { url: "https://www.diodedynamics.com/ss10-sae-dot-white-led-light-bar-one.html", representativeSkus: ["DD8180","DD8181","DD8182","DD8183","DD8184","DD8185","DD8189","DD8190","DD8191","DD8192","DD8193","DD8194","DD8195","DD8196","DD8197"] },
  { url: "https://www.diodedynamics.com/ss20-white-led-light-bar-one.html", representativeSkus: ["DD8201","DD8203","DD8204","DD8205","DD8207","DD8208","DD8216","DD8219","DD8220","DD8221","DD8231","DD8232","DD8233"] },
  { url: "https://www.diodedynamics.com/c2-2-0-sae-dot-white-max-led-pod-pair.html", representativeSkus: ["DD8240P","DD8241P","DD8242P","DD8243P"] },
  { url: "https://www.diodedynamics.com/ss30-white-led-light-bar-one.html", representativeSkus: ["DD8256"] },
  { url: "https://www.diodedynamics.com/ss30-dual-color-led-light-bar-one.html", representativeSkus: ["DD8375"] },
  { url: "https://www.diodedynamics.com/ss40-dual-color-led-light-bar-one.html", representativeSkus: ["DD8385"] },
  { url: "https://www.diodedynamics.com/c2r-white-flood-standard-led-pod-pair.html", representativeSkus: ["DD8450P","DD8450S"] },
  { url: "https://www.diodedynamics.com/mini-crosslink-endmount-kit.html", representativeSkus: ["DD8469","DD8470","DD8471"] },
  { url: "https://www.diodedynamics.com/c2-2-0-led-pod-replacement-front-bezel-one.html", representativeSkus: ["DD8555S","DD8556","DD8557","DD8558","DD8559","DD8560"] },
  { url: "https://www.diodedynamics.com/c2r-white-flood-flush-mount-led-pod-pair.html", representativeSkus: ["DD8573P","DD8573S"] },
  { url: "https://www.diodedynamics.com/stage-series-led-light-bar-universal-bracket-kit.html", representativeSkus: ["DD8656","DD8657","DD8815"] },
  { url: "https://www.diodedynamics.com/ss6-sae-yellow-led-light-bar-one.html", representativeSkus: ["DD8658S","DD8659S"] },
  { url: "https://www.diodedynamics.com/ss5-crosslink-6-pod-37-5-inch-led-light-bar-one.html", representativeSkus: ["DD8767"] },
];

async function importDDProducts() {
  console.log("Starting DiodeDynamics product import...\n");

  const allCategories = await db.select().from(categories);
  const catMap = new Map(allCategories.map(c => [c.slug, c.id]));

  const existingVariants = await db.select({ sku: productVariants.sku }).from(productVariants);
  const existingSkus = new Set(existingVariants.map(v => v.sku.toUpperCase()));

  let imported = 0;
  let skipped = 0;
  let totalNewVariants = 0;

  for (const page of productPages) {
    const neededSkus = page.representativeSkus.filter(s => !existingSkus.has(s.toUpperCase()));
    if (neededSkus.length === 0) {
      console.log(`SKIP: All SKUs already exist for ${page.url}`);
      skipped++;
      continue;
    }

    console.log(`Fetching: ${page.url}`);
    const product = await fetchProductPage(page.url);
    if (!product) {
      console.log(`  FAILED to fetch product page`);
      continue;
    }

    console.log(`  Found: ${product.name} (${product.variants.length} variants, ${product.images.length} images)`);

    if (product.variants.length === 0) {
      console.log(`  No variants found in page, creating from requested SKUs`);
      const priceMatch = product.description.match(/\$([\d.]+)/);
      const priceUsd = priceMatch ? parseFloat(priceMatch[1]) : 29.95;
      for (const sku of neededSkus) {
        product.variants.push({
          sku,
          price: Math.round(priceUsd * USD_TO_INR * 100) / 100,
          name: product.name,
          weight: null
        });
      }
    }

    const newVariants = product.variants.filter(v => !existingSkus.has(v.sku.toUpperCase()));
    if (newVariants.length === 0) {
      console.log(`  All fetched variants already exist, checking for requested ones...`);
      for (const sku of neededSkus) {
        const existing = product.variants.find(v => v.sku.toUpperCase() === sku.toUpperCase());
        if (!existing) {
          const baseVariant = product.variants[0];
          newVariants.push({
            sku,
            price: baseVariant?.price || 2999,
            name: sku,
            weight: null
          });
        }
      }
    }

    if (newVariants.length === 0) {
      console.log(`  Truly no new variants to add`);
      continue;
    }

    const existingProduct = await db.select().from(products).where(
      eq(products.slug, slugify(product.name))
    );

    let productId: string;

    if (existingProduct.length > 0) {
      productId = existingProduct[0].id;
      console.log(`  Product already exists, adding ${newVariants.length} new variants`);
    } else {
      const lowestPrice = Math.min(...product.variants.map(v => v.price));
      const priceInr = Math.round(lowestPrice);

      const slug = slugify(product.name);
      const series = getSeriesFromName(product.name);
      const beamPatterns = getBeamPatterns(product.variants);
      const colors = getColors(product.name, product.variants);

      const shortDesc = extractTextContent(product.description).substring(0, 300);

      const [newProduct] = await db.insert(products).values({
        name: product.name,
        slug,
        sku: newVariants[0].sku,
        series,
        tagline: `Premium ${series} Series LED Lighting`,
        shortDescription: shortDesc || product.name,
        fullDescription: product.description || product.name,
        price: priceInr,
        beamPatterns,
        colors,
        features: product.features,
        specs: [`Warranty: ${product.warranty} Years`],
        whatsInBox: product.whatsInBox,
        warrantyYears: product.warranty,
        images: product.images,
        compatibleVehicles: [],
        isPopular: false,
        isActive: true,
        partNumbers: JSON.stringify(product.variants.map(v => ({
          sku: v.sku, price: v.price, name: v.name, weight: v.weight
        }))),
        installationGuide: JSON.stringify({
          installationTime: "30-60 minutes",
          toolsNeeded: "Basic Toolset",
          note: "Follow included instructions for best results."
        }),
      }).returning();

      productId = newProduct.id;

      if (product.images.length > 0) {
        await db.insert(productMedia).values(
          product.images.map((img, i) => ({
            productId,
            url: img,
            altText: `${product.name} - Image ${i + 1}`,
            mediaType: "image",
            isPrimary: i === 0,
            sortOrder: i,
          }))
        );
      }

      const catId = catMap.get(product.categorySlug);
      if (catId) {
        await db.insert(productCategories).values({ productId, categoryId: catId });
      }

      imported++;
    }

    for (const v of newVariants) {
      if (existingSkus.has(v.sku.toUpperCase())) continue;

      try {
        await db.insert(productVariants).values({
          productId,
          sku: v.sku,
          name: v.name,
          price: Math.round(v.price),
          color: getColors(v.name, []).join(', ') || null,
          beamPattern: null,
          isAvailable: true,
          weight: v.weight,
        });
        existingSkus.add(v.sku.toUpperCase());
        totalNewVariants++;
      } catch (e: any) {
        if (e.message?.includes('unique')) {
          console.log(`  Duplicate SKU skipped: ${v.sku}`);
        } else {
          console.error(`  Error inserting variant ${v.sku}:`, e.message);
        }
      }
    }

    console.log(`  Done: ${newVariants.length} new variants added`);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`New products created: ${imported}`);
  console.log(`New variants added: ${totalNewVariants}`);
  console.log(`Skipped (already exist): ${skipped}`);
}

async function fixCaseSensitiveSkus() {
  console.log("Fixing case-sensitive SKU issues...");
  const caseFixes = [
    { from: 'DD8133s', to: 'DD8133S' },
    { from: 'DD8138s', to: 'DD8138S' },
    { from: 'DD8143s', to: 'DD8143S' },
    { from: 'DD8145s', to: 'DD8145S' },
    { from: 'DD8150s', to: 'DD8150S' },
    { from: 'DD8155s', to: 'DD8155S' },
    { from: 'DD8157s', to: 'DD8157S' },
    { from: 'DD8162s', to: 'DD8162S' },
  ];

  for (const fix of caseFixes) {
    try {
      await db.update(productVariants)
        .set({ sku: fix.to })
        .where(eq(productVariants.sku, fix.from));
      console.log(`  Fixed: ${fix.from} -> ${fix.to}`);
    } catch (e: any) {
      if (e.message?.includes('unique')) {
        await db.delete(productVariants).where(eq(productVariants.sku, fix.from));
        console.log(`  Deleted duplicate: ${fix.from} (${fix.to} already exists)`);
      }
    }
  }
}

async function main() {
  await fixCaseSensitiveSkus();
  await importDDProducts();

  const totalProducts = await db.select({ count: sql<number>`count(*)` }).from(products);
  const totalVariants = await db.select({ count: sql<number>`count(*)` }).from(productVariants);
  console.log(`\nTotal products in DB: ${totalProducts[0].count}`);
  console.log(`Total variants in DB: ${totalVariants[0].count}`);
}

main().catch(console.error);
