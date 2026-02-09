"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@rentway/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@rentway/ui/components/card";
import { Checkbox } from "@rentway/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@rentway/ui/components/field";
import { Input } from "@rentway/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@rentway/ui/components/radio-group";
import { Separator } from "@rentway/ui/components/separator";
import { Textarea } from "@rentway/ui/components/textarea";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckoutSummary } from "./checkout.chunks";
import { type CheckoutFormValues, checkoutSchema } from "./checkout.dto";
import {
  CHECKOUT_STORAGE_KEY,
  isBrowser,
  ORDER_STORAGE_KEY,
  safeParseJSON,
} from "./checkout.lib";
// Optional server action (safe to remove if you don't want it)
import { createCheckout } from "./checkout.server";
import type { BookingOrder, CheckoutPayload } from "./checkout.types";

export default function CheckoutPage() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [order, setOrder] = React.useState<BookingOrder | null>(null);

  React.useEffect(() => {
    if (!isBrowser()) {
      return;
    }
    const parsed = safeParseJSON<BookingOrder>(
      sessionStorage.getItem(ORDER_STORAGE_KEY)
    );
    if (!parsed) {
      router.replace("/");
      return;
    }
    setOrder(parsed);
  }, [router]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: 19,
      licenseNumber: "",
      licenseExpiry: dayjs().add(1, "year").format("YYYY-MM-DD"),
      notes: "",
      paymentMethod: "cash_on_delivery",
      termsAccepted: true,
    },
  });

  function onSubmit(values: CheckoutFormValues) {
    if (!order) {
      return;
    }

    startTransition(async () => {
      const payload: CheckoutPayload = {
        order,
        customer: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
        },
        driver: {
          age: values.age,
          licenseNumber: values.licenseNumber,
          licenseExpiry: dayjs(values.licenseExpiry)
            .startOf("day")
            .toISOString(),
          notes: values.notes || undefined,
        },
        payment: {
          method: values.paymentMethod,
        },
        consent: {
          termsAccepted: values.termsAccepted,
        },
      };

      // Save locally for /checkout and /checkout/success usage
      try {
        sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // if storage fails, still try to continue
      }

      // Optional: call server action (creates a checkout intent / record)
      const result = await createCheckout(payload);

      if (!result.success) {
        // no sonner dependency: use native alert or you can swap to your own toast system
        toast.error(result.error ?? "Checkout failed. Please try again.");
        return;
      }

      router.push("/checkout/success");
    });
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="animate-pulse rounded-2xl border p-6">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="mt-3 h-4 w-72 rounded bg-muted" />
          <div className="mt-6 h-40 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">Checkout</div>
        <h1 className="font-semibold text-2xl tracking-tight">
          Confirm your booking
        </h1>
        <p className="text-muted-foreground text-sm">
          Pay the deposit now, and we’ll confirm your delivery details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Form */}
        <div className="lg:col-span-7">
          <Card className="overflow-hidden rounded-2xl">
            <CardHeader>
              <CardTitle>Guest & driver details</CardTitle>
              <CardDescription>
                This helps the provider verify eligibility and prepare delivery.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  {/* Customer */}
                  <div className="font-semibold text-sm">Contact</div>

                  <Controller
                    control={form.control}
                    name="fullName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="checkout-fullName">
                          Full name
                        </FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          id="checkout-fullName"
                          placeholder="Omar Rentway"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="checkout-email">
                            Email
                          </FieldLabel>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            autoComplete="email"
                            id="checkout-email"
                            placeholder="omar@rentway.com"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="phone"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="checkout-phone">
                            Phone
                          </FieldLabel>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            autoComplete="tel"
                            id="checkout-phone"
                            placeholder="+20 10 0000 0000"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <Separator className="my-2" />

                  {/* Driver */}
                  <div className="font-semibold text-sm">Driver</div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="age"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="checkout-age">Age</FieldLabel>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            id="checkout-age"
                            min={19}
                            type="number"
                          />
                          <FieldDescription>
                            Minimum age is 19.
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="licenseExpiry"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="checkout-licenseExpiry">
                            License expiry
                          </FieldLabel>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            id="checkout-licenseExpiry"
                            type="date"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    control={form.control}
                    name="licenseNumber"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="checkout-licenseNumber">
                          License number
                        </FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          id="checkout-licenseNumber"
                          placeholder="EG-1234567"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="notes"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="checkout-notes">
                          Notes for delivery (optional)
                        </FieldLabel>
                        <Textarea
                          {...field}
                          aria-invalid={fieldState.invalid}
                          id="checkout-notes"
                          placeholder="Gate number, landmarks, preferred delivery time window…"
                          rows={4}
                        />
                        <FieldDescription>Max 280 characters.</FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Separator className="my-2" />

                  {/* Payment */}
                  <div className="font-semibold text-sm">Payment</div>

                  <Controller
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Choose payment method</FieldLabel>
                        <RadioGroup
                          className="grid gap-3 md:grid-cols-2"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-muted/40">
                            <RadioGroupItem
                              className="mt-1"
                              value="cash_on_delivery"
                            />
                            <div>
                              <div className="font-medium text-sm">
                                Cash on delivery
                              </div>
                              <div className="text-muted-foreground text-xs">
                                Pay deposit now. Remaining handled upon delivery
                                (MVP).
                              </div>
                            </div>
                          </label>

                          <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-muted/40">
                            <RadioGroupItem className="mt-1" value="card" />
                            <div>
                              <div className="font-medium text-sm">
                                Card (coming soon)
                              </div>
                              <div className="text-muted-foreground text-xs">
                                We’ll enable online card payments next
                                iteration.
                              </div>
                            </div>
                          </label>
                        </RadioGroup>
                      </Field>
                    )}
                  />

                  {/* Terms */}
                  <Controller
                    control={form.control}
                    name="termsAccepted"
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        orientation="horizontal"
                      >
                        <div className="space-y-0.5">
                          <FieldLabel>I accept the terms</FieldLabel>
                          <FieldDescription>
                            By continuing, you agree to Rentway’s rental terms
                            and provider policies.
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </div>

                        <Checkbox
                          aria-invalid={fieldState.invalid}
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-3">
              <Button
                disabled={pending}
                onClick={() => router.back()}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button disabled={pending} form="checkout-form" type="submit">
                {pending ? "Processing…" : "Confirm & pay deposit"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-6">
            <CheckoutSummary order={order} />

            {/* Nice “trust” strip */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="font-semibold text-sm">What happens next?</div>
              <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
                <li>
                  • We notify the provider with your dates & delivery area.
                </li>
                <li>
                  • Provider confirms availability and delivery time window.
                </li>
                <li>• You’ll see the confirmation on the success screen.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
