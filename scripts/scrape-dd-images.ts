import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, isNull } from "drizzle-orm";

const DD_CDN_BASE = "https://dxv0kh7euhy9z.cloudfront.net/catalog/product/cache/67cb7de173f5275efcd98ea89f80cd4b";

interface ProductImageMapping {
  slug: string;
  images: string[];
}

const productImageMappings: ProductImageMapping[] = [
  {
    slug: "ss10-white-led-light-bar",
    images: [
      `${DD_CDN_BASE}/d/d/dd8189_ss10_sport_white_spot_standard_abl_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8189_ss10_sport_white_spot_standard_abl_2.jpg`,
      `${DD_CDN_BASE}/d/d/dd8189_ss10_sport_white_sae_driving_standard_abl_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8193_ss10_pro_white_spot_standard_abl_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8197_ss10_max_white_spot_standard_abl_1.jpg`,
    ],
  },
  {
    slug: "ss10-yellow-led-light-bar",
    images: [
      `${DD_CDN_BASE}/d/d/dd8182_ss10_sport_yellow_spot_standard_abl_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8182_ss10_sport_yellow_spot_standard_abl_2.jpg`,
      `${DD_CDN_BASE}/d/d/dd8184_ss10_pro_yellow_spot_standard_abl_1.jpg`,
    ],
  },
  {
    slug: "stage-series-led-light-bar-cover",
    images: [
      `${DD_CDN_BASE}/d/d/dd7784_ss10_cover_standard_black_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd7781_ss10_cover_standard_clear_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd7783_ss10_cover_standard_smoked_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd7782_ss10_cover_standard_yellow_1.jpg`,
    ],
  },
  {
    slug: "stage-series-light-bar-universal-bracket-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd8657_ss6_universal_bracket_kit_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8657_ss6_universal_bracket_kit_2.jpg`,
      `${DD_CDN_BASE}/d/d/dd8815_ss10_universal_bracket_kit_1.jpg`,
    ],
  },
  {
    slug: "ss30-white-led-light-bar",
    images: [
      `${DD_CDN_BASE}/d/d/dd8256_ss30_sport_white_combo_standard_abl_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8256_ss30_sport_white_combo_standard_abl_2.jpg`,
      `${DD_CDN_BASE}/d/d/dd8373_ss30_sport_yellow_combo_standard_abl_1.jpg`,
    ],
  },
  {
    slug: "ss30-dual-color-led-light-bar",
    images: [
      `${DD_CDN_BASE}/d/d/dd8375_ss30_sport_dualcolor_combo_standard_abl_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8375_ss30_sport_dualcolor_combo_standard_abl_2.jpg`,
    ],
  },
  {
    slug: "ss20-white-led-light-bar",
    images: [
      `${DD_CDN_BASE}/d/d/dd8216_ss20_sport_white_combo_standard_abl_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8216_ss20_sport_white_combo_standard_abl_2.jpg`,
      `${DD_CDN_BASE}/d/d/dd8220_ss20_pro_white_combo_standard_abl_1.jpg`,
    ],
  },
  {
    slug: "mini-crosslink-endmount-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd8469_mini_crosslink_endmount_kit_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8469_mini_crosslink_endmount_kit_2.jpg`,
    ],
  },
  {
    slug: "ss3-security-hardware-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd7529_ss3_security_hardware_kit_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd7529_ss3_security_hardware_kit_2.jpg`,
    ],
  },
  {
    slug: "reverse-light-wiring-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd4102_reverse_light_wiring_kit_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd4103_reverse_light_wiring_kit_dual_1.jpg`,
    ],
  },
  {
    slug: "rock-light-surface-mount-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd7462_rocklight_surface_mount_kit_standard_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd7463_rocklight_surface_mount_kit_heavy_duty_1.jpg`,
    ],
  },
  {
    slug: "ss6-classic-to-new-gen-adapter-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd8656_ss6_classic_to_new_gen_adapter_kit_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8656_ss6_classic_to_new_gen_adapter_kit_2.jpg`,
    ],
  },
  {
    slug: "c2-2-0-security-hardware-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd8767_c2_gen_2_security_hardware_kit_1.jpg`,
    ],
  },
  {
    slug: "ss3-led-pod-cover",
    images: [
      `${DD_CDN_BASE}/d/d/dd6261_ss3_pod_cover_clear_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd6262_ss3_pod_cover_smoked_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd6263_ss3_pod_cover_yellow_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd6264_ss3_pod_cover_black_1.jpg`,
    ],
  },
  {
    slug: "c2-2-0-led-pod-cover-clear",
    images: [
      `${DD_CDN_BASE}/d/d/dd8559_c2_gen_2_cover_standard_clear_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8559_c2_gen_2_cover_standard_clear_2.jpg`,
    ],
  },
  {
    slug: "c2-2-0-flush-mount-mounting-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd8559s_c2_gen_2_flush_mount_kit_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd8559p_c2_gen_2_flush_mount_kit_pair_1.jpg`,
    ],
  },
  {
    slug: "ssc1-flush-mount-mounting-kit",
    images: [
      `${DD_CDN_BASE}/d/d/dd6621s_ssc1_flush_mount_kit_single_1.jpg`,
    ],
  },
  {
    slug: "light-duty-dual-output-2-pin-wiring-harness",
    images: [
      `${DD_CDN_BASE}/d/d/dd4033_2_pin_light_duty_dual_output_harness_1.jpg`,
      `${DD_CDN_BASE}/d/d/dd4033_2_pin_light_duty_dual_output_harness_2.jpg`,
    ],
  },
];

async function updateProductImages() {
  console.log("Starting product image update...");
  let updated = 0;
  let failed = 0;

  for (const mapping of productImageMappings) {
    try {
      const validImages: string[] = [];
      for (const url of mapping.images) {
        try {
          const response = await fetch(url, { method: "HEAD" });
          if (response.ok) {
            validImages.push(url);
          } else {
            console.log(`  Image not found (${response.status}): ${url.split('/').pop()}`);
          }
        } catch {
          console.log(`  Failed to check: ${url.split('/').pop()}`);
        }
      }

      if (validImages.length > 0) {
        await db.update(products)
          .set({ images: validImages })
          .where(eq(products.slug, mapping.slug));
        console.log(`Updated ${mapping.slug}: ${validImages.length} images`);
        updated++;
      } else {
        console.log(`No valid images found for ${mapping.slug}`);
        failed++;
      }
    } catch (error) {
      console.error(`Error updating ${mapping.slug}:`, error);
      failed++;
    }
  }

  console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
}

updateProductImages().then(() => process.exit(0)).catch(console.error);
