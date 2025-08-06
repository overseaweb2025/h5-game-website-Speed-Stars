/**
 * 评论相关的缓存管理工具
 * 专门处理发布评论时的游戏详情缓存清理
 */

import { Locale } from './lang/dictionaraies'

/**
 * 发布评论后清除游戏详情缓存
 * 确保用户看到最新的评论数据
 */
export function clearGameCacheAfterComment(gameSlug: string, lang: Locale): void {
  if (typeof window === 'undefined') return
  
  try {
    // 设置评论更新标识
    const cacheKey = `comment-update-${lang}-${gameSlug}`
    localStorage.setItem(cacheKey, Date.now().toString())
    
    console.log(`[CommentCacheUtils] Comment cache clear requested for game: ${gameSlug} (${lang})`)
    
    // 广播事件通知需要清除缓存
    const event = new CustomEvent('comment-published', {
      detail: { gameSlug, lang }
    })
    window.dispatchEvent(event)
    
    // 自动清除标识（5分钟后）
    setTimeout(() => {
      try {
        localStorage.removeItem(cacheKey)
      } catch (error) {
        console.error('[CommentCacheUtils] Error removing cache key:', error)
      }
    }, 5 * 60 * 1000) // 5分钟
    
  } catch (error) {
    console.error('[CommentCacheUtils] Error setting comment update flag:', error)
  }
}

/**
 * 检查是否有评论更新需要清除缓存
 */
export function shouldClearCacheForCommentUpdate(gameSlug: string, lang: Locale): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const cacheKey = `comment-update-${lang}-${gameSlug}`
    const updateTime = localStorage.getItem(cacheKey)
    
    if (!updateTime) return false
    
    // 检查更新时间是否在5分钟内
    const updateTimestamp = parseInt(updateTime, 10)
    const now = Date.now()
    const isRecent = now - updateTimestamp < 5 * 60 * 1000 // 5分钟
    
    if (!isRecent) {
      localStorage.removeItem(cacheKey)
    }
    
    return isRecent
  } catch (error) {
    console.error('[CommentCacheUtils] Error checking comment update flag:', error)
    return false
  }
}

/**
 * Hook工厂函数：创建评论缓存管理器
 */
export function createCommentCacheManager() {
  // 监听评论发布事件
  if (typeof window !== 'undefined') {
    const handleCommentPublished = (event: CustomEvent) => {
      const { gameSlug, lang } = event.detail
      console.log(`[CommentCacheManager] Received comment published event for ${gameSlug} (${lang})`)
      
      // 这里可以触发具体的缓存清理逻辑
      // 由于需要访问hook，所以实际的清理逻辑在组件中实现
    }
    
    window.addEventListener('comment-published', handleCommentPublished as EventListener)
    
    // 返回清理函数
    return () => {
      window.removeEventListener('comment-published', handleCommentPublished as EventListener)
    }
  }
  
  return () => {}
}