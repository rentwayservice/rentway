import type { Metadata } from "next";
import { ProviderSettingsForm } from "@/components/provider-settings-form/provider-settings-form";

export const metadata: Metadata = {
  title: "Provider settings",
  description: "Manage provider settings.",
  robots: { index: false, follow: false },
};

export default function ProviderSettingsPage() {
  return (
    <main className="mx-auto max-w-3xl pb-16">
      <ProviderSettingsForm />
    </main>
  );
}
