import Link from "next/link";
import type { BodyTypeGridProps } from "./body-type-grid.types";

export const BodyTypeGrid = ({
  bodyTypes,
  title,
  className,
}: BodyTypeGridProps) => {
  return (
    <section className={className}>
      {title ? <h2 className="text-2xl font-semibold">{title}</h2> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {bodyTypes.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            No body types available yet.
          </div>
        ) : (
          bodyTypes.map((bodyType) => (
            <Link
              key={bodyType.id}
              href={`/body-types/${bodyType.slug}`}
              className="rounded-xl border bg-white p-4"
            >
              <p className="text-sm font-medium">{bodyType.name}</p>
              <p className="text-xs text-muted-foreground">
                {bodyType.icon ?? ""}
              </p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};
