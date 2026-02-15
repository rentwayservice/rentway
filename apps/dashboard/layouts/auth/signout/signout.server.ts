"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createSupabaseServerClient } from "@/supabase/server";

export async function logoutUser() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  updateTag("user-profile");
}
