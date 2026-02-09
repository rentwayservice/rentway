import { brands, db } from "@rentway/db";
import { eq } from "drizzle-orm";

export async function getBrands() {
  const brandsData = await db.query.brands.findMany({
    where: eq(brands.isActive, true),
  });
  return brandsData;
}
