import type { AuthFormProps } from "./auth-form.types";

export const AuthForm = ({ className, mode }: AuthFormProps) => {
  return (
    <div className={`rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <h1 className="text-2xl font-semibold">
        {mode === "sign-in" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "sign-in"
          ? "Sign in to manage your profile and bookings."
          : "Sign up to start booking cars and managing rentals."}
      </p>
      <form className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            className="rounded-lg border px-3 py-2"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Password
          <input
            type="password"
            name="password"
            className="rounded-lg border px-3 py-2"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
};
