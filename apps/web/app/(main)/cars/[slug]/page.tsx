import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarBySlug } from "@/actions/cars";
import { CarDetails } from "@/components/car-details/car-details";
import { CarFeaturePicker } from "@/components/car-feature-picker/car-feature-picker";
import { ProviderCard } from "@/components/provider-card/provider-card";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getCarBySlug({ slug: params.slug });
  if (!result.success || !result.data) {
    return { title: "Car" };
  }

  const car = result.data;
  const title = `${car.brand.name} ${car.model.name}`;
  const description = car.car.description ?? "Explore this rental car.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: car.car.primaryImageUrl ? [car.car.primaryImageUrl] : [],
    },
    alternates: {
      canonical: `/cars/${car.car.slug}`,
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const result = await getCarBySlug({ slug: params.slug });

  if (!result.success || !result.data) {
    notFound();
  }

  const car = result.data;

  return (
    <main className="space-y-8 pb-16">
      <CarDetails car={car} />
      <CarFeaturePicker features={car.features.map((item) => item.feature)} />
      <ProviderCard
        name={car.provider.name}
        description={car.provider.description}
        href={`/providers/${car.provider.slug}`}
        logoUrl={
          typeof car.provider.branding === "object" &&
          car.provider.branding !== null
            ? (car.provider.branding as { logo_url?: string | null }).logo_url ??
              null
            : null
        }
      />
    </main>
  );
}
