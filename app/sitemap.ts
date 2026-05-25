import type { MetadataRoute } from "next";

const baseUrl = "https://clinicrelay.co";

const routes = [
  "",
  "/about",
  "/contact",
  "/demo",
  "/pricing",
  "/privacy",
  "/terms",
  "/workflow-audit",
  "/use-cases/family-medicine",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
