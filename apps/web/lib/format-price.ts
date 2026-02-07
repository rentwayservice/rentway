/**
 * Formats a price amount with currency based on locale.
 * EGP for English (en), ج.م for Arabic (ar).
 */
export function formatPrice(amount: number, locale: string): string {
  const formattedAmount = new Intl.NumberFormat(locale).format(amount);
  return locale === "ar" ? `${formattedAmount} ج.م` : `£${formattedAmount}`;
}

export type PricePeriod = "day" | "week" | "month";

const PERIOD_LABELS: Record<string, Record<PricePeriod, string>> = {
  en: { day: "day", week: "week", month: "month" },
  ar: { day: "يوم", week: "أسبوع", month: "شهر" },
};

/**
 * Formats a price with period (e.g. EGP200/day or 200 ج.م/يوم).
 */
export function formatPriceWithPeriod(
  amount: number,
  period: PricePeriod,
  locale: string
): string {
  const price = formatPrice(amount, locale);
  const label =
    PERIOD_LABELS[locale]?.[period] ?? PERIOD_LABELS.en?.[period] ?? period;
  return `${price}/${label}`;
}
