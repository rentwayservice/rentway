import Link from "next/link";
import type { HomeHeroProps } from "./home-hero.types";

export const HomeHero = ({ className }: HomeHeroProps) => {
  return (
    <section
      className={`rounded-3xl bg-slate-900 px-6 py-12 text-white ${
        className ?? ""
      }`}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Rent smarter
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Find your next ride with Rentway
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
            Explore curated vehicles from trusted providers across the region.
            Compare pricing, features, and availability in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/search"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900"
          >
            Start searching
          </Link>
          <Link
            href="/providers"
            className="rounded-full border border-white/40 px-5 py-2 text-sm font-medium"
          >
            Browse providers
          </Link>
        </div>
      </div>
    </section>
  );
};
