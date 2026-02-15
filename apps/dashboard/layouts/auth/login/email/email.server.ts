"use server";

import { db } from "@zaher/db";
import { handleServerActionError } from "@zaher/libs";
import type { SigninEmailValues } from "./email.dto";

export async function checkProfileAction(data: SigninEmailValues) {
  try {
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.email, data.email),
    });

    if (!profile) {
      throw new Error("بيانات خاطئة برجاء مراجعة البيانات وإعادة المحاولة!");
    }

    if (profile.isBlocked) {
      throw new Error("تم حظر حسابك برجاء التواصل معنا في أقرب وقت");
    }

    return { success: true, data: null, error: null };
  } catch (error) {
    return handleServerActionError(error);
  }
}
