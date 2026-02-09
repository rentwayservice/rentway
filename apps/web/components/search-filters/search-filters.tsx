import type { SearchFiltersProps } from "./search-filters.types";

export const SearchFilters = ({
  className,
  providers,
  brands,
  bodyTypes,
}: SearchFiltersProps) => {
  return (
    <form
      className={`grid gap-4 rounded-2xl border bg-white p-4 md:grid-cols-3 ${
        className ?? ""
      }`}
      method="get"
      action="/search"
    >
      <label className="flex flex-col gap-1 text-sm">
        Provider
        <select name="providerId" className="rounded-lg border px-3 py-2">
          <option value="">All providers</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Brand
        <select name="brandId" className="rounded-lg border px-3 py-2">
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Body type
        <select name="bodyTypeId" className="rounded-lg border px-3 py-2">
          <option value="">All body types</option>
          {bodyTypes.map((bodyType) => (
            <option key={bodyType.id} value={bodyType.id}>
              {bodyType.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Minimum price
        <input
          type="number"
          name="minPrice"
          className="rounded-lg border px-3 py-2"
          placeholder="e.g. 400"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Maximum price
        <input
          type="number"
          name="maxPrice"
          className="rounded-lg border px-3 py-2"
          placeholder="e.g. 1200"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Available from
        <input
          type="date"
          name="availableFrom"
          className="rounded-lg border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Available until
        <input
          type="date"
          name="availableUntil"
          className="rounded-lg border px-3 py-2"
        />
      </label>
      <div className="md:col-span-3">
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
};
