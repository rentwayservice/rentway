import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "@rentway/ui/globals.css";
import { DirectionProvider } from "@rentway/ui/components/direction";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
