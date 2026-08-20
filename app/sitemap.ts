import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cpmgarage.com";

  // Fetch all products
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    "",
    "/shop",
    "/cars",
    "/cars/modified",
    "/cars/drawn",
    "/cars/realistic-logos",
    "/cars/limited",
    "/cars/stock",
    "/services",
    "/accounts",
    "/deposit",
    "/faq",
    "/terms",
    "/privacy",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.9,
  }));

  return [...staticUrls, ...productUrls];
}
