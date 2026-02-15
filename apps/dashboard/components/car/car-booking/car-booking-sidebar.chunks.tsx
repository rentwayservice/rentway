"use client";

import { cn } from "@rentway/ui/lib/utils";
import dayjs from "dayjs";

export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function daysBetweenInclusive(from: Date, to: Date) {
  // Rental days: if from=12th and to=19th => 7 days
  const start = dayjs(from).startOf("day");
  const end = dayjs(to).startOf("day");
  const diff = end.diff(start, "day");
  return Math.max(1, diff); // treat as nights-like; user spec implies 7 days for 12->19
}

export function clampToAvailability({
  from,
  to,
  availableFrom,
  availableUntil,
}: {
  from: Date;
  to: Date;
  availableFrom?: string | null;
  availableUntil?: string | null;
}) {
  const af = availableFrom ? dayjs(availableFrom).startOf("day") : null;
  const au = availableUntil ? dayjs(availableUntil).startOf("day") : null;

  const f = dayjs(from).startOf("day");
  const t = dayjs(to).startOf("day");

  if (af && f.isBefore(af)) {
    return { ok: false, message: "Pickup date is before availability." };
  }
  if (au && t.isAfter(au)) {
    return { ok: false, message: "Drop-off date is after availability." };
  }
  if (!t.isAfter(f)) {
    return { ok: false, message: "Drop-off must be after pickup." };
  }
  return { ok: true as const };
}

/**
 * Pricing rules (as requested):
 * - < 7 days: days * daily
 * - exactly 7 days: weekly
 * - >7 and <14: weekly + (days-7)*daily
 * - 14 or 21 days: weeks * weekly
 * - month (>= 30): monthly (simple MVP)
 */
export function computeRentalSubtotal({
  days,
  daily,
  weekly,
  monthly,
}: {
  days: number;
  daily: number;
  weekly: number;
  monthly: number;
}) {
  // Month rule (MVP): if 30+ days use monthly blocks + remainder by daily
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const rem = days % 30;
    const subtotal = months * monthly + rem * daily;
    return {
      subtotal,
      breakdown: `${months} month(s) × ${money(monthly/30)} + ${rem} day(s) × ${money(daily)}`,
    };
  }

  if (days < 7) {
    const subtotal = days * daily;
    return { subtotal, breakdown: `${days} day(s) × ${money(daily)}` };
  }

  if (days === 7) {
    return {
      breakdown: `7 days (weekly) × ${money(weekly/7)}`,
      subtotal: weekly,
    };
  }

  if (days > 7 && days < 14) {
    const extraDays = days - 7;
    const subtotal = weekly + extraDays * daily;
    return {
      subtotal,
      breakdown: `1 week × ${money(weekly/7)} + ${extraDays} day(s) × ${money(daily)}`,
    };
  }

  // 14-29 days: count full weeks, remainder by daily (keeps your "two or three weeks = weeks * weekly")
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  const subtotal = weeks * weekly + rem * daily;
  return {
    subtotal,
    breakdown: `${weeks} week(s) × ${money(weekly/7)} + ${rem} day(s) × ${money(daily)}`,
  };
}

export function calcTierPrices({
  daily,
  weekly,
  monthly,
}: {
  daily: number;
  weekly: number;
  monthly: number;
}) {
  return {
    day: daily,
    week: weekly / 7,
    month: monthly / 30,
  };
}

export function TierCard({
  labelTop,
  price,
  currency,
  active,
  badge,
}: {
  labelTop: string;
  price: number;
  currency: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border p-3 text-center",
        active ? "border-green-600 ring-1 ring-green-600" : "border-border"
      )}
    >
      {badge ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-2 py-0.5 font-semibold text-[10px] text-white">
          {badge}
        </div>
      ) : null}
      <div className="text-muted-foreground text-xs">{labelTop}</div>
      <div className="mt-1 font-semibold text-lg">
        {currency} {money(price)}
      </div>
      <div className="text-muted-foreground text-xs">/day</div>
    </div>
  );
}
