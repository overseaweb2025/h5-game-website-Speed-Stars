import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://speed-stars.net"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Admin and private areas
          "/admin/",
          "/private/",
          "/dashboard/",
          "/management/",
          
          // API and system files
          "/api/",
          "/_next/",
          "/node_modules/",
          "/.git/",
          "/.env*",
          "/config/",
          "/logs/",
          "/backup/",
          "/tmp/",
          "/cache/",
          
          // Development and testing
          "/test/",
          "/dev/",
          "/staging/",
          "/debug/",
          
          // Authentication and user management
          "/auth/signin/",
          "/auth/error/",
          "/user/settings/",
          "/user/profile/edit/",
          
          // Tracking and analytics parameters
          "/*?utm_*",
          "/*?ref=*",
          "/*?fbclid=*",
          "/*?gclid=*",
          "/*?mc_cid=*",
          "/*?mc_eid=*",
          "/*?_ga=*",
          "/*?sessionid=*",
          "/*?timestamp=*",
          
          // Duplicate content prevention
          "/*?page=*",
          "/*?sort=*",
          "/*?filter=*",
          "/search?*",
          
          // File types that shouldn't be indexed
          "/*.json$",
          "/*.xml$",
          "/*.txt$",
          "/*.log$",
          "/*.env$",
        ],
      },
      
      // Specific rules for major search engines
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/games/",
          "/blog/",
          "/about/",
          "/help/",
          "/contact/"
        ],
        disallow: [
          "/admin/",
          "/private/",
          "/api/",
          "/tmp/",
          "/auth/",
          "/user/settings/"
        ],
        crawlDelay: 1,
      },
      
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/games/",
          "/blog/",
          "/about/",
          "/help/",
          "/contact/"
        ],
        disallow: [
          "/admin/",
          "/private/",
          "/api/",
          "/tmp/",
          "/auth/",
          "/user/settings/"
        ],
        crawlDelay: 2,
      },
      
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/admin/", "/private/", "/api/", "/tmp/"],
        crawlDelay: 3,
      },
      
      // Block aggressive crawlers and scrapers
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot", 
          "MJ12bot",
          "DotBot",
          "BLEXBot",
          "DataForSeoBot",
          "PetalBot",
          "MegaIndex",
          "SeznamBot",
          "linkdexbot",
          "Mediatoolkitbot",
          "VoilaBot",
          "BUbiNG",
          "Cliqzbot"
        ],
        disallow: "/",
      },
      
      // Block malicious bots
      {
        userAgent: [
          "SiteBot",
          "WebCopier",
          "WebZIP",
          "larbin",
          "b2w/0.1",
          "psbot",
          "Python-urllib",
          "NetAnts",
          "Mister PiX",
          "WebAuto",
          "TheNomad",
          "WWW-Collector-E",
          "RMA",
          "libWeb/clsHTTP",
          "asterias",
          "httplib",
          "turingos",
          "spanner",
          "InfoNaviRobot",
          "Harvest/1.5",
          "Bullseye/1.0",
          "Mozilla/4.0 (compatible; BullsEye; Windows 95)"
        ],
        disallow: "/",
      },
      
      // Special allowance for image bots (for better image SEO)
      {
        userAgent: "Googlebot-Image",
        allow: [
          "/images/",
          "/public/images/",
          "/*.jpg",
          "/*.jpeg", 
          "/*.png",
          "/*.gif",
          "/*.webp"
        ],
        disallow: ["/admin/", "/private/"],
      },
      
      // News bot allowance
      {
        userAgent: "Googlebot-News",
        allow: "/blog/",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
