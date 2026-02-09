"use server";

import { providers, cars, db } from "@rentway/db";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { ActionResult } from "@/actions/action-result";

const providerSlugSchema = z.object({ slug: z.string().min(1) });
const listProvidersSchema = z.object({});
const upsertProviderSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  countryCode: z.string().optional(),
  branding: z
    .object({
      logo_url: z.string().optional(),
      cover_image_url: z.string().optional(),
      primary_color: z.string().optional(),
      secondary_color: z.string().optional(),
    })
    .optional(),
});

export type Provider = InferSelectModel<typeof providers>;
export type ProviderWithCars = Provider & {
  cars: Array<
    InferSelectModel<typeof cars> & {
      model?: {
        name?: string | null;
        brand?: { name?: string | null } | null;
      } | null;
    }
  >;
};

export const listProviders = async (
  raw: z.input<typeof listProvidersSchema> = {}
): Promise<ActionResult<Provider[]>> => {
  const parsed = listProvidersSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    const items = await db.query.providers.findMany({
      where: eq(providers.status, "active"),
      orderBy: [desc(providers.createdAt)],
    });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: "Unable to list providers." };
  }
};

export const getProviderBySlug = async (
  raw: z.input<typeof providerSlugSchema>
): Promise<ActionResult<ProviderWithCars | null>> => {
  const parsed = providerSlugSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid provider slug." };
  }

  try {
    const provider = await db.query.providers.findFirst({
      where: eq(providers.slug, parsed.data.slug),
    });

    if (!provider) {
      return { success: true, data: null };
    }

    const providerCars = await db.query.cars.findMany({
      where: and(
        eq(cars.providerId, provider.id),
        eq(cars.approvalStatus, "approved"),
        eq(cars.status, "active")
      ),
      orderBy: [desc(cars.createdAt)],
      with: {
        model: {
          with: {
            brand: true,
          },
        },
      },
    });

    return { success: true, data: { ...provider, cars: providerCars } };
  } catch (error) {
    return { success: false, error: "Unable to load provider." };
  }
};

export const upsertProvider = async (
  raw: z.input<typeof upsertProviderSchema>
): Promise<ActionResult<Provider>> => {
  const parsed = upsertProviderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid provider payload." };
  }

  try {
    const [provider] = await db
      .insert(providers)
      .values({
        ...parsed.data,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: providers.id,
        set: { ...parsed.data, updatedAt: new Date().toISOString() },
      })
      .returning();

    return { success: true, data: provider };
  } catch (error) {
    return { success: false, error: "Unable to save provider." };
  }
};
