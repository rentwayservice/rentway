"use client";

import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { StepLayout } from "@/layouts/auth/register/register-form.chunks";

export default function AuthConfirmErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="md:px-0 px-7 bg-white">
      <StepLayout image="/step-2-placeholder.png">
        <div className="flex justify-center items-center h-full">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold">Verification error</h1>
            <p className="text-sm text-muted-foreground">
              {error ??
                "We couldn't verify your email link. It may have expired or already been used."}
            </p>
          </div>
        </div>
      </StepLayout>
    </div>
  );
}
