import type { Metadata } from "next";
import { DashboardStats } from "@/components/dashboard-stats/dashboard-stats";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Provider overview.",
  robots: { index: false, follow: false },
};

export default function ProviderDashboardPage() {
  return (
    <main className="space-y-6 pb-16">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <DashboardStats totalCars={0} approvedCars={0} pendingCars={0} />
    </main>
  );
}
