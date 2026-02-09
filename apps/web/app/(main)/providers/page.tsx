import type { Metadata } from "next";
import { listProviders } from "@/actions/providers";
import { ProviderCard } from "@/components/provider-card/provider-card";

export const metadata: Metadata = {
  title: "Providers",
  description: "Browse rental providers on Rentway.",
  openGraph: {
    title: "Providers",
    description: "Browse rental providers on Rentway.",
  },
};

export default async function ProvidersPage() {
  const result = await listProviders();
  const providers = result.success ? result.data : [];

  return (
    <main className="space-y-6 pb-16">
      <h1 className="text-3xl font-semibold">Providers</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            name={provider.name}
            description={provider.description}
            href={`/providers/${provider.slug}`}
            logoUrl={
              typeof provider.branding === "object" && provider.branding !== null
                ? (provider.branding as { logo_url?: string | null }).logo_url ??
                  null
                : null
            }
          />
        ))}
      </div>
    </main>
  );
}
