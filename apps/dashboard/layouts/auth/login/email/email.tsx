"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@zaher/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TranslatedFormMessage,
} from "@zaher/ui/components/form";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { FormInput } from "@/components/inputs/form-input";
import { PasswordInput } from "@/components/inputs/password-input";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabase/client";
import { OAuth } from "../../oauth";
import { type SigninEmailValues, signinEmailSchema } from "./email.dto";
import { checkProfileAction } from "./email.server";

export function SigninEmail() {
  const t = useTranslations("EmailLoginPage");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SigninEmailValues>({
    resolver: zodResolver(signinEmailSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resendVerificationEmail = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.getValues("email"),
    });

    if (!error) {
      Swal.fire({
        title: t("resendEmailTitle"),
        text: t("resendEmailSuccess"),
        icon: "success",
      });
      return;
    }

    Swal.fire({
      title: t("resendWaitTitle"),
      text: t("resendError"),
      icon: "error",
    });
  };

  const onSubmit = (values: SigninEmailValues) => {
    startTransition(async () => {
      try {
        const result = await checkProfileAction(values);
        const { success } = result;

        if (!success) {
          toast.error(result.error || "حدث خطأ ما, برجاء المحاولة مرة اخرى");
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          let errorMessage = "حدث خطأ ما!";
          let errorType: string | undefined;

          switch (error.message) {
            case "Invalid login credentials":
              errorType = "invalid_credentials";
              errorMessage =
                "بيانات خاطئة برجاء مراجعة البيانات وإعادة المحاولة!";
              break;
            case "Email not confirmed":
              errorType = "unconfirmed_email";
              errorMessage = "برجاء تأكيد عنوان البريد الإلكتروني الخاص بك!";
              break;
          }

          Swal.fire({
            title: t("error"),
            text: errorMessage,
            icon: "error",
            confirmButtonText:
              errorType === "unconfirmed_email"
                ? t("resendConfirmEmail")
                : t("ok"),
          }).then((swalResult) => {
            if (swalResult.isConfirmed && errorType === "unconfirmed_email") {
              resendVerificationEmail();
            }
          });
          return;
        }

        router.push("/");
      } catch (_) {}
    });
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            disabled={isPending}
            form={form}
            label={t("email")}
            name="email"
            placeholder={t("emailPlaceholder")}
            type="email"
          />
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <PasswordInput field={field} isPending={isPending} />
                  </FormControl>
                  <TranslatedFormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link
                className="text-sm text-foreground underline"
                href={"/auth/forgot-password"}
              >
                {t("forgotPassword")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full flex gap-2 h-11"
              disabled={isPending}
              type="submit"
            >
              {t("signIn")}
              <LoaderCircle
                className={cn(" animate-spin", { hidden: !isPending })}
              />
            </Button>
            <Button
              asChild
              className="w-full flex gap-2 h-11"
              type="button"
              variant={"outline"}
            >
              <Link href="/auth">{t("using_otp")}</Link>
            </Button>
          </div>
        </form>
      </Form>
      <OAuth disable={isPending} />
    </>
  );
}
