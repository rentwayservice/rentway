"use client";
import { MAIN_SITE_URL } from "@rentway/libs";
import { Button } from "@rentway/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SigninEmail, SigninOtp } from "./login";

export function AuthTabs() {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-2 rounded-md border border-primary">
      <Link
        className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-sm bg-transparent px-3 py-3 font-medium text-primary text-xs transition-all md:text-sm"
        href={`${MAIN_SITE_URL}/auth`}
      >
        <Image
          alt="vendor icon"
          className="filter-primary h-6 w-6"
          height={24}
          src="/icons/signin-user-icon.svg"
          width={24}
        />
        {t("auth.signin_as_customer")} {/* Translated text */}
      </Link>
      <div className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-sm bg-primary px-3 py-3 font-medium text-white text-xs transition-all md:text-sm">
        <Image
          alt="vendor icon"
          className="filter-white h-6 w-6"
          height={24}
          src="/icons/signin-vendor-icon.svg"
          width={24}
        />
        {t("auth.signin_as_vendor")} {/* Translated text */}
      </div>
    </div>
  );
}

export function AuthForm() {
  const [activeForm, setActiveForm] = useState<"email" | "magic">("magic");
  const t = useTranslations();

  return (
    <>
      {activeForm === "email" ? <SigninEmail /> : <SigninOtp />}

      <Button
        className="!h-11"
        onClick={() => setActiveForm("email")}
        variant="outline"
      >
        {activeForm === "email"
          ? t("EmailLoginPage.using_otp")
          : t("otp.using_email_and_password")}
      </Button>
    </>
  );
}
