import type { MetadataRoute } from "next"
import { fetchHomeGameData } from "@/lib/server-api"
import { getSupportedLocales, getLocalizedPath } from "@/lib/lang/utils"
import { getCanonicalDomain } from "@/lib/seo-utils"
const API_BASE_URL = process.env.NEXT_API_URL || 'http://www.xingnengyun.com'

const url = `${API_BASE_URL}/api/v1/sitemap`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalDomain()
  const currentDate = new Date()
  const supportedLocales = getSupportedLocales()
  
  const res = await fetch(url)
  const { data } = await res.json()

  const games = data.games.map((g: any) => ({
    name: g, category: g 
  }))

  const categories = data.categories.map((c: any) => ({
    slug: c,
    name: c,
  }))

  const blog = data.blog.map((b: any) => ({
     slug: b, priority: 0.75
  }))

  const urls: MetadataRoute.Sitemap = []

  // Generate URLs for each supported language
  supportedLocales.forEach(locale => {
    const localePrefix = locale === 'en' ? '' : `/${locale}`
    
    // Homepage - highest priority
    urls.push({
      url: `${baseUrl}${localePrefix}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    })
    
    // Games index page - very high priority
    urls.push({
      url: `${baseUrl}${localePrefix}/games`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    })

    // Game category pages - high priority
    categories.forEach((category: { slug: any; updated_at: string | number | Date }) => {
      urls.push({
        url: `${baseUrl}${localePrefix}/games/c/${category.slug}`,
        lastModified: category.updated_at ? new Date(category.updated_at) : currentDate,
        changeFrequency: "weekly",
        priority: 0.85,
      })
    })

    // Individual game pages - high priority
    games.forEach(game => {
      urls.push({
        url: `${baseUrl}${localePrefix}/game/${game.name}`,
        lastModified: game.updated_at ? new Date(game.updated_at) : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    })

    // Blog section - high priority for content
    urls.push({
      url: `${baseUrl}${localePrefix}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    })

    // User pages (public profiles)
    urls.push({
      url: `${baseUrl}${localePrefix}/user`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    })

    // Static pages with multilingual support
    const staticPages = [
      { path: '/help', priority: 0.7, changeFreq: 'monthly' as const, lastMod: currentDate },
      { path: '/about', priority: 0.6, changeFreq: 'monthly' as const, lastMod: currentDate },
      { path: '/contact', priority: 0.6, changeFreq: 'monthly' as const, lastMod: currentDate },
      { path: '/terms', priority: 0.4, changeFreq: 'yearly' as const, lastMod: new Date("2024-01-01") },
      { path: '/privacy', priority: 0.4, changeFreq: 'yearly' as const, lastMod: new Date("2024-01-01") },
      { path: '/cookies', priority: 0.3, changeFreq: 'yearly' as const, lastMod: new Date("2024-01-01") },
      { path: '/dmca', priority: 0.3, changeFreq: 'yearly' as const, lastMod: new Date("2024-01-01") },
    ]

    staticPages.forEach(page => {
      urls.push({
        url: `${baseUrl}${localePrefix}${page.path}`,
        lastModified: page.lastMod,
        changeFrequency: page.changeFreq,
        priority: page.priority,
      })
    })


    blog.forEach(post => {
      urls.push({
        url: `${baseUrl}${localePrefix}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: post.priority,
      })
    })

    // Additional game-related routes
    games.forEach(game => {
      // Alternative game URL structure for better SEO
      urls.push({
        url: `${baseUrl}${localePrefix}/games/${game.name}`,
        lastModified: game.updated_at ? new Date(game.updated_at) : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    })
  })

  // Sort URLs by priority (highest first) for better indexing
  urls.sort((a, b) => (b.priority || 0) - (a.priority || 0))

  return urls
}
