"use client";
import { Badge } from "@rentway/ui/components/badge";
import { Button } from "@rentway/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@rentway/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@rentway/ui/components/carousel";
import { Dialog, DialogContent } from "@rentway/ui/components/dialog";
import { cn } from "@rentway/ui/lib/utils";
import {
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  Shirt,
  X,
} from "lucide-react";
import Image from "next/image";
import React from "react";
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

interface GalleryProps {
  images: string[];
  className?: string;
}

export function GalleryGrid({
  images,
  onOpen,
}: {
  images: string[];
  onOpen: (index: number) => void;
}) {
  const first = images[0];
  const rest = images.slice(1, 5); // show 4 thumbs like screenshot
  const remaining = Math.max(0, images.length - 5);

  return (
    <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-7">
      {/* Big primary */}
      <button
        className="group relative overflow-hidden rounded-l-xl border bg-muted lg:col-span-4"
        onClick={() => onOpen(0)}
        type="button"
      >
        <div className="relative aspect-16/12 w-full">
          <Image
            alt="Car photo 1"
            className="h-full w-full object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            src={first ?? ""}
          />
        </div>
      </button>

      {/* Right grid */}
      <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-r-xl lg:col-span-3">
        {rest.map((src, i) => {
          const idx = i + 1;
          const isLastThumb = i === rest.length - 1;

          return (
            <button
              className="relative h-full w-full border"
              key={`${src}-${idx}`}
              onClick={() => onOpen(idx)}
              type="button"
            >
              <Image
                alt={`Car photo ${idx + 1}`}
                className="h-full w-full object-cover"
                fill
                sizes="(min-width: 1024px) 20vw, 50vw"
                src={src}
              />

              {remaining > 0 && isLastThumb && (
                <div className="absolute inset-0 flex items-end justify-end p-3">
                  <div className="rounded-full bg-black/70 px-3 py-1 font-medium text-sm text-white">
                    +{remaining} more
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FullscreenCarousel({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: string[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const total = images.length;

  const prev = React.useCallback(() => {
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  const next = React.useCallback(() => {
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowLeft") {
        prev();
      }
      if (e.key === "ArrowRight") {
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, onClose]);

  return (
    <div className="relative z-50 h-screen w-screen bg-black/80">
      {/* Top bar */}
      <div className="absolute top-4 right-7 z-10 flex items-center justify-between p-4">
        <Button
          className="p-5 text-white hover:bg-white/10 hover:text-white"
          onClick={onClose}
          size="icon"
          variant="ghost"
        >
          <X className="size-8" />
        </Button>
      </div>

      {/* Image */}
      <Image
        alt={`Car photo ${index + 1}`}
        className="object-contain"
        fill
        sizes="100vw"
        src={images[index] ?? ""}
      />
      <div className="absolute top-5 left-8 z-10 text-sm text-white/80">
        {index + 1} / {total}
      </div>
      {/* Controls */}
      <Button
        className="absolute top-1/2 left-5 -translate-y-1/2 p-5 text-white hover:bg-white/10 hover:text-white"
        onClick={prev}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft className="size-10" />
      </Button>

      <Button
        className="absolute top-1/2 right-7 -translate-y-1/2 p-5 text-white hover:bg-white/10 hover:text-white"
        onClick={next}
        size="icon"
        variant="ghost"
      >
        <ChevronRight className="size-10" />
      </Button>

      {/* Thumbnails */}
      <div className="absolute right-0 bottom-5 left-0 z-10 mx-auto w-fit rounded-lg border-white/10 border-t bg-black/40 p-3.5 px-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2">
          {images.map((src, i) => {
            const active = i === index;
            return (
              <button
                aria-current={active ? "true" : "false"}
                className={[
                  "relative h-14 w-20 flex-none overflow-auto rounded-lg border-2",
                  active ? "border-white" : "border-white/50 opacity-90",
                ].join(" ")}
                key={src}
                onClick={() => onIndexChange(i)}
                type="button"
              >
                <Image
                  alt={`Thumbnail ${i + 1}`}
                  className="object-cover"
                  fill
                  sizes="80px"
                  src={src}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DesktopGallery({ images, className }: GalleryProps) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleOpen = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  if (safeImages.length === 0) {
    return null;
  }

  return (
    <div className={cn("hidden md:block", className)}>
      <GalleryGrid images={safeImages} onOpen={handleOpen} />

      <Dialog onOpenChange={setOpen} open={open}>
        {/* fullscreen dialog */}
        <DialogContent className="left-0 w-screen max-w-none translate-x-0 border-0 bg-transparent p-0">
          <FullscreenCarousel
            images={safeImages}
            index={activeIndex}
            onClose={() => setOpen(false)}
            onIndexChange={setActiveIndex}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export interface MobileGalleryProps {
  images: string[];
  className?: string;
}

export function MobileGallery({ images, className }: MobileGalleryProps) {
  if (!images?.length) {
    return null;
  }

  return (
    <div className={cn("block md:hidden", className)}>
      <Carousel>
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={src}>
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  alt={`Car image ${i + 1}`}
                  className="object-cover"
                  fill
                  priority={i === 0}
                  sizes="50vw"
                  src={src}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows */}
        <CarouselPrevious className="left-2 bg-black/40 text-white hover:bg-black/60" />
        <CarouselNext className="right-2 bg-black/40 text-white hover:bg-black/60" />
      </Carousel>
    </div>
  );
}

export function CarHeroImages({ images }: { images: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {images.map((image) => (
        <Image
          alt="Car image"
          height={100}
          key={image}
          src={image}
          width={100}
        />
      ))}
    </div>
  );
}

export function CarHero({ car }: CarHeroProps) {
  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-4 lg:col-span-2">
        <DesktopGallery images={car.images ?? []} />
        <MobileGallery images={car.images ?? []} />

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
        <div className="grid gap-4 sm:grid-cols-1">
          {tiers.map((tier) => (
            <div
              className="flex items-center justify-between gap-1 rounded-lg border p-4"
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
