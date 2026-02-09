import type { CarFormProps } from "./car-form.types";

export const CarForm = ({ className, mode, defaultValues }: CarFormProps) => {
  return (
    <form className={`grid gap-4 rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <h1 className="text-2xl font-semibold">
        {mode === "create" ? "Create new car" : "Edit car"}
      </h1>
      <label className="grid gap-1 text-sm">
        Slug
        <input
          name="slug"
          className="rounded-lg border px-3 py-2"
          defaultValue={defaultValues?.slug ?? ""}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Year
        <input
          type="number"
          name="year"
          className="rounded-lg border px-3 py-2"
          defaultValue={defaultValues?.year ?? undefined}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Daily rate
        <input
          type="number"
          name="dailyRate"
          className="rounded-lg border px-3 py-2"
          defaultValue={defaultValues?.dailyRate ?? undefined}
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        {mode === "create" ? "Create car" : "Save changes"}
      </button>
    </form>
  );
};
