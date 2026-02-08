import { db } from "./db";
import { products, productVariants } from "@shared/schema";
import { sql } from "drizzle-orm";

const MISSING_PRODUCTS = [
  {
    id: "03df51af-ae20-4ac9-b6dc-38464bb2a8ed",
    name: "C2 2.0 SAE Yellow Sport LED Pod (pair)",
    slug: "c2-2-0-yellow-sport-led-pod-pair",
    sku: "DD8089P",
    series: "Sport",
    tagline: "See Further, Go Faster",
    shortDescription: "The new C2 2.0 is the next generation of auxiliary LED lighting with SAE Yellow Sport performance.",
    fullDescription: "The new C2 2.0 is the next generation of auxiliary LED lighting! See Further, Go Faster with our C2 2.0 SAE Yellow Sport Standard LED Pod (pair)! The C2 2.0 features TIR optics for maximum output and efficiency, a new sleek compact design, and SAE compliance. Available in Driving, Combo/Driving, Flood, SAE Fog/Wide, and Spot beam patterns.",
    price: 28599,
    originalPrice: 28599,
    beamPatterns: ["Driving", "Combo/Driving", "Flood", "SAE Fog/Wide", "Spot"],
    colors: ["Yellow"],
    features: ["TIR Optics", "SAE Compliant", "Compact Design", "IP68 Waterproof", "50,000+ Hour Lifespan"],
    specs: ["Power: 40W Sport", "Voltage: 9-32V DC", "LED Emitter: Osram", "Material: Die-Cast Aluminum", "IP Rating: IP68"],
    whatsInBox: ["2x C2 2.0 Yellow Sport LED Pods", "1x Wiring Harness", "Mounting Hardware"],
    warrantyYears: 6,
    images: ["https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b/d/d/dd8094p_c2_gen2_sport_yellow_combo_standard_abl_pair_built_-_titled.jpg", "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/3587a0a2f04460e2c3314cded1962806/d/d/dd8089p_c2_gen2_sport_yellow_driving_standard_abl_pair_built_ktw92m70kjgve70m.jpg"],
    compatibleVehicles: ["Toyota Hilux", "Isuzu V-Cross", "Jeep Wrangler", "Toyota Hycross", "Suzuki Jimny", "Toyota Fortuner", "Toyota Innova Crysta", "Mahindra Thar", "Mahindra Thar Roxx"],
    isPopular: false,
    isActive: true,
    isPreOrder: false,
    variants: [
      { sku: "DD8089P", name: "Driving (pair)", price: 28599, color: "Yellow", beamPattern: "Driving" },
      { sku: "DD8091P", name: "SAE Fog/Wide (pair)", price: 28599, color: "Yellow", beamPattern: "SAE Fog/Wide" },
      { sku: "DD8097P", name: "Flood (pair)", price: 28599, color: "Yellow", beamPattern: "Flood" },
      { sku: "DD8099P", name: "Spot (pair)", price: 28599, color: "Yellow", beamPattern: "Spot" },
    ],
  },
  {
    id: "8705c441-86e2-4154-bd55-1b21e26e30ee",
    name: "C2 2.0 SAE Yellow Pro LED Pod (pair)",
    slug: "c2-2-0-yellow-pro-led-pod-pair",
    sku: "DD8111P",
    series: "Pro",
    tagline: "See Further, Go Faster",
    shortDescription: "The new C2 2.0 is the next generation of auxiliary LED lighting with SAE Yellow Pro performance.",
    fullDescription: "The new C2 2.0 is the next generation of auxiliary LED lighting! See Further, Go Faster with our C2 2.0 SAE Yellow Pro Standard LED Pod (pair)! The C2 2.0 Pro features TIR optics for maximum output and efficiency, upgraded driver electronics for increased power, a new sleek compact design, and SAE compliance. Available in Driving, Combo/Driving, Flood, SAE Fog/Wide, and Spot beam patterns.",
    price: 45499,
    originalPrice: 45499,
    beamPatterns: ["Driving", "Combo/Driving", "Flood", "SAE Fog/Wide", "Spot"],
    colors: ["Yellow"],
    features: ["TIR Optics", "SAE Compliant", "Pro Driver Electronics", "IP68 Waterproof", "50,000+ Hour Lifespan"],
    specs: ["Power: 90W Pro", "Voltage: 9-32V DC", "LED Emitter: Osram", "Material: Die-Cast Aluminum", "IP Rating: IP68"],
    whatsInBox: ["2x C2 2.0 Yellow Pro LED Pods", "1x Wiring Harness", "Mounting Hardware"],
    warrantyYears: 6,
    images: ["https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b/d/d/dd8106p_c2_gen2_pro_yellow_combo_standard_abl_pair_built_-_titled.jpg", "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/3587a0a2f04460e2c3314cded1962806/d/d/dd8101p_c2_gen2_pro_yellow_driving_standard_abl_pair_built_zfex6tbhjs40r8bq.jpg"],
    compatibleVehicles: ["Toyota Hilux", "Isuzu V-Cross", "Jeep Wrangler", "Toyota Hycross", "Suzuki Jimny", "Toyota Fortuner", "Toyota Innova Crysta", "Mahindra Thar", "Mahindra Thar Roxx"],
    isPopular: false,
    isActive: true,
    isPreOrder: false,
    variants: [
      { sku: "DD8111P", name: "Spot (pair)", price: 45499, color: "Yellow", beamPattern: "Spot" },
    ],
  },
  {
    id: "bd1e5493-5b0f-41a8-8430-6fbaf533607b",
    name: "C2 2.0 SAE Yellow Max LED Pod (pair)",
    slug: "c2-2-0-yellow-max-led-pod-pair",
    sku: "DD8114P",
    series: "Max",
    tagline: "See Further, Go Faster",
    shortDescription: "The new C2 2.0 is the next generation of auxiliary LED lighting with SAE Yellow Max performance.",
    fullDescription: "The new C2 2.0 is the next generation of auxiliary LED lighting! See Further, Go Faster with our C2 2.0 SAE Yellow Max Standard LED Pod (pair)! The C2 2.0 Max features TIR optics for absolute maximum output, top-tier driver electronics, a new sleek compact design, and SAE compliance. Available in Driving, Combo/Driving, Flood, SAE Fog/Wide, and Spot beam patterns.",
    price: 62399,
    originalPrice: 62399,
    beamPatterns: ["Driving", "Combo/Driving", "Flood", "SAE Fog/Wide", "Spot"],
    colors: ["Yellow"],
    features: ["TIR Optics", "SAE Compliant", "Max Driver Electronics", "IP68 Waterproof", "50,000+ Hour Lifespan"],
    specs: ["Power: Max", "Voltage: 9-32V DC", "LED Emitter: Osram", "Material: Die-Cast Aluminum", "IP Rating: IP68"],
    whatsInBox: ["2x C2 2.0 Yellow Max LED Pods", "1x Wiring Harness", "Mounting Hardware"],
    warrantyYears: 6,
    images: ["https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b/d/d/dd8114p_c2_gen2_max_yellow_combo_standard_abl_pair_built_-_titled.jpg", "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/3587a0a2f04460e2c3314cded1962806/d/d/dd8101p_c2_gen2_pro_yellow_driving_standard_abl_pair_built_zfex6tbhjs40r8bq.jpg"],
    compatibleVehicles: ["Toyota Hilux", "Isuzu V-Cross", "Jeep Wrangler", "Toyota Hycross", "Suzuki Jimny", "Toyota Fortuner", "Toyota Innova Crysta", "Mahindra Thar", "Mahindra Thar Roxx"],
    isPopular: false,
    isActive: true,
    isPreOrder: false,
    variants: [
      { sku: "DD8114P", name: "Combo/Driving (pair)", price: 62399, color: "Yellow", beamPattern: "Combo/Driving" },
      { sku: "DD8119P", name: "Spot (pair)", price: 62399, color: "Yellow", beamPattern: "Spot" },
    ],
  },
  {
    id: "e3a7df2f-4b69-4e8d-9a95-d380227800aa",
    name: "SS10 SAE/DOT Yellow LED Light Bar (one)",
    slug: "ss10-yellow-led-light-bar",
    sku: "DD8182",
    series: "Sport",
    tagline: "See Further, Go Faster",
    shortDescription: "See Further, Go Faster with our SS10 SAE/DOT Yellow LED Light Bar.",
    fullDescription: "See Further, Go Faster with our SS10 SAE/DOT Yellow LED Light Bar. Designed for maximum functionality with a useful beam pattern in a highly durable package. The SS10 features TIR optics, die-cast aluminum construction, and is available in Sport, Pro, and Max power levels with SAE Driving, Combo/Driving, Flood, and Spot beam patterns.",
    price: 32499,
    originalPrice: 32499,
    beamPatterns: ["SAE Driving", "Combo/Driving", "Flood", "Spot"],
    colors: ["Yellow"],
    features: ["TIR Optics", "SAE/DOT Compliant", "Die-Cast Aluminum", "IP68 Waterproof", "50,000+ Hour Lifespan"],
    specs: ["Power: 40W Sport / 51.5W Pro / 61W Max", "Voltage: 9-32V DC", "LED Emitter: Osram", "Material: Die-Cast Aluminum", "IP Rating: IP68"],
    whatsInBox: ["1x SS10 Yellow LED Light Bar", "1x Wiring Harness", "Mounting Hardware"],
    warrantyYears: 6,
    images: ["https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b/d/d/dd8191_ss10_sport_yellow_spot_standard_abl_1.jpg", "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/3587a0a2f04460e2c3314cded1962806/d/d/dd8182_ss10_sport_yellow_driving_standard_abl.jpg"],
    compatibleVehicles: ["Toyota Hilux", "Isuzu V-Cross", "Jeep Wrangler", "Toyota Hycross", "Suzuki Jimny", "Toyota Fortuner", "Toyota Innova Crysta", "Mahindra Thar", "Mahindra Thar Roxx"],
    isPopular: false,
    isActive: true,
    isPreOrder: false,
    variants: [
      { sku: "DD8182", name: "SAE Driving Sport (40W)", price: 32499, color: "Yellow", beamPattern: "SAE Driving" },
      { sku: "DD8194", name: "SAE Driving Pro (51.5W)", price: 45499, color: "Yellow", beamPattern: "SAE Driving" },
    ],
  },
  {
    id: "741ca561-3aad-409f-8c1c-15936924dc60",
    name: "SS20 White LED Light Bar (one)",
    slug: "ss20-white-led-light-bar",
    sku: "DD8216",
    series: "Sport",
    tagline: "See Further, Go Faster",
    shortDescription: "See Further, Go Faster with our SS20 White LED Light Bar.",
    fullDescription: "See Further, Go Faster with our SS20 White LED Light Bar. Designed for maximum functionality with a useful beam pattern in a highly durable package. The SS20 features TIR optics, die-cast aluminum construction, and is available in Sport and Pro power levels with SAE Driving, Combo/Driving, Flood, and Spot beam patterns. Available in Standard and SmartSelect models.",
    price: 51999,
    originalPrice: 51999,
    beamPatterns: ["SAE Driving", "Combo/Driving", "Flood", "Spot"],
    colors: ["White"],
    features: ["TIR Optics", "SAE/DOT Compliant", "Die-Cast Aluminum", "IP68 Waterproof", "50,000+ Hour Lifespan", "SmartSelect Available"],
    specs: ["Power: 76.5W Sport / 105W Pro", "Voltage: 9-32V DC", "LED Emitter: Osram", "Material: Die-Cast Aluminum", "IP Rating: IP68"],
    whatsInBox: ["1x SS20 White LED Light Bar", "1x Wiring Harness", "Mounting Hardware"],
    warrantyYears: 6,
    images: ["https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b/d/d/dd8225_ss20_sport_white_spot_standard_abl_1.jpg", "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/3587a0a2f04460e2c3314cded1962806/d/d/dd8216_ss20_sport_white_driving_standard_abl.jpg"],
    compatibleVehicles: ["Toyota Hilux", "Isuzu V-Cross", "Jeep Wrangler", "Toyota Hycross", "Suzuki Jimny", "Toyota Fortuner", "Toyota Innova Crysta", "Mahindra Thar", "Mahindra Thar Roxx"],
    isPopular: false,
    isActive: true,
    isPreOrder: false,
    variants: [
      { sku: "DD8216", name: "SAE Driving Sport (76.5W) Standard", price: 51999, color: "White", beamPattern: "SAE Driving" },
      { sku: "DD8220", name: "Combo/Driving Sport (76.5W) SmartSelect", price: 58499, color: "White", beamPattern: "Combo/Driving" },
      { sku: "DD8232", name: "Combo/Driving Pro (105W) SmartSelect", price: 77999, color: "White", beamPattern: "Combo/Driving" },
    ],
  },
  {
    id: "369749dd-6389-4e58-be53-dc5e50e33bf6",
    name: "SS30 White LED Light Bar (one)",
    slug: "ss30-white-led-light-bar",
    sku: "DD8256",
    series: "Sport",
    tagline: "See Further, Go Faster",
    shortDescription: "See Further, Go Faster with our SS30 White LED Light Bar.",
    fullDescription: "See Further, Go Faster with our SS30 White LED Light Bar. Designed for maximum functionality with a useful beam pattern in a highly durable package. The SS30 features TIR optics, die-cast aluminum construction, and is available in Sport and Pro power levels with SAE Driving, Combo/Driving, Flood, and Spot beam patterns. Available in Standard and SmartSelect models.",
    price: 77999,
    originalPrice: 77999,
    beamPatterns: ["SAE Driving", "Combo/Driving", "Flood", "Spot"],
    colors: ["White"],
    features: ["TIR Optics", "SAE/DOT Compliant", "Die-Cast Aluminum", "IP68 Waterproof", "50,000+ Hour Lifespan", "SmartSelect Available"],
    specs: ["Power: 120W Sport / 165W Pro", "Voltage: 9-32V DC", "LED Emitter: Osram", "Material: Die-Cast Aluminum", "IP Rating: IP68"],
    whatsInBox: ["1x SS30 White LED Light Bar", "1x Wiring Harness", "Mounting Hardware"],
    warrantyYears: 6,
    images: ["https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b/d/d/dd8261_ss30_sport_white_spot_standard_abl_1.jpg", "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/3587a0a2f04460e2c3314cded1962806/d/d/dd8252_ss30_sport_white_driving_standard_abl.jpg"],
    compatibleVehicles: ["Toyota Hilux", "Isuzu V-Cross", "Jeep Wrangler", "Toyota Hycross", "Suzuki Jimny", "Toyota Fortuner", "Toyota Innova Crysta", "Mahindra Thar", "Mahindra Thar Roxx"],
    isPopular: false,
    isActive: true,
    isPreOrder: false,
    variants: [
      { sku: "DD8256", name: "Combo/Driving Sport (120W) SmartSelect", price: 87749, color: "White", beamPattern: "Combo/Driving" },
    ],
  },
  {
    id: "c8df7734-3be3-416e-889c-834b28b84399",
    name: "C2 2.0 LED Pod Cover, Clear (one)",
    slug: "c2-2-0-led-pod-cover-clear",
    sku: "DD8559",
    series: "Sport",
    tagline: "Protect Your Investment",
    shortDescription: "Protect your Diode Dynamics C2 2.0 LED Pod Lights with clear protective covers.",
    fullDescription: "Protect your Diode Dynamics C2 2.0 LED Pod Lights with clear protective covers. Designed to shield your C2 2.0 LED pods from debris, dust, and weather when not in use. The clear cover allows light to pass through while providing durable protection. Available for Standard mount C2 2.0 pods.",
    price: 1164,
    originalPrice: 1164,
    beamPatterns: [],
    colors: ["Clear"],
    features: ["Durable Polycarbonate", "UV Resistant", "Easy Snap-On Installation", "Clear Lens"],
    specs: ["Material: Polycarbonate", "Fitment: C2 2.0 Standard Mount", "Color: Clear"],
    whatsInBox: ["1x C2 2.0 LED Pod Cover (Clear)"],
    warrantyYears: 6,
    images: ["https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b/d/d/dd8559_c2_gen_2_cover_standard_clear_1.jpg"],
    compatibleVehicles: ["Toyota Hilux", "Isuzu V-Cross", "Jeep Wrangler", "Toyota Hycross", "Suzuki Jimny", "Toyota Fortuner", "Toyota Innova Crysta", "Mahindra Thar", "Mahindra Thar Roxx"],
    isPopular: false,
    isActive: true,
    isPreOrder: false,
    variants: [
      { sku: "DD8559", name: "Clear Cover (one)", price: 1164, color: "Clear", beamPattern: null },
    ],
  },
];

export async function seedMissingProducts() {
  try {
    const existing = await db.select({ id: products.id }).from(products);
    const existingIds = new Set(existing.map((p) => p.id));

    let addedCount = 0;
    for (const p of MISSING_PRODUCTS) {
      if (existingIds.has(p.id)) continue;

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
        whatsInBox: p.whatsInBox,
        warrantyYears: p.warrantyYears,
        images: p.images,
        compatibleVehicles: p.compatibleVehicles,
        isPopular: p.isPopular,
        isActive: p.isActive,
        isPreOrder: p.isPreOrder,
      });

      const existingVariants = await db.select({ sku: productVariants.sku }).from(productVariants);
      const existingSkus = new Set(existingVariants.map((v) => v.sku));

      for (const v of p.variants) {
        if (existingSkus.has(v.sku)) continue;
        await db.insert(productVariants).values({
          productId: p.id,
          sku: v.sku,
          name: v.name,
          price: v.price,
          color: v.color,
          beamPattern: v.beamPattern,
          isAvailable: true,
          stockQuantity: 0,
        });
      }

      addedCount++;
      console.log(`  Seeded: ${p.name}`);
    }

    if (addedCount > 0) {
      console.log(`Seeded ${addedCount} missing products to database.`);
    }
  } catch (error) {
    console.error("Error seeding missing products:", error);
  }
}
