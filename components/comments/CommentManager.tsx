'use client'

import { useState } from 'react'
import { useCommentCacheManager } from '@/hooks/useCommentCacheManager'
import { Locale } from '@/lib/lang/dictionaraies'

interface CommentManagerProps {
  gameSlug: string
  lang: Locale
  onCommentSubmitted?: () => void
}

/**
 * 评论管理组件示例
 * 展示如何在发布评论时清除游戏详情缓存
 */
export const CommentManager = ({ gameSlug, lang, onCommentSubmitted }: CommentManagerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comment, setComment] = useState('')
  
  const { handleCommentPublished, refreshGameCache } = useCommentCacheManager()

  const handleSubmitComment = async () => {
    if (!comment.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // 这里应该是实际的评论提交API调用
      // const response = await submitComment({ gameSlug, content: comment, lang })
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(`[CommentManager] Comment submitted for game: ${gameSlug}`)
      
      // 评论提交成功后，清除游戏详情缓存
      handleCommentPublished(gameSlug, lang)
      
      // 清空评论框
      setComment('')
      
      // 通知父组件
      onCommentSubmitted?.()
      
      console.log(`[CommentManager] Cache clear triggered for game: ${gameSlug} (${lang})`)
      
    } catch (error) {
      console.error('[CommentManager] Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForceRefresh = () => {
    refreshGameCache(gameSlug, lang)
  }

  return (
    <div className="comment-manager p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">发表评论</h3>
      
      <div className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="写下你的评论..."
          className="w-full p-3 border rounded-lg resize-none h-24"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleSubmitComment}
          disabled={!comment.trim() || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '提交中...' : '发布评论'}
        </button>
        
        <button
          onClick={handleForceRefresh}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          刷新数据
        </button>
      </div>
      
      {isSubmitting && (
        <div className="mt-2 text-sm text-gray-600">
          正在提交评论并清理缓存...
        </div>
      )}
    </div>
  )
}

export default CommentManager