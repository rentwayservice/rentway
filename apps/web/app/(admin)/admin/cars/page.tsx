import type { Metadata } from "next";
import { AdminApprovalList } from "@/components/admin-approval-list/admin-approval-list";

export const metadata: Metadata = {
  title: "Admin cars",
  description: "Approve car listings.",
  robots: { index: false, follow: false },
};

export default function AdminCarsPage() {
  return (
    <main className="mx-auto max-w-4xl pb-16">
      <AdminApprovalList title="Car approvals" />
    </main>
  );
}
