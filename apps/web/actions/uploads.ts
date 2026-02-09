"use server";

import { cars, db } from "@rentway/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";

const uploadImagesSchema = z.object({
  carId: z.string().uuid(),
  imageUrls: z.array(z.string().url()),
});

export const uploadImages = async (
  raw: z.input<typeof uploadImagesSchema>
): Promise<ActionResult<{ primaryImageUrl: string; images: string[] }>> => {
  const parsed = uploadImagesSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid image payload." };
  }

  try {
    const [primaryImageUrl] = parsed.data.imageUrls;
    await db
      .update(cars)
      .set({
        primaryImageUrl: primaryImageUrl ?? null,
        images: parsed.data.imageUrls,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cars.id, parsed.data.carId));

    return {
      success: true,
      data: {
        primaryImageUrl: primaryImageUrl ?? "",
        images: parsed.data.imageUrls,
      },
    };
  } catch (error) {
    return { success: false, error: "Unable to upload images." };
  }
};
