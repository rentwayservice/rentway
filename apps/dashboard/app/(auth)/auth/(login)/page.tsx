import Link from "next/link";
import { useTranslations } from "next-intl";
import { SigninOtp } from "@/layouts/auth";

export default function Page() {
  const t = useTranslations("EmailLoginPage");
  return (
    <>
      <SigninOtp />
      <div className="mt-0 text-center text-sm">
        {t("no_account")}{" "}
        <Link className="underline" href="/auth/register">
          {t("register")}
        </Link>
      </div>
    </>
  );
}
0;
