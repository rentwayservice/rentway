"use server";

import { brands, db } from "@rentway/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { ActionResult } from "@/actions/action-result";

const listBrandsSchema = z.object({});
const brandSlugSchema = z.object({ slug: z.string().min(1) });

export type Brand = InferSelectModel<typeof brands>;

export const listBrands = async (
  raw: z.input<typeof listBrandsSchema> = {}
): Promise<ActionResult<Brand[]>> => {
  const parsed = listBrandsSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    const items = await db.query.brands.findMany({
      where: eq(brands.isActive, true),
      orderBy: [desc(brands.sortOrder), desc(brands.createdAt)],
    });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: "Unable to list brands." };
  }
};

export const getBrandBySlug = async (
  raw: z.input<typeof brandSlugSchema>
): Promise<ActionResult<Brand | null>> => {
  const parsed = brandSlugSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid brand slug." };
  }

  try {
    const brand = await db.query.brands.findFirst({
      where: eq(brands.slug, parsed.data.slug),
    });
    return { success: true, data: brand ?? null };
  } catch (error) {
    return { success: false, error: "Unable to load brand." };
  }
};
