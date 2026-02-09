"use server";

import { cars, db, providers } from "@rentway/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";

const approveCarSchema = z.object({
  carId: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
});

const rejectCarSchema = z.object({
  carId: z.string().uuid(),
  rejectionReason: z.string().min(1),
  approvedBy: z.string().uuid().optional(),
});

const approveProviderSchema = z.object({
  providerId: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
});

const rejectProviderSchema = z.object({
  providerId: z.string().uuid(),
  rejectionReason: z.string().min(1),
  approvedBy: z.string().uuid().optional(),
});

export const approveCar = async (
  raw: z.input<typeof approveCarSchema>
): Promise<ActionResult<{ carId: string }>> => {
  const parsed = approveCarSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid approval payload." };
  }

  try {
    await db
      .update(cars)
      .set({
        approvalStatus: "approved",
        approvedAt: new Date().toISOString(),
        approvedBy: parsed.data.approvedBy ?? null,
        rejectionReason: null,
      })
      .where(eq(cars.id, parsed.data.carId));

    return { success: true, data: { carId: parsed.data.carId } };
  } catch (error) {
    return { success: false, error: "Unable to approve car." };
  }
};

export const rejectCar = async (
  raw: z.input<typeof rejectCarSchema>
): Promise<ActionResult<{ carId: string }>> => {
  const parsed = rejectCarSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid rejection payload." };
  }

  try {
    await db
      .update(cars)
      .set({
        approvalStatus: "rejected",
        approvedAt: new Date().toISOString(),
        approvedBy: parsed.data.approvedBy ?? null,
        rejectionReason: parsed.data.rejectionReason,
      })
      .where(eq(cars.id, parsed.data.carId));

    return { success: true, data: { carId: parsed.data.carId } };
  } catch (error) {
    return { success: false, error: "Unable to reject car." };
  }
};

export const approveProvider = async (
  raw: z.input<typeof approveProviderSchema>
): Promise<ActionResult<{ providerId: string }>> => {
  const parsed = approveProviderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid approval payload." };
  }

  try {
    await db
      .update(providers)
      .set({
        approvalStatus: "approved",
        approvedAt: new Date().toISOString(),
        approvedBy: parsed.data.approvedBy ?? null,
        rejectionReason: null,
      })
      .where(eq(providers.id, parsed.data.providerId));

    return { success: true, data: { providerId: parsed.data.providerId } };
  } catch (error) {
    return { success: false, error: "Unable to approve provider." };
  }
};

export const rejectProvider = async (
  raw: z.input<typeof rejectProviderSchema>
): Promise<ActionResult<{ providerId: string }>> => {
  const parsed = rejectProviderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid rejection payload." };
  }

  try {
    await db
      .update(providers)
      .set({
        approvalStatus: "rejected",
        approvedAt: new Date().toISOString(),
        approvedBy: parsed.data.approvedBy ?? null,
        rejectionReason: parsed.data.rejectionReason,
      })
      .where(eq(providers.id, parsed.data.providerId));

    return { success: true, data: { providerId: parsed.data.providerId } };
  } catch (error) {
    return { success: false, error: "Unable to reject provider." };
  }
};
