import { db } from "./db";
import { vehicles, reviews } from "@shared/schema";
import { eq } from "drizzle-orm";

const SEED_VEHICLES = [
  { id: "veh-1", make: "Mahindra", model: "Thar (2020+)", year: "2020-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6", "prod-7"] },
  { id: "veh-2", make: "Mahindra", model: "Thar Roxx", year: "2024-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6", "prod-7"] },
  { id: "veh-3", make: "Mahindra", model: "Scorpio-N", year: "2022-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-7"] },
  { id: "veh-4", make: "Mahindra", model: "Scorpio Classic", year: "2022-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-5", make: "Mahindra", model: "XUV700", year: "2021-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-6", make: "Mahindra", model: "Bolero", year: "2020-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-7", make: "Maruti Suzuki", model: "Jimny", year: "2023-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-8", make: "Maruti Suzuki", model: "Gypsy", year: "All Years", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-9", make: "Toyota", model: "Hilux", year: "2022-2025", compatibleProductIds: ["prod-2", "prod-4", "prod-5", "prod-6", "prod-7"] },
  { id: "veh-10", make: "Toyota", model: "Fortuner", year: "2016-2025", compatibleProductIds: ["prod-2", "prod-5", "prod-6", "prod-7"] },
  { id: "veh-11", make: "Toyota", model: "Land Cruiser", year: "All Years", compatibleProductIds: ["prod-5", "prod-6", "prod-7"] },
  { id: "veh-12", make: "Toyota", model: "Innova Crysta", year: "2016-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-13", make: "Toyota", model: "Hycross", year: "2023-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-14", make: "Force", model: "Gurkha", year: "2021-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3"] },
  { id: "veh-15", make: "Isuzu", model: "V-Cross", year: "2019-2025", compatibleProductIds: ["prod-2", "prod-4", "prod-6", "prod-7"] },
  { id: "veh-16", make: "Isuzu", model: "MU-X", year: "2017-2025", compatibleProductIds: ["prod-2", "prod-5", "prod-7"] },
  { id: "veh-17", make: "Jeep", model: "Wrangler", year: "2018-2025", compatibleProductIds: ["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6", "prod-7"] },
  { id: "veh-18", make: "Jeep", model: "Compass", year: "2021-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-19", make: "Tata", model: "Safari", year: "2021-2025", compatibleProductIds: ["prod-1", "prod-3"] },
  { id: "veh-20", make: "Tata", model: "Harrier", year: "2019-2025", compatibleProductIds: ["prod-1", "prod-3"] },
];

const SEED_REVIEWS = [
  {
    id: "rev-1",
    rating: 5,
    text: "I was skeptical about the price. But the cut-off line on my Scorpio-N is razor sharp. No blinding oncoming traffic, just pure daylight. Worth every rupee.",
    authorName: "Rohan K.",
    authorLocation: "Hyderabad",
    vehicleOwned: "Scorpio-N Z8L",
    isVerified: true,
    productId: "prod-5",
  },
  {
    id: "rev-2",
    rating: 5,
    text: "I use my Hilux in very foggy conditions in the mountains. The 18 inch Combo Amber lightbar provides excellent visibility in fog and rain.",
    authorName: "Jagadish Kumar",
    authorLocation: "Nilgiris",
    vehicleOwned: "Toyota Hilux",
    isVerified: true,
    productId: "prod-6",
  },
  {
    id: "rev-3",
    rating: 5,
    text: "The installation was incredibly easy - true plug and play. My Jimny now lights up mountain trails like it's noon. Best upgrade I've made to the car.",
    authorName: "Priya M.",
    authorLocation: "Bangalore",
    vehicleOwned: "Maruti Jimny",
    isVerified: true,
    productId: "prod-3",
  },
  {
    id: "rev-4",
    rating: 5,
    text: "After 2 years and countless off-road trips, not a single issue. The warranty gives peace of mind, but these lights are genuinely built to last. American engineering shows.",
    authorName: "Arjun D.",
    authorLocation: "Pune",
    vehicleOwned: "Toyota Hilux",
    isVerified: true,
    productId: "prod-2",
  },
  {
    id: "rev-5",
    rating: 5,
    text: "The SS3 Pro pods completely transformed my Thar's night driving capability. The TIR optics focus light exactly where needed - no scatter, no glare for oncoming traffic.",
    authorName: "Vikram S.",
    authorLocation: "Delhi",
    vehicleOwned: "Mahindra Thar",
    isVerified: true,
    productId: "prod-5",
  },
];

export async function seedVehiclesAndReviews() {
  try {
    const existingVehicles = await db.select({ id: vehicles.id }).from(vehicles);
    const existingVehicleIds = new Set(existingVehicles.map((v) => v.id));

    let vehiclesAdded = 0;
    for (const v of SEED_VEHICLES) {
      if (existingVehicleIds.has(v.id)) continue;
      await db.insert(vehicles).values({
        id: v.id,
        make: v.make,
        model: v.model,
        year: v.year,
        compatibleProductIds: v.compatibleProductIds,
      });
      vehiclesAdded++;
    }

    const existingReviews = await db.select({ id: reviews.id }).from(reviews);
    const existingReviewIds = new Set(existingReviews.map((r) => r.id));

    let reviewsAdded = 0;
    for (const r of SEED_REVIEWS) {
      if (existingReviewIds.has(r.id)) continue;
      await db.insert(reviews).values({
        id: r.id,
        rating: r.rating,
        text: r.text,
        authorName: r.authorName,
        authorLocation: r.authorLocation,
        vehicleOwned: r.vehicleOwned,
        isVerified: r.isVerified,
        productId: r.productId,
      });
      reviewsAdded++;
    }

    if (vehiclesAdded > 0 || reviewsAdded > 0) {
      console.log(`Seeded: ${vehiclesAdded} vehicles, ${reviewsAdded} reviews.`);
    }
  } catch (error) {
    console.error("Error seeding vehicles and reviews:", error);
  }
}
