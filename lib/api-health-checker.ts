/**
 * API 健康检查和降级处理工具
 * 监控API状态，提供降级数据和错误恢复机制
 */

import { Locale } from '@/lib/lang/dictionaraies'

// API 健康状态接口
interface APIHealthStatus {
  isHealthy: boolean
  lastCheckTime: number
  consecutiveFailures: number
  responseTime: number | null
  lastError: string | null
}

// 降级数据配置
interface FallbackData {
  gameList: any[]
  navigation: any
  homeData: any
}

// API 健康检查管理器
export class APIHealthChecker {
  private static healthStatus: APIHealthStatus = {
    isHealthy: true,
    lastCheckTime: 0,
    consecutiveFailures: 0,
    responseTime: null,
    lastError: null
  }

  private static readonly MAX_FAILURES = 3
  private static readonly HEALTH_CHECK_INTERVAL = 5 * 60 * 1000 // 5分钟
  private static readonly HEALTH_CHECK_TIMEOUT = 5000 // 5秒

  /**
   * 检查API健康状态
   */
  static async checkAPIHealth(): Promise<boolean> {
    const now = Date.now()
    
    // 如果距离上次检查时间太短，返回缓存状态
    if (now - this.healthStatus.lastCheckTime < this.HEALTH_CHECK_INTERVAL) {
      return this.healthStatus.isHealthy
    }

    try {
      const startTime = Date.now()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/health`, {
        method: 'GET',
        timeout: this.HEALTH_CHECK_TIMEOUT,
      } as any)

      const responseTime = Date.now() - startTime

      if (response.ok) {
        // API健康
        this.healthStatus = {
          isHealthy: true,
          lastCheckTime: now,
          consecutiveFailures: 0,
          responseTime,
          lastError: null
        }
        console.log(`[APIHealthChecker] API is healthy (${responseTime}ms)`)
        return true
      } else {
        throw new Error(`Health check failed with status: ${response.status}`)
      }
    } catch (error: any) {
      // API不健康
      this.healthStatus = {
        isHealthy: false,
        lastCheckTime: now,
        consecutiveFailures: this.healthStatus.consecutiveFailures + 1,
        responseTime: null,
        lastError: error.message || 'Unknown error'
      }
      
      console.warn(`[APIHealthChecker] API health check failed (${this.healthStatus.consecutiveFailures}/${this.MAX_FAILURES}):`, error)
      return false
    }
  }

  /**
   * 获取当前API健康状态
   */
  static getHealthStatus(): APIHealthStatus {
    return { ...this.healthStatus }
  }

  /**
   * 判断是否应该使用降级数据
   */
  static shouldUseFallback(): boolean {
    return !this.healthStatus.isHealthy && 
           this.healthStatus.consecutiveFailures >= this.MAX_FAILURES
  }

  /**
   * 记录API请求失败
   */
  static recordFailure(error: any) {
    this.healthStatus.consecutiveFailures += 1
    this.healthStatus.lastError = error?.message || 'Request failed'
    
    if (this.healthStatus.consecutiveFailures >= this.MAX_FAILURES) {
      this.healthStatus.isHealthy = false
      console.warn('[APIHealthChecker] API marked as unhealthy due to consecutive failures')
    }
  }

  /**
   * 记录API请求成功
   */
  static recordSuccess(responseTime?: number) {
    this.healthStatus.isHealthy = true
    this.healthStatus.consecutiveFailures = 0
    this.healthStatus.lastError = null
    if (responseTime) {
      this.healthStatus.responseTime = responseTime
    }
  }
}

// 降级数据提供器
export class FallbackDataProvider {
  /**
   * 获取降级游戏列表数据
   */
  static getFallbackGameList(lang: Locale): any[] {
    const fallbackGames = [
      {
        id: 1,
        name: 'speed-stars',
        display_name: 'Speed Stars',
        thumbnail: '/images/fallback-game.jpg',
        category: 'racing',
        description: lang === 'zh' ? '极速赛车游戏' : 'High-speed racing game'
      },
      {
        id: 2,
        name: 'puzzle-master',
        display_name: 'Puzzle Master',
        thumbnail: '/images/fallback-puzzle.jpg',
        category: 'puzzle',
        description: lang === 'zh' ? '益智解谜游戏' : 'Brain puzzle game'
      }
    ]

    return [{
      category: lang === 'zh' ? '热门游戏' : 'Popular Games',
      games: fallbackGames
    }]
  }

  /**
   * 获取降级导航数据
   */
  static getFallbackNavigation(lang: Locale): any {
    return {
      top_navigation: [
        {
          url: '/games',
          text: lang === 'zh' ? '游戏' : 'Games',
          icon: ''
        },
        {
          url: '/about',
          text: lang === 'zh' ? '关于' : 'About',
          icon: ''
        }
      ],
      footer_navigation: []
    }
  }

  /**
   * 获取降级首页数据
   */
  static getFallbackHomeData(lang: Locale): any {
    return {
      title: lang === 'zh' ? 'Speed Stars - 在线游戏平台' : 'Speed Stars - Online Gaming Platform',
      description: lang === 'zh' ? '免费在线游戏平台，提供各种精彩游戏' : 'Free online gaming platform with exciting games',
      game: {
        page_title: 'Speed Stars',
        page_description: lang === 'zh' ? '最佳在线游戏体验' : 'Best online gaming experience',
        page_keywords: lang === 'zh' ? '在线游戏,免费游戏,Speed Stars' : 'online games,free games,Speed Stars'
      }
    }
  }
}

// API错误恢复工具
export class APIErrorRecovery {
  /**
   * 带有健康检查的API请求包装器
   */
  static async makeRequestWithFallback<T>(
    apiCall: () => Promise<T>,
    fallbackData: T,
    requestName: string = 'API Request'
  ): Promise<T> {
    try {
      const startTime = Date.now()
      
      // 首先检查API健康状态
      if (APIHealthChecker.shouldUseFallback()) {
        console.warn(`[APIErrorRecovery] Using fallback data for ${requestName} due to API health issues`)
        return fallbackData
      }

      // 尝试API调用
      const result = await apiCall()
      
      // 记录成功
      const responseTime = Date.now() - startTime
      APIHealthChecker.recordSuccess(responseTime)
      
      console.log(`[APIErrorRecovery] ${requestName} succeeded (${responseTime}ms)`)
      return result

    } catch (error: any) {
      // 记录失败
      APIHealthChecker.recordFailure(error)
      
      console.error(`[APIErrorRecovery] ${requestName} failed:`, error)
      
      // 如果是500错误或网络错误，使用降级数据
      if (error?.response?.status === 500 || 
          error?.code === 'NETWORK_ERROR' || 
          error?.message?.includes('timeout')) {
        console.warn(`[APIErrorRecovery] Using fallback data for ${requestName}`)
        return fallbackData
      }
      
      // 其他错误继续抛出
      throw error
    }
  }

  /**
   * 自动重试的API请求
   */
  static async makeRequestWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    retryDelay: number = 1000,
    requestName: string = 'API Request'
  ): Promise<T> {
    let lastError: any
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`[APIErrorRecovery] Retrying ${requestName} (attempt ${attempt + 1}/${maxRetries + 1})`)
        }
        
        const result = await apiCall()
        
        if (attempt > 0) {
          console.log(`[APIErrorRecovery] ${requestName} succeeded on retry ${attempt}`)
        }
        
        return result
        
      } catch (error: any) {
        lastError = error
        
        // 如果是最后一次尝试，或者不是可重试的错误，直接抛出
        if (attempt === maxRetries || !this.isRetryableError(error)) {
          throw error
        }
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
    
    throw lastError
  }

  /**
   * 判断错误是否可重试
   */
  private static isRetryableError(error: any): boolean {
    // 500、502、503、504 错误可以重试
    const retryableStatusCodes = [500, 502, 503, 504]
    const status = error?.response?.status
    
    if (status && retryableStatusCodes.includes(status)) {
      return true
    }
    
    // 网络错误和超时错误可以重试
    if (error?.code === 'NETWORK_ERROR' || 
        error?.message?.includes('timeout') ||
        error?.message?.includes('ECONNRESET')) {
      return true
    }
    
    return false
  }
}

// 统一导出
export const APIUtils = {
  HealthChecker: APIHealthChecker,
  FallbackDataProvider,
  ErrorRecovery: APIErrorRecovery
}

export default APIUtils