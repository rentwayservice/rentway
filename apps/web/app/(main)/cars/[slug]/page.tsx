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
import type { CarWithDetails } from "@/components/car/car.types";
import CarBookingSidebar from "@/components/car/car-booking/car-booking-sidebar";

interface CarPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CarPage({ params }: CarPageProps) {
  const { slug } = await params;
  const car = await getCarBySlugWithDetails(slug);
  const locale = await getLocale();
console.log("car", car);
  if (!car) {
    notFound();
  }

  const carName = car.model?.brand
    ? `${car.model.brand.name} ${car.model.name}`
    : (car.model?.name ?? "Car");

  return (
    <main className="min-h-screen">
      <CarHero car={car as CarWithDetails} locale={locale} />
      <div className="container mx-auto space-y-6 px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CarSpecifications car={car as CarWithDetails} />
            <CarFeatures carFeatures={car.carFeatures} />
            <CarDescription car={car as CarWithDetails} carName={carName} />
            <CarConditions car={car as CarWithDetails} />
            <CarMileage car={car as CarWithDetails} />
            <CarIncludedBenefits />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CarBookingSidebar car={car as CarWithDetails} />
              <CarPricingTiers car={car as CarWithDetails} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
