// registration-form.chunks.tsx
"use client";

import { Logo } from "@zaher/ui/icons/logo";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function StepLayout({
  image,
  children,
}: {
  image: string;
  children: React.ReactNode;
}) {
  const t = useTranslations();
  return (
    <div className="w-full grid min-h-svh lg:grid-cols-2 grid-cols-1">
      <div className="md:py-12 pt-16 pb-10 h-full justify-between w-full flex flex-col items-stretch">
        <div className="mx-auto max-w-2xl w-full md:space-y-12 space-y-11">
          <div className="lg:gap-12 gap-16 text-center flex lg:flex-col flex-col-reverse">
            <Link className="w-full flex justify-center" href="/">
              <Logo className="lg:h-auto h-7 w-auto" />
            </Link>
          </div>
        </div>
        <div className="w-full mx-auto max-w-md flex-1 animate-in slide-in-from-bottom-10 duration-700 mt-11">
          {children}
        </div>
        <div className="text-center md:text-sm mt-6 md:mt-9 text-gray-400 text-xs border-t w-full py-5 space-y-2">
          <p>{t("register.edit_later")}</p>
          <p>
            {t("auth.have_account")}{" "}
            <Link className="underline font-medium" href="/auth">
              {t("auth.signin")}
            </Link>
          </p>
        </div>
      </div>
      <div className="bg-primary-100/50 lg:flex justify-center items-center px-10 hidden">
        <div className="relative rounded-[40px] w-full">
          <Image
            alt="Image"
            className="object-cover max-w-2xl w-full animate-in slide-in-from-bottom-10 duration-700"
            height={550}
            priority
            sizes="100%"
            src={image}
            width={813}
          />
        </div>
      </div>
    </div>
  );
}
