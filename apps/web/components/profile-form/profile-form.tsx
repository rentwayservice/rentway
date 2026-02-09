import type { ProfileFormProps } from "./profile-form.types";

export const ProfileForm = ({
  className,
  fullName,
  email,
  phone,
}: ProfileFormProps) => {
  return (
    <form className={`grid gap-4 rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <h1 className="text-2xl font-semibold">Your profile</h1>
      <label className="grid gap-1 text-sm">
        Full name
        <input
          name="fullName"
          className="rounded-lg border px-3 py-2"
          defaultValue={fullName ?? ""}
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
      <button
        type="submit"
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Save profile
      </button>
    </form>
  );
};
