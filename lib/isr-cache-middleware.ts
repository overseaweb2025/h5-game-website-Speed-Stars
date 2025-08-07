/**
 * ISR 缓存中间件
 * 优先使用本地缓存数据，如果缓存不存在则通过 API 获取数据
 */

import { Locale } from '@/lib/lang/dictionaraies'
import { HomeGameInfo } from '@/app/api/types/Get/home'
import { GameDetails } from '@/app/api/types/Get/game'
import { blogDetails } from '@/app/api/types/Get/blog'
import { gamelist } from '@/app/api/types/Get/game'

// ISR 缓存策略配置
export const ISR_CONFIG = {
  // 缓存时间（5分钟）
  CACHE_TIME: 5 * 60 * 1000,
  // 重新验证时间（ISR - 60秒后在后台重新生成）
  REVALIDATE: 60
}

// ISR 缓存数据接口
export interface ISRCacheData<T = any> {
  data: T
  timestamp: number
  language: Locale
}

// ISR 中间件选项
export interface ISRMiddlewareOptions {
  cacheKey: string
  language: Locale
  fallbackFn: () => Promise<any>
}

/**
 * 检查缓存是否过期
 */
export function isISRCacheExpired(timestamp: number): boolean {
  return Date.now() - timestamp > ISR_CONFIG.CACHE_TIME
}

/**
 * 是否需要后台重新验证
 */
export function needsRevalidation(timestamp: number): boolean {
  return Date.now() - timestamp > ISR_CONFIG.REVALIDATE * 1000
}

/**
 * 从缓存 hooks 获取数据的 ISR 中间件
 */
export class ISRCacheMiddleware {
  /**
   * 首页数据 ISR 处理
   */
  static async getHomeData(
    language: Locale,
    getCacheData: () => HomeGameInfo | null,
    fetchFreshData: () => Promise<void>
  ): Promise<HomeGameInfo | null> {
    const cachedData = getCacheData()
    
    if (cachedData) {
      console.log(`[ISR] Using cached home data for ${language}`)
      
      // 检查是否需要后台重新验证
      const cacheTimestamp = this.getCacheTimestamp('home', language)
      if (cacheTimestamp && needsRevalidation(cacheTimestamp)) {
        // 后台重新获取数据（不阻塞当前请求）
        fetchFreshData().catch(error => {
          console.error('[ISR] Background revalidation failed for home data:', error)
        })
      }
      
      return cachedData
    } else {
      console.log(`[ISR] Cache miss for home data ${language}, fetching fresh data`)
      await fetchFreshData()
      return getCacheData()
    }
  }

  /**
   * 游戏列表数据 ISR 处理
   */
  static async getGameListData(
    language: Locale,
    getCacheData: () => gamelist | undefined,
    fetchFreshData: () => Promise<void>
  ): Promise<gamelist | null> {
    const cachedData = getCacheData()
    
    if (cachedData && cachedData.length > 0) {
      console.log(`[ISR] Using cached game list data for ${language}`)
      
      // 检查是否需要后台重新验证
      const cacheTimestamp = this.getCacheTimestamp('gamelist', language)
      if (cacheTimestamp && needsRevalidation(cacheTimestamp)) {
        fetchFreshData().catch(error => {
          console.error('[ISR] Background revalidation failed for game list:', error)
        })
      }
      
      return cachedData
    } else {
      console.log(`[ISR] Cache miss for game list ${language}, fetching fresh data`)
      await fetchFreshData()
      return getCacheData() || null
    }
  }

  /**
   * 游戏详情数据 ISR 处理
   */
  static async getGameDetailsData(
    language: Locale,
    slug: string,
    getCacheData: () => GameDetails | null,
    fetchFreshData: () => Promise<void>
  ): Promise<GameDetails | null> {
    const cachedData = getCacheData()
    
    if (cachedData) {
      console.log(`[ISR] Using cached game details for ${language}/${slug}`)
      
      // 检查是否需要后台重新验证
      const cacheTimestamp = this.getCacheTimestamp('gamedetails', language, slug)
      if (cacheTimestamp && needsRevalidation(cacheTimestamp)) {
        fetchFreshData().catch(error => {
          console.error('[ISR] Background revalidation failed for game details:', error)
        })
      }
      
      return cachedData
    } else {
      console.log(`[ISR] Cache miss for game details ${language}/${slug}, fetching fresh data`)
      await fetchFreshData()
      return getCacheData()
    }
  }

  /**
   * 博客详情数据 ISR 处理
   */
  static async getBlogDetailsData(
    language: Locale,
    slug: string,
    getCacheData: () => blogDetails | null,
    fetchFreshData: () => Promise<void>
  ): Promise<blogDetails | null> {
    const cachedData = getCacheData()
    
    if (cachedData) {
      console.log(`[ISR] Using cached blog details for ${language}/${slug}`)
      
      // 检查是否需要后台重新验证
      const cacheTimestamp = this.getCacheTimestamp('blogdetails', language, slug)
      if (cacheTimestamp && needsRevalidation(cacheTimestamp)) {
        fetchFreshData().catch(error => {
          console.error('[ISR] Background revalidation failed for blog details:', error)
        })
      }
      
      return cachedData
    } else {
      console.log(`[ISR] Cache miss for blog details ${language}/${slug}, fetching fresh data`)
      await fetchFreshData()
      return getCacheData()
    }
  }

  /**
   * 博客列表数据 ISR 处理
   */
  static async getBlogListData(
    language: Locale,
    getCacheData: () => any,
    fetchFreshData: () => Promise<void>
  ): Promise<any> {
    const cachedData = getCacheData()
    
    if (cachedData && Object.keys(cachedData).length > 0) {
      console.log(`[ISR] Using cached blog list data for ${language}`)
      
      // 检查是否需要后台重新验证
      const cacheTimestamp = this.getCacheTimestamp('bloglist', language)
      if (cacheTimestamp && needsRevalidation(cacheTimestamp)) {
        fetchFreshData().catch(error => {
          console.error('[ISR] Background revalidation failed for blog list:', error)
        })
      }
      
      return cachedData
    } else {
      console.log(`[ISR] Cache miss for blog list ${language}, fetching fresh data`)
      await fetchFreshData()
      return getCacheData()
    }
  }

  /**
   * 获取缓存时间戳（从 localStorage）
   */
  private static getCacheTimestamp(type: string, language: Locale, slug?: string): number | null {
    if (typeof window === 'undefined') return null
    
    try {
      let timestampKey = ''
      
      switch (type) {
        case 'home':
          timestampKey = 'language-home-timestamp'
          break
        case 'gamelist':
          timestampKey = 'language-Gamelist-timestamp'
          break
        case 'gamedetails':
          timestampKey = 'language-GameDetails-timestamp'
          break
        case 'blogdetails':
          timestampKey = 'language-Blog-Details-timestamp'
          break
        case 'bloglist':
          timestampKey = 'language-blog-timestamp'
          break
        default:
          return null
      }
      
      const timestamp = localStorage.getItem(timestampKey)
      return timestamp ? parseInt(timestamp, 10) : null
    } catch (error) {
      console.error('[ISR] Failed to get cache timestamp:', error)
      return null
    }
  }
}

/**
 * ISR 工具函数
 */
export const ISRUtils = {
  /**
   * 生成缓存键
   */
  generateCacheKey: (type: string, language: Locale, slug?: string): string => {
    return slug ? `${type}-${language}-${slug}` : `${type}-${language}`
  },

  /**
   * 检查是否为生产环境（生产环境才使用 ISR）
   */
  isProduction: (): boolean => {
    return process.env.NODE_ENV === 'production'
  },

  /**
   * 记录 ISR 性能
   */
  logPerformance: (type: string, language: Locale, useCache: boolean, duration: number) => {
    const source = useCache ? 'cache' : 'api'
    console.log(`[ISR Performance] ${type} ${language} from ${source}: ${duration}ms`)
  }
}