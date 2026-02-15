"use server";

import { db, profiles } from "@zaher/db";
import { eq } from "drizzle-orm";
import { createSupabaseServerClient } from "@/supabase/server";
import { SupabaseAuthErrorKeys } from "../auth.constants";
import {
  type RegisterFormValues,
  registerFormSchema,
} from "./register-form.dto";

export async function signUpWithEmailAndPassword(data: RegisterFormValues) {
  const validatedFields = registerFormSchema.safeParse(data);
  if (!validatedFields.success) {
    return JSON.stringify({ error: validatedFields.error });
  }

  const profile = await checkEmailAvailability(data.email);
  if (profile) {
    return JSON.stringify({ error: SupabaseAuthErrorKeys.EMAIL_IN_USE });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const result = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL,
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (result.error) {
      console.log(result.error);
      // Map Supabase error codes to our custom error keys
      return JSON.stringify({
        error: `auth_errors.${result.error.code}`,
      });
    }

    return JSON.stringify(result);
  } catch (_) {
    return JSON.stringify({
      error: SupabaseAuthErrorKeys.UNKNOWN_ERROR,
    });
  }
}

export async function checkEmailAvailability(email: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.email, email),
  });
  return profile;
}
