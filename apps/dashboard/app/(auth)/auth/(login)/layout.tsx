import Image from "next/image";
import Link from "next/link";
import { MAIN_SITE_URL } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:min-h-svh lg:grid-cols-2 xl:h-full py-12 lg:px-12">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[640px] gap-6 px-8">
          <div className="grid gap-2 text-center">
            <Link href={MAIN_SITE_URL}>
              <Image
                alt="logo"
                className="w-44 h-12 mx-auto"
                height={50}
                src="/logo.svg"
                width={180}
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:block rounded-[40px]">
        <div className="relative w-full h-full rounded-[40px]">
          <Image
            alt="Image"
            className="object-cover rounded-[40px] dark:brightness-[0.2] dark:grayscale"
            fill
            priority
            sizes="100%"
            src="/auth-placeholder.svg"
          />
        </div>
      </div>
    </div>
  );
}
