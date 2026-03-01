import { db } from "./db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seedAdminUser() {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Expelight@2024";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@expelight.in";

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, adminUsername));

  if (existing.length > 0) {
    if (existing[0].role !== "admin") {
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.id, existing[0].id));
      console.log("Updated existing user to admin role.");
    }
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.insert(users).values({
    username: adminUsername,
    email: adminEmail,
    passwordHash,
    firstName: "Admin",
    lastName: null,
    role: "admin",
  });

  console.log("Seeded admin user.");
}
