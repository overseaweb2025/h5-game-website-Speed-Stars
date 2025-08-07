/**
 * ISR 数据获取服务
 * 整合所有缓存 hooks，提供统一的数据获取接口
 */

import { Locale } from '@/lib/lang/dictionaraies'
import { ISRCacheMiddleware } from './isr-cache-middleware'
import { useHomeLanguage } from '@/hooks/LangHome_value'
import { useLangGameList } from '@/hooks/LangGamelist_value'
import { useLangGameDetails } from '@/hooks/LangGameDetails_value'
import { useLangBlogDetails } from '@/hooks/LangBlogDetails_value'
import { useLangBlog } from '@/hooks/LangBlog_value'

/**
 * ISR 数据服务类
 * 提供统一的数据获取接口，自动处理缓存策略
 */
export class ISRDataService {
  /**
   * 获取首页数据（优先使用缓存）
   */
  static async getHomeData(language: Locale) {
    const startTime = Date.now()
    
    // 使用 hooks 的实例
    const homeLanguage = useHomeLanguage()
    
    const result = await ISRCacheMiddleware.getHomeData(
      language,
      () => homeLanguage.getHomeInfoByLang(language),
      () => homeLanguage.autoGetHomeData(true, language)
    )
    
    const duration = Date.now() - startTime
    console.log(`[ISR Service] Home data for ${language} fetched in ${duration}ms`)
    
    return result
  }

  /**
   * 获取游戏列表数据（优先使用缓存）
   */
  static async getGameListData(language: Locale) {
    const startTime = Date.now()
    
    const langGameList = useLangGameList()
    
    const result = await ISRCacheMiddleware.getGameListData(
      language,
      () => langGameList.getLangGamelistBylang(language),
      () => langGameList.autoGetData(language, true)
    )
    
    const duration = Date.now() - startTime
    console.log(`[ISR Service] Game list data for ${language} fetched in ${duration}ms`)
    
    return result
  }

  /**
   * 获取游戏详情数据（优先使用缓存）
   */
  static async getGameDetailsData(language: Locale, slug: string) {
    const startTime = Date.now()
    
    const langGameDetails = useLangGameDetails()
    
    const result = await ISRCacheMiddleware.getGameDetailsData(
      language,
      slug,
      () => langGameDetails.getGameDetailsFromCache(language, slug),
      () => langGameDetails.autoGetData(language, slug, true)
    )
    
    const duration = Date.now() - startTime
    console.log(`[ISR Service] Game details for ${language}/${slug} fetched in ${duration}ms`)
    
    return result
  }

  /**
   * 获取博客详情数据（优先使用缓存）
   */
  static async getBlogDetailsData(language: Locale, slug: string) {
    const startTime = Date.now()
    
    const langBlogDetails = useLangBlogDetails()
    
    const result = await ISRCacheMiddleware.getBlogDetailsData(
      language,
      slug,
      () => langBlogDetails.getBlogDetailsFromCache(language, slug),
      () => langBlogDetails.autoGetData(language, slug, true)
    )
    
    const duration = Date.now() - startTime
    console.log(`[ISR Service] Blog details for ${language}/${slug} fetched in ${duration}ms`)
    
    return result
  }

  /**
   * 获取博客列表数据（优先使用缓存）
   */
  static async getBlogListData(language: Locale, form: any) {
    const startTime = Date.now()
    
    const langBlog = useLangBlog()
    
    const result = await ISRCacheMiddleware.getBlogListData(
      language,
      () => langBlog.LangBlog?.[language],
      () => langBlog.autoGetData(language, form, true)
    )
    
    const duration = Date.now() - startTime
    console.log(`[ISR Service] Blog list data for ${language} fetched in ${duration}ms`)
    
    return result
  }

  /**
   * 预热缓存（可选）
   * 在应用启动时预先加载常用数据
   */
  static async preheatCache(languages: Locale[] = ['en', 'zh']) {
    console.log('[ISR Service] Starting cache preheat...')
    
    const promises = []
    
    for (const lang of languages) {
      // 预热首页数据
      promises.push(
        this.getHomeData(lang).catch(error => 
          console.error(`[ISR Service] Preheat failed for home ${lang}:`, error)
        )
      )
      
      // 预热游戏列表数据
      promises.push(
        this.getGameListData(lang).catch(error => 
          console.error(`[ISR Service] Preheat failed for game list ${lang}:`, error)
        )
      )
    }
    
    await Promise.allSettled(promises)
    console.log('[ISR Service] Cache preheat completed')
  }

  /**
   * 清除过期缓存
   */
  static clearExpiredCache() {
    if (typeof window === 'undefined') return
    
    const cacheKeys = [
      { key: 'language-home-value', timestamp: 'language-home-timestamp' },
      { key: 'language-Gamelist-value', timestamp: 'language-Gamelist-timestamp' },
      { key: 'language-GameDetails-value', timestamp: 'language-GameDetails-timestamp' },
      { key: 'language-Blog-Details-value', timestamp: 'language-Blog-Details-timestamp' },
      { key: 'language-blog-value', timestamp: 'language-blog-timestamp' }
    ]
    
    const CACHE_EXPIRY = 5 * 60 * 1000 // 5分钟
    
    cacheKeys.forEach(({ key, timestamp }) => {
      try {
        const timestampValue = localStorage.getItem(timestamp)
        if (timestampValue) {
          const lastUpdated = parseInt(timestampValue, 10)
          if (Date.now() - lastUpdated > CACHE_EXPIRY) {
            localStorage.removeItem(key)
            localStorage.removeItem(timestamp)
            console.log(`[ISR Service] Cleared expired cache: ${key}`)
          }
        }
      } catch (error) {
        console.error(`[ISR Service] Error clearing cache ${key}:`, error)
      }
    })
  }
}

/**
 * React Hook 形式的 ISR 服务
 * 在组件中使用更加方便
 */
export function useISRData() {
  const homeLanguage = useHomeLanguage()
  const langGameList = useLangGameList()
  const langGameDetails = useLangGameDetails()
  const langBlogDetails = useLangBlogDetails()
  const langBlog = useLangBlog()

  const getHomeDataWithISR = async (language: Locale) => {
    return ISRCacheMiddleware.getHomeData(
      language,
      () => homeLanguage.getHomeInfoByLang(language),
      () => homeLanguage.autoGetHomeData(true, language)
    )
  }

  const getGameListDataWithISR = async (language: Locale) => {
    return ISRCacheMiddleware.getGameListData(
      language,
      () => langGameList.getLangGamelistBylang(language),
      () => langGameList.autoGetData(language, true)
    )
  }

  const getGameDetailsDataWithISR = async (language: Locale, slug: string) => {
    return ISRCacheMiddleware.getGameDetailsData(
      language,
      slug,
      () => langGameDetails.getGameDetailsFromCache(language, slug),
      () => langGameDetails.autoGetData(language, slug, true)
    )
  }

  const getBlogDetailsDataWithISR = async (language: Locale, slug: string) => {
    return ISRCacheMiddleware.getBlogDetailsData(
      language,
      slug,
      () => langBlogDetails.getBlogDetailsFromCache(language, slug),
      () => langBlogDetails.autoGetData(language, slug, true)
    )
  }

  const getBlogListDataWithISR = async (language: Locale, form: any) => {
    return ISRCacheMiddleware.getBlogListData(
      language,
      () => langBlog.LangBlog?.[language],
      () => langBlog.autoGetData(language, form, true)
    )
  }

  return {
    getHomeDataWithISR,
    getGameListDataWithISR,
    getGameDetailsDataWithISR,
    getBlogDetailsDataWithISR,
    getBlogListDataWithISR,
    // 原始 hooks 的所有功能
    homeLanguage,
    langGameList,
    langGameDetails,
    langBlogDetails,
    langBlog
  }
}