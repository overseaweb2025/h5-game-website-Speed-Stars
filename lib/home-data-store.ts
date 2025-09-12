"use client"

import { HomeGameData } from '@/app/api/types/Get/game'
import { Locale } from './lang/dictionaraies'

// 首页数据状态管理器
interface LanguageCache {
  data: HomeGameData | null
  lastFetched: number | null
}

interface HomeDataStore {
  data: Partial<Record<Locale, LanguageCache>>
  isLoading: boolean
  error: string | null
  cacheExpiry: number // 3分钟缓存
}

class HomeDataManager {
  private store: HomeDataStore = {
    data: {},
    isLoading: false,
    error: null,
    cacheExpiry: 3 * 60 * 1000 // 3分钟
  }

  private listeners: Set<() => void> = new Set()

  // 获取当前状态
  getState(): HomeDataStore {
    return { ...this.store }
  }

  // 订阅状态变化
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  // 通知订阅者
  private notify() {
    this.listeners.forEach(callback => callback())
  }

  // 更新状态
  private setState(updates: Partial<HomeDataStore>) {
    this.store = { ...this.store, ...updates }
    this.notify()
  }

  // 检查特定语言的缓存是否有效
  private isCacheValid(lang: Locale): boolean {
    const langCache = this.store.data[lang]
    if (!langCache || !langCache.data || !langCache.lastFetched) {
      return false
    }
    
    const now = Date.now()
    return (now - langCache.lastFetched) < this.store.cacheExpiry
  }

  // 获取首页数据（带缓存）
  async fetchHomeData(lang: Locale): Promise<HomeGameData | null> {
    // 如果缓存有效，直接返回缓存数据
    if (this.isCacheValid(lang)) {
      return this.store.data[lang]!.data
    }

    // 如果正在加载，等待加载完成
    if (this.store.isLoading) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.store.isLoading) {
            resolve(this.store.data[lang]?.data || null)
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }

    // 开始加载数据
    this.setState({ isLoading: true, error: null })

    try {
      // 动态导入避免服务端渲染问题
      const { getGameHome } = await import('@/app/api/game')
      const response = await getGameHome(lang)
      const homeData = response.data

      // 更新特定语言的缓存
      this.setState({
        data: {
          ...this.store.data,
          [lang]: {
            data: homeData,
            lastFetched: Date.now()
          }
        },
        isLoading: false,
        error: null,
      })

      return homeData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch home data'
      
      this.setState({
        isLoading: false,
        error: errorMessage
      })

      return null
    }
  }

  // 清除缓存
  clearCache(lang?: Locale) {
    if (lang) {
      const newData = { ...this.store.data }
      delete newData[lang]
      this.setState({ data: newData })
    } else {
      this.setState({
        data: {},
        lastFetched: null,
        error: null
      })
    }
  }

  // 预加载数据
  preloadData(lang: Locale) {
    if (!this.isCacheValid(lang) && !this.store.isLoading) {
      this.fetchHomeData(lang)
    }
  }

  // 获取游戏URL
  getGameUrl(lang: Locale): string | null {
    return this.store.data[lang]?.data?.data?.game?.package?.url || null
  }

  // 获取SEO数据
  getSEOData(lang: Locale) {
    const data = this.store.data[lang]?.data?.data
    if (!data) return null

    return {
      title: data.game?.page_title || data.title || "Free Game",
      description: data.game?.page_description || data.description || "Play Free Game racing game online",
      keywords: data.game?.page_keywords || data.keywords || "Free Game, racing game, online game",
      category: data.game?.category || "Action",
      aboutContent: data.page_content?.About || ""
    }
  }
}

// 创建全局实例
const homeDataManager = new HomeDataManager()

export default homeDataManager

// 导出类型
export type { HomeDataStore }