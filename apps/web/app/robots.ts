import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/search", "/cars", "/providers", "/brands", "/body-types"],
        disallow: [
          "/dashboard",
          "/profile",
          "/admin",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://rentway.app/sitemap.xml",
  };
}
