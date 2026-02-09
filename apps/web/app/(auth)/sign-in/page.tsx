import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Access your Rentway account.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-lg pb-16">
      <AuthForm mode="sign-in" />
    </main>
  );
}
