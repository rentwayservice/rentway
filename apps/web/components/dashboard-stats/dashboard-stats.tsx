import type { DashboardStatsProps } from "./dashboard-stats.types";

export const DashboardStats = ({
  className,
  totalCars,
  approvedCars,
  pendingCars,
}: DashboardStatsProps) => {
  return (
    <section className={`grid gap-4 md:grid-cols-3 ${className ?? ""}`}>
      {[
        { label: "Total cars", value: totalCars },
        { label: "Approved", value: approvedCars },
        { label: "Pending", value: pendingCars },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border bg-white p-4"
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </section>
  );
};
