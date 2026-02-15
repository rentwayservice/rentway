"use client";

import { Button } from "@zaher/ui/components/button";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";
import { StepLayout } from "./register-form.chunks";
export function RegisterConfirm() {
  const supabase = createClient();
  const t = useTranslations();
  const email = useSearchParams().get("email");

  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (emailSent && countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    if (countdown === 0) {
      setCanResend(true);
      setEmailSent(false);
    }
  }, [emailSent, countdown]);

  const resendVerificationEmail = () => {
    startTransition(async () => {
      if (!email) {
        toast.error(t("register.confirm.resend_email_error"));
        return;
      }

      setCanResend(false);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (!error) {
        toast.success(t("register.confirm.resend_email_success"));
        setCountdown(60);
        setEmailSent(true);
        setCanResend(false);
        return;
      }
      toast.error(t("register.confirm.resend_email_error"));
    });
  };

  return (
    <div className="md:px-0 px-7 bg-white">
      <StepLayout image="/step-2-placeholder.png">
        <div className="flex flex-col items-center justify-center gap-4 h-full text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <div className="relative">
              <Mail className="w-8 h-8 text-primary" />
              <CheckCircle className="w-4 h-4 text-accent absolute -top-1 -right-1 bg-primary rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">{t("register.confirm.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("register.confirm.description")}
          </p>
          <div className=" rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">
              {t.rich("register.confirm.spam", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
          <Button
            className="w-full h-11"
            disabled={!(email && canResend) || isPending}
            onClick={resendVerificationEmail}
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {t("register.confirm.sending")}
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                {emailSent
                  ? `${t("register.confirm.resend_email")} (${countdown})`
                  : t("register.confirm.resend_email")}
              </>
            )}
          </Button>
        </div>
      </StepLayout>
    </div>
  );
}
