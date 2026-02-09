import type { Metadata } from "next";
import { listBrands } from "@/actions/brands";
import { listBodyTypes } from "@/actions/body-types";
import { listCars } from "@/actions/cars";
import { listProviders } from "@/actions/providers";
import { CarCard } from "@/components/car-card/car-card";
import { SearchFilters } from "@/components/search-filters/search-filters";
import { Pagination } from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "Search",
  description: "Search rental cars by provider, brand, and availability.",
  openGraph: {
    title: "Search cars",
    description: "Search rental cars by provider, brand, and availability.",
  },
};

type SearchParams = {
  providerId?: string;
  brandId?: string;
  bodyTypeId?: string;
  minPrice?: string;
  maxPrice?: string;
  availableFrom?: string;
  availableUntil?: string;
  page?: string;
};

const toNumber = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const page = searchParams?.page
    ? Number.parseInt(searchParams.page, 10)
    : 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  const [providersResult, brandsResult, bodyTypesResult, carsResult] =
    await Promise.all([
      listProviders(),
      listBrands(),
      listBodyTypes(),
      listCars({
        providerId: searchParams?.providerId,
        brandId: searchParams?.brandId,
        bodyTypeId: searchParams?.bodyTypeId,
        minPrice: toNumber(searchParams?.minPrice),
        maxPrice: toNumber(searchParams?.maxPrice),
        availableFrom: searchParams?.availableFrom,
        availableUntil: searchParams?.availableUntil,
        limit,
        offset,
      }),
    ]);

  const providers = providersResult.success ? providersResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];
  const bodyTypes = bodyTypesResult.success ? bodyTypesResult.data : [];
  const cars = carsResult.success ? carsResult.data.items : [];
  const total = carsResult.success ? carsResult.data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="space-y-8 pb-16">
      <SearchFilters
        providers={providers}
        brands={brands}
        bodyTypes={bodyTypes}
      />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((item) => (
          <CarCard
            key={item.car.id}
            title={`${item.brand.name} ${item.model.name}`}
            subtitle={item.provider.name}
            price={item.car.dailyRate?.toString() ?? ""}
            href={`/cars/${item.car.slug}`}
            imageUrl={item.car.primaryImageUrl ?? undefined}
          />
        ))}
      </section>
      <Pagination
        basePath="/search"
        currentPage={page}
        totalPages={totalPages}
        searchParams={{
          providerId: searchParams?.providerId ?? "",
          brandId: searchParams?.brandId ?? "",
          bodyTypeId: searchParams?.bodyTypeId ?? "",
          minPrice: searchParams?.minPrice ?? "",
          maxPrice: searchParams?.maxPrice ?? "",
          availableFrom: searchParams?.availableFrom ?? "",
          availableUntil: searchParams?.availableUntil ?? "",
        }}
      />
    </main>
  );
}
