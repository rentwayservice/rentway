import { getLocale } from "next-intl/server";
import { getCarsCount, getCarsWithDetails } from "@/actions/cars";
import type { CarWithDetails } from "@/components/car/car.types";
import { Pagination } from "@/components/shared/pagination";
import { ProductCard } from "@/components/shared/product-card";

const DEFAULT_PAGE_SIZE = 12;

interface CarsPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(
      1,
      Number.parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) ||
        DEFAULT_PAGE_SIZE
    )
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
  console.log("cars", cars);
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-bold text-2xl md:text-3xl">Browse cars</h1>
        <p className="mt-1 text-muted-foreground">
          {total} car{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cars.map((car) => (
          <ProductCard
            car={car as CarWithDetails}
            key={car.id}
            locale={locale}
          />
        ))}
      </div>

      {cars.length === 0 && (
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
