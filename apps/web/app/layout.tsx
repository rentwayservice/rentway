import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "@rentway/ui/globals.css";
import { DirectionProvider } from "@rentway/ui/components/direction";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rentway.app"),
  title: {
    default: "Rentway",
    template: "%s | Rentway",
  },
  description:
    "Rent cars from trusted providers with transparent pricing and availability.",
  openGraph: {
    type: "website",
    siteName: "Rentway",
    title: "Rentway",
    description:
      "Rent cars from trusted providers with transparent pricing and availability.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Rentway",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html dir={direction} lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <NextIntlClientProvider>
            <DirectionProvider direction={direction}>
              {children}
            </DirectionProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
