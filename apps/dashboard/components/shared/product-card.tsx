import { Card, CardContent, CardHeader } from "@rentway/ui/components/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPriceWithPeriod } from "@/lib/format-price";
import type { CarWithDetails } from "../car/car.types";

interface ProductCardProps {
  car: CarWithDetails;
  locale: string;
}

export function ProductCard({ car, locale }: ProductCardProps) {
  console.log("car", car);
  return (
    <Link href={`/cars/${car.slug}`}>
      <Card className="group gap-2.5 overflow-hidden rounded-none pt-0 ring-0">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
          <Image
            alt={`${car.model.brand.name} ${car.model.name} ${car.year}`}
            className="object-cover duration-300 group-hover:scale-101"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={car.primaryImageUrl ?? ""}
          />
        </div>
        <CardHeader className="px-2">
          <h3 className="font-semibold text-lg leading-4.5">
            {car.model.brand.name} {car.model.name} {car.year}
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 px-2 pt-0">
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {car.stats.average_rating}
            </span>
            <span>({car.stats.total_bookings} trips)</span>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold">
              {formatPriceWithPeriod(car.dailyRate, "day", locale)}
            </span>
            {/* <span className="text-muted-foreground">
              {formatPriceWithPeriod(car.priceWeekly, "week", locale)}
            </span>
            <span className="text-muted-foreground">
              {formatPriceWithPeriod(car.priceMonthly, "month", locale)}
            </span> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
