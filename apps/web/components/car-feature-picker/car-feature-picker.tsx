import type { CarFeaturePickerProps } from "./car-feature-picker.types";

export const CarFeaturePicker = ({
  className,
  features,
}: CarFeaturePickerProps) => {
  return (
    <div className={`rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <h2 className="text-lg font-semibold">Features</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {features.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            No features assigned.
          </span>
        ) : (
          features.map((feature) => (
            <span
              key={feature.id}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs"
            >
              {feature.name}
            </span>
          ))
        )}
      </div>
    </div>
  );
};
