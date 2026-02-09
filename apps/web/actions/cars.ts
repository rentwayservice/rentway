"use server";

import { cars, db } from "@rentway/db";
import { sql } from "drizzle-orm";
import {
  and,
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
  type SQL,
} from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";

// Types inferred from schema
export type Car = InferSelectModel<typeof cars>;
export type CarInsert = InferInsertModel<typeof cars>;

// Filter options for list queries
export interface CarsFilter {
  providerId?: string;
  modelId?: string;
  status?: "active" | "inactive" | "deleted";
  approvalStatus?: "pending" | "approved" | "rejected";
  availability?: "available" | "rented" | "reserved" | "maintenance";
  limit?: number;
  offset?: number;
}

const CARS_TAG = "cars";

// Internal fetch functions for unstable_cache (must be pure, no closure over db)
async function fetchCars(filter: CarsFilter) {
  const conditions: SQL[] = [];
  if (filter.providerId) {
    conditions.push(eq(cars.providerId, filter.providerId));
  }
  if (filter.modelId) {
    conditions.push(eq(cars.modelId, filter.modelId));
  }
  if (filter.status) {
    conditions.push(eq(cars.status, filter.status));
  }
  if (filter.approvalStatus) {
    conditions.push(eq(cars.approvalStatus, filter.approvalStatus));
  }
  if (filter.availability) {
    conditions.push(eq(cars.availability, filter.availability));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const limit = filter.limit ?? 50;
  const offset = filter.offset ?? 0;

  const result = await db
    .select()
    .from(cars)
    .where(whereClause)
    .orderBy(desc(cars.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

async function fetchCarById(id: string) {
  const result = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
  return result[0] ?? null;
}

async function fetchCarBySlug(slug: string) {
  const result = await db
    .select()
    .from(cars)
    .where(eq(cars.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

async function fetchCarsWithDetails(filter: CarsFilter) {
  const conditions: SQL[] = [];
  if (filter.providerId) {
    conditions.push(eq(cars.providerId, filter.providerId));
  }
  if (filter.modelId) {
    conditions.push(eq(cars.modelId, filter.modelId));
  }
  if (filter.status) {
    conditions.push(eq(cars.status, filter.status));
  }
  if (filter.approvalStatus) {
    conditions.push(eq(cars.approvalStatus, filter.approvalStatus));
  }
  if (filter.availability) {
    conditions.push(eq(cars.availability, filter.availability));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = filter.limit ?? 12;
  const offset = filter.offset ?? 0;

  const result = await db.query.cars.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: [desc(cars.createdAt)],
    with: {
      model: {
        with: { brand: true },
      },
    },
  });
  return result;
}

async function fetchCarsCount(filter: Omit<CarsFilter, "limit" | "offset">) {
  const conditions: SQL[] = [];
  if (filter.providerId) {
    conditions.push(eq(cars.providerId, filter.providerId));
  }
  if (filter.modelId) {
    conditions.push(eq(cars.modelId, filter.modelId));
  }
  if (filter.status) {
    conditions.push(eq(cars.status, filter.status));
  }
  if (filter.approvalStatus) {
    conditions.push(eq(cars.approvalStatus, filter.approvalStatus));
  }
  if (filter.availability) {
    conditions.push(eq(cars.availability, filter.availability));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const query = db.select({ count: sql<number>`count(*)::int` }).from(cars);
  const result = whereClause
    ? await query.where(whereClause)
    : await query;
  return result[0]?.count ?? 0;
}

async function fetchCarBySlugWithDetails(slug: string) {
  const result = await db.query.cars.findFirst({
    where: eq(cars.slug, slug),
    with: {
      model: {
        with: {
          brand: true,
        },
      },
      carFeatures: {
        with: {
          feature: true,
        },
      },
    },
  });
  return result ?? null;
}
// Cached read operations
export const getCarsWithDetails = async (filter: CarsFilter = {}) =>
  unstable_cache(
    () => fetchCarsWithDetails(filter),
    [`cars-list-details-${JSON.stringify(filter)}`],
    { tags: [CARS_TAG], revalidate: 60 }
  )();

export const getCarsCount = async (
  filter: Omit<CarsFilter, "limit" | "offset"> = {}
) =>
  unstable_cache(
    () => fetchCarsCount(filter),
    [`cars-count-${JSON.stringify(filter)}`],
    { tags: [CARS_TAG], revalidate: 60 }
  )();

export const getCars = async (filter: CarsFilter = {}) =>
  unstable_cache(
    () => fetchCars(filter),
    [`cars-list-${JSON.stringify(filter)}`],
    { tags: [CARS_TAG], revalidate: 60 }
  )();

export const getCar = async (id: string) =>
  unstable_cache(() => fetchCarById(id), [`car-${id}`], {
    tags: [CARS_TAG],
    revalidate: 60,
  })();

export const getCarBySlug = async (slug: string) =>
  unstable_cache(() => fetchCarBySlug(slug), [`car-slug-${slug}`], {
    tags: [CARS_TAG],
    revalidate: 60,
  })();

export const getCarBySlugWithDetails = async (slug: string) =>
  unstable_cache(
    () => fetchCarBySlugWithDetails(slug),
    [`car-slug-details-${slug}`],
    {
      tags: [CARS_TAG],
      revalidate: 60,
    }
  )();

// Mutations (revalidate cache after changes)
export const createCar = async (data: CarInsert) => {
  const result = await db.insert(cars).values(data).returning();
  revalidateTag(CARS_TAG, "max");
  return result[0];
};

export const updateCar = async (id: string, data: Partial<CarInsert>) => {
  const result = await db
    .update(cars)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(cars.id, id))
    .returning();
  revalidateTag(CARS_TAG, "max");
  return result[0];
};

export const deleteCar = async (id: string) => {
  const result = await db.delete(cars).where(eq(cars.id, id)).returning();
  revalidateTag(CARS_TAG, "max");
  return result[0];
};
