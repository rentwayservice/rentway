import type { Metadata } from "next";
import Link from "next/link";
import { CarCard } from "@/components/car-card/car-card";
import { CarStatusBadge } from "@/components/car-status-badge/car-status-badge";

export const metadata: Metadata = {
  title: "Manage cars",
  description: "Manage provider car listings.",
  robots: { index: false, follow: false },
};

export default function ProviderCarsPage() {
  return (
    <main className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your cars</h1>
        <Link
          href="/dashboard/cars/new"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Add new car
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Sample listing</p>
            <CarStatusBadge status="pending" />
          </div>
          <CarCard
            title="Pending approval"
            subtitle="Awaiting review"
            href="/dashboard/cars/placeholder/edit"
          />
        </div>
      </div>
    </main>
  );
}
