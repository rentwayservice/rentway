import type { CarStatusBadgeProps } from "./car-status-badge.types";

const statusStyles: Record<CarStatusBadgeProps["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  active: "bg-blue-100 text-blue-700",
  inactive: "bg-slate-100 text-slate-600",
};

export const CarStatusBadge = ({
  className,
  status,
}: CarStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status]
      } ${className ?? ""}`}
    >
      {status}
    </span>
  );
};
