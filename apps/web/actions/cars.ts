"use server";

import dayjs from "dayjs";
import {
  brands,
  bodyTypes,
  carFeatures,
  cars,
  db,
  featureCategories,
  features,
  models,
  providers,
} from "@rentway/db";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { ActionResult } from "@/actions/action-result";

const listCarsSchema = z.object({
  providerId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  bodyTypeId: z.string().uuid().optional(),
  fuelType: z
    .enum(["petrol", "diesel", "electric", "hybrid", "plug_in_hybrid"])
    .optional(),
  transmissionType: z
    .enum(["automatic", "manual", "cvt", "semi_automatic"])
    .optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const carSlugSchema = z.object({ slug: z.string().min(1) });
const carFeaturesSchema = z.object({ carId: z.string().uuid() });

const createCarSchema = z.object({
  providerId: z.string().uuid(),
  modelId: z.string().uuid(),
  slug: z.string().min(1),
  year: z.number(),
  dailyRate: z.number().optional(),
  weeklyRate: z.number().optional(),
  monthlyRate: z.number().optional(),
  availability: z
    .enum(["available", "rented", "reserved", "maintenance"])
    .optional(),
  status: z.enum(["active", "inactive", "deleted"]).optional(),
  description: z.string().optional(),
});

const updateCarSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).optional(),
  year: z.number().optional(),
  dailyRate: z.number().optional(),
  weeklyRate: z.number().optional(),
  monthlyRate: z.number().optional(),
  availability: z
    .enum(["available", "rented", "reserved", "maintenance"])
    .optional(),
  status: z.enum(["active", "inactive", "deleted"]).optional(),
  description: z.string().optional(),
});

const setCarFeaturesSchema = z.object({
  carId: z.string().uuid(),
  featureIds: z.array(z.string().uuid()),
});


export type Car = InferSelectModel<typeof cars>;
export type Model = InferSelectModel<typeof models>;
export type Brand = InferSelectModel<typeof brands>;
export type Provider = InferSelectModel<typeof providers>;
export type BodyType = InferSelectModel<typeof bodyTypes>;
export type Feature = InferSelectModel<typeof features>;
export type FeatureCategory = InferSelectModel<typeof featureCategories>;

export type CarWithDetails = {
  car: Car;
  model: Model;
  brand: Brand;
  provider: Provider;
  bodyType: BodyType | null;
};

export type CarDetail = CarWithDetails & {
  features: Array<{
    feature: Feature;
    category: FeatureCategory | null;
  }>;
};

const DEFAULT_LIMIT = 12;

const formatDate = (value?: string) => {
  if (!value) return null;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return null;
  return parsed.format("YYYY-MM-DD");
};

export const listCars = async (
  rawFilters: z.input<typeof listCarsSchema> = {}
): Promise<
  ActionResult<{ items: CarWithDetails[]; total: number }>
> => {
  const parsed = listCarsSchema.safeParse(rawFilters);
  if (!parsed.success) {
    return { success: false, error: "Invalid filters." };
  }

  try {
    const filters = parsed.data;
    const conditions = [
      eq(cars.approvalStatus, "approved"),
      eq(cars.status, "active"),
      eq(cars.availability, "available"),
    ];

    if (filters.providerId) {
      conditions.push(eq(cars.providerId, filters.providerId));
    }
    if (filters.brandId) {
      conditions.push(eq(models.brandId, filters.brandId));
    }
    if (filters.bodyTypeId) {
      conditions.push(eq(models.bodyTypeId, filters.bodyTypeId));
    }
    if (filters.fuelType) {
      conditions.push(eq(models.fuelType, filters.fuelType));
    }
    if (filters.transmissionType) {
      conditions.push(eq(models.transmissionType, filters.transmissionType));
    }
    if (filters.minPrice !== undefined) {
      conditions.push(gte(cars.dailyRate, filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(cars.dailyRate, filters.maxPrice));
    }

    const availableFrom = formatDate(filters.availableFrom);
    const availableUntil = formatDate(filters.availableUntil);

    if (availableFrom) {
      conditions.push(lte(cars.availableFrom, availableFrom));
    }
    if (availableUntil) {
      conditions.push(gte(cars.availableUntil, availableUntil));
    }

    const limit = filters.limit ?? DEFAULT_LIMIT;
    const offset = filters.offset ?? 0;

    const items = await db
      .select({
        car: cars,
        model: models,
        brand: brands,
        provider: providers,
        bodyType: bodyTypes,
      })
      .from(cars)
      .innerJoin(models, eq(cars.modelId, models.id))
      .innerJoin(brands, eq(models.brandId, brands.id))
      .innerJoin(providers, eq(cars.providerId, providers.id))
      .leftJoin(bodyTypes, eq(models.bodyTypeId, bodyTypes.id))
      .where(and(...conditions))
      .orderBy(desc(cars.createdAt))
      .limit(limit)
      .offset(offset);

    const totalQuery = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(cars)
      .innerJoin(models, eq(cars.modelId, models.id))
      .innerJoin(brands, eq(models.brandId, brands.id))
      .innerJoin(providers, eq(cars.providerId, providers.id))
      .leftJoin(bodyTypes, eq(models.bodyTypeId, bodyTypes.id))
      .where(and(...conditions));

    return {
      success: true,
      data: {
        items,
        total: totalQuery[0]?.count ?? 0,
      },
    };
  } catch (error) {
    return { success: false, error: "Unable to list cars." };
  }
};

export const getCarBySlug = async (
  raw: z.input<typeof carSlugSchema>
): Promise<ActionResult<CarDetail | null>> => {
  const parsed = carSlugSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid car slug." };
  }

  try {
    const car = await db.query.cars.findFirst({
      where: eq(cars.slug, parsed.data.slug),
      with: {
        model: { with: { brand: true, bodyType: true } },
        provider: true,
        carFeatures: {
          with: {
            feature: { with: { category: true } },
          },
        },
      },
    });

    if (!car) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        car,
        model: car.model,
        brand: car.model.brand,
        provider: car.provider,
        bodyType: car.model.bodyType ?? null,
        features: car.carFeatures.map((item) => ({
          feature: item.feature,
          category: item.feature.category ?? null,
        })),
      },
    };
  } catch (error) {
    return { success: false, error: "Unable to load car." };
  }
};

export const getCarFeatures = async (
  raw: z.input<typeof carFeaturesSchema>
): Promise<ActionResult<Feature[]>> => {
  const parsed = carFeaturesSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid car id." };
  }

  try {
    const items = await db.query.carFeatures.findMany({
      where: eq(carFeatures.carId, parsed.data.carId),
      with: {
        feature: { with: { category: true } },
      },
    });

    return { success: true, data: items.map((item) => item.feature) };
  } catch (error) {
    return { success: false, error: "Unable to load car features." };
  }
};

export const createCar = async (
  raw: z.input<typeof createCarSchema>
): Promise<ActionResult<Car>> => {
  const parsed = createCarSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid car payload." };
  }

  try {
    const [created] = await db
      .insert(cars)
      .values({
        ...parsed.data,
        approvalStatus: "pending",
      })
      .returning();
    return { success: true, data: created };
  } catch (error) {
    return { success: false, error: "Unable to create car." };
  }
};

export const updateCar = async (
  raw: z.input<typeof updateCarSchema>
): Promise<ActionResult<Car>> => {
  const parsed = updateCarSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid car payload." };
  }

  try {
    const [updated] = await db
      .update(cars)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(eq(cars.id, parsed.data.id))
      .returning();
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Unable to update car." };
  }
};

export const setCarFeatures = async (
  raw: z.input<typeof setCarFeaturesSchema>
): Promise<ActionResult<{ carId: string; featureIds: string[] }>> => {
  const parsed = setCarFeaturesSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid features payload." };
  }

  try {
    await db
      .delete(carFeatures)
      .where(eq(carFeatures.carId, parsed.data.carId));

    if (parsed.data.featureIds.length > 0) {
      await db.insert(carFeatures).values(
        parsed.data.featureIds.map((featureId) => ({
          carId: parsed.data.carId,
          featureId,
        }))
      );
    }

    return {
      success: true,
      data: {
        carId: parsed.data.carId,
        featureIds: parsed.data.featureIds,
      },
    };
  } catch (error) {
    return { success: false, error: "Unable to update car features." };
  }
};
