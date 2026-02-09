import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBodyTypeBySlug } from "@/actions/body-types";
import { listCars } from "@/actions/cars";
import { BodyTypeGrid } from "@/components/body-type-grid/body-type-grid";
import { CarCard } from "@/components/car-card/car-card";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getBodyTypeBySlug({ slug: params.slug });
  if (!result.success || !result.data) {
    return { title: "Body type" };
  }

  return {
    title: result.data.name,
    description: `Cars available in ${result.data.name} body type.`,
    openGraph: {
      title: result.data.name,
      description: `Cars available in ${result.data.name} body type.`,
    },
  };
}

export default async function BodyTypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const bodyTypeResult = await getBodyTypeBySlug({ slug: params.slug });
  if (!bodyTypeResult.success || !bodyTypeResult.data) {
    notFound();
  }

  const carsResult = await listCars({
    bodyTypeId: bodyTypeResult.data.id,
    limit: 12,
  });
  const cars = carsResult.success ? carsResult.data.items : [];

  return (
    <main className="space-y-8 pb-16">
      <BodyTypeGrid
        title={bodyTypeResult.data.name}
        bodyTypes={[bodyTypeResult.data]}
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
    </main>
  );
}
