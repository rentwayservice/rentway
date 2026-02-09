import type { MetadataRoute } from "next";
import {
  bodyTypes,
  brands,
  cars,
  db,
  providers,
} from "@rentway/db";
import { eq } from "drizzle-orm";

const baseUrl = "https://rentway.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [carSlugs, providerSlugs, brandSlugs, bodyTypeSlugs] = await Promise.all(
    [
      db
        .select({ slug: cars.slug, updatedAt: cars.updatedAt })
        .from(cars)
        .where(eq(cars.approvalStatus, "approved")),
      db
        .select({ slug: providers.slug, updatedAt: providers.updatedAt })
        .from(providers)
        .where(eq(providers.status, "active")),
      db
        .select({ slug: brands.slug, updatedAt: brands.updatedAt })
        .from(brands)
        .where(eq(brands.isActive, true)),
      db
        .select({ slug: bodyTypes.slug, updatedAt: bodyTypes.updatedAt })
        .from(bodyTypes)
        .where(eq(bodyTypes.isActive, true)),
    ]
  );

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/cars`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/providers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/brands`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/body-types`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  routes.push(
    ...carSlugs.map((car) => ({
      url: `${baseUrl}/cars/${car.slug}`,
      lastModified: car.updatedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
    ...providerSlugs.map((provider) => ({
      url: `${baseUrl}/providers/${provider.slug}`,
      lastModified: provider.updatedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
    ...brandSlugs.map((brand) => ({
      url: `${baseUrl}/brands/${brand.slug}`,
      lastModified: brand.updatedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
    ...bodyTypeSlugs.map((bodyType) => ({
      url: `${baseUrl}/body-types/${bodyType.slug}`,
      lastModified: bodyType.updatedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    }))
  );

  return routes;
}
