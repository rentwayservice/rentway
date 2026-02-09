import Link from "next/link";
import type { BrandGridProps } from "./brand-grid.types";

export const BrandGrid = ({ brands, title, className }: BrandGridProps) => {
  return (
    <section className={className}>
      {title ? <h2 className="text-2xl font-semibold">{title}</h2> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {brands.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            No brands available yet.
          </div>
        ) : (
          brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <span className="text-sm font-medium">{brand.name}</span>
              <span className="text-xs text-muted-foreground">
                {brand.countryOfOrigin ?? ""}
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};
