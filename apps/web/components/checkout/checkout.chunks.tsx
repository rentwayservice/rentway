"use client";

import { Badge } from "@rentway/ui/components/badge";
import { Separator } from "@rentway/ui/components/separator";
import { computeBadge, formatDateRange, formatMoney } from "./checkout.lib";
import type { BookingOrder } from "./checkout.types";

export function CheckoutSummary({ order }: { order: BookingOrder }) {
  const badge = computeBadge(order);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-muted-foreground text-sm">Your booking</div>
            <div className="mt-1 font-semibold text-lg">{order.title}</div>
            <div className="mt-2 text-muted-foreground text-sm">
              {formatDateRange(order)}
            </div>
          </div>

          <Badge className={`${badge.tone} text-white hover:${badge.tone}`}>
            {badge.label}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 text-sm">
          <Row label="Delivery area" value={order.deliveryArea} />
          <Row label="Rental days" value={`${order.pricing.days} day(s)`} />
          <Row label="Pricing rule" value={order.pricing.breakdown || "—"} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="font-semibold text-sm">Price details</div>

        <div className="mt-4 space-y-3 text-sm">
          <Row
            label={"Rental subtotal"}
            value={formatMoney(order.currency, order.pricing.rentalSubtotal)}
          />
          <Row
            label={"Deposit fee (10%)"}
            value={formatMoney(order.currency, order.pricing.depositFee)}
          />

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">Pay now</div>
              <div className="text-muted-foreground text-xs">
                Deposit only (MVP)
              </div>
            </div>
            <div className="font-semibold text-base">
              {formatMoney(order.currency, order.pricing.totalPayableNow)}
            </div>
          </div>

          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total (rental + deposit)</span>
            <span>{formatMoney(order.currency, order.pricing.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-muted/40 p-4 text-muted-foreground text-xs">
        Tip: You can review and update your pickup/drop-off dates back on the
        car page.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-muted-foreground">{label}</div>
      <div className="text-right font-medium text-foreground">{value}</div>
    </div>
  );
}
