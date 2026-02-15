"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@rentway/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TranslatedFormMessage,
} from "@rentway/ui/components/form";
import { Input } from "@rentway/ui/components/input";
import { InputOTP, InputOTPSlot } from "@rentway/ui/components/input-otp";
import { Separator } from "@rentway/ui/components/separator";
import { AuthApiError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";
import { OAuth } from "../../oauth";
import { type OtpValues, otpSchema } from "./otp-login.dto";

export function OTPLoginForm() {
  const t = useTranslations("otp");
  const router = useRouter();
  const supabase = createClient();

  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    mode: "all",
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const email = form.watch("email");
  const otp = form.watch("otp");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: false,
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setSent(true);
      setCountdown(60);
      toast.success(t("success_send"));
    },
    onError: (error) => {
      if (error instanceof AuthApiError) {
        if (error.message === "Signups not allowed for otp") {
          toast.error(t("error_not_registered"));
        } else {
          toast.error(t("error_send_generic"));
        }
      } else {
        toast.error(t("error_send_generic"));
      }
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof AuthApiError) {
        const errorKey =
          error.status === 400
            ? t("error_invalid_or_expired")
            : error.status === 401
              ? t("error_unauthorized")
              : error.status === 422
                ? t("error_invalid_input")
                : t("error_verification_generic");
        toast.error(errorKey);
      } else {
        toast.error(t("error_unexpected"));
      }
    },
  });

  const onSubmit = () => {
    if (sent) {
      verifyOtpMutation.mutate();
    } else {
      sendOtpMutation.mutate();
    }
  };

  const isLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col space-y-2 py-6 text-center">
          <h2 className="font-medium text-xl">{t("title")}</h2>
          <p className="text-muted-foreground text-sm">
            {sent ? t("description_otp") : t("description_email")}
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {!sent && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email_label")}</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        disabled={isLoading}
                        placeholder={t("email_placeholder")}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <TranslatedFormMessage />
                  </FormItem>
                )}
              />
            )}

            {sent && (
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem
                    className="justify-center space-y-2 text-center"
                    dir="ltr"
                  >
                    <FormLabel aria-hidden className="sr-only justify-center">
                      {t("code_label")}
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        {...field}
                        className="mx-auto"
                        maxLength={6}
                        onChange={field.onChange}
                      >
                        {[...new Array(6)].map((_, index) => (
                          <InputOTPSlot
                            className="size-12 rounded-md border border-input"
                            index={index}
                            key={index}
                          />
                        ))}
                      </InputOTP>
                    </FormControl>
                    <TranslatedFormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              className="h-12 w-full"
              disabled={
                form.getValues().email === "" ||
                !!form.formState.errors.email ||
                isLoading
              }
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : sent ? (
                t("verify_code")
              ) : (
                t("send_code")
              )}
            </Button>
          </form>
        </Form>

        {sent && (
          <div className="mt-5 flex flex-col items-center space-y-2 p-6 pt-0">
            <p className="text-muted-foreground text-sm">{t("resend_text")}</p>
            <Button
              className="h-12 w-full"
              disabled={countdown > 0}
              onClick={() => {
                setSent(false);
                form.setValue("otp", "");
              }}
              type="button"
              variant="outline"
            >
              {countdown > 0
                ? t.raw("resend_timer").replace("{{seconds}}", `${countdown}`)
                : t("resend_button").replace("{{seconds}}", `${countdown}`)}
            </Button>
          </div>
        )}
      </div>

      <Link
        className={buttonVariants({ variant: "outline", className: "h-11!" })}
        href="/auth/email"
      >
        {t("using_email_and_password")}
      </Link>
      <div className="flex items-center gap-4">
        <Separator className="w-auto flex-1" />
        {t("or")}
        <Separator className="w-auto flex-1" />
      </div>

      <OAuth disable={isLoading} />
    </>
  );
}
