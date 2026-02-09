"use server";

import { db, featureCategories, features } from "@rentway/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { ActionResult } from "@/actions/action-result";

const listFeaturesSchema = z.object({});

export type FeatureCategory = InferSelectModel<typeof featureCategories>;
export type Feature = InferSelectModel<typeof features>;

export const listFeaturesByCategory = async (
  raw: z.input<typeof listFeaturesSchema> = {}
): Promise<
  ActionResult<Array<{ category: FeatureCategory; features: Feature[] }>>
> => {
  const parsed = listFeaturesSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    const items = await db.query.featureCategories.findMany({
      where: eq(featureCategories.isActive, true),
      with: {
        features: true,
      },
      orderBy: [desc(featureCategories.sortOrder), desc(featureCategories.name)],
    });

    return {
      success: true,
      data: items.map((item) => ({
        category: item,
        features: item.features,
      })),
    };
  } catch (error) {
    return { success: false, error: "Unable to list features." };
  }
};
