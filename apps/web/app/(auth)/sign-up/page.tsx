import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form/auth-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Rentway account.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-lg pb-16">
      <AuthForm mode="sign-up" />
    </main>
  );
}
