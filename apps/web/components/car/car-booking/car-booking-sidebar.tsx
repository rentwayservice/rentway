// CarBookingSidebar/car-booking-sidebar.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import { Calendar } from "@/rentway/ui/components/calendar";
import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@rentway/ui/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@rentway/ui/components/select";
import { Separator } from "@rentway/ui/components/separator";
import { Switch } from "@rentway/ui/components/switch";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  calcTierPrices,
  clampToAvailability,
  computeRentalSubtotal,
  daysBetweenInclusive,
  money,
  TierCard,
} from "./car-booking-sidebar.chunks";
import { cairoAreas, timeOptions } from "./car-booking-sidebar.dto";
import type {
  BookingOrder,
  CarBookingSidebarProps,
} from "./car-booking-sidebar.types";

const formSchema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine((r) => !!r.from && !!r.to, { message: "Select rental dates." }),
  pickupTime: z.string().min(1, "Select pickup time."),
  dropoffTime: z.string().min(1, "Select drop-off time."),
  deliveryArea: z.string().min(1, "Select a delivery area."),
  samePlace: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function CarBookingSidebar({
  car,
  className,
}: CarBookingSidebarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const daily = Number(car.dailyRate ?? 0);
  const weekly = Number(car.weeklyRate ?? 0);
  const monthly = Number(car.monthlyRate ?? 0);

  const initialFrom = car.availableFrom
    ? dayjs(car.availableFrom).toDate()
    : undefined;
  const initialTo = car.availableFrom
    ? dayjs(car.availableFrom).add(7, "day").toDate()
    : undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: { from: initialFrom, to: initialTo },
      pickupTime: "10:00",
      dropoffTime: "10:00",
      deliveryArea: "New Cairo",
      samePlace: true,
    },
  });

  const dateRange = form.watch("dateRange");
  const pricing = useMemo(() => {
    const from = dateRange?.from;
    const to = dateRange?.to;
    if (!(from && to && daily && weekly && monthly)) {
      return {
        days: 0,
        rentalSubtotal: 0,
        depositFee: 0,
        totalPayableNow: 0,
        total: 0,
        breakdown: "",
      };
    }

    const days = daysBetweenInclusive(from, to);
    const { subtotal, breakdown } = computeRentalSubtotal({
      days,
      daily,
      weekly,
      monthly,
    });
    const depositFee = subtotal * 0.1;

    return {
      days,
      rentalSubtotal: subtotal,
      depositFee,
      totalPayableNow: depositFee,
      total: subtotal + depositFee,
      breakdown,
    };
  }, [dateRange?.from, dateRange?.to, daily, weekly, monthly]);

  const tiers = useMemo(
    () => calcTierPrices({ daily, weekly, monthly }),
    [daily, weekly, monthly]
  );

  const activeTier = useMemo(() => {
    const d = pricing.days;
    if (!d) {
      return "day";
    }
    if (d >= 30) {
      return "month";
    }
    if (d >= 7) {
      return "week";
    }
    return "day";
  }, [pricing.days]);

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const from = values.dateRange.from!;
      const to = values.dateRange.to!;

      const availCheck = clampToAvailability({
        from,
        to,
        availableFrom: car.availableFrom,
        availableUntil: car.availableUntil,
      });

      if (!availCheck.ok) {
        toast.error(availCheck.message);
        return;
      }

      const title =
        `${car.model?.brand?.name ?? "Car"} ${car.model?.name ?? ""} ${car.year}`.trim();

      const order: BookingOrder = {
        carId: car.id,
        carSlug: car.slug,
        providerId: car.providerId,
        modelId: car.modelId,
        title,
        currency: car.currency,

        pickupDate: dayjs(from).startOf("day").toISOString(),
        dropoffDate: dayjs(to).startOf("day").toISOString(),
        pickupTime: values.pickupTime,
        dropoffTime: values.dropoffTime,
        deliveryArea: values.deliveryArea,
        samePlace: values.samePlace,

        pricing: {
          days: pricing.days,
          dailyRate: daily,
          weeklyRate: weekly,
          monthlyRate: monthly,
          rentalSubtotal: pricing.rentalSubtotal,
          depositFee: pricing.depositFee,
          totalPayableNow: pricing.totalPayableNow,
          total: pricing.total,
          breakdown: pricing.breakdown,
        },
      };

      try {
        sessionStorage.setItem("rentway:checkout:order", JSON.stringify(order));
        router.push("/checkout");
      } catch {
        toast.error("Could not save booking. Please try again.");
      }
    });
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Book this car</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing tiers */}
        <div className="grid grid-cols-3 gap-2">
          <TierCard
            active={activeTier === "day"}
            currency={car.currency}
            labelTop="1 Day+"
            price={tiers.day}
          />
          <TierCard
            active={activeTier === "week"}
            badge="SAVE"
            currency={car.currency}
            labelTop="7 Days+"
            price={tiers.week}
          />
          <TierCard
            active={activeTier === "month"}
            badge="SAVE"
            currency={car.currency}
            labelTop="30 Days+"
            price={tiers.month}
          />
        </div>

        <Separator />

        <form id="car-booking-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Date range */}
            <Controller
              control={form.control}
              name="dateRange"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Choose rental dates</FieldLabel>

                  <Calendar
                    defaultMonth={
                      field.value?.from ??
                      (car.availableFrom
                        ? dayjs(car.availableFrom).toDate()
                        : undefined)
                    }
                    fromDate={
                      car.availableFrom
                        ? dayjs(car.availableFrom).toDate()
                        : undefined
                    }
                    mode="range"
                    numberOfMonths={1}
                    onSelect={(range) => field.onChange(range)}
                    selected={field.value}
                    toDate={
                      car.availableUntil
                        ? dayjs(car.availableUntil).toDate()
                        : undefined
                    }
                  />

                  <FieldDescription>
                    Select pickup and drop-off dates within availability.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Delivery area */}
            <Controller
              control={form.control}
              name="deliveryArea"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Where would you like your car delivered?
                  </FieldLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {cairoAreas.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Same place switch */}
            <Controller
              control={form.control}
              name="samePlace"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <div className="space-y-0.5">
                    <FieldLabel>Same place</FieldLabel>
                    <FieldDescription>
                      Pickup & drop-off at the same area
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />

            {/* Times */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={form.control}
                name="pickupTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Select pickup time</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Pickup time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="dropoffTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Select drop-off time</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Drop-off time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <FieldDescription>
              Delivery time is up to 3 hours depending on traffic conditions.
            </FieldDescription>
          </FieldGroup>
        </form>

        <Separator />

        {/* Price details */}
        <div className="space-y-2">
          <div className="font-semibold text-sm">Price details</div>

          <div className="space-y-2 rounded-xl border p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Rental ({pricing.days || 0} day(s))
              </span>
              <span className="font-medium">
                {car.currency} {money(pricing.rentalSubtotal)}
              </span>
            </div>

            {pricing.breakdown ? (
              <div className="text-muted-foreground text-xs">
                {pricing.breakdown}
              </div>
            ) : null}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Deposit fee (10%)</span>
              <span className="font-medium">
                {car.currency} {money(pricing.depositFee)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Pay now</span>
              <span className="font-semibold text-base">
                {car.currency} {money(pricing.totalPayableNow)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Total (rental + deposit)
              </span>
              <span className="text-muted-foreground text-xs">
                {car.currency} {money(pricing.total)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button
            disabled={pending}
            onClick={() => form.reset()}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
          <Button disabled={pending} form="car-booking-form" type="submit">
            {pending ? "Continuing..." : "Continue to checkout"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
