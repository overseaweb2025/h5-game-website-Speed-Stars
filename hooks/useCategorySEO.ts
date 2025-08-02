"use client"

import { useState, useEffect, useCallback } from 'react'
import { getGameCategory } from '@/app/api/gameList'
import { CategorySEO } from '@/app/api/types/Get/game'

export interface CachedCategorySEO {
  category: string
  seo: CategorySEO
  cachedAt: number
  expiresAt: number
}

interface CategorySEOState {
  cache: Map<string, CachedCategorySEO>
  loading: Set<string>
  errors: Map<string, string>
}

const CACHE_DURATION = 3 * 60 * 1000 // 3分钟缓存时间
const STORAGE_KEY = 'category_seo_cache'

// 全局状态
let globalCategorySEOState: CategorySEOState = {
  cache: new Map(),
  loading: new Set(),
  errors: new Map()
}

// 监听器存储
const seoListeners = new Set<() => void>()

// 通知所有监听器状态更新
const notifySEOListeners = () => {
  seoListeners.forEach(listener => listener())
}

// 更新全局状态
const updateGlobalState = (updates: Partial<CategorySEOState>) => {
  if (updates.cache) {
    globalCategorySEOState.cache = new Map(updates.cache)
  }
  if (updates.loading) {
    globalCategorySEOState.loading = new Set(updates.loading)
  }
  if (updates.errors) {
    globalCategorySEOState.errors = new Map(updates.errors)
  }
  notifySEOListeners()
}

// 从localStorage加载缓存
const loadCacheFromStorage = (): Map<string, CachedCategorySEO> => {
  if (typeof window === 'undefined') return new Map()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsedArray = JSON.parse(stored) as [string, CachedCategorySEO][]
      const cache = new Map(parsedArray)
      
      // 清除过期的缓存项
      const now = Date.now()
      const validCache = new Map<string, CachedCategorySEO>()
      
      cache.forEach((item, category) => {
        if (item.expiresAt > now) {
          validCache.set(category, item)
        } else {
          // Remove expired cache item
        }
      })
      
      return validCache
    }
  } catch (error) {
  }
  
  return new Map()
}

// 保存缓存到localStorage
const saveCacheToStorage = (cache: Map<string, CachedCategorySEO>) => {
  if (typeof window === 'undefined') return
  
  try {
    const cacheArray = Array.from(cache.entries())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheArray))
  } catch (error) {
  }
}

// 检查缓存项是否过期
const isCacheExpired = (cachedItem: CachedCategorySEO): boolean => {
  return Date.now() > cachedItem.expiresAt
}

// 从API响应中提取SEO信息
const extractSEOFromResponse = (response: any): CategorySEO | null => {
  try {
    if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const firstGame = response.data.data[0]
      if (firstGame.category) {
        return {
          page_title: firstGame.category.page_title || '',
          page_description: firstGame.category.page_description || '',
          page_keywords: firstGame.category.page_keywords || ''
        }
      }
    }
  } catch (error) {
  }
  return null
}

// 创建默认SEO信息
const createDefaultSEO = (category: string): CategorySEO => {
  const decodedCategory = decodeURIComponent(category)
  return {
    page_title: `${decodedCategory} Games - Free Online Games`,
    page_description: `Play free ${decodedCategory.toLowerCase()} games online. Enjoy our collection of ${decodedCategory.toLowerCase()} games with no downloads required.`,
    page_keywords: `${decodedCategory}, games, online games, free games, browser games, ${decodedCategory.toLowerCase()} games`
  }
}

// 清理过期的缓存项
const cleanupExpiredCache = () => {
  const now = Date.now()
  const newCache = new Map<string, CachedCategorySEO>()
  let hasExpired = false
  
  globalCategorySEOState.cache.forEach((item, category) => {
    if (item.expiresAt > now) {
      newCache.set(category, item)
    } else {
      hasExpired = true
    }
  })
  
  if (hasExpired) {
    updateGlobalState({ cache: newCache })
    saveCacheToStorage(newCache)
  }
}

// 初始化缓存
const initializeCache = () => {
  if (globalCategorySEOState.cache.size === 0) {
    const storedCache = loadCacheFromStorage()
    updateGlobalState({ cache: storedCache })
  }
}

// 获取类别SEO信息（从缓存或API）
const fetchCategorySEO = async (category: string): Promise<CategorySEO | null> => {
  // 检查是否正在加载
  if (globalCategorySEOState.loading.has(category)) {
    return null
  }
  
  // 清理过期缓存
  cleanupExpiredCache()
  
  // 检查缓存
  const cached = globalCategorySEOState.cache.get(category)
  if (cached && !isCacheExpired(cached)) {
    return cached.seo
  }
  
  // 从API获取数据
  const newLoading = new Set(globalCategorySEOState.loading)
  newLoading.add(category)
  updateGlobalState({ loading: newLoading })
  
  try {
    const response = await getGameCategory(category)
    
    const seoData = extractSEOFromResponse(response)
    
    if (seoData) {
      // 缓存API数据
      const now = Date.now()
      const cachedItem: CachedCategorySEO = {
        category,
        seo: seoData,
        cachedAt: now,
        expiresAt: now + CACHE_DURATION
      }
      
      const newCache = new Map(globalCategorySEOState.cache)
      newCache.set(category, cachedItem)
      
      // 清除加载状态和错误
      const newLoadingState = new Set(globalCategorySEOState.loading)
      newLoadingState.delete(category)
      
      const newErrors = new Map(globalCategorySEOState.errors)
      newErrors.delete(category)
      
      updateGlobalState({
        cache: newCache,
        loading: newLoadingState,
        errors: newErrors
      })
      
      saveCacheToStorage(newCache)
      
      return seoData
    } else {
      throw new Error('No SEO data found in response')
    }
  } catch (error: any) {
    
    // 先清除加载状态
    const newLoadingState = new Set(globalCategorySEOState.loading)
    newLoadingState.delete(category)
    
    // 使用默认SEO数据
    const defaultSEO = createDefaultSEO(category)
    
    // 缓存默认数据（短时间缓存）
    const now = Date.now()
    const cachedItem: CachedCategorySEO = {
      category,
      seo: defaultSEO,
      cachedAt: now,
      expiresAt: now + (30 * 1000) // 30秒后过期，鼓励重新尝试API
    }
    
    const newCache = new Map(globalCategorySEOState.cache)
    newCache.set(category, cachedItem)
    
    // 清除错误，因为我们有默认数据
    const newErrors = new Map(globalCategorySEOState.errors)
    newErrors.delete(category)
    
    updateGlobalState({
      cache: newCache,
      loading: newLoadingState,
      errors: newErrors
    })
    
    saveCacheToStorage(newCache)
    
    return defaultSEO
  }
}

// 手动清除特定类别的缓存
const clearCategoryCache = (category: string) => {
  const newCache = new Map(globalCategorySEOState.cache)
  newCache.delete(category)
  
  const newErrors = new Map(globalCategorySEOState.errors)
  newErrors.delete(category)
  
  updateGlobalState({
    cache: newCache,
    errors: newErrors
  })
  
  saveCacheToStorage(newCache)
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
  
}

// 类别SEO Hook
export const useCategorySEO = (category?: string) => {
  const [updateTrigger, setUpdateTrigger] = useState(0)
  
  // 强制重新渲染的函数
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    // 初始化缓存
    initializeCache()
    
    // 添加监听器
    seoListeners.add(triggerUpdate)
    
    // 如果提供了category且没有数据，自动获取
    if (category && !globalCategorySEOState.cache.has(category) && !globalCategorySEOState.loading.has(category)) {
      fetchCategorySEO(category)
    }
    
    // 设置定期清理过期缓存
    const cleanupInterval = setInterval(() => {
      cleanupExpiredCache()
    }, 60000) // 每分钟清理一次过期缓存
    
    return () => {
      seoListeners.delete(triggerUpdate)
      clearInterval(cleanupInterval)
    }
  }, [category, triggerUpdate])

  // 获取类别SEO的函数
  const getCategorySEO = useCallback(async (categoryName: string) => {
    return await fetchCategorySEO(categoryName)
  }, [])

  // 获取特定类别的状态
  const getCategoryState = useCallback((categoryName: string) => {
    const cached = globalCategorySEOState.cache.get(categoryName)
    const isLoading = globalCategorySEOState.loading.has(categoryName)
    const error = globalCategorySEOState.errors.get(categoryName)
    
    return {
      data: cached?.seo || null,
      isLoading,
      error: error || null,
      isCached: !!cached && !isCacheExpired(cached),
      cachedAt: cached?.cachedAt || null,
      expiresAt: cached?.expiresAt || null
    }
  }, [updateTrigger])

  // 获取缓存统计信息
  const getCacheStats = useCallback(() => {
    const cache = globalCategorySEOState.cache
    const totalCached = cache.size
    const loadingCount = globalCategorySEOState.loading.size
    const errorCount = globalCategorySEOState.errors.size
    
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

  // 如果提供了category，自动获取该类别的状态
  const currentCategoryState = category ? getCategoryState(category) : null

  return {
    // 当前类别状态（如果提供了category）
    data: currentCategoryState?.data || null,
    isLoading: currentCategoryState?.isLoading || false,
    error: currentCategoryState?.error || null,
    isCached: currentCategoryState?.isCached || false,
    
    // 操作函数
    getCategorySEO,
    getCategoryState,
    clearCategoryCache,
    clearAllCache,
    
    // 统计信息
    cacheStats: getCacheStats(),
    
    // 全局状态
    globalCache: globalCategorySEOState.cache,
    globalLoading: globalCategorySEOState.loading,
    globalErrors: globalCategorySEOState.errors
  }
}

export default useCategorySEO