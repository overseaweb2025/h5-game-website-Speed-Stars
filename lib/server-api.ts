// Server-side API client for metadata generation
// This bypasses the client-side proxy and makes direct requests

import { HomeGameData } from '@/app/api/types/Get/game'

const API_BASE_URL = process.env.NEXT_API_URL || 'http://www.xingnengyun.com'

// Server-side cache store
interface CacheEntry {
  data: HomeGameData
  timestamp: number
}

let serverCache: CacheEntry | null = null
const CACHE_DURATION = 3 * 60 * 1000 // 3分钟

function isCacheValid(cache: CacheEntry | null): boolean {
  if (!cache) return false
  return (Date.now() - cache.timestamp) < CACHE_DURATION
}

export async function fetchHomeGameData(): Promise<HomeGameData | null> {
  // Check server-side cache first
  if (isCacheValid(serverCache)) {
    return serverCache!.data
  }

  try {
    const url = `${API_BASE_URL}/api/v1/index/show`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-Server/1.0)',
      },
      // Add timeout and cache control
      signal: AbortSignal.timeout(10000), // 10 second timeout
      next: { 
        revalidate: 180 // Cache for 3 minutes
      }
    })

    if (!response.ok) {
      // If we have expired cache, return it as fallback
      if (serverCache) {
        return serverCache.data
      }
      return null
    }

    const data: HomeGameData = await response.json()
    
    // Validate the response structure
    if (!data || !data.data || !data.data.game) {
      // If we have expired cache, return it as fallback
      if (serverCache) {
        return serverCache.data
      }
      return null
    }
    
    // Update server cache
    serverCache = {
      data,
      timestamp: Date.now()
    }
    
    return data
  } catch (error) {
    // If we have expired cache, return it as fallback
    if (serverCache) {
      return serverCache.data
    }
    // Silent error handling - return null for fallback
    return null
  }
}

// Helper function to extract SEO metadata
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
}

export function extractSEOFromHomeData(homeData: HomeGameData | null): SEOMetadata {
  if (!homeData?.data?.game) {
    return {
      title: "Free Game",
      description: "Play Free Game racing game online",
      keywords: "free game, racing game, online game"
    }
  }

  const { page_title, page_description, page_keywords } = homeData.data.game
  
  return {
    title: page_title || homeData.data.title || "Free Game",
    description: page_description || homeData.data.description || "Play Free Game racing game online",
    keywords: page_keywords || homeData.data.keywords || "free game, racing game, online game"
  }
}