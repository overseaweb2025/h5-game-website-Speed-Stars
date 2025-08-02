"use client"

import { HomeGameData } from '@/app/api/types/Get/game'

// 首页数据状态管理器
interface HomeDataStore {
  data: HomeGameData | null
  isLoading: boolean
  error: string | null
  lastFetched: number | null
  cacheExpiry: number // 3分钟缓存
}

class HomeDataManager {
  private store: HomeDataStore = {
    data: null,
    isLoading: false,
    error: null,
    lastFetched: null,
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

  // 检查缓存是否有效
  private isCacheValid(): boolean {
    if (!this.store.data || !this.store.lastFetched) {
      return false
    }
    
    const now = Date.now()
    return (now - this.store.lastFetched) < this.store.cacheExpiry
  }

  // 获取首页数据（带缓存）
  async fetchHomeData(): Promise<HomeGameData | null> {
    // 如果缓存有效，直接返回缓存数据
    if (this.isCacheValid() && this.store.data) {
      return this.store.data
    }

    // 如果正在加载，等待加载完成
    if (this.store.isLoading) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.store.isLoading) {
            resolve(this.store.data)
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
      const { getGameHome } = await import('@/app/api/gameList')
      const response = await getGameHome()
      const homeData = response.data

      // 更新缓存
      this.setState({
        data: homeData,
        isLoading: false,
        error: null,
        lastFetched: Date.now()
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
  clearCache() {
    this.setState({
      data: null,
      lastFetched: null,
      error: null
    })
  }

  // 预加载数据
  preloadData() {
    if (!this.isCacheValid() && !this.store.isLoading) {
      this.fetchHomeData()
    }
  }

  // 获取游戏URL
  getGameUrl(): string | null {
    return this.store.data?.data?.game?.package?.url || null
  }

  // 获取SEO数据
  getSEOData() {
    const data = this.store.data?.data
    if (!data) return null

    return {
      title: data.game?.page_title || data.title || "Speed Stars - Racing Game",
      description: data.game?.page_description || data.description || "Play Speed Stars racing game online",
      keywords: data.game?.page_keywords || data.keywords || "speed stars, racing game, online game",
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