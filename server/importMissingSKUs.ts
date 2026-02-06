import { db } from "./db";
import { products, productVariants, productCategories } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const CDN_BASE = "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/514be37cf1810d98075a71c32f7b6a0f/";

const CAT = {
  LED_PODS: "dd041c1d-2aa0-4890-9625-1f81cc00fb1e",
  SS5_PODS: "164d4ce6-2e9e-4f0f-adf9-da20241a934c",
  SSC2_PODS: "24159e91-7384-464b-afe1-72a4846e661d",
  SSC1_PODS: "40b9bb60-e536-4244-b628-b57ce15ec276",
  SS3_PODS: "5b92debf-917c-4b65-96f3-ec4335f90132",
  LED_LIGHT_BARS: "788fb719-7872-4b11-bceb-519784bc600c",
  STAGE_SERIES_LB: "4db760ec-5a96-432a-a84a-3ff9356043af",
  SS5_CROSSLINK_LB: "d215ad25-b6d7-4aff-8fca-cceff24ab275",
  ACCESSORIES: "7bf3e012-1b52-4735-8bb4-adeec79ac1b8",
  POD_COVERS: "7eae54a8-181c-4995-b311-76298afe3f27",
  WIRING: "eba3ac43-07c9-4fea-ae1c-04c347d04d7e",
  BRACKETS: "8eb4452d-dede-4868-bef9-2103954825dd",
  CONTROLLERS: "5f22780d-0ed5-43f0-8cf2-79fb74469a84",
  ROCK_LIGHTS: "6c2a4fc5-27d0-4d05-a172-d7ca09fb444f",
};

interface VariantDef {
  sku: string;
  name: string;
  price: number;
  beamPattern?: string;
  color?: string;
  size?: string;
}

interface ProductDef {
  name: string;
  slug: string;
  sku: string;
  series: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  beamPatterns: string[];
  colors: string[];
  features: string[];
  specs: string[];
  specificationsTable?: string;
  whatsInBox: string[];
  warrantyYears: number;
  images: string[];
  compatibleVehicles: string[];
  videoUrl?: string;
  isPopular?: boolean;
  isPreOrder: boolean;
  preOrderMessage: string;
  categoryIds: string[];
  variants: VariantDef[];
}

interface ExistingVariantDef {
  productId: string;
  variants: VariantDef[];
}

async function skuExists(sku: string): Promise<boolean> {
  const existing = await db.select().from(productVariants).where(eq(productVariants.sku, sku));
  return existing.length > 0;
}

async function slugExists(slug: string): Promise<boolean> {
  const existing = await db.select().from(products).where(eq(products.slug, slug));
  return existing.length > 0;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (await slugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

function getNewProducts(): ProductDef[] {
  return [
    {
      name: "C2 2.0 SAE/DOT White Sport LED Pod (pair)",
      slug: "c2-2-0-white-sport-led-pod-pair",
      sku: "DD8093P",
      series: "Sport",
      tagline: "Ultra-Compact 2nd Gen C2 Sport Pod with Patented TIR Optics",
      shortDescription: "The all-new C2 2.0 Sport LED Pod delivers up to 95% more power than the original C2, packed into an ultra-compact 2-inch design with patented TIR optics and CrossLink compatibility.",
      fullDescription: "The Diode Dynamics C2 2.0 Sport LED Pod represents the next generation of ultra-compact auxiliary lighting. Featuring a complete redesign with up to 95% more power than the original C2 1.0, this pod packs serious output into a remarkably small 2-inch form factor. Built with patented TIR optics for precise beam control, Lumileds LED emitters for maximum efficiency, and a Deutsch DT connector for reliable weatherproof connections.\n\nAvailable in multiple SAE/DOT-compliant beam patterns including Driving, Fog-Wide, Combo, Flood, and Spot configurations, each paired with your choice of Amber or Red backlight functionality. The C2 2.0 is CrossLink compatible, allowing you to build custom light bar configurations. With an IP69K waterproof rating, 9-30V operating voltage, and a Limited Lifetime Warranty, these pods are engineered to perform in the harshest conditions. Proudly made in the USA.",
      price: 28599,
      beamPatterns: ["SAE Driving", "SAE Fog-Wide", "Combo-Driving", "Flood", "Spot"],
      colors: ["White"],
      features: ["Ultra-compact 2\" design", "Patented TIR optics", "Up to 95% more power than C2 1.0", "Backlight functionality", "CrossLink compatible", "IP69K Waterproof", "Limited Lifetime Warranty", "Made in USA"],
      specs: ["Power: 15W", "Voltage: 9-30V", "Rating: IP69K", "LED: Lumileds", "Connector: Deutsch DT", "Color Temp: 6000K", "Output: 1190 lm raw"],
      whatsInBox: ["C2 2.0 Sport LED Pod (pair)", "Mounting Hardware", "Deutsch DT Connector", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8093p_c2_gen2_sport_white_combo_standard_rbl_pair_built_-_titled.jpg"],
      compatibleVehicles: [],
      videoUrl: "https://www.youtube.com/watch?v=ODU-l_G8B2s",
      isPopular: true,
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.SSC2_PODS, CAT.LED_PODS],
      variants: [
        { sku: "DD8088P", name: "SAE Driving / Amber Backlight (pair)", price: 28599, beamPattern: "SAE Driving", color: "Amber Backlight" },
        { sku: "DD8090P", name: "SAE Fog-Wide / Amber Backlight (pair)", price: 28599, beamPattern: "SAE Fog-Wide", color: "Amber Backlight" },
        { sku: "DD8092P", name: "Combo-Driving / Amber Backlight (pair)", price: 28599, beamPattern: "Combo-Driving", color: "Amber Backlight" },
        { sku: "DD8094P", name: "Flood / Amber Backlight (pair)", price: 28599, beamPattern: "Flood", color: "Amber Backlight" },
        { sku: "DD8096P", name: "Spot / Amber Backlight (pair)", price: 28599, beamPattern: "Spot", color: "Amber Backlight" },
        { sku: "DD8098P", name: "SAE Driving / Red Backlight (pair)", price: 28599, beamPattern: "SAE Driving", color: "Red Backlight" },
      ],
    },
    {
      name: "C2 2.0 SAE/DOT White Pro LED Pod (pair)",
      slug: "c2-2-0-white-pro-led-pod-pair",
      sku: "DD8101P",
      series: "Pro",
      tagline: "Pro-Level C2 2.0 Pod with Enhanced Output and TIR Optics",
      shortDescription: "The C2 2.0 Pro LED Pod steps up power delivery with enhanced output over the Sport model, maintaining the ultra-compact 2-inch design with patented TIR optics.",
      fullDescription: "The Diode Dynamics C2 2.0 Pro LED Pod builds on the revolutionary C2 2.0 platform with increased power output for demanding applications. The Pro-level power delivery pushes more light through the patented TIR optics, providing enhanced visibility in SAE/DOT-compliant beam patterns including Driving, Fog-Wide, Combo-Driving, and Flood configurations.\n\nEngineered with Lumileds LED emitters, Deutsch DT connectors, and an IP69K waterproof rating, the C2 2.0 Pro delivers professional-grade performance in an ultra-compact package. Each pod features backlight functionality with Amber backlight options, CrossLink compatibility for modular light bar builds, and operates on 9-30V systems. Backed by a Limited Lifetime Warranty and proudly made in the USA.",
      price: 45499,
      beamPatterns: ["SAE Driving", "SAE Fog-Wide", "Combo-Driving", "Flood"],
      colors: ["White"],
      features: ["Ultra-compact 2\" design", "Patented TIR optics", "Pro-level power output", "Backlight functionality", "CrossLink compatible", "IP69K Waterproof", "Limited Lifetime Warranty", "Made in USA"],
      specs: ["Power: 25W", "Voltage: 9-30V", "Rating: IP69K", "LED: Lumileds", "Connector: Deutsch DT", "Color Temp: 6000K"],
      whatsInBox: ["C2 2.0 Pro LED Pod (pair)", "Mounting Hardware", "Deutsch DT Connector", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8093p_c2_gen2_sport_white_combo_standard_rbl_pair_built_-_titled.jpg"],
      compatibleVehicles: [],
      videoUrl: "https://www.youtube.com/watch?v=ODU-l_G8B2s",
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.SSC2_PODS, CAT.LED_PODS],
      variants: [
        { sku: "DD8101P", name: "SAE Driving / Amber Backlight (pair)", price: 45499, beamPattern: "SAE Driving", color: "Amber Backlight" },
        { sku: "DD8103P", name: "SAE Fog-Wide / Amber Backlight (pair)", price: 45499, beamPattern: "SAE Fog-Wide", color: "Amber Backlight" },
        { sku: "DD8104P", name: "Combo-Driving / Amber Backlight (pair)", price: 45499, beamPattern: "Combo-Driving", color: "Amber Backlight" },
        { sku: "DD8106P", name: "Flood / Amber Backlight (pair)", price: 45499, beamPattern: "Flood", color: "Amber Backlight" },
      ],
    },
    {
      name: "C2 2.0 SAE/DOT White Max LED Pod (pair)",
      slug: "c2-2-0-white-max-led-pod-pair",
      sku: "DD8113P",
      series: "Max",
      tagline: "Maximum Output C2 2.0 Pod — Peak Performance in a 2\" Package",
      shortDescription: "The C2 2.0 Max LED Pod delivers the absolute maximum output from the C2 2.0 platform, offering unmatched brightness in the ultra-compact 2-inch form factor.",
      fullDescription: "The Diode Dynamics C2 2.0 Max LED Pod represents the pinnacle of the C2 2.0 lineup, delivering maximum power output from the ultra-compact 2-inch platform. With the highest lumen output available in this form factor, the Max variant is designed for enthusiasts who demand the absolute best in auxiliary lighting performance.\n\nAvailable in the full range of SAE/DOT-compliant beam patterns including Combo-Driving, SAE Driving, SAE Fog-Wide, Flood, and Spot, with both Amber and Red backlight options. Features include patented TIR optics, Lumileds LED emitters, Deutsch DT connectors, IP69K waterproof rating, and CrossLink compatibility. The C2 2.0 Max operates on 9-30V systems and is backed by a Limited Lifetime Warranty. Made in the USA.",
      price: 62399,
      beamPatterns: ["Combo-Driving", "SAE Driving", "SAE Fog-Wide", "Flood", "Spot"],
      colors: ["White"],
      features: ["Ultra-compact 2\" design", "Patented TIR optics", "Maximum power output", "Backlight functionality", "CrossLink compatible", "IP69K Waterproof", "Limited Lifetime Warranty", "Made in USA"],
      specs: ["Power: 35W", "Voltage: 9-30V", "Rating: IP69K", "LED: Lumileds", "Connector: Deutsch DT", "Color Temp: 6000K"],
      whatsInBox: ["C2 2.0 Max LED Pod (pair)", "Mounting Hardware", "Deutsch DT Connector", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8113p_c2_gen2_max_white_combo_standard_rbl_pair_built_-_titled.jpg"],
      compatibleVehicles: [],
      videoUrl: "https://www.youtube.com/watch?v=ODU-l_G8B2s",
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.SSC2_PODS, CAT.LED_PODS],
      variants: [
        { sku: "DD8113P", name: "Combo-Driving / Amber Backlight (pair)", price: 62399, beamPattern: "Combo-Driving", color: "Amber Backlight" },
        { sku: "DD8115P", name: "SAE Driving / Amber Backlight (pair)", price: 62399, beamPattern: "SAE Driving", color: "Amber Backlight" },
        { sku: "DD8117P", name: "SAE Fog-Wide / Amber Backlight (pair)", price: 62399, beamPattern: "SAE Fog-Wide", color: "Amber Backlight" },
        { sku: "DD8118P", name: "Flood / Amber Backlight (pair)", price: 62399, beamPattern: "Flood", color: "Amber Backlight" },
        { sku: "DD8120P", name: "Spot / Amber Backlight (pair)", price: 62399, beamPattern: "Spot", color: "Amber Backlight" },
        { sku: "DD8240P", name: "SAE Driving / Red Backlight (pair)", price: 62399, beamPattern: "SAE Driving", color: "Red Backlight" },
        { sku: "DD8241P", name: "SAE Fog-Wide / Red Backlight (pair)", price: 62399, beamPattern: "SAE Fog-Wide", color: "Red Backlight" },
        { sku: "DD8243P", name: "Spot / Red Backlight (pair)", price: 62399, beamPattern: "Spot", color: "Red Backlight" },
      ],
    },
    {
      name: "C2R White Flood LED Pod (pair)",
      slug: "c2r-white-flood-led-pod-pair",
      sku: "DD8450P",
      series: "Sport",
      tagline: "Round C2 Flood Pod with Wide-Angle Illumination",
      shortDescription: "The C2R White Flood LED Pod delivers wide-angle flood illumination in a compact round form factor, perfect for close-range area lighting.",
      fullDescription: "The Diode Dynamics C2R White Flood LED Pod features a round design optimized for wide-angle flood illumination. This compact pod is ideal for close-range area lighting applications including rock lights, scene lighting, and reverse light upgrades.\n\nAvailable in standard mount configuration for maximum versatility. Each pod features premium LED emitters, weatherproof construction, and a clean white light output at 6000K. Available as both a pair and single unit to fit your specific lighting needs. Backed by Diode Dynamics' industry-leading warranty.",
      price: 49399,
      beamPatterns: ["Flood"],
      colors: ["White"],
      features: ["Round compact design", "Wide-angle flood beam", "Premium LED emitters", "Standard mount included", "IP67 Waterproof", "Limited Lifetime Warranty", "Made in USA"],
      specs: ["Beam Pattern: Flood", "Color Temp: 6000K", "Mount: Standard"],
      whatsInBox: ["C2R Flood LED Pod (pair)", "Standard Mounting Hardware", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8450p_c2r_white_flood_standard_pair_built_-_titled.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.SSC2_PODS, CAT.LED_PODS],
      variants: [
        { sku: "DD8450P", name: "Standard Mount (pair)", price: 49399, beamPattern: "Flood", size: "Pair" },
        { sku: "DD8450S", name: "Standard Mount (single)", price: 26999, beamPattern: "Flood", size: "Single" },
      ],
    },
    {
      name: "C2R White Flood Flush Mount LED Pod (pair)",
      slug: "c2r-white-flood-flush-mount-led-pod-pair",
      sku: "DD8573P",
      series: "Sport",
      tagline: "Flush-Mounted Round C2 Flood Pod for Clean Installations",
      shortDescription: "The C2R Flush Mount Flood LED Pod provides wide-angle flood illumination with a sleek flush-mount design for clean, integrated installations.",
      fullDescription: "The Diode Dynamics C2R White Flood Flush Mount LED Pod combines the wide-angle flood beam of the C2R platform with a flush-mount design for clean, integrated installations. Perfect for bumper cutout mounts, custom fabrication projects, and anywhere a seamless look is desired.\n\nThe flush mount design sits nearly flush with the mounting surface, providing a factory-integrated appearance while delivering powerful flood illumination. Available as both pair and single units, with premium LED emitters and weatherproof construction. Backed by Diode Dynamics' industry-leading warranty.",
      price: 49399,
      beamPatterns: ["Flood"],
      colors: ["White"],
      features: ["Flush mount design", "Round compact form factor", "Wide-angle flood beam", "Clean integrated look", "IP67 Waterproof", "Limited Lifetime Warranty", "Made in USA"],
      specs: ["Beam Pattern: Flood", "Color Temp: 6000K", "Mount: Flush"],
      whatsInBox: ["C2R Flush Mount Flood LED Pod (pair)", "Flush Mounting Hardware", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8573p_c2r_white_flood_flush_pair_built_-_titled.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.SSC2_PODS, CAT.LED_PODS],
      variants: [
        { sku: "DD8573P", name: "Flush Mount (pair)", price: 49399, beamPattern: "Flood", size: "Pair" },
        { sku: "DD8573S", name: "Flush Mount (single)", price: 26999, beamPattern: "Flood", size: "Single" },
      ],
    },
    {
      name: "SS10 SAE/DOT White LED Light Bar (one)",
      slug: "ss10-white-led-light-bar",
      sku: "DD8189",
      series: "Sport",
      tagline: "10-Inch Stage Series Light Bar with Patented TIR Optics",
      shortDescription: "The SS10 LED Light Bar delivers powerful, precisely controlled illumination in a compact 10-inch form factor with patented TIR optics, SmartSelect backlight, and Sport/Pro/Max power levels.",
      fullDescription: "The Diode Dynamics SS10 SAE/DOT White LED Light Bar is the latest addition to the Stage Series lineup, bringing patented TIR optics and upgraded beam patterns to a compact 10-inch form factor. Available in three power levels — Sport (22W), Pro (44W), and Max (61W) — the SS10 lets you choose the perfect balance of output and value for your application.\n\nEach SS10 features your choice of Standard Amber Backlight (ABL) or the innovative SmartSelect backlight system with 8 selectable colors. SAE/DOT-compliant beam patterns include Driving, Combo, Flood, and Spot configurations. Built with an IP69K waterproof rating, 6000K color temperature, and Diode Dynamics' commitment to quality with a Lifetime Warranty. Proudly made in the USA.\n\nThe SS10 is designed for vehicles that need a compact yet powerful forward-facing light bar. Whether mounted on a bumper, roof rack, or behind the grille, the SS10 delivers impressive output with precise beam control that larger light bars provide.",
      price: 32499,
      beamPatterns: ["SAE Driving", "Combo", "Flood", "Spot"],
      colors: ["White"],
      features: ["Patented TIR Optics", "Upgraded beam patterns", "SmartSelect backlight with 8 colors", "Sport/Pro/Max power levels", "IP69K waterproof", "Lifetime Warranty", "Made in USA"],
      specs: ["Sport Power: 22W", "Pro Power: 44W", "Max Power: 61W", "Color Temp: 6000K", "Rating: IP69K"],
      whatsInBox: ["SS10 LED Light Bar", "Standard Mounting Brackets", "Wiring Connector", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8189_ss10_sport_white_spot_standard_abl_1.jpg"],
      compatibleVehicles: [],
      videoUrl: "https://www.youtube.com/watch?v=DjWQAadoHmU",
      isPopular: true,
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.STAGE_SERIES_LB, CAT.LED_LIGHT_BARS],
      variants: [
        { sku: "DD8180", name: "Sport SAE Driving / Standard ABL", price: 32499, beamPattern: "SAE Driving", size: "Sport" },
        { sku: "DD8183", name: "Sport Combo / Standard ABL", price: 32499, beamPattern: "Combo", size: "Sport" },
        { sku: "DD8186", name: "Sport Flood / Standard ABL", price: 32499, beamPattern: "Flood", size: "Sport" },
        { sku: "DD8189", name: "Sport Spot / Standard ABL", price: 32499, beamPattern: "Spot", size: "Sport" },
        { sku: "DD8181", name: "Sport SAE Driving / SmartSelect", price: 36399, beamPattern: "SAE Driving", size: "Sport SmartSelect" },
        { sku: "DD8185", name: "Sport Combo / SmartSelect", price: 36399, beamPattern: "Combo", size: "Sport SmartSelect" },
        { sku: "DD8191", name: "Sport Spot / SmartSelect", price: 36399, beamPattern: "Spot", size: "Sport SmartSelect" },
        { sku: "DD8193", name: "Pro SAE Driving / Standard ABL", price: 51999, beamPattern: "SAE Driving", size: "Pro" },
        { sku: "DD8195", name: "Pro Combo / Standard ABL", price: 51999, beamPattern: "Combo", size: "Pro" },
        { sku: "DD8197", name: "Pro Flood / Standard ABL", price: 51999, beamPattern: "Flood", size: "Pro" },
        { sku: "DD8201", name: "Pro Spot / Standard ABL", price: 51999, beamPattern: "Spot", size: "Pro" },
        { sku: "DD8203", name: "Pro SAE Driving / SmartSelect", price: 55899, beamPattern: "SAE Driving", size: "Pro SmartSelect" },
        { sku: "DD8205", name: "Pro Combo / SmartSelect", price: 55899, beamPattern: "Combo", size: "Pro SmartSelect" },
        { sku: "DD8207", name: "Pro Flood / SmartSelect", price: 55899, beamPattern: "Flood", size: "Pro SmartSelect" },
        { sku: "DD8209", name: "Pro Spot / SmartSelect", price: 55899, beamPattern: "Spot", size: "Pro SmartSelect" },
        { sku: "DD8211", name: "Max SAE Driving / Standard ABL", price: 64999, beamPattern: "SAE Driving", size: "Max" },
        { sku: "DD8213", name: "Max Combo / Standard ABL", price: 64999, beamPattern: "Combo", size: "Max" },
        { sku: "DD8215", name: "Max Flood / Standard ABL", price: 64999, beamPattern: "Flood", size: "Max" },
        { sku: "DD8217", name: "Max Spot / Standard ABL", price: 64999, beamPattern: "Spot", size: "Max" },
        { sku: "DD8219", name: "Max SAE Driving / SmartSelect", price: 68899, beamPattern: "SAE Driving", size: "Max SmartSelect" },
        { sku: "DD8221", name: "Max Combo / SmartSelect", price: 68899, beamPattern: "Combo", size: "Max SmartSelect" },
        { sku: "DD8223", name: "Max Flood / SmartSelect", price: 68899, beamPattern: "Flood", size: "Max SmartSelect" },
        { sku: "DD8225", name: "Max Spot / SmartSelect", price: 68899, beamPattern: "Spot", size: "Max SmartSelect" },
        { sku: "DD8227", name: "Max SAE Driving / Special", price: 68899, beamPattern: "SAE Driving", size: "Max Special" },
        { sku: "DD8229", name: "Max Combo / Special", price: 68899, beamPattern: "Combo", size: "Max Special" },
        { sku: "DD8231", name: "Max Flood / Special", price: 68899, beamPattern: "Flood", size: "Max Special" },
        { sku: "DD8233", name: "Max Spot / Special", price: 68899, beamPattern: "Spot", size: "Max Special" },
      ],
    },
    {
      name: "SS6 SAE/DOT White LED Light Bar (one)",
      slug: "ss6-white-led-light-bar",
      sku: "DD8132S",
      series: "Sport",
      tagline: "Compact 6-Inch Stage Series Light Bar in White",
      shortDescription: "The SS6 White LED Light Bar brings Stage Series performance to a compact 6-inch form factor, available in Sport, Pro, and Max power levels with SmartSelect backlight options.",
      fullDescription: "The Diode Dynamics SS6 SAE/DOT White LED Light Bar is the compact member of the Stage Series family, delivering impressive performance in a 6-inch package. Available in three power levels — Sport, Pro, and Max — the SS6 offers SAE/DOT-compliant beam patterns including Driving, Fog-Wide, Combo, Flood, and Spot configurations.\n\nThe SS6 features patented TIR optics for precise beam control, multiple backlight options including Standard ABL and the SmartSelect system with selectable colors. Built with IP69K waterproof rating, premium LED emitters, and a 6000K color temperature. Each unit is backed by a Lifetime Warranty and made in the USA.\n\nIdeal for tight mounting spaces, bumper installations, and applications where a larger light bar won't fit. The SS6 White complements the existing SS6 Yellow variant for dual-color setups.",
      price: 19499,
      beamPatterns: ["SAE Driving", "Fog-Wide", "Combo", "Flood", "Spot"],
      colors: ["White"],
      features: ["Patented TIR Optics", "Compact 6-inch form factor", "Sport/Pro/Max power levels", "SmartSelect backlight available", "IP69K waterproof", "Lifetime Warranty", "Made in USA"],
      specs: ["Color Temp: 6000K", "Rating: IP69K", "Length: 6 inches"],
      whatsInBox: ["SS6 White LED Light Bar", "Mounting Brackets", "Wiring Connector", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8189_ss10_sport_white_spot_standard_abl_1.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.STAGE_SERIES_LB, CAT.LED_LIGHT_BARS],
      variants: [
        { sku: "DD8132S", name: "Sport SAE Driving / Standard ABL", price: 19499, beamPattern: "SAE Driving", size: "Sport" },
        { sku: "DD8134S", name: "Sport Fog-Wide / Standard ABL", price: 19499, beamPattern: "Fog-Wide", size: "Sport" },
        { sku: "DD8136S", name: "Sport Combo / Standard ABL", price: 19499, beamPattern: "Combo", size: "Sport" },
        { sku: "DD8137S", name: "Sport Flood / Standard ABL", price: 19499, beamPattern: "Flood", size: "Sport" },
        { sku: "DD8139S", name: "Sport Spot / Standard ABL", price: 19499, beamPattern: "Spot", size: "Sport" },
        { sku: "DD8141S", name: "Pro SAE Driving / Standard ABL", price: 32499, beamPattern: "SAE Driving", size: "Pro" },
        { sku: "DD8144S", name: "Pro Combo / Standard ABL", price: 32499, beamPattern: "Combo", size: "Pro" },
        { sku: "DD8146S", name: "Pro Flood / Standard ABL", price: 32499, beamPattern: "Flood", size: "Pro" },
        { sku: "DD8148S", name: "Pro Spot / Standard ABL", price: 32499, beamPattern: "Spot", size: "Pro" },
        { sku: "DD8151S", name: "Max SAE Driving / Standard ABL", price: 45499, beamPattern: "SAE Driving", size: "Max" },
        { sku: "DD8153S", name: "Max Combo / Standard ABL", price: 45499, beamPattern: "Combo", size: "Max" },
        { sku: "DD8156S", name: "Max Flood / Standard ABL", price: 45499, beamPattern: "Flood", size: "Max" },
        { sku: "DD8158S", name: "Max Spot / Standard ABL", price: 45499, beamPattern: "Spot", size: "Max" },
        { sku: "DD8160S", name: "Sport SAE Driving / SmartSelect", price: 23399, beamPattern: "SAE Driving", size: "Sport SmartSelect" },
        { sku: "DD8163S", name: "Sport Combo / SmartSelect", price: 23399, beamPattern: "Combo", size: "Sport SmartSelect" },
        { sku: "DD8165S", name: "Sport Spot / SmartSelect", price: 23399, beamPattern: "Spot", size: "Sport SmartSelect" },
        { sku: "DD8167S", name: "Pro Driving / SmartSelect", price: 32499, beamPattern: "Driving", size: "Pro SmartSelect" },
        { sku: "DD8168S", name: "Pro Combo / SmartSelect", price: 32499, beamPattern: "Combo", size: "Pro SmartSelect" },
      ],
    },
    {
      name: "SS30 Dual-Color LED Light Bar (one)",
      slug: "ss30-dual-color-led-light-bar",
      sku: "DD8375",
      series: "Sport",
      tagline: "30-Inch Dual-Color Stage Series Light Bar",
      shortDescription: "The SS30 Dual-Color LED Light Bar combines white and amber output in a single 30-inch bar, allowing instant color switching for varying driving conditions.",
      fullDescription: "The Diode Dynamics SS30 Dual-Color LED Light Bar is the ultimate forward-facing light bar, offering both white and amber output from a single 30-inch unit. With the ability to instantly switch between colors, you can adapt to changing conditions — white for maximum visibility and amber for fog, dust, and inclement weather.\n\nAvailable in Sport and Pro power levels with Combo beam pattern and Standard mount. The SS30 features patented TIR optics, IP69K waterproof construction, and premium LED emitters. This light bar is designed for serious off-road enthusiasts and overland vehicles that need versatile, high-output lighting. Backed by a Lifetime Warranty and made in the USA.",
      price: 87749,
      beamPatterns: ["Combo"],
      colors: ["White", "Amber"],
      features: ["Dual-Color white/amber output", "30-inch form factor", "Patented TIR Optics", "Sport and Pro power levels", "IP69K waterproof", "Lifetime Warranty", "Made in USA"],
      specs: ["Length: 30 inches", "Beam Pattern: Combo", "Rating: IP69K", "Color Temp: 6000K / Amber"],
      whatsInBox: ["SS30 Dual-Color LED Light Bar", "Mounting Brackets", "Wiring Harness", "Installation Guide"],
      warrantyYears: 10,
      images: [CDN_BASE + "dd/dd8375_ss30_sport_dc_combo_standard_mbl_1.jpg"],
      compatibleVehicles: [],
      isPopular: true,
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.STAGE_SERIES_LB, CAT.LED_LIGHT_BARS],
      variants: [
        { sku: "DD8375", name: "Sport Combo Standard", price: 87749, beamPattern: "Combo", size: "Sport" },
        { sku: "DD8385", name: "Pro Combo Standard", price: 113749, beamPattern: "Combo", size: "Pro" },
      ],
    },
    {
      name: "SS3 Security Hardware Kit",
      slug: "ss3-security-hardware-kit",
      sku: "DD7529",
      series: "Accessory",
      tagline: "Anti-Theft Security Hardware for SS3 LED Pods",
      shortDescription: "Protect your SS3 LED Pods from theft with this security hardware kit featuring tamper-resistant bolts.",
      fullDescription: "The Diode Dynamics SS3 Security Hardware Kit provides peace of mind by replacing your standard mounting hardware with tamper-resistant security bolts. Designed specifically for the SS3 LED Pod platform, this kit makes it significantly harder for thieves to remove your lights.\n\nEach kit includes all necessary security fasteners and the specialized tool needed for installation and removal. A must-have accessory for vehicles that are frequently parked in public or unattended.",
      price: 5199,
      beamPatterns: [],
      colors: [],
      features: ["Tamper-resistant security bolts", "SS3 pod compatible", "Includes security tool", "Easy installation"],
      specs: ["Fitment: SS3 LED Pods"],
      whatsInBox: ["Security Hardware Kit", "Security Tool"],
      warrantyYears: 2,
      images: [CDN_BASE + "dd/dd7529_ss3_security_hw_kit.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD7529", name: "SS3 Security Hardware Kit", price: 5199 },
      ],
    },
    {
      name: "Stage Series Security Hardware Kit",
      slug: "stage-series-security-hardware-kit",
      sku: "DD7530",
      series: "Accessory",
      tagline: "Anti-Theft Security Hardware for Stage Series Products",
      shortDescription: "Protect your Stage Series LED Pods and CrossLink bars from theft with tamper-resistant security hardware kits.",
      fullDescription: "The Diode Dynamics Stage Series Security Hardware Kit provides tamper-resistant security bolts for your Stage Series products. Available in configurations for SS3 Max, SS5, and SS5 CrossLink products, ensuring your investment stays secure.\n\nEach kit includes all necessary security fasteners and the specialized tool for installation and removal. Choose the correct kit for your specific Stage Series product to ensure proper fitment.",
      price: 5199,
      beamPatterns: [],
      colors: [],
      features: ["Tamper-resistant security bolts", "Multiple fitment options", "Includes security tool", "Easy installation"],
      specs: ["Fitment: SS3 Max / SS5 / SS5 CrossLink"],
      whatsInBox: ["Security Hardware Kit", "Security Tool"],
      warrantyYears: 2,
      images: [CDN_BASE + "dd/dd7529_ss3_security_hw_kit.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD7530", name: "SS3 Max Security Hardware Kit", price: 5199, size: "SS3 Max" },
        { sku: "DD7531", name: "SS5 Security Hardware Kit", price: 6499, size: "SS5" },
        { sku: "DD7532", name: "SS5 CrossLink Security Hardware Kit", price: 7799, size: "SS5 CrossLink" },
      ],
    },
    {
      name: "C2 2.0 Security Hardware Kit",
      slug: "c2-2-0-security-hardware-kit",
      sku: "DD8767",
      series: "Accessory",
      tagline: "Anti-Theft Security Hardware for C2 2.0 LED Pods",
      shortDescription: "Protect your C2 2.0 LED Pods from theft with this universal security hardware kit featuring tamper-resistant bolts.",
      fullDescription: "The Diode Dynamics C2 2.0 Security Hardware Kit provides tamper-resistant security bolts designed specifically for the C2 2.0 LED Pod platform. This universal kit fits all C2 2.0 mounting configurations and makes it significantly harder for thieves to remove your pods.\n\nIncludes all necessary security fasteners and the specialized tool needed for installation and removal. A simple but effective way to protect your lighting investment.",
      price: 5199,
      beamPatterns: [],
      colors: [],
      features: ["Tamper-resistant security bolts", "C2 2.0 universal fitment", "Includes security tool", "Easy installation"],
      specs: ["Fitment: C2 2.0 LED Pods"],
      whatsInBox: ["C2 2.0 Security Hardware Kit", "Security Tool"],
      warrantyYears: 2,
      images: [CDN_BASE + "dd/dd8767_c2_2.0_universal_security_hw_kit.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD8767", name: "C2 2.0 Security Hardware Kit", price: 5199 },
      ],
    },
    {
      name: "SS3 LED Pod Cover (one)",
      slug: "ss3-led-pod-cover",
      sku: "DD6261",
      series: "Accessory",
      tagline: "Protective Pod Cover for SS3 LED Pods",
      shortDescription: "Snap-on protective covers for SS3 LED Pods, available in Clear, Amber, Yellow, and Smoked options.",
      fullDescription: "The Diode Dynamics SS3 LED Pod Cover provides snap-on protection for your SS3 LED Pods when they're not in use. Available in Clear, Amber, Yellow, and Smoked options, these covers protect your pod lenses from road debris, dirt, and scratches while also allowing you to change the light color output when using Clear or tinted options.\n\nDesigned for a precise snap-on fit with the SS3 Standard mount pods. Easy to install and remove without tools. A simple way to protect your investment and customize your look.",
      price: 1199,
      beamPatterns: [],
      colors: ["Clear", "Amber", "Yellow", "Smoked"],
      features: ["Snap-on design", "Lens protection", "Multiple color options", "Tool-free installation", "SS3 Standard fitment"],
      specs: ["Fitment: SS3 Standard Mount"],
      whatsInBox: ["SS3 Pod Cover (one)"],
      warrantyYears: 1,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.POD_COVERS],
      variants: [
        { sku: "DD6261", name: "SS3 Standard Clear", price: 1199, color: "Clear" },
        { sku: "DD6262", name: "SS3 Standard Amber", price: 1199, color: "Amber" },
        { sku: "DD6263", name: "SS3 Standard Yellow", price: 1199, color: "Yellow" },
        { sku: "DD6264", name: "SS3 Standard Smoked", price: 1199, color: "Smoked" },
      ],
    },
    {
      name: "SS5 LED Pod Cover, Black (one)",
      slug: "ss5-led-pod-cover-black",
      sku: "DD7217",
      series: "Accessory",
      tagline: "Black Protective Cover for SS5 LED Pods",
      shortDescription: "Black snap-on protective cover for SS5 LED Pods, available in Standard and Flush mount configurations.",
      fullDescription: "The Diode Dynamics SS5 LED Pod Cover in Black provides a sleek, stealthy look while protecting your SS5 LED Pod lenses from road debris and scratches. The opaque black finish completely conceals your pods when not in use for a clean, factory-integrated appearance.\n\nAvailable in both Standard and Flush mount configurations to match your SS5 installation type. Easy snap-on design requires no tools for installation or removal.",
      price: 1199,
      beamPatterns: [],
      colors: ["Black"],
      features: ["Snap-on design", "Stealthy black finish", "Lens protection", "Standard & Flush options", "Tool-free installation"],
      specs: ["Fitment: SS5 Standard / Flush Mount"],
      whatsInBox: ["SS5 Pod Cover, Black (one)"],
      warrantyYears: 1,
      images: [CDN_BASE + "dd/d7217_ss5_cover_standard_black.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.POD_COVERS],
      variants: [
        { sku: "DD7217", name: "Black Standard", price: 1199, color: "Black", size: "Standard" },
        { sku: "DD7218", name: "Black Flush", price: 1199, color: "Black", size: "Flush" },
      ],
    },
    {
      name: "SS5 LED Pod Cover, Smoked (one)",
      slug: "ss5-led-pod-cover-smoked",
      sku: "DD7242",
      series: "Accessory",
      tagline: "Smoked Protective Cover for SS5 LED Pods",
      shortDescription: "Smoked snap-on protective cover for SS5 LED Pods, available in Standard and Flush mount configurations.",
      fullDescription: "The Diode Dynamics SS5 LED Pod Cover in Smoked provides a subtle, tinted look while protecting your SS5 LED Pod lenses. The smoked finish reduces the visibility of the LED emitters when not in use, giving your vehicle a clean, understated appearance.\n\nAvailable in both Standard and Flush mount configurations. The snap-on design makes installation and removal quick and tool-free.",
      price: 1199,
      beamPatterns: [],
      colors: ["Smoked"],
      features: ["Snap-on design", "Smoked tinted finish", "Lens protection", "Standard & Flush options", "Tool-free installation"],
      specs: ["Fitment: SS5 Standard / Flush Mount"],
      whatsInBox: ["SS5 Pod Cover, Smoked (one)"],
      warrantyYears: 1,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.POD_COVERS],
      variants: [
        { sku: "DD7242", name: "Smoked Standard", price: 1199, color: "Smoked", size: "Standard" },
        { sku: "DD7254", name: "Smoked Flush", price: 1199, color: "Smoked", size: "Flush" },
      ],
    },
    {
      name: "Stage Series LED Light Bar Cover",
      slug: "stage-series-led-light-bar-cover",
      sku: "DD7777",
      series: "Accessory",
      tagline: "Protective Covers for Stage Series Light Bars and SS5 Pods",
      shortDescription: "Snap-on protective covers for Stage Series LED Light Bars and SS5 Pods, available in Clear, Smoked, Yellow, Black, and Amber for multiple sizes.",
      fullDescription: "The Diode Dynamics Stage Series LED Light Bar Cover provides snap-on protection for your Stage Series products. Available for SS5 Pod size, SS6/SS10 Light Bar size, and SS10 full-size configurations in five color options: Clear, Smoked, Yellow, Black, and Amber.\n\nThese covers protect lenses from road debris, dirt, and scratches while also allowing color customization. The Clear option maintains full light output for protection only, while tinted options can alter beam color. Each cover features a precision snap-on fit designed to stay secure during driving while remaining easy to remove by hand.",
      price: 1199,
      beamPatterns: [],
      colors: ["Clear", "Smoked", "Yellow", "Black", "Amber"],
      features: ["Snap-on design", "Multiple color options", "Multiple size options", "Lens protection", "Tool-free installation"],
      specs: ["Fitment: SS5 Pod / SS6 Light Bar / SS10 Light Bar"],
      whatsInBox: ["Stage Series Cover (one)"],
      warrantyYears: 1,
      images: [CDN_BASE + "dd/dd7784_ss10_cover_standard_black_1.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.POD_COVERS],
      variants: [
        { sku: "DD7777", name: "Clear (SS5 Pod)", price: 1199, color: "Clear", size: "SS5 Pod" },
        { sku: "DD7778", name: "Smoked (SS5 Pod)", price: 1199, color: "Smoked", size: "SS5 Pod" },
        { sku: "DD7779", name: "Yellow (SS5 Pod)", price: 1199, color: "Yellow", size: "SS5 Pod" },
        { sku: "DD7780", name: "Black (SS5 Pod)", price: 1199, color: "Black", size: "SS5 Pod" },
        { sku: "DD7781", name: "Amber (SS5 Pod)", price: 1199, color: "Amber", size: "SS5 Pod" },
        { sku: "DD7782", name: "Clear (SS6 Light Bar)", price: 1199, color: "Clear", size: "SS6 Light Bar" },
        { sku: "DD7783", name: "Smoked (SS6 Light Bar)", price: 1199, color: "Smoked", size: "SS6 Light Bar" },
        { sku: "DD7784", name: "Black (SS6 Light Bar)", price: 1199, color: "Black", size: "SS6 Light Bar" },
        { sku: "DD7785", name: "Yellow (SS6 Light Bar)", price: 1199, color: "Yellow", size: "SS6 Light Bar" },
        { sku: "DD7786", name: "Amber (SS6 Light Bar)", price: 1199, color: "Amber", size: "SS6 Light Bar" },
        { sku: "DD7787", name: "Clear (SS10 Light Bar)", price: 1199, color: "Clear", size: "SS10 Light Bar" },
        { sku: "DD7788", name: "Smoked (SS10 Light Bar)", price: 1199, color: "Smoked", size: "SS10 Light Bar" },
        { sku: "DD8643", name: "Black (SS10 Light Bar)", price: 1199, color: "Black", size: "SS10 Light Bar" },
        { sku: "DD8644", name: "Yellow (SS10 Light Bar)", price: 1199, color: "Yellow", size: "SS10 Light Bar" },
        { sku: "DD8645", name: "Amber (SS10 Light Bar)", price: 1199, color: "Amber", size: "SS10 Light Bar" },
      ],
    },
    {
      name: "Light Duty Dual Output 2-Pin Offroad Wiring Harness",
      slug: "light-duty-dual-output-2-pin-wiring-harness",
      sku: "DD4033",
      series: "Accessory",
      tagline: "2-Pin Wiring Harness for Dual Light Output",
      shortDescription: "Light duty wiring harness with dual outputs for connecting two LED pods or lights using 2-pin Deutsch DT connectors.",
      fullDescription: "The Diode Dynamics Light Duty Dual Output 2-Pin Offroad Wiring Harness provides a clean, reliable wiring solution for connecting two LED pods or auxiliary lights. Designed for lights with 2-pin Deutsch DT connectors, this harness includes an inline fuse, relay, and switch for safe operation.\n\nIdeal for SSC1, SSC2, and other compact LED pods that use 2-pin connections. The light-duty rating handles up to 30A of total load, suitable for most auxiliary lighting setups. Features weatherproof connections and quality wiring for long-lasting, trouble-free performance.",
      price: 3899,
      beamPatterns: [],
      colors: [],
      features: ["Dual output design", "2-pin Deutsch DT connectors", "Inline fuse included", "Relay and switch included", "Weatherproof connections"],
      specs: ["Connector: 2-pin Deutsch DT", "Rating: Light Duty", "Outputs: 2"],
      whatsInBox: ["Wiring Harness", "Relay", "Switch", "Fuse", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.WIRING],
      variants: [
        { sku: "DD4033", name: "Light Duty Dual Output 2-Pin", price: 3899 },
      ],
    },
    {
      name: "Light Duty Dual Output 4-Pin Wiring Harness",
      slug: "light-duty-dual-output-4-pin-wiring-harness",
      sku: "DD4092",
      series: "Accessory",
      tagline: "4-Pin Wiring Harness for Dual Light Output with Backlight Support",
      shortDescription: "Light duty wiring harness with dual outputs using 4-pin Deutsch DT connectors, supporting both main beam and backlight circuits.",
      fullDescription: "The Diode Dynamics Light Duty Dual Output 4-Pin Wiring Harness provides a complete wiring solution for LED pods and lights with backlight functionality. The 4-pin Deutsch DT connectors support both the main beam and backlight circuits on a single connector, simplifying installation.\n\nDesigned for SS3, SSC2, and other LED pods with backlight features. Includes inline fuse, relay, and switch for safe operation. The dual-output design allows you to power two lights from a single harness with weatherproof connections throughout.",
      price: 5199,
      beamPatterns: [],
      colors: [],
      features: ["Dual output design", "4-pin Deutsch DT connectors", "Backlight circuit support", "Inline fuse included", "Relay and switch included", "Weatherproof connections"],
      specs: ["Connector: 4-pin Deutsch DT", "Rating: Light Duty", "Outputs: 2"],
      whatsInBox: ["Wiring Harness", "Relay", "Switch", "Fuse", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.WIRING],
      variants: [
        { sku: "DD4092", name: "Light Duty Dual Output 4-pin", price: 5199 },
      ],
    },
    {
      name: "DT 4-Pin Extension Wire",
      slug: "dt-4-pin-extension-wire",
      sku: "DD4098",
      series: "Accessory",
      tagline: "Extend Your 4-Pin Deutsch DT Wiring",
      shortDescription: "4-pin Deutsch DT extension wire available in 1m and 2m lengths for extending your LED lighting wiring runs.",
      fullDescription: "The Diode Dynamics DT 4-Pin Extension Wire allows you to extend the wiring run between your harness and LED lights when the standard cable length isn't sufficient. Available in 1-meter and 2-meter lengths with quality 4-pin Deutsch DT connectors on each end.\n\nIdeal for roof rack installations, rear bumper mounts, and other applications where additional wire length is needed. Uses the same high-quality weatherproof Deutsch DT connectors as Diode Dynamics LED products for a seamless, reliable connection.",
      price: 1949,
      beamPatterns: [],
      colors: [],
      features: ["4-pin Deutsch DT connectors", "1m and 2m options", "Weatherproof connections", "Compatible with all DD 4-pin products"],
      specs: ["Connector: 4-pin Deutsch DT", "Lengths: 1m, 2m"],
      whatsInBox: ["DT 4-Pin Extension Wire"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.WIRING],
      variants: [
        { sku: "DD4098", name: "1m Extension", price: 1949, size: "1m" },
        { sku: "DD4099", name: "2m Extension", price: 3899, size: "2m" },
      ],
    },
    {
      name: "Reverse Light Wiring Kit",
      slug: "reverse-light-wiring-kit",
      sku: "DD4102",
      series: "Accessory",
      tagline: "Wire LED Pods to Your Reverse Light Circuit",
      shortDescription: "Complete wiring kit for connecting LED pods to your vehicle's reverse light circuit, with optional running light functionality.",
      fullDescription: "The Diode Dynamics Reverse Light Wiring Kit provides everything you need to wire LED pods to your vehicle's reverse light circuit. When your vehicle shifts into reverse, your auxiliary LED pods will illuminate automatically, providing dramatically improved visibility behind your vehicle.\n\nAvailable in 4-pin (with running light support), 2-pin, and 2-pin without running light configurations. The 4-pin version allows the pods to also function as running lights at reduced brightness when the vehicle is running, adding an extra layer of visibility. Includes all necessary wiring, connectors, and hardware for a clean installation.",
      price: 7799,
      beamPatterns: [],
      colors: [],
      features: ["Reverse-activated operation", "Optional running light mode", "4-pin and 2-pin options", "Complete wiring kit", "Easy installation"],
      specs: ["4-pin: w/ running light", "2-pin: reverse only", "2-pin NRL: no running light"],
      whatsInBox: ["Reverse Light Wiring Kit", "Wiring Connectors", "Installation Hardware", "Instructions"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.WIRING],
      variants: [
        { sku: "DD4102", name: "4-pin (with running light)", price: 7799, size: "4-pin" },
        { sku: "DD4103", name: "2-pin", price: 4999, size: "2-pin" },
        { sku: "DD4104", name: "2-pin (no running light)", price: 3899, size: "2-pin NRL" },
      ],
    },
    {
      name: "Ultra Heavy Duty Single Output 4-Pin Wiring Harness",
      slug: "ultra-heavy-duty-4-pin-wiring-harness",
      sku: "DD4123",
      series: "Accessory",
      tagline: "Ultra Heavy Duty Wiring for High-Power Light Bars",
      shortDescription: "Ultra heavy duty 4-pin wiring harness for high-power LED light bars, available in single and dual output configurations.",
      fullDescription: "The Diode Dynamics Ultra Heavy Duty 4-Pin Wiring Harness is designed for high-power LED light bars and demanding lighting setups. Built with heavier gauge wiring, higher-capacity relay, and robust Deutsch DT connectors, this harness handles the increased current draw of larger LED products.\n\nAvailable in Single Output and Dual Output configurations. The dual output version powers two light bars from a single harness with independent wiring runs. Features an inline fuse, heavy-duty relay, and illuminated switch. Perfect for SS10, SS30, SS5 CrossLink, and other high-power Stage Series products.",
      price: 11699,
      beamPatterns: [],
      colors: [],
      features: ["Ultra heavy duty wiring", "4-pin Deutsch DT connectors", "High-capacity relay", "Inline fuse", "Illuminated switch", "Single and dual output options"],
      specs: ["Connector: 4-pin Deutsch DT", "Rating: Ultra Heavy Duty", "Single or Dual output"],
      whatsInBox: ["Ultra Heavy Duty Wiring Harness", "Heavy Duty Relay", "Illuminated Switch", "Fuse", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.WIRING],
      variants: [
        { sku: "DD4123", name: "Single Output", price: 11699 },
        { sku: "DD4125", name: "Dual Output", price: 14299 },
      ],
    },
    {
      name: "SSC1 Yellow Sport LED Pod (pair)",
      slug: "ssc1-yellow-sport-led-pod-pair",
      sku: "DD6443P",
      series: "Sport",
      tagline: "Compact SSC1 Sport Pod in Yellow for Fog and Adverse Conditions",
      shortDescription: "The SSC1 Yellow Sport LED Pod delivers selective yellow output in the compact SSC1 form factor, ideal for fog, rain, and dusty conditions.",
      fullDescription: "The Diode Dynamics SSC1 Yellow Sport LED Pod provides selective yellow light output designed to cut through fog, rain, dust, and other adverse weather conditions. The Sport power level offers an excellent balance of output and value in the ultra-compact SSC1 form factor.\n\nYellow/amber light has a longer wavelength that is less likely to reflect back at the driver in poor visibility conditions, making it the preferred choice for fog lights and inclement weather driving. The SSC1 Sport delivers reliable performance with premium LED emitters and a weatherproof construction. Available in standard mount configuration as a pair.",
      price: 23399,
      beamPatterns: ["Standard"],
      colors: ["Yellow"],
      features: ["Selective yellow output", "Sport power level", "Compact SSC1 form factor", "Fog/rain penetrating wavelength", "Weatherproof construction"],
      specs: ["Color: Yellow", "Power Level: Sport", "Mount: Standard"],
      whatsInBox: ["SSC1 Yellow Sport LED Pod (pair)", "Standard Mounting Hardware", "Installation Guide"],
      warrantyYears: 8,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.SSC1_PODS, CAT.LED_PODS],
      variants: [
        { sku: "DD6443P", name: "SSC1 Yellow Sport Standard (pair)", price: 23399, color: "Yellow", size: "Standard" },
      ],
    },
    {
      name: "SSC1 Flush Mount Mounting Kit",
      slug: "ssc1-flush-mount-mounting-kit",
      sku: "DD6621S",
      series: "Accessory",
      tagline: "Flush Mount Kit for SSC1 LED Pods",
      shortDescription: "Flush mount mounting kit for SSC1 LED Pods, enabling a clean flush installation in bumpers and panels.",
      fullDescription: "The Diode Dynamics SSC1 Flush Mount Mounting Kit allows you to install your SSC1 LED Pods flush with your vehicle's bumper or panel for a clean, factory-integrated look. The kit includes all necessary brackets, hardware, and gaskets for a weatherproof flush installation.\n\nDesigned specifically for the SSC1 LED Pod form factor. Available as a single unit — order two for a pair installation.",
      price: 1299,
      beamPatterns: [],
      colors: [],
      features: ["Flush mount design", "SSC1 pod compatible", "Weatherproof gasket", "Clean factory look"],
      specs: ["Fitment: SSC1 LED Pods"],
      whatsInBox: ["Flush Mount Bracket", "Gasket", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD6621S", name: "SSC1 Flush Mount Kit (single)", price: 1299 },
      ],
    },
    {
      name: "C2 2.0 LED Pod Replacement Front Bezel",
      slug: "c2-2-0-replacement-front-bezel",
      sku: "DD8554S",
      series: "Accessory",
      tagline: "Replacement and Upgrade Bezels for C2 2.0 LED Pods",
      shortDescription: "Replacement front bezels for C2 2.0 LED Pods, available in standard, flush, black, and clear options with or without hardware.",
      fullDescription: "The Diode Dynamics C2 2.0 LED Pod Replacement Front Bezel allows you to replace a damaged bezel or change the look of your C2 2.0 pods. Available in Standard and Flush mount configurations, Black, and Clear finishes, with or without mounting hardware included.\n\nThe bezel snaps onto the front of the C2 2.0 pod and can be swapped without tools. Choose bezels with hardware if you also need replacement mounting bolts, or select bezel-only options for a simple cosmetic swap.",
      price: 1199,
      beamPatterns: [],
      colors: ["Standard", "Flush", "Black", "Clear"],
      features: ["Easy snap-on replacement", "Multiple finish options", "Optional hardware included", "C2 2.0 compatible"],
      specs: ["Fitment: C2 2.0 LED Pods"],
      whatsInBox: ["Replacement Front Bezel"],
      warrantyYears: 1,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES],
      variants: [
        { sku: "DD8554S", name: "Standard Bezel", price: 1199, size: "Standard" },
        { sku: "DD8555S", name: "Flush Bezel", price: 1199, size: "Flush" },
        { sku: "DD8556", name: "Standard Bezel with Hardware", price: 3199, size: "Standard w/ Hardware" },
        { sku: "DD8557", name: "Flush Bezel with Hardware", price: 3199, size: "Flush w/ Hardware" },
        { sku: "DD8558", name: "Black Bezel", price: 1499, color: "Black" },
        { sku: "DD8560", name: "Clear Bezel", price: 1199, color: "Clear" },
      ],
    },
    {
      name: "C2 2.0 Flush Mount Mounting Kit",
      slug: "c2-2-0-flush-mount-mounting-kit",
      sku: "DD8559S",
      series: "Accessory",
      tagline: "Flush Mount Kit for C2 2.0 LED Pods",
      shortDescription: "Flush mount mounting kit for C2 2.0 LED Pods, enabling a clean flush installation. Available as single or pair.",
      fullDescription: "The Diode Dynamics C2 2.0 Flush Mount Mounting Kit allows you to install your C2 2.0 LED Pods flush with your vehicle's bumper or panel for a clean, integrated look. Includes all necessary brackets, hardware, and weatherproof gaskets.\n\nAvailable as a single unit or pair. The flush mount design creates a factory-like appearance while maintaining full pod functionality including backlight and CrossLink compatibility.",
      price: 3199,
      beamPatterns: [],
      colors: [],
      features: ["Flush mount design", "C2 2.0 compatible", "Weatherproof gasket", "Single or pair options"],
      specs: ["Fitment: C2 2.0 LED Pods"],
      whatsInBox: ["Flush Mount Bracket", "Gasket", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD8559S", name: "Single Flush Mount", price: 3199, size: "Single" },
        { sku: "DD8559P", name: "Pair Flush Mount", price: 5999, size: "Pair" },
      ],
    },
    {
      name: "SS6 Classic to SS6 New Gen Adapter Kit",
      slug: "ss6-classic-to-new-gen-adapter-kit",
      sku: "DD8656",
      series: "Accessory",
      tagline: "Adapter Kit to Upgrade SS6 Classic Mounting to New Gen",
      shortDescription: "Adapter kit allowing SS6 Classic mounting brackets to work with the new generation SS6 LED Light Bar.",
      fullDescription: "The Diode Dynamics SS6 Classic to SS6 New Gen Adapter Kit allows you to use your existing SS6 Classic mounting brackets with the new generation SS6 LED Light Bar. If you're upgrading from the classic SS6 to the new generation, this adapter eliminates the need to purchase new vehicle-specific brackets.\n\nSimple bolt-on installation that bridges the mounting pattern difference between the classic and new generation SS6 products.",
      price: 2599,
      beamPatterns: [],
      colors: [],
      features: ["Bridges Classic to New Gen mounting", "Bolt-on installation", "Reuse existing brackets", "Quality construction"],
      specs: ["Fitment: SS6 Classic to New Gen"],
      whatsInBox: ["SS6 Adapter Kit", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD8656", name: "SS6 Classic to New Gen Adapter Kit", price: 2599 },
      ],
    },
    {
      name: "Stage Series LED Light Bar Universal Bracket Kit",
      slug: "stage-series-light-bar-universal-bracket-kit",
      sku: "DD8657",
      series: "Accessory",
      tagline: "Universal Mounting Brackets for Stage Series Light Bars",
      shortDescription: "Universal mounting bracket kit for Stage Series LED Light Bars, available in Cast, Sheet, and Extruded bracket styles.",
      fullDescription: "The Diode Dynamics Stage Series LED Light Bar Universal Bracket Kit provides versatile mounting solutions for Stage Series LED Light Bars. Available in Cast, Sheet, and Extruded bracket styles to suit different mounting needs and aesthetic preferences.\n\nThe Cast bracket offers a robust, premium look. The Sheet bracket provides a slim, low-profile option. The Extruded bracket delivers a clean, machined appearance. All brackets feature quality construction with weather-resistant finishes for long-lasting performance in any environment.",
      price: 2599,
      beamPatterns: [],
      colors: [],
      features: ["Universal fitment", "Multiple bracket styles", "Quality construction", "Weather-resistant finish"],
      specs: ["Fitment: Stage Series LED Light Bars", "Styles: Cast, Sheet, Extruded"],
      whatsInBox: ["Universal Bracket", "Mounting Hardware"],
      warrantyYears: 2,
      images: [CDN_BASE + "dd/dd8657_stage_series_cast_lightbar_universal_bracket_detailed_angled.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD8657", name: "Cast Bracket", price: 2599, size: "Cast" },
        { sku: "DD8658S", name: "Sheet Bracket (single)", price: 2599, size: "Sheet" },
        { sku: "DD8659S", name: "Extruded Bracket (single)", price: 2599, size: "Extruded" },
        { sku: "DD8815", name: "Universal Bracket Kit", price: 2599, size: "Universal" },
      ],
    },
    {
      name: "Mini CrossLink Endmount Kit",
      slug: "mini-crosslink-endmount-kit",
      sku: "DD8469",
      series: "Accessory",
      tagline: "Endmount Brackets for Mini CrossLink Light Configurations",
      shortDescription: "Endmount bracket kit for Mini CrossLink LED configurations, available in standard, pair, and L-bracket options.",
      fullDescription: "The Diode Dynamics Mini CrossLink Endmount Kit provides mounting solutions for Mini CrossLink LED configurations. The endmount brackets secure the ends of your CrossLink light bar assembly to your vehicle's mounting surface.\n\nAvailable in Single, Pair, and L-Bracket configurations to suit different mounting scenarios. The L-Bracket option provides a 90-degree mounting angle for installations where the light bar needs to be mounted perpendicular to the surface. All brackets feature quality construction with a durable finish.",
      price: 3899,
      beamPatterns: [],
      colors: [],
      features: ["CrossLink compatible", "Single/Pair/L-Bracket options", "Quality construction", "Durable finish"],
      specs: ["Fitment: Mini CrossLink"],
      whatsInBox: ["Endmount Bracket", "Mounting Hardware"],
      warrantyYears: 2,
      images: [CDN_BASE + "dd/dd8469_mini_crosslink_endmount_kit.jpg"],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD8469", name: "Single Endmount", price: 3899, size: "Single" },
        { sku: "DD8470", name: "Pair Endmount", price: 6499, size: "Pair" },
        { sku: "DD8471", name: "L-Bracket Endmount", price: 3899, size: "L-Bracket" },
      ],
    },
    {
      name: "Rock Light Surface Mount Kit",
      slug: "rock-light-surface-mount-kit",
      sku: "DD7462",
      series: "Accessory",
      tagline: "Surface Mounting Kit for Rock Lights",
      shortDescription: "Surface mount kit for Diode Dynamics Rock Lights, available in Standard and Heavy Duty options.",
      fullDescription: "The Diode Dynamics Rock Light Surface Mount Kit provides a secure mounting solution for installing rock lights on flat surfaces. Available in Standard and Heavy Duty configurations to match your installation needs.\n\nThe Standard mount is suitable for most installations on frame rails, skid plates, and body panels. The Heavy Duty mount features reinforced construction for demanding off-road environments where vibration and impacts are a concern.",
      price: 2599,
      beamPatterns: [],
      colors: [],
      features: ["Surface mount design", "Standard and Heavy Duty options", "Secure rock light mounting", "Durable construction"],
      specs: ["Fitment: Diode Dynamics Rock Lights"],
      whatsInBox: ["Surface Mount Kit", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ROCK_LIGHTS, CAT.ACCESSORIES],
      variants: [
        { sku: "DD7462", name: "Standard Surface Mount", price: 2599, size: "Standard" },
        { sku: "DD7463", name: "Heavy Duty Surface Mount", price: 3599, size: "Heavy Duty" },
      ],
    },
    {
      name: "SS5 CrossLink Endmount Kit",
      slug: "ss5-crosslink-endmount-kit",
      sku: "DD6804",
      series: "Accessory",
      tagline: "Endmount Brackets for SS5 CrossLink Light Bars",
      shortDescription: "Endmount bracket kit for SS5 CrossLink LED Light Bar configurations, available in Standard, L-Bracket, and Security options.",
      fullDescription: "The Diode Dynamics SS5 CrossLink Endmount Kit provides mounting brackets for the ends of your SS5 CrossLink light bar assembly. These endmounts secure the CrossLink system to your vehicle and are essential for any CrossLink light bar build.\n\nAvailable in Standard, L-Bracket, and Security configurations. The Standard endmount provides a direct surface mount. The L-Bracket version offers a 90-degree mounting angle. The Security version includes tamper-resistant hardware to protect against theft. Choose the option that best fits your mounting location and security needs.",
      price: 3899,
      beamPatterns: [],
      colors: [],
      features: ["SS5 CrossLink compatible", "Standard/L-Bracket/Security options", "Quality construction", "Essential for CrossLink builds"],
      specs: ["Fitment: SS5 CrossLink"],
      whatsInBox: ["Endmount Bracket", "Mounting Hardware"],
      warrantyYears: 2,
      images: [],
      compatibleVehicles: [],
      isPreOrder: true,
      preOrderMessage: "Pre-order now - ships in 6-8 weeks",
      categoryIds: [CAT.ACCESSORIES, CAT.BRACKETS],
      variants: [
        { sku: "DD6804", name: "Standard Endmount", price: 3899, size: "Standard" },
        { sku: "DD6805", name: "L-Bracket Endmount", price: 3899, size: "L-Bracket" },
        { sku: "DD6806", name: "Security Endmount", price: 5199, size: "Security" },
      ],
    },
  ];
}

function getExistingProductVariants(): ExistingVariantDef[] {
  return [
    {
      productId: "9fc6bcdc-464d-46c6-938f-8c12986259ea",
      variants: [
        { sku: "DD6792", name: "White Combo Sport", price: 97499, beamPattern: "Combo", size: "Sport" },
        { sku: "DD7204", name: "White Driving Sport", price: 97499, beamPattern: "Driving", size: "Sport" },
      ],
    },
    {
      productId: "a63ac52b-4385-4fbb-a6c8-7a542f39e4aa",
      variants: [
        { sku: "DD6774S", name: "Spot (single)", price: 47999, beamPattern: "Spot", size: "Single" },
        { sku: "DD6774SNB", name: "Spot (single, no bracket)", price: 44999, beamPattern: "Spot", size: "Single NB" },
        { sku: "DD6775S", name: "Combo (single)", price: 47999, beamPattern: "Combo", size: "Single" },
        { sku: "DD6775SNB", name: "Combo (single, no bracket)", price: 44999, beamPattern: "Combo", size: "Single NB" },
        { sku: "DD6782SNB", name: "Driving (single, no bracket)", price: 44999, beamPattern: "Driving", size: "Single NB" },
      ],
    },
    {
      productId: "1f826b51-8985-4af4-aa64-4d193241d5b9",
      variants: [
        { sku: "DD6814S", name: "SAE Driving (single)", price: 16999, beamPattern: "SAE Driving", size: "Single" },
        { sku: "DD6858S", name: "Flood / Red BL (single)", price: 16999, beamPattern: "Flood", color: "Red Backlight", size: "Single" },
        { sku: "DD6861S", name: "Spot / Amber BL (single)", price: 16999, beamPattern: "Spot", color: "Amber Backlight", size: "Single" },
      ],
    },
    {
      productId: "3daebdea-c043-45ec-8625-f9ddcf20c008",
      variants: [
        { sku: "DD6847P", name: "Driving / Amber BL (pair)", price: 54999, beamPattern: "Driving", color: "Amber Backlight", size: "Pair" },
        { sku: "DD6865P", name: "Combo / Amber BL (pair)", price: 54999, beamPattern: "Combo", color: "Amber Backlight", size: "Pair" },
        { sku: "DD6878P", name: "Flood / Amber BL (pair)", price: 54999, beamPattern: "Flood", color: "Amber Backlight", size: "Pair" },
        { sku: "DD6899P", name: "SAE Driving / Amber BL (pair)", price: 54999, beamPattern: "SAE Driving", color: "Amber Backlight", size: "Pair" },
        { sku: "DD6910P", name: "SAE Fog-Wide / Amber BL (pair)", price: 54999, beamPattern: "SAE Fog-Wide", color: "Amber Backlight", size: "Pair" },
      ],
    },
  ];
}

export async function importMissingSKUs() {
  console.log("=== Starting Missing SKUs Import ===");
  const results = { productsCreated: 0, variantsCreated: 0, variantsSkipped: 0, categoriesLinked: 0, errors: [] as string[] };

  const newProducts = getNewProducts();
  console.log(`Processing ${newProducts.length} new products...`);

  for (const prod of newProducts) {
    try {
      const uniqueSlug = await ensureUniqueSlug(prod.slug);
      const productId = crypto.randomUUID();

      const firstVariantSku = prod.variants[0]?.sku || prod.sku;
      if (await skuExists(firstVariantSku)) {
        console.log(`  Skipping product "${prod.name}" - SKU ${firstVariantSku} already exists`);
        results.variantsSkipped += prod.variants.length;
        continue;
      }

      await db.insert(products).values({
        id: productId,
        name: prod.name,
        slug: uniqueSlug,
        sku: prod.sku,
        series: prod.series,
        tagline: prod.tagline,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        price: prod.price,
        originalPrice: prod.originalPrice || null,
        beamPatterns: prod.beamPatterns,
        colors: prod.colors,
        features: prod.features,
        specs: prod.specs,
        specificationsTable: prod.specificationsTable || null,
        partNumbers: null,
        qaContent: null,
        installationGuide: null,
        whatsInBox: prod.whatsInBox,
        warrantyYears: prod.warrantyYears,
        images: prod.images,
        compatibleVehicles: prod.compatibleVehicles,
        isPopular: prod.isPopular || false,
        isActive: true,
        advlustProductId: null,
        advlustHandle: null,
        videoUrl: prod.videoUrl || null,
        isPreOrder: prod.isPreOrder,
        preOrderMessage: prod.preOrderMessage,
      });

      console.log(`  Created product: "${prod.name}" (${uniqueSlug})`);
      results.productsCreated++;

      for (const variant of prod.variants) {
        if (await skuExists(variant.sku)) {
          console.log(`    Skipping variant ${variant.sku} - already exists`);
          results.variantsSkipped++;
          continue;
        }

        await db.insert(productVariants).values({
          id: crypto.randomUUID(),
          productId,
          sku: variant.sku,
          name: variant.name,
          price: variant.price,
          compareAtPrice: null,
          color: variant.color || null,
          beamPattern: variant.beamPattern || null,
          size: variant.size || null,
          stockQuantity: 0,
          isAvailable: true,
        });
        results.variantsCreated++;
      }

      for (const categoryId of prod.categoryIds) {
        await db.insert(productCategories).values({
          id: crypto.randomUUID(),
          productId,
          categoryId,
        });
        results.categoriesLinked++;
      }

    } catch (error: any) {
      const msg = `Error creating "${prod.name}": ${error.message}`;
      console.error(`  ${msg}`);
      results.errors.push(msg);
    }
  }

  const existingVariants = getExistingProductVariants();
  console.log(`\nProcessing ${existingVariants.length} existing products for new variants...`);

  for (const ev of existingVariants) {
    for (const variant of ev.variants) {
      try {
        if (await skuExists(variant.sku)) {
          console.log(`  Skipping variant ${variant.sku} - already exists`);
          results.variantsSkipped++;
          continue;
        }

        await db.insert(productVariants).values({
          id: crypto.randomUUID(),
          productId: ev.productId,
          sku: variant.sku,
          name: variant.name,
          price: variant.price,
          compareAtPrice: null,
          color: variant.color || null,
          beamPattern: variant.beamPattern || null,
          size: variant.size || null,
          stockQuantity: 0,
          isAvailable: true,
        });
        console.log(`  Added variant ${variant.sku} to product ${ev.productId}`);
        results.variantsCreated++;
      } catch (error: any) {
        const msg = `Error adding variant ${variant.sku}: ${error.message}`;
        console.error(`  ${msg}`);
        results.errors.push(msg);
      }
    }
  }

  console.log("\n=== Import Complete ===");
  console.log(`Products created: ${results.productsCreated}`);
  console.log(`Variants created: ${results.variantsCreated}`);
  console.log(`Variants skipped (already existed): ${results.variantsSkipped}`);
  console.log(`Category links created: ${results.categoriesLinked}`);
  if (results.errors.length > 0) {
    console.log(`Errors: ${results.errors.length}`);
    results.errors.forEach(e => console.log(`  - ${e}`));
  }

  return results;
}
