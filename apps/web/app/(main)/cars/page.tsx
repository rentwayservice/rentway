import { getCarsCount, getCarsWithDetails } from "@/actions/cars";
import { Pagination } from "@/components/shared/pagination";
import { ProductCard } from "@/components/shared/product-card";
import type { CarListing } from "@/components/home/home.constants";
import { getLocale } from "next-intl/server";

const DEFAULT_PAGE_SIZE = 12;

interface CarsPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

function mapCarToListing(
  car: Awaited<ReturnType<typeof getCarsWithDetails>>[number]
): CarListing & { slug: string } {
  const make = car.model?.brand?.name ?? "";
  const model = car.model?.name ?? "";
  const image =
    car.primaryImageUrl ??
    (Array.isArray(car.images) && car.images.length > 0
      ? String((car.images as string[])[0])
      : "/audi.jpeg");
  const stats = (car.stats ?? {}) as {
    average_rating?: number;
    total_bookings?: number;
  };
  const rating = stats.average_rating ?? 0;
  const tripCount = stats.total_bookings ?? 0;
  const priceDaily = car.dailyRate ? Number(car.dailyRate) : 0;
  const priceWeekly = car.weeklyRate ? Number(car.weeklyRate) : 0;
  const priceMonthly = car.monthlyRate ? Number(car.monthlyRate) : 0;
  const savings =
    priceDaily > 0 && priceWeekly > 0
      ? Math.round((1 - priceWeekly / 7 / priceDaily) * 100)
      : undefined;

  return {
    id: car.id,
    slug: car.slug,
    make,
    model,
    year: car.year,
    image,
    rating,
    tripCount,
    priceDaily,
    priceWeekly,
    priceMonthly,
    savings,
    location: "",
  };
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, Number.parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const offset = (page - 1) * pageSize;

  const [cars, total] = await Promise.all([
    getCarsWithDetails({
      limit: pageSize,
      offset,
      approvalStatus: "approved",
      status: "active",
    }),
    getCarsCount({ approvalStatus: "approved", status: "active" }),
  ]);

  const locale = await getLocale();
  const totalPages = Math.ceil(total / pageSize);
  const listings = cars.map(mapCarToListing);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-bold text-2xl md:text-3xl">Browse cars</h1>
        <p className="mt-1 text-muted-foreground">
          {total} car{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((car) => (
          <ProductCard car={car} key={car.id} locale={locale} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">No cars available yet.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            basePath="/cars"
            currentPage={page}
            searchParams={
              pageSize !== DEFAULT_PAGE_SIZE
                ? { pageSize: String(pageSize) }
                : undefined
            }
            totalPages={totalPages}
          />
        </div>
      )}
    </main>
  );
}
