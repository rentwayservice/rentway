import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProviderBySlug } from "@/actions/providers";
import { CarCard } from "@/components/car-card/car-card";
import { ProviderDetail } from "@/components/provider-detail/provider-detail";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getProviderBySlug({ slug: params.slug });
  if (!result.success || !result.data) {
    return { title: "Provider" };
  }

  return {
    title: result.data.name,
    description: result.data.description ?? "Provider details",
    openGraph: {
      title: result.data.name,
      description: result.data.description ?? "Provider details",
    },
  };
}

export default async function ProviderDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const result = await getProviderBySlug({ slug: params.slug });

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <main className="space-y-8 pb-16">
      <ProviderDetail provider={result.data} />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {result.data.cars.map((car) => (
          <CarCard
            key={car.id}
            title={`${car.model?.brand?.name ?? ""} ${car.model?.name ?? ""}`.trim()}
            subtitle={car.model?.name ?? ""}
            price={car.dailyRate?.toString() ?? ""}
            href={`/cars/${car.slug}`}
            imageUrl={car.primaryImageUrl ?? undefined}
          />
        ))}
      </section>
    </main>
  );
}
