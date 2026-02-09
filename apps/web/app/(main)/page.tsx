import type { Metadata } from "next";
import { listBrands } from "@/actions/brands";
import { listCars } from "@/actions/cars";
import { listProviders } from "@/actions/providers";
import { BrandGrid } from "@/components/brand-grid/brand-grid";
import { FeaturedCars } from "@/components/featured-cars/featured-cars";
import { HomeHero } from "@/components/home-hero/home-hero";
import { ProviderCard } from "@/components/provider-card/provider-card";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Find your next rental car. Browse trusted providers, brands, and featured listings.",
  openGraph: {
    title: "Rentway Home",
    description:
      "Find your next rental car. Browse trusted providers, brands, and featured listings.",
  },
};

export default async function HomePage() {
  const [carsResult, providersResult, brandsResult] = await Promise.all([
    listCars({ limit: 8 }),
    listProviders(),
    listBrands(),
  ]);

  const featuredCars = carsResult.success ? carsResult.data.items : [];
  const providers = providersResult.success ? providersResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];

  return (
    <main className="space-y-12 pb-16">
      <HomeHero />
      <FeaturedCars cars={featuredCars} />
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Featured providers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              name={provider.name}
              description={provider.description}
              href={`/providers/${provider.slug}`}
              logoUrl={
                typeof provider.branding === "object" && provider.branding !== null
                  ? (provider.branding as { logo_url?: string | null }).logo_url ??
                    null
                  : null
              }
            />
          ))}
        </div>
      </section>
      <BrandGrid title="Popular brands" brands={brands} />
    </main>
  );
}
