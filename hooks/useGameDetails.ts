"use client"

import { useState, useEffect, useCallback } from 'react'
import { getGameDetails } from '@/app/api/gameList'
import { ExtendedGameDetails } from '@/app/api/types/Get/game'
import { gameDetailsParser } from '@/lib/game-utils'
import { gamesData } from '@/data/games/games-data'

export interface CachedGameDetails {
  slug: string
  data: ExtendedGameDetails
  cachedAt: number
  expiresAt: number
}

interface GameDetailsState {
  cache: Map<string, CachedGameDetails>
  loading: Set<string> // 正在加载的游戏slug
  errors: Map<string, string>
}

const CACHE_DURATION = 3 * 60 * 1000 // 3分钟缓存时间
const STORAGE_KEY = 'game_details_cache'

// 全局状态
let globalGameDetailsState: GameDetailsState = {
  cache: new Map(),
  loading: new Set(),
  errors: new Map()
}

// 监听器存储
const detailsListeners = new Set<() => void>()

// 通知所有监听器状态更新
const notifyDetailsListeners = () => {
  detailsListeners.forEach(listener => listener())
}

// 更新全局状态
const updateGlobalState = (updates: Partial<GameDetailsState>) => {
  if (updates.cache) {
    globalGameDetailsState.cache = new Map(updates.cache)
  }
  if (updates.loading) {
    globalGameDetailsState.loading = new Set(updates.loading)
  }
  if (updates.errors) {
    globalGameDetailsState.errors = new Map(updates.errors)
  }
  notifyDetailsListeners()
}

// 从localStorage加载缓存
const loadCacheFromStorage = (): Map<string, CachedGameDetails> => {
  if (typeof window === 'undefined') return new Map()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsedArray = JSON.parse(stored) as [string, CachedGameDetails][]
      const cache = new Map(parsedArray)
      
      // 清除过期的缓存项
      const now = Date.now()
      const validCache = new Map<string, CachedGameDetails>()
      
      cache.forEach((item, slug) => {
        if (item.expiresAt > now) {
          validCache.set(slug, item)
        } else {
          console.log(`Removing expired cache for game: ${slug}`)
        }
      })
      
      return validCache
    }
  } catch (error) {
    console.error('Error loading game details cache from storage:', error)
  }
  
  return new Map()
}

// 保存缓存到localStorage
const saveCacheToStorage = (cache: Map<string, CachedGameDetails>) => {
  if (typeof window === 'undefined') return
  
  try {
    // 转换Map为数组以便JSON序列化
    const cacheArray = Array.from(cache.entries())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheArray))
  } catch (error) {
    console.error('Error saving game details cache to storage:', error)
  }
}

// 检查缓存项是否过期
const isCacheExpired = (cachedItem: CachedGameDetails): boolean => {
  return Date.now() > cachedItem.expiresAt
}

// 从本地数据创建游戏详情
const createGameDetailsFromLocal = (slug: string): ExtendedGameDetails | null => {
  // 尝试从本地游戏数据中找到匹配的游戏
  const localGame = gamesData.find(game => {
    const gameSlug = game.url.replace('/games/', '')
    const titleSlug = game.title.toLowerCase().replace(/\s+/g, '-')
    
    return gameSlug === slug || 
           titleSlug === slug ||
           game.url.includes(slug) || 
           game.title.toLowerCase().includes(slug.replace(/-/g, ' '))
  })
  
  if (!localGame) {
    console.log(`No local fallback found for game: ${slug}`)
    return null
  }
  
  console.log(`Using local fallback data for game: ${slug}`)
  
  // 创建一个基于本地数据的ExtendedGameDetails对象
  const fallbackDetails: ExtendedGameDetails = {
    // 必需的 GameDetailsData 属性
    breadcrumbs: [
      { name: 'Games', path: '/games', level: 1 },
      { name: localGame.title, path: localGame.url, level: 2 }
    ],
    page_title: localGame.title,
    page_description: localGame.description,
    page_keywords: `${localGame.title}, online game, free game, browser game`,
    display_name: localGame.title,
    package: { url: localGame.iframeSrc || '' },
    rating: '4.0(100votes)',
    info: localGame.description,
    technology: 'HTML5',
    platforms: 'Browser (desktop, mobile)',
    released_at: new Date().toISOString(),
    reviews: [],
    last_updated: new Date().toISOString(),
    
    // ExtendedGameDetails 扩展属性
    parsedRating: {
      score: 4.0,
      votes: 100,
      displayText: '4.0(100votes)'
    },
    formattedReleaseDate: new Date().toLocaleDateString(),
    formattedUpdateDate: new Date().toLocaleDateString(),
    categoryInfo: {
      name: 'Games',
      path: '/games'
    },
    gameSlug:  slug  
  }
  
  return fallbackDetails
}

// 清理过期的缓存项
const cleanupExpiredCache = () => {
  const now = Date.now()
  const newCache = new Map<string, CachedGameDetails>()
  let hasExpired = false
  
  globalGameDetailsState.cache.forEach((item, slug) => {
    if (item.expiresAt > now) {
      newCache.set(slug, item)
    } else {
      hasExpired = true
      console.log(`Cleaning up expired cache for game: ${slug}`)
    }
  })
  
  if (hasExpired) {
    updateGlobalState({ cache: newCache })
    saveCacheToStorage(newCache)
  }
}

// 初始化缓存
const initializeCache = () => {
  if (globalGameDetailsState.cache.size === 0) {
    const storedCache = loadCacheFromStorage()
    updateGlobalState({ cache: storedCache })
    console.log(`Loaded ${storedCache.size} game details from cache`)
  }
}

// 获取游戏详情（从缓存或API）
const fetchGameDetails = async (slug: string): Promise<ExtendedGameDetails | null> => {
  // 检查是否正在加载
  if (globalGameDetailsState.loading.has(slug)) {
    console.log(`Game details for ${slug} is already being fetched`)
    return null
  }
  
  // 清理过期缓存
  cleanupExpiredCache()
  
  // 检查缓存
  const cached = globalGameDetailsState.cache.get(slug)
  if (cached && !isCacheExpired(cached)) {
    console.log(`Using cached game details for ${slug}`)
    return cached.data
  }
  
  // 从API获取数据
  const newLoading = new Set(globalGameDetailsState.loading)
  newLoading.add(slug)
  updateGlobalState({ loading: newLoading })
  
  try {
    console.log(`Fetching game details for ${slug} from API`)
    const response = await getGameDetails(slug)
    
    if (response.data && response.data.data) {
      const extendedDetails = gameDetailsParser.toExtendedDetails(response.data.data as any)
      
      // 缓存数据
      const now = Date.now()
      const cachedItem: CachedGameDetails = {
        slug,
        data: extendedDetails,
        cachedAt: now,
        expiresAt: now + CACHE_DURATION
      }
      
      const newCache = new Map(globalGameDetailsState.cache)
      newCache.set(slug, cachedItem)
      
      // 清除加载状态和错误
      const newLoadingState = new Set(globalGameDetailsState.loading)
      newLoadingState.delete(slug)
      
      const newErrors = new Map(globalGameDetailsState.errors)
      newErrors.delete(slug)
      
      updateGlobalState({
        cache: newCache,
        loading: newLoadingState,
        errors: newErrors
      })
      
      saveCacheToStorage(newCache)
      console.log(`Cached game details for ${slug}`)
      
      return extendedDetails
    } else {
      throw new Error('Invalid response data')
    }
  } catch (error: any) {
    console.warn(`API failed for game details ${slug}, trying fallback:`, error.message || error)
    
    // 先清除加载状态
    const newLoadingState = new Set(globalGameDetailsState.loading)
    newLoadingState.delete(slug)
    
    // 尝试使用本地fallback数据
    const fallbackData = createGameDetailsFromLocal(slug)
    
    if (fallbackData) {
      console.log(`✅ Using local fallback data for ${slug}`)
      
      // 缓存fallback数据（短时间缓存，优先从API获取）
      const now = Date.now()
      const cachedItem: CachedGameDetails = {
        slug,
        data: fallbackData,
        cachedAt: now,
        expiresAt: now + (30 * 1000) // 30秒后过期，鼓励重新尝试API
      }
      
      const newCache = new Map(globalGameDetailsState.cache)
      newCache.set(slug, cachedItem)
      
      // 清除错误，因为我们有fallback数据
      const newErrors = new Map(globalGameDetailsState.errors)
      newErrors.delete(slug)
      
      updateGlobalState({
        cache: newCache,
        loading: newLoadingState,
        errors: newErrors
      })
      
      saveCacheToStorage(newCache)
      
      return fallbackData
    } else {
      console.warn(`❌ No fallback data available for ${slug}`)
      
      // 如果没有fallback数据，记录错误
      const newErrors = new Map(globalGameDetailsState.errors)
      newErrors.set(slug, error.message || 'Failed to load game details')
      
      updateGlobalState({
        loading: newLoadingState,
        errors: newErrors
      })
      
      return null
    }
  }
}

// 手动清除特定游戏的缓存
const clearGameCache = (slug: string) => {
  const newCache = new Map(globalGameDetailsState.cache)
  newCache.delete(slug)
  
  const newErrors = new Map(globalGameDetailsState.errors)
  newErrors.delete(slug)
  
  updateGlobalState({
    cache: newCache,
    errors: newErrors
  })
  
  saveCacheToStorage(newCache)
  console.log(`Cleared cache for game: ${slug}`)
}

// 清除所有缓存
const clearAllCache = () => {
  updateGlobalState({
    cache: new Map(),
    errors: new Map()
  })
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
  
  console.log('Cleared all game details cache')
}

// 预加载游戏详情
const preloadGameDetails = async (slug: string): Promise<void> => {
  await fetchGameDetails(slug)
}

// 游戏详情Hook
export const useGameDetails = (slug?: string) => {
  const [updateTrigger, setUpdateTrigger] = useState(0)
  
  // 强制重新渲染的函数
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    // 初始化缓存
    initializeCache()
    
    // 添加监听器
    detailsListeners.add(triggerUpdate)
    
    // 如果提供了slug且没有数据，自动获取
    if (slug && !globalGameDetailsState.cache.has(slug) && !globalGameDetailsState.loading.has(slug)) {
      console.log(`Auto-fetching game details for ${slug}`)
      fetchGameDetails(slug)
    }
    
    // 设置定期清理过期缓存
    const cleanupInterval = setInterval(() => {
      cleanupExpiredCache()
    }, 60000) // 每分钟清理一次过期缓存
    
    return () => {
      detailsListeners.delete(triggerUpdate)
      clearInterval(cleanupInterval)
    }
  }, [slug, triggerUpdate])

  // 获取游戏详情的函数
  const getGameDetails = useCallback(async (gameSlug: string) => {
    return await fetchGameDetails(gameSlug)
  }, [])

  // 获取特定游戏的状态
  const getGameState = useCallback((gameSlug: string) => {
    const cached = globalGameDetailsState.cache.get(gameSlug)
    const isLoading = globalGameDetailsState.loading.has(gameSlug)
    const error = globalGameDetailsState.errors.get(gameSlug)
    
    return {
      data: cached?.data || null,
      isLoading,
      error: error || null,
      isCached: !!cached && !isCacheExpired(cached),
      cachedAt: cached?.cachedAt || null,
      expiresAt: cached?.expiresAt || null
    }
  }, [updateTrigger])

  // 获取缓存统计信息
  const getCacheStats = useCallback(() => {
    const cache = globalGameDetailsState.cache
    const totalCached = cache.size
    const loadingCount = globalGameDetailsState.loading.size
    const errorCount = globalGameDetailsState.errors.size
    
    let validCount = 0
    let expiredCount = 0
    const now = Date.now()
    
    cache.forEach((item) => {
      if (item.expiresAt > now) {
        validCount++
      } else {
        expiredCount++
      }
    })
    
    return {
      totalCached,
      validCount,
      expiredCount,
      loadingCount,
      errorCount
    }
  }, [updateTrigger])

  // 如果提供了slug，自动获取该游戏的状态
  const currentGameState = slug ? getGameState(slug) : null

  return {
    // 当前游戏状态（如果提供了slug）
    data: currentGameState?.data || null,
    isLoading: currentGameState?.isLoading || false,
    error: currentGameState?.error || null,
    isCached: currentGameState?.isCached || false,
    
    // 操作函数
    getGameDetails,
    getGameState,
    clearGameCache,
    clearAllCache,
    preloadGameDetails,
    
    // 统计信息
    cacheStats: getCacheStats(),
    
    // 全局状态
    globalCache: globalGameDetailsState.cache,
    globalLoading: globalGameDetailsState.loading,
    globalErrors: globalGameDetailsState.errors
  }
}

export default useGameDetails