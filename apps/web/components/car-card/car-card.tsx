import Link from "next/link";
import type { CarCardProps } from "./car-card.types";

export const CarCard = ({
  className,
  title,
  subtitle,
  price,
  href,
  imageUrl,
  meta,
}: CarCardProps) => {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        className ?? ""
      }`}
    >
      <div className="aspect-[16/9] w-full bg-slate-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {meta ? <p className="text-xs text-slate-500">{meta}</p> : null}
        {price ? (
          <p className="mt-auto text-sm font-semibold text-slate-900">
            {price} / day
          </p>
        ) : null}
      </div>
    </Link>
  );
};
