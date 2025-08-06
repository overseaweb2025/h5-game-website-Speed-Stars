/**
 * 缓存管理工具
 * 用于检测发布状态和管理游戏详情缓存
 */

import { Locale } from './lang/dictionaraies'

/**
 * 检测是否为发布场景
 * 可以通过URL参数、环境变量或其他标识来判断
 */
export function detectPublishingMode(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search)
    const forceRefresh = urlParams.get('refresh') === 'true'
    const isPublishing = urlParams.get('publishing') === 'true'
    
    // 检查localStorage中的发布标识
    const publishingFlag = localStorage.getItem('game-publishing-mode') === 'true'
    
    return forceRefresh || isPublishing || publishingFlag
  } catch (error) {
    console.error('[CacheUtils] Error detecting publishing mode:', error)
    return false
  }
}

/**
 * 设置发布模式标识
 */
export function setPublishingMode(isPublishing: boolean): void {
  if (typeof window === 'undefined') return
  
  try {
    if (isPublishing) {
      localStorage.setItem('game-publishing-mode', 'true')
      // 设置临时标识，页面刷新后自动清除
      setTimeout(() => {
        localStorage.removeItem('game-publishing-mode')
      }, 10000) // 10秒后自动清除
    } else {
      localStorage.removeItem('game-publishing-mode')
    }
  } catch (error) {
    console.error('[CacheUtils] Error setting publishing mode:', error)
  }
}

/**
 * 强制刷新游戏详情缓存
 */
export function forceRefreshGameCache(gameSlug: string, lang: Locale): void {
  if (typeof window === 'undefined') return
  
  try {
    // 设置游戏特定的刷新标识
    const refreshKey = `force-refresh-${lang}-${gameSlug}`
    localStorage.setItem(refreshKey, Date.now().toString())
    
    console.log(`[CacheUtils] Force refresh set for game: ${gameSlug} (${lang})`)
    
    // 自动清除标识
    setTimeout(() => {
      localStorage.removeItem(refreshKey)
    }, 5000)
  } catch (error) {
    console.error('[CacheUtils] Error setting force refresh:', error)
  }
}

/**
 * 检查是否需要强制刷新指定游戏
 */
export function shouldForceRefresh(gameSlug: string, lang: Locale): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const refreshKey = `force-refresh-${lang}-${gameSlug}`
    const refreshTime = localStorage.getItem(refreshKey)
    
    if (!refreshTime) return false
    
    // 检查刷新标识是否在有效时间内（5分钟内）
    const refreshTimestamp = parseInt(refreshTime, 10)
    const now = Date.now()
    const isValid = now - refreshTimestamp < 5 * 60 * 1000 // 5分钟
    
    if (!isValid) {
      localStorage.removeItem(refreshKey)
    }
    
    return isValid
  } catch (error) {
    console.error('[CacheUtils] Error checking force refresh:', error)
    return false
  }
}