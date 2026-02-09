import { BrandsSection, CarsSection, HeroSection } from "@/components/home";

export default function HomePage() {
  return (
    <main className="space-y-12 pb-16">
      <HeroSection />
      <BrandsSection />
      <CarsSection />
    </main>
  );
}
