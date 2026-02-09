import type { AdminApprovalListProps } from "./admin-approval-list.types";

export const AdminApprovalList = ({
  className,
  title,
}: AdminApprovalListProps) => {
  return (
    <section className={`rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Admin approvals will appear here once wired to moderation queues.
      </p>
    </section>
  );
};
