import { CarCard } from "@/components/car-card/car-card";
import type { FeaturedCarsProps } from "./featured-cars.types";

export const FeaturedCars = ({ cars, className }: FeaturedCarsProps) => {
  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured cars</h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cars.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            No featured cars are available yet.
          </div>
        ) : (
          cars.map((item) => (
            <CarCard
              key={item.car.id}
              title={`${item.brand.name} ${item.model.name}`}
              subtitle={item.provider.name}
              price={item.car.dailyRate?.toString() ?? ""}
              href={`/cars/${item.car.slug}`}
              imageUrl={item.car.primaryImageUrl ?? undefined}
            />
          ))
        )}
      </div>
    </section>
  );
};
