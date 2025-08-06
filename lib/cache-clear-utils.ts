/**
 * 缓存清空工具函数
 * 用于统一管理所有客户端缓存的清空操作
 */

// 所有缓存键的定义
export const CACHE_KEYS = {
  // 游戏列表缓存
  GAME_LIST_VALUE: 'language-Gamelist-value',
  GAME_LIST_TIMESTAMP: 'language-Gamelist-timestamp',
  
  // 首页数据缓存
  HOME_VALUE: 'language-home-value',
  HOME_TIMESTAMP: 'language-home-timestamp',
  
  // 博客详情缓存
  BLOG_DETAILS_VALUE: 'language-Blog-Details-value',
  BLOG_DETAILS_TIMESTAMP: 'language-Blog-Details-timestamp',
  
  // 游戏详情缓存
  GAME_DETAILS_VALUE: 'language-GameDetails-value',
  GAME_DETAILS_TIMESTAMP: 'language-GameDetails-timestamp',
  
  // 导航数据缓存
  NAVIGATION_VALUE: 'navigation-language-value',
  NAVIGATION_TIMESTAMP: 'navigation-language-timestamp',
  
  // 评论缓存标识
  COMMENT_UPDATE_PREFIX: 'comment-update-',
  
  // 发布模式标识
  PUBLISHING_MODE: 'game-publishing-mode',
  
  // 强制刷新标识前缀
  FORCE_REFRESH_PREFIX: 'force-refresh-'
} as const

/**
 * 获取所有缓存键的数组
 */
export function getAllCacheKeys(): string[] {
  return [
    CACHE_KEYS.GAME_LIST_VALUE,
    CACHE_KEYS.GAME_LIST_TIMESTAMP,
    CACHE_KEYS.HOME_VALUE,
    CACHE_KEYS.HOME_TIMESTAMP,
    CACHE_KEYS.BLOG_DETAILS_VALUE,
    CACHE_KEYS.BLOG_DETAILS_TIMESTAMP,
    CACHE_KEYS.GAME_DETAILS_VALUE,
    CACHE_KEYS.GAME_DETAILS_TIMESTAMP,
    CACHE_KEYS.NAVIGATION_VALUE,
    CACHE_KEYS.NAVIGATION_TIMESTAMP,
    CACHE_KEYS.PUBLISHING_MODE
  ]
}

/**
 * 清空所有应用缓存
 */
export function clearAllAppCaches(): { success: boolean; clearedKeys: string[]; errors: string[] } {
  if (typeof window === 'undefined') {
    return { success: false, clearedKeys: [], errors: ['Not in browser environment'] }
  }
  
  const clearedKeys: string[] = []
  const errors: string[] = []
  
  try {
    // 1. 清空固定的缓存键
    const fixedKeys = getAllCacheKeys()
    fixedKeys.forEach(key => {
      try {
        localStorage.removeItem(key)
        clearedKeys.push(key)
        console.log(`[CacheClear] Cleared fixed key: ${key}`)
      } catch (error) {
        errors.push(`Failed to clear ${key}: ${error.message}`)
      }
    })
    
    // 2. 清空动态生成的缓存键（通过前缀匹配）
    const dynamicPrefixes = [
      CACHE_KEYS.COMMENT_UPDATE_PREFIX,
      CACHE_KEYS.FORCE_REFRESH_PREFIX
    ]
    
    // 遍历所有localStorage键，找到匹配前缀的
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const shouldClear = dynamicPrefixes.some(prefix => key.startsWith(prefix))
        if (shouldClear) {
          try {
            localStorage.removeItem(key)
            clearedKeys.push(key)
            console.log(`[CacheClear] Cleared dynamic key: ${key}`)
          } catch (error) {
            errors.push(`Failed to clear dynamic key ${key}: ${error.message}`)
          }
        }
      }
    }
    
    // 3. 触发storage事件通知所有打开的标签页
    try {
      window.dispatchEvent(new Event('storage'))
      console.log('[CacheClear] Storage event dispatched to notify other tabs')
    } catch (error) {
      errors.push(`Failed to dispatch storage event: ${error.message}`)
    }
    
    // 4. 可选：清空sessionStorage中的临时缓存
    try {
      // 只清空特定的session存储，避免影响其他功能
      const sessionKeys = ['temp-cache', 'search-cache', 'filter-cache']
      sessionKeys.forEach(key => {
        if (sessionStorage.getItem(key)) {
          sessionStorage.removeItem(key)
          clearedKeys.push(`session:${key}`)
        }
      })
    } catch (error) {
      errors.push(`Failed to clear sessionStorage: ${error.message}`)
    }
    
    const success = errors.length === 0
    console.log(`[CacheClear] Cache clearing completed. Success: ${success}, Cleared: ${clearedKeys.length} keys, Errors: ${errors.length}`)
    
    return {
      success,
      clearedKeys,
      errors
    }
    
  } catch (error) {
    const errorMsg = `Critical error during cache clearing: ${error.message}`
    console.error('[CacheClear]', errorMsg)
    return {
      success: false,
      clearedKeys,
      errors: [...errors, errorMsg]
    }
  }
}

/**
 * 清空特定类型的缓存
 */
export function clearSpecificCache(cacheType: keyof typeof CACHE_KEYS): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const key = CACHE_KEYS[cacheType]
    localStorage.removeItem(key)
    
    // 如果有对应的时间戳键，也一起清空
    const timestampKey = key.replace('-value', '-timestamp')
    if (localStorage.getItem(timestampKey)) {
      localStorage.removeItem(timestampKey)
    }
    
    console.log(`[CacheClear] Cleared specific cache: ${key}`)
    return true
  } catch (error) {
    console.error(`[CacheClear] Failed to clear specific cache ${cacheType}:`, error)
    return false
  }
}

/**
 * 检查缓存使用情况
 */
export function getCacheUsageInfo(): {
  totalKeys: number
  appCacheKeys: number
  otherKeys: number
  estimatedSize: string
} {
  if (typeof window === 'undefined') {
    return { totalKeys: 0, appCacheKeys: 0, otherKeys: 0, estimatedSize: '0 KB' }
  }
  
  const totalKeys = localStorage.length
  const allAppKeys = getAllCacheKeys()
  let appCacheKeys = 0
  let estimatedBytes = 0
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key) || ''
      estimatedBytes += key.length + value.length
      
      if (allAppKeys.includes(key) || 
          key.startsWith(CACHE_KEYS.COMMENT_UPDATE_PREFIX) ||
          key.startsWith(CACHE_KEYS.FORCE_REFRESH_PREFIX)) {
        appCacheKeys++
      }
    }
  }
  
  const otherKeys = totalKeys - appCacheKeys
  const estimatedKB = (estimatedBytes / 1024).toFixed(2)
  
  return {
    totalKeys,
    appCacheKeys,
    otherKeys,
    estimatedSize: `${estimatedKB} KB`
  }
}