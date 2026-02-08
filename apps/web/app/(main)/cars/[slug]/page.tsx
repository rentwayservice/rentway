import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getCarBySlugWithDetails } from "@/actions/cars";
import {
  CarConditions,
  CarDescription,
  CarFeatures,
  CarHero,
  CarIncludedBenefits,
  CarMileage,
  CarPricingTiers,
  CarSpecifications,
} from "@/components/car";

interface CarPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CarPage({ params }: CarPageProps) {
  const { slug } = await params;
  const car = await getCarBySlugWithDetails(slug);
  const locale = await getLocale();

  if (!car) {
    notFound();
  }

  const carName = car.model?.brand
    ? `${car.model.brand.name} ${car.model.name}`
    : (car.model?.name ?? "Car");

  return (
    <main className="min-h-screen">
      <CarHero car={car} locale={locale} />
      <div className="container mx-auto space-y-6 px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CarSpecifications car={car} />
            <CarFeatures carFeatures={car.carFeatures} />
            <CarDescription car={car} carName={carName} />
            <CarConditions car={car} />
            <CarMileage car={car} />
            <CarIncludedBenefits />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CarPricingTiers car={car} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
