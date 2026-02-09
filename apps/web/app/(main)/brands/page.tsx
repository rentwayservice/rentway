import type { Metadata } from "next";
import { listBrands } from "@/actions/brands";
import { BrandGrid } from "@/components/brand-grid/brand-grid";

export const metadata: Metadata = {
  title: "Brands",
  description: "Discover brands available on Rentway.",
  openGraph: {
    title: "Brands",
    description: "Discover brands available on Rentway.",
  },
};

export default async function BrandsPage() {
  const result = await listBrands();
  const brands = result.success ? result.data : [];

  return (
    <main className="space-y-6 pb-16">
      <BrandGrid title="Browse brands" brands={brands} />
    </main>
  );
}
