import type { CarDetailsProps } from "./car-details.types";

export const CarDetails = ({ car, className }: CarDetailsProps) => {
  return (
    <section className={`grid gap-6 lg:grid-cols-[2fr_1fr] ${className ?? ""}`}>
      <div className="space-y-4">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
          {car.car.primaryImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={car.car.primaryImageUrl}
              alt={`${car.brand.name} ${car.model.name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image uploaded
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            {car.brand.name} {car.model.name}
          </h1>
          <p className="text-muted-foreground">
            {car.model.fuelType ?? ""} · {car.model.transmissionType ?? ""}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="mt-2 text-sm">
            {car.car.description ?? "No description provided yet."}
          </p>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Daily rate</p>
          <p className="text-2xl font-semibold">
            {car.car.dailyRate ?? "--"}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Provider</p>
          <p className="text-base font-semibold">{car.provider.name}</p>
          <p className="text-sm text-muted-foreground">
            {car.provider.city ?? ""} {car.provider.countryCode ?? ""}
          </p>
        </div>
      </aside>
    </section>
  );
};
