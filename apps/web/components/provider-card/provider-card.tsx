import Link from "next/link";
import type { ProviderCardProps } from "./provider-card.types";

export const ProviderCard = ({
  className,
  name,
  description,
  href,
  logoUrl,
}: ProviderCardProps) => {
  return (
    <Link
      href={href}
      className={`flex h-full flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-100">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-muted-foreground">Verified provider</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {description ?? "Trusted rental partner."}
      </p>
    </Link>
  );
};
