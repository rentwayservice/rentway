import { Badge } from "@rentway/ui/components/badge";
import { Button } from "@rentway/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@rentway/ui/components/card";
import { CalendarDays, Car, Check, Fuel, Gauge, Shirt } from "lucide-react";
import Image from "next/image";
import { formatPriceWithCurrency } from "@/lib/format-price";
import {
  CAR_PAGE_LABELS,
  FUEL_TYPE_LABELS,
  INCLUDED_BENEFITS,
  TRANSMISSION_LABELS,
} from "./car.constants";
import type { CarWithDetails } from "./car.types";

interface CarHeroProps {
  car: CarWithDetails;
  locale: string;
}

export function CarHero({ car, locale }: CarHeroProps) {
  const carName = car.model?.brand
    ? `${car.model.brand.name} ${car.model.name}`
    : (car.model?.name ?? "Car");
  const title = `Rent ${carName} ${car.year}`;
  const imageUrl =
    car.primaryImageUrl ??
    (Array.isArray(car.images) && car.images.length > 0
      ? String((car.images as string[])[0])
      : "/audi.jpeg");

  const dailyRate = car.dailyRate ? Number(car.dailyRate) : 0;
  const currency = car.currency ?? "EGP";

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <Image
              alt={title}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              src={imageUrl}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1" variant="secondary">
              <Check className="size-3" />
              {CAR_PAGE_LABELS.noDeposit}
            </Badge>
            <Badge className="gap-1" variant="secondary">
              <Check className="size-3" />
              {CAR_PAGE_LABELS.freeDelivery}
            </Badge>
            <Badge className="gap-1" variant="secondary">
              <Check className="size-3" />
              {CAR_PAGE_LABELS.minDays}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl">{title}</h1>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                From {formatPriceWithCurrency(dailyRate, currency, locale)}
              </CardDescription>
              <CardTitle className="font-bold text-2xl">
                {formatPriceWithCurrency(dailyRate, currency, locale)}{" "}
                <span className="font-normal text-base text-muted-foreground">
                  {CAR_PAGE_LABELS.perDay}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                {CAR_PAGE_LABELS.bookNow}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

interface CarPricingTiersProps {
  car: CarWithDetails;
  locale: string;
}

export function CarPricingTiers({ car, locale }: CarPricingTiersProps) {
  const dailyRate = car.dailyRate ? Number(car.dailyRate) : 0;
  const weeklyRate = car.weeklyRate ? Number(car.weeklyRate) : 0;
  const monthlyRate = car.monthlyRate ? Number(car.monthlyRate) : 0;
  const currency = car.currency ?? "EGP";

  const tiers = [
    {
      days: "1 Day+",
      price: dailyRate,
      perPeriod: "day",
      savings: null as number | null,
    },
    {
      days: "7 Days+",
      price: weeklyRate / 7,
      perPeriod: "day",
      savings:
        dailyRate > 0 ? Math.round((1 - weeklyRate / 7 / dailyRate) * 100) : 0,
    },
    {
      days: "30 Days+",
      price: monthlyRate / 30,
      perPeriod: "day",
      savings:
        dailyRate > 0
          ? Math.round((1 - monthlyRate / 30 / dailyRate) * 100)
          : 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{CAR_PAGE_LABELS.rentalDurationPricing}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              className="flex flex-col gap-1 rounded-lg border p-4"
              key={tier.days}
            >
              <span className="text-muted-foreground text-sm">{tier.days}</span>
              <span className="font-semibold">
                {formatPriceWithCurrency(tier.price, currency, locale)}
              </span>
              <span className="text-muted-foreground text-sm">
                / {tier.perPeriod}
              </span>
              {tier.savings != null && tier.savings > 0 && (
                <Badge className="mt-1 w-fit" variant="secondary">
                  Save {tier.savings}%
                </Badge>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span>{CAR_PAGE_LABELS.day}</span>
            <span>{formatPriceWithCurrency(dailyRate, currency, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{CAR_PAGE_LABELS.week}</span>
            <span>{formatPriceWithCurrency(weeklyRate, currency, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{CAR_PAGE_LABELS.month}</span>
            <span>
              {formatPriceWithCurrency(monthlyRate, currency, locale)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CarSpecificationsProps {
  car: CarWithDetails;
}

export function CarSpecifications({ car }: CarSpecificationsProps) {
  const model = car.model;
  const fuelLabel = model?.fuelType
    ? (FUEL_TYPE_LABELS[model.fuelType] ?? model.fuelType)
    : null;
  const transmissionLabel = model?.transmissionType
    ? (TRANSMISSION_LABELS[model.transmissionType] ?? model.transmissionType)
    : null;

  const specs = [
    { label: CAR_PAGE_LABELS.year, value: car.year, icon: CalendarDays },
    { label: CAR_PAGE_LABELS.color, value: car.color ?? "-", icon: Shirt },
    {
      label: CAR_PAGE_LABELS.luggage,
      value: model?.largeBags
        ? `${model.largeBags + (model.smallBags ?? 0)} bags`
        : "-",
      icon: Car,
    },
    { label: CAR_PAGE_LABELS.doors, value: model?.doors ?? "-", icon: Car },
    {
      label: CAR_PAGE_LABELS.horsepower,
      value: model?.horsepower ?? "-",
      icon: Gauge,
    },
    { label: CAR_PAGE_LABELS.fuelType, value: fuelLabel ?? "-", icon: Fuel },
    { label: CAR_PAGE_LABELS.seats, value: model?.seats ?? "-", icon: Car },
    {
      label: CAR_PAGE_LABELS.engine,
      value: model?.engineSizeCc ? `${model.engineSizeCc} cc` : "-",
      icon: Gauge,
    },
    {
      label: CAR_PAGE_LABELS.transmission,
      value: transmissionLabel ?? "-",
      icon: Gauge,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{CAR_PAGE_LABELS.carSpecifications}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map(({ label, value, icon: Icon }) => (
            <div
              className="flex items-center gap-3 rounded-lg border p-3"
              key={label}
            >
              <Icon className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="font-medium">{String(value)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CarConditionsProps {
  car: CarWithDetails;
}

export function CarConditions({ car: _car }: CarConditionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{CAR_PAGE_LABELS.conditions}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">
              {CAR_PAGE_LABELS.minimumAge}
            </span>
            <span className="font-medium">19</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">
              {CAR_PAGE_LABELS.minimumDays}
            </span>
            <span className="font-medium">1</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">
              {CAR_PAGE_LABELS.requiredDocuments}
            </span>
            <span className="font-medium">{CAR_PAGE_LABELS.seeTheList}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CarIncludedBenefits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{CAR_PAGE_LABELS.includedWithBooking}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {INCLUDED_BENEFITS.map(({ title, description }) => (
            <li className="flex gap-3" key={title}>
              <Check className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface CarMileageProps {
  car: CarWithDetails;
}

export function CarMileage({ car }: CarMileageProps) {
  const dailyLimit = car.dailyMileageLimit ?? 250;
  const extraRate = car.extraMileageRate ? Number(car.extraMileageRate) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="size-5" />
          {CAR_PAGE_LABELS.mileage}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-sm">
              {dailyLimit} {CAR_PAGE_LABELS.perDayMileage}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">
              {dailyLimit * 7} {CAR_PAGE_LABELS.perWeekMileage}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">
              {dailyLimit * 30} {CAR_PAGE_LABELS.perMonthMileage}
            </p>
          </div>
        </div>
        {extraRate > 0 && (
          <p className="mt-2 text-muted-foreground text-sm">
            {CAR_PAGE_LABELS.extraMileageFee} {car.currency ?? "EGP"}{" "}
            {extraRate} / Km
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface CarDescriptionProps {
  car: CarWithDetails;
  carName: string;
}

export function CarDescription({ car, carName }: CarDescriptionProps) {
  const description =
    car.description ??
    `Rent the ${carName} ${car.year} and enjoy a smooth blend of style, comfort, and performance. This model offers seating for ${car.model?.seats ?? 5} passengers, with a ${car.model?.fuelType ?? "petrol"} engine${car.model?.horsepower ? ` that delivers up to ${car.model.horsepower} HP` : ""}. Finished in ${car.color ?? "various colors"}, featuring ${car.model?.doors ?? 4} doors and luggage space ideal for everyday needs.`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{CAR_PAGE_LABELS.description}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

interface CarFeaturesProps {
  carFeatures?: { feature: { id: string; name: string } }[];
}

export function CarFeatures({ carFeatures = [] }: CarFeaturesProps) {
  const features = carFeatures.map((cf) => cf.feature);
  if (features.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{CAR_PAGE_LABELS.carFeatures}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <Badge key={f.id} variant="outline">
              {f.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
