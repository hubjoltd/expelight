import { db } from "./db";
import { products, productMedia } from "@shared/schema";
import { eq } from "drizzle-orm";

const imageEnrichments: Record<string, string[]> = {
  "c2-2-0-sae-dot-white-sport-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8093p_c2_gen2_sport_white_combo_standard_rbl_pair_built_-_titled.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/2/x/2xc220w-spt_254515_.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/revslider/Splashes/Diode_Dynamics_C2_2.0_LED_Pods_-_Its_All_In_The_Optics_-_Clear_Fog.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/revslider/Splashes/Diode_Dynamics_C2_2.0_LED_Pods_-_Standard_Functional_Patterns.gif",
    "https://dxv0kh7euhy9z.cloudfront.net/revslider/Splashes/Diode_Dynamics_C2_2.0_LED_Pods_-_Amber_Backlight_1.jpg"
  ],
  "c2-2-0-sae-dot-white-max-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8093p_c2_gen2_sport_white_combo_standard_rbl_pair_built_-_titled.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/revslider/Splashes/Diode_Dynamics_C2_2.0_LED_Pods_-_Its_All_In_The_Optics_-_Clear_Fog.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/revslider/Splashes/Diode_Dynamics_C2_2.0_LED_Pods_-_White_Sport_Pro_Max.gif",
    "https://dxv0kh7euhy9z.cloudfront.net/revslider/Splashes/Diode_Dynamics_C2_2.0_LED_Pods_-_Amber_Backlight_1.jpg"
  ],
  "stage-series-led-light-bar-cover": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd7784_ss10_cover_standard_black_1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss10_pro_combo_white_assembled_black_cover.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd7780_ss6_cover_standard_black_1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd7788_extruded_cover_black_1.jpg"
  ],
  "light-duty-dual-output-2-pin-offroad-wiring-harness": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd4033_light_duty_dual_output_offroad_wiring_harness_1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd4033_light_duty_dual_output_offroad_wiring_harness_cu.jpg"
  ],
  "light-duty-dual-output-4-pin-wiring-harness": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd4092_light_duty_dual_output_4pin_wiring_harness_1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd4092_light_duty_dual_output_4pin_wiring_harness_cu.jpg"
  ],
  "ss6-sae-dot-white-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8132s_ss6_white_sae_driving_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8140s_ss6_yellow_sae_driving_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss6_lightbar_installed_tacoma_bumper.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss6_lightbar_spec_diagram.jpg"
  ],
  "ss10-sae-dot-white-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8180_ss10_white_sae_driving_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8189_ss10_yellow_sae_driving_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss10_lightbar_installed_bronco.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss10_lightbar_spec_diagram.jpg"
  ],
  "ss20-white-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8201_ss20_white_sae_driving_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss20_lightbar_installed.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss20_lightbar_spec_diagram.jpg"
  ],
  "ss30-white-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8256_ss30_white_sae_driving_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss30_lightbar_installed.jpg"
  ],
  "ss3-sae-dot-white-sport-led-pod-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6858s_ss3_white_sport_sae_driving_one_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_led_pod_beam_patterns.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_pro_standard_white_driving.jpg"
  ],
  "ss3-sae-dot-white-sport-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6865p_ss3_white_sport_sae_driving_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_led_pod_beam_patterns.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_pro_standard_white_driving.jpg"
  ],
  "ss3-sae-dot-white-pro-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6878p_ss3_white_pro_sae_driving_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_led_pod_beam_patterns.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_pro_standard_white_driving.jpg"
  ],
  "ss3-sae-white-max-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6899p_ss3_white_max_sae_driving_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_led_pod_beam_patterns.jpg"
  ],
  "ss3-sae-yellow-max-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6910p_ss3_yellow_max_sae_driving_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_led_pod_beam_patterns.jpg"
  ],
  "ss5-white-pro-led-pod-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6774s_ss5_white_sport_driving_one_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss5_led_pod_beam_patterns.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss5_pro_white_combo.jpg"
  ],
  "ssc1-white-sae-fog-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6847p_ssc1_white_sae_fog_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ssc1_led_pod_beam_patterns.jpg"
  ],
  "ssc1-yellow-sport-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6443p_ssc1_yellow_sport_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ssc1_led_pod_beam_patterns.jpg"
  ],
  "c2r-white-flood-standard-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8450p_c2r_white_flood_standard_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/c/2/c2r_led_pod_installed.jpg"
  ],
  "c2r-white-flood-flush-mount-led-pod-pair": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8573p_c2r_white_flood_flush_pair_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/c/2/c2r_flush_mount_installed.jpg"
  ],
  "ss5-crosslink-3-pod-18-5-inch-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6792_ss5_crosslink_3pod_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss5_crosslink_lightbar_installed.jpg"
  ],
  "ss5-crosslink-5-pod-31-5-inch-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd7242_ss5_crosslink_5pod_lightbar_b1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss5_crosslink_lightbar_installed.jpg"
  ],
  "ss5-crosslink-endmount-kit": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6804_ss5_crosslink_endmount_kit_b1.jpg"
  ],
  "ss5-led-pod-cover-black-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd7217_ss5_cover_black_1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss5_pro_white_combo_black_cover.jpg"
  ],
  "ss3-led-pod-cover-clear-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6261_ss3_cover_clear_1.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/s/s/ss3_pro_white_clear_cover.jpg"
  ],
  "ss3-security-hardware-kit": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd7529_ss3_security_hardware_kit_b1.jpg"
  ],
  "ssc1-flush-mount-mounting-kit": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6621s_ssc1_flush_mount_kit_b1.jpg"
  ],
  "dt-4-pin-extension-wire-1m": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd4098_dt_4pin_extension_wire_1m.jpg"
  ],
  "reverse-light-wiring-kit-w-running-light": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd4102_reverse_light_wiring_kit.jpg"
  ],
  "ultra-heavy-duty-single-output-4-pin-wiring-harness": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd4123_ultra_heavy_duty_single_output_4pin_harness.jpg"
  ],
  "stage-series-rock-light-surface-mount-adapter-kit-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd7462_rock_light_surface_mount_adapter_1.jpg"
  ],
  "stage-series-led-light-bar-universal-bracket-kit": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8657_stage_series_cast_lightbar_universal_bracket_detailed_angled.jpg",
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8657_stage_series_cast_lightbar_universal_bracket_kit_1.jpg"
  ],
  "ss30-dual-color-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8375_ss30_dual_color_lightbar_b1.jpg"
  ],
  "ss40-dual-color-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8385_ss40_dual_color_lightbar_b1.jpg"
  ],
  "mini-crosslink-endmount-kit": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8469_mini_crosslink_endmount_kit_b1.jpg"
  ],
  "c2-2-0-led-pod-replacement-front-bezel-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd8555s_c2_gen2_replacement_bezel_b1.jpg"
  ],
  "ss5-crosslink-6-pod-37-5-inch-led-light-bar-one": [
    "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/d/d/dd6798_ss5_lightbar_white_combo_6_crosslink_assembled.jpg",
    "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/ss5_led_pod_backlight_collage_8.jpg"
  ]
};

async function enrichImages() {
  let updated = 0;
  for (const [slug, newImages] of Object.entries(imageEnrichments)) {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    if (!product) {
      console.log(`Product not found: ${slug}`);
      continue;
    }

    const existingImages = product.images || [];
    const allImages = [...new Set([...newImages, ...existingImages])];
    
    await db.update(products).set({ images: allImages }).where(eq(products.id, product.id));

    const existingMedia = await db.select().from(productMedia).where(eq(productMedia.productId, product.id));
    const existingUrls = new Set(existingMedia.map(m => m.url));

    const newMediaEntries = allImages
      .filter(url => !existingUrls.has(url))
      .map((url, i) => ({
        productId: product.id,
        url,
        altText: `${product.name} - Image ${existingMedia.length + i + 1}`,
        mediaType: "image",
        isPrimary: existingMedia.length === 0 && i === 0,
        sortOrder: existingMedia.length + i,
      }));

    if (newMediaEntries.length > 0) {
      await db.insert(productMedia).values(newMediaEntries);
    }

    console.log(`Updated ${slug}: ${allImages.length} images (${newMediaEntries.length} new media)`);
    updated++;
  }
  console.log(`\nEnriched ${updated} products with images`);
  process.exit(0);
}

enrichImages().catch(console.error);
