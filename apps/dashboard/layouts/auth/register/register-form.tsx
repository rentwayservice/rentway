"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@zaher/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  TranslatedFormMessage,
} from "@zaher/ui/components/form";
import { Input } from "@zaher/ui/components/input";
import { EmailIcon } from "@zaher/ui/icons/email-icon";
import { LockIcon } from "@zaher/ui/icons/lock-icon";
import { SlugIcon } from "@zaher/ui/icons/slug-icon";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "@/components/inputs/password-input";
import { PasswordInput2 } from "@/components/inputs/password-input-2";
import { signUpWithEmailAndPassword } from "./register.server";
import { StepLayout } from "./register-form.chunks";
import {
  type RegisterFormValues,
  registerFormSchema,
} from "./register-form.dto";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      const result = await signUpWithEmailAndPassword(values);
      const { error } = JSON.parse(result);

      if (error) {
        toast.error(t(`${error}` as any));
      } else {
        toast.success(t("register.success.email_confirmation"));
        router.push(`/auth/register/confirm?email=${values.email}`);
      }
    });
  };

  return (
    <div className="md:px-0 px-7 bg-white">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <StepLayout image="/step-2-placeholder.png">
            <div className="flex flex-col gap-4 h-full">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-input border rounded-xl flex items-center px-4 gap-2">
                        <SlugIcon className="shrink-0 " />
                        <Input
                          className="h-11 flex-1 border-0"
                          placeholder={t(
                            "register.personal.full_name.placeholder"
                          )}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs!">
                      {t("register.personal.privacy_note")}
                    </FormDescription>
                    <TranslatedFormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-input border rounded-xl flex items-center px-4 gap-2">
                        <EmailIcon className="shrink-0 stroke-gray-500" />
                        <Input
                          className="h-11 flex-1 border-0"
                          placeholder={t("register.account.email.placeholder")}
                          type="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <TranslatedFormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput2
                        className="bg-transparent border-0 p-0 flex-1"
                        field={field}
                        placeholder="**************"
                        // placeholder={t("register.account.password.placeholder")}
                      />
                    </FormControl>
                    <TranslatedFormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-input border rounded-xl flex items-center px-4 gap-2">
                        <LockIcon className="shrink-0 " />
                        <PasswordInput
                          className="bg-transparent border-0 p-0 flex-1"
                          field={field}
                          // placeholder={t("register.account.confirm_password.placeholder")}
                        />
                      </div>
                    </FormControl>
                    <TranslatedFormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 mt-auto flex justify-center gap-6">
                <Button
                  className="h-11 md:w-36 w-28 rounded-xl"
                  disabled={isPending}
                  type="submit"
                >
                  {t("register.submit")}
                  {isPending && <LoaderCircle className="animate-spin" />}
                </Button>
              </div>
            </div>
          </StepLayout>
        </form>
      </Form>
    </div>
  );
}
