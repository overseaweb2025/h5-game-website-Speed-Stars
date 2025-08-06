'use client'

import { useEffect, useCallback } from 'react'
import { useLangGameDetails } from '@/hooks/LangGameDetails_value'
import { Locale } from '@/lib/lang/dictionaraies'
import { clearGameCacheAfterComment, shouldClearCacheForCommentUpdate } from '@/lib/comment-cache-utils'

interface CommentCacheManagerProps {
  gameSlug?: string
  lang?: Locale
}

/**
 * 评论缓存管理Hook
 * 处理评论发布时的游戏详情缓存清理
 */
export const useCommentCacheManager = ({ gameSlug, lang }: CommentCacheManagerProps = {}) => {
  const { deleteGameFromCache, autoGetData } = useLangGameDetails()

  // 监听评论发布事件
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleCommentPublished = async (event: CustomEvent) => {
      const { gameSlug: eventGameSlug, lang: eventLang } = event.detail
      
      console.log(`[useCommentCacheManager] Comment published for game: ${eventGameSlug} (${eventLang})`)
      
      // 删除游戏详情缓存
      deleteGameFromCache(eventLang, eventGameSlug)
      
      // 短暂延迟后重新获取最新数据
      setTimeout(() => {
        autoGetData(eventLang, eventGameSlug, false) // force=false 强制获取
      }, 500) // 0.5秒延迟确保缓存已清除
    }

    window.addEventListener('comment-published', handleCommentPublished as EventListener)
    
    return () => {
      window.removeEventListener('comment-published', handleCommentPublished as EventListener)
    }
  }, [deleteGameFromCache, autoGetData])

  // 检查当前游戏是否需要清除缓存（页面加载时）
  useEffect(() => {
    if (!gameSlug || !lang) return
    
    const needsClearCache = shouldClearCacheForCommentUpdate(gameSlug, lang)
    if (needsClearCache) {
      console.log(`[useCommentCacheManager] Cache clear needed for ${gameSlug} (${lang}) on page load`)
      deleteGameFromCache(lang, gameSlug)
      
      // 重新获取最新数据
      setTimeout(() => {
        autoGetData(lang, gameSlug, false)
      }, 200)
    }
  }, [gameSlug, lang, deleteGameFromCache, autoGetData])

  /**
   * 手动触发评论发布后的缓存清理
   */
  const handleCommentPublished = useCallback((targetGameSlug: string, targetLang: Locale) => {
    clearGameCacheAfterComment(targetGameSlug, targetLang)
  }, [])

  /**
   * 立即清除指定游戏的缓存并重新获取
   */
  const refreshGameCache = useCallback(async (targetGameSlug: string, targetLang: Locale) => {
    console.log(`[useCommentCacheManager] Manually refreshing cache for ${targetGameSlug} (${targetLang})`)
    
    // 清除缓存
    deleteGameFromCache(targetLang, targetGameSlug)
    
    // 重新获取数据
    try {
      await autoGetData(targetLang, targetGameSlug, false)
      console.log(`[useCommentCacheManager] Cache refresh completed for ${targetGameSlug} (${targetLang})`)
    } catch (error) {
      console.error(`[useCommentCacheManager] Cache refresh failed for ${targetGameSlug} (${targetLang}):`, error)
    }
  }, [deleteGameFromCache, autoGetData])

  return {
    handleCommentPublished,
    refreshGameCache
  }
}