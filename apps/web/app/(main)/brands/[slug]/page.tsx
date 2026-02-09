import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/actions/brands";
import { listCars } from "@/actions/cars";
import { BrandGrid } from "@/components/brand-grid/brand-grid";
import { CarCard } from "@/components/car-card/car-card";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getBrandBySlug({ slug: params.slug });
  if (!result.success || !result.data) {
    return { title: "Brand" };
  }

  return {
    title: result.data.name,
    description: `Cars available from ${result.data.name}.`,
    openGraph: {
      title: result.data.name,
      description: `Cars available from ${result.data.name}.`,
    },
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const brandResult = await getBrandBySlug({ slug: params.slug });
  if (!brandResult.success || !brandResult.data) {
    notFound();
  }

  const carsResult = await listCars({ brandId: brandResult.data.id, limit: 12 });
  const cars = carsResult.success ? carsResult.data.items : [];

  return (
    <main className="space-y-8 pb-16">
      <BrandGrid title={brandResult.data.name} brands={[brandResult.data]} />
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
    </main>
  );
}
