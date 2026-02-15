import type { EmailOtpType } from "@supabase/supabase-js";
import { db, profiles } from "@zaher/db";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("host") || "vendor.zaher.io";
  const protocol = request.headers.get("x-forwarded-proto") || "https";

  const origin = `${protocol}://${host}`;

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/error?error=${encodeURIComponent(
          error?.message ?? "Unknown error"
        )}`
      );
    }

    if (type === "email_change" && data?.user?.id) {
      await db
        .update(profiles)
        .set({
          email: data.user.email,
        })
        .where(eq(profiles.id, data.user.id));

      updateTag("user-profile");
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("No token hash or type")}`
  );
}
