import type { MetadataRoute } from "next"
import { fetchHomeGameData } from "@/lib/server-api"
import { getSupportedLocales, getLocalizedPath } from "@/lib/lang/utils"

// Fetch game data from API
async function getGamesList() {
  try {
    const homeData = await fetchHomeGameData()
    if (homeData?.data?.data) {
      const games: Array<{ name: string; updated_at?: string; category?: string }> = []
      
      // Extract games from categories
      homeData.data.data.forEach((category: any) => {
        if (category.games) {
          category.games.forEach((game: any) => {
            if (game.name && !games.find(g => g.name === game.name)) {
              games.push({
                name: game.name,
                updated_at: game.updated_at,
                category: category.name || category.slug
              })
            }
          })
        }
      })
      
      return games
    }
  } catch (error) {
    console.warn('Failed to fetch games list for sitemap, using fallback data')
  }
  
  // Fallback games if API fails
  return [
    { name: 'speed-stars', category: 'racing' },
    { name: 'speed-stars-2', category: 'racing' },
    { name: 'crazy-cattle-3d', category: 'action' },
    { name: 'puzzle-quest', category: 'puzzle' },
    { name: 'adventure-run', category: 'adventure' },
    { name: 'bubble-pop', category: 'puzzle' },
    { name: 'word-master', category: 'puzzle' },
    { name: 'space-shooter', category: 'action' }
  ]
}

// Fetch game categories
async function getGameCategories() {
  try {
    const homeData = await fetchHomeGameData()
    if (homeData) {
      // Assuming homeData is an array of categories
      return Array.isArray(homeData)
        ? homeData.map((category: any) => ({
            slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-'),
            name: category.name,
            updated_at: category.updated_at
          }))
        : [];
    }
  } catch (error) {
    console.warn('Failed to fetch categories for sitemap, using fallback data')
  }
  
  // Fallback categories
  return [
    { slug: 'racing', name: 'Racing' },
    { slug: 'action', name: 'Action' },
    { slug: 'puzzle', name: 'Puzzle' },
    { slug: 'adventure', name: 'Adventure' },
    { slug: 'sports', name: 'Sports' },
    { slug: 'arcade', name: 'Arcade' }
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://speed-stars.net"
  const currentDate = new Date()
  const supportedLocales = getSupportedLocales()
  const games = await getGamesList()
  const categories = await getGameCategories()
  
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

    // Blog posts - these should ideally be fetched dynamically
    const blogPosts = [
      { slug: 'speed-stars-ultimate-guide', date: '2025-05-28', priority: 0.75 },
      { slug: 'mobile-gaming-revolution-2025', date: '2025-06-15', priority: 0.7 },
      { slug: 'unblocked-games-school-workplace', date: '2025-06-10', priority: 0.7 },
      { slug: 'speed-stars-2-new-features', date: '2025-06-05', priority: 0.75 },
      { slug: 'html5-games-vs-native-apps', date: '2025-05-30', priority: 0.65 },
      { slug: 'gaming-productivity-balance', date: '2025-05-25', priority: 0.65 },
      { slug: 'future-of-browser-gaming', date: '2025-05-20', priority: 0.7 },
      { slug: 'best-racing-games-2025', date: '2025-06-20', priority: 0.7 },
      { slug: 'speed-stars-tips-tricks', date: '2025-06-18', priority: 0.75 },
      { slug: 'browser-gaming-performance-guide', date: '2025-06-12', priority: 0.65 },
    ]

    blogPosts.forEach(post => {
      urls.push({
        url: `${baseUrl}${localePrefix}/blog/${post.slug}`,
        lastModified: new Date(post.date),
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
