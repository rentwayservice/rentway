import type { ProviderDetailProps } from "./provider-detail.types";

export const ProviderDetail = ({ provider, className }: ProviderDetailProps) => {
  return (
    <section className={`rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-2xl bg-slate-100" />
        <div>
          <h1 className="text-2xl font-semibold">{provider.name}</h1>
          <p className="text-sm text-muted-foreground">
            {provider.city ?? ""} {provider.countryCode ?? ""}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {provider.description ?? "Provider description coming soon."}
      </p>
    </section>
  );
};
