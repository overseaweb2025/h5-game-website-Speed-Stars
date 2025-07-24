import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://speed-stars.net"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/private/",
          "/api/",
          "/tmp/",
          "/_next/",
          "/node_modules/",
          "/.git/",
          "/config/",
          "/logs/",
          "/backup/",
          "/test/",
          "/dev/",
          "/staging/",
          "/*?utm_*", // Block tracking parameters
          "/*?ref=*", // Block referral parameters
          "/*?fbclid=*", // Block Facebook click IDs
          "/*?gclid=*", // Block Google click IDs
        ],
      },
      // Special rules for search engines
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/private/", "/api/", "/tmp/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/private/", "/api/", "/tmp/"],
      },
      // Block bad bots and scrapers
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "BLEXBot", "DataForSeoBot"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
