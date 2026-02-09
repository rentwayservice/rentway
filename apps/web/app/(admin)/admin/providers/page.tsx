import type { Metadata } from "next";
import { AdminApprovalList } from "@/components/admin-approval-list/admin-approval-list";

export const metadata: Metadata = {
  title: "Admin providers",
  description: "Approve provider applications.",
  robots: { index: false, follow: false },
};

export default function AdminProvidersPage() {
  return (
    <main className="mx-auto max-w-4xl pb-16">
      <AdminApprovalList title="Provider approvals" />
    </main>
  );
}
