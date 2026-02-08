import { Badge } from "@rentway/ui/components/badge";
import { Card, CardContent, CardHeader } from "@rentway/ui/components/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CarListing } from "@/components/home/home.constants";
import { formatPrice, formatPriceWithPeriod } from "@/lib/format-price";

interface ProductCardProps {
  car: CarListing & { slug?: string };
  locale: string;
}

export function ProductCard({ car, locale }: ProductCardProps) {
  const href = car.slug ? `/cars/${car.slug}` : `/cars/${car.id}`;
  return (
    <Link href={href}>
      <Card className="group gap-2.5 overflow-hidden rounded-none pt-0 ring-0">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
          <Image
            alt={`${car.make} ${car.model} ${car.year}`}
            className="object-cover duration-300 group-hover:scale-101"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={car.image}
          />
          {car.savings != null && (
            <Badge
              className="absolute end-2 top-2 border-0 bg-emerald-600 text-white"
              variant="secondary"
            >
              {locale === "ar" ? "وفر " : "Save "}
              {formatPrice(car.savings, locale)}
            </Badge>
          )}
        </div>
        <CardHeader className="px-2">
          <h3 className="font-semibold text-lg leading-4.5">
            {car.make} {car.model} {car.year}
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 px-2 pt-0">
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{car.rating}</span>
            <span>({car.tripCount} trips)</span>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold">
              {formatPriceWithPeriod(car.priceDaily, "day", locale)}
            </span>
            <span className="text-muted-foreground">
              {formatPriceWithPeriod(car.priceWeekly, "week", locale)}
            </span>
            <span className="text-muted-foreground">
              {formatPriceWithPeriod(car.priceMonthly, "month", locale)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
