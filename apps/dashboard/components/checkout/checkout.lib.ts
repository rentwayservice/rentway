import dayjs from "dayjs";
import type { BookingOrder } from "./checkout.types";

export const ORDER_STORAGE_KEY = "rentway:checkout:order";
export const CHECKOUT_STORAGE_KEY = "rentway:checkout:payload";

export function safeParseJSON<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function formatMoney(currency: string, n: number) {
  const rounded = Math.round(n);
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(rounded);
  return `${currency} ${formatted}`;
}

export function formatDateRange(order: BookingOrder) {
  const from = dayjs(order.pickupDate);
  const to = dayjs(order.dropoffDate);
  return `${from.format("ddd, MMM D YYYY")} • ${order.pickupTime} → ${to.format("ddd, MMM D YYYY")} • ${order.dropoffTime}`;
}

export function computeBadge(order: BookingOrder) {
  const d = order.pricing.days;
  if (d >= 30) {
    return { label: "Monthly deal", tone: "bg-emerald-600" };
  }
  if (d >= 7) {
    return { label: "Weekly deal", tone: "bg-emerald-600" };
  }
  return { label: "Daily rate", tone: "bg-zinc-900" };
}

export function isBrowser() {
  return typeof window !== "undefined";
}
