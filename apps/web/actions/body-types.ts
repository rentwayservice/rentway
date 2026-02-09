"use server";

import { bodyTypes, db } from "@rentway/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { ActionResult } from "@/actions/action-result";

const listBodyTypesSchema = z.object({});
const bodyTypeSlugSchema = z.object({ slug: z.string().min(1) });

export type BodyType = InferSelectModel<typeof bodyTypes>;

export const listBodyTypes = async (
  raw: z.input<typeof listBodyTypesSchema> = {}
): Promise<ActionResult<BodyType[]>> => {
  const parsed = listBodyTypesSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    const items = await db.query.bodyTypes.findMany({
      where: eq(bodyTypes.isActive, true),
      orderBy: [desc(bodyTypes.sortOrder), desc(bodyTypes.createdAt)],
    });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: "Unable to list body types." };
  }
};

export const getBodyTypeBySlug = async (
  raw: z.input<typeof bodyTypeSlugSchema>
): Promise<ActionResult<BodyType | null>> => {
  const parsed = bodyTypeSlugSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid body type slug." };
  }

  try {
    const bodyType = await db.query.bodyTypes.findFirst({
      where: eq(bodyTypes.slug, parsed.data.slug),
    });
    return { success: true, data: bodyType ?? null };
  } catch (error) {
    return { success: false, error: "Unable to load body type." };
  }
};
