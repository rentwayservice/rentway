import type { ProviderSettingsFormProps } from "./provider-settings-form.types";

export const ProviderSettingsForm = ({
  className,
  name,
  email,
  phone,
  city,
}: ProviderSettingsFormProps) => {
  return (
    <form className={`grid gap-4 rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <h1 className="text-2xl font-semibold">Provider settings</h1>
      <label className="grid gap-1 text-sm">
        Provider name
        <input
          name="name"
          className="rounded-lg border px-3 py-2"
          defaultValue={name ?? ""}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Email
        <input
          type="email"
          name="email"
          className="rounded-lg border px-3 py-2"
          defaultValue={email ?? ""}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Phone
        <input
          name="phone"
          className="rounded-lg border px-3 py-2"
          defaultValue={phone ?? ""}
        />
      </label>
      <label className="grid gap-1 text-sm">
        City
        <input
          name="city"
          className="rounded-lg border px-3 py-2"
          defaultValue={city ?? ""}
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Save settings
      </button>
    </form>
  );
};
