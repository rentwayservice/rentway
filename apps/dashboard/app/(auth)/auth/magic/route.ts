import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const origin = requestUrl.origin;

  if (!token_hash) {
    console.log("No code found in query string");
    return NextResponse.redirect(`${origin}/`);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "email",
    });

    if (error) {
      console.error("Error exchanging code for session:", error.message);
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
      );
    }

    console.log("Successfully exchanged code for session");
    return NextResponse.redirect(`${origin}/`);
  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.redirect(
      `${origin}/auth/error?message=Unexpected%20error`
    );
  }
}
