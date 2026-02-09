"use server";

import { db, profiles } from "@rentway/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { ActionResult } from "@/actions/action-result";

const profileIdSchema = z.object({ id: z.string().uuid() });
const upsertProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export type Profile = InferSelectModel<typeof profiles>;

export const getProfile = async (
  raw: z.input<typeof profileIdSchema>
): Promise<ActionResult<Profile | null>> => {
  const parsed = profileIdSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid profile id." };
  }

  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, parsed.data.id),
    });
    return { success: true, data: profile ?? null };
  } catch (error) {
    return { success: false, error: "Unable to load profile." };
  }
};

export const upsertProfile = async (
  raw: z.input<typeof upsertProfileSchema>
): Promise<ActionResult<Profile>> => {
  const parsed = upsertProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid profile payload." };
  }

  try {
    const [profile] = await db
      .insert(profiles)
      .values({ ...parsed.data, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: profiles.id,
        set: { ...parsed.data, updatedAt: new Date().toISOString() },
      })
      .returning();

    return { success: true, data: profile };
  } catch (error) {
    return { success: false, error: "Unable to save profile." };
  }
};
