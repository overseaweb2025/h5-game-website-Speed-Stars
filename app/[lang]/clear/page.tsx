'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { clearAllAppCaches, CACHE_KEYS } from '@/lib/cache-clear-utils'

export default function ClearCachePage() {
  const searchParams = useSearchParams()
  const object = searchParams.get('object') || 'all'
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<string[]>([])

  useEffect(() => {
    const clearCache = async () => {
      try {
        setMessage('正在清理缓存...')
        
        // 根据 object 参数清理不同类型的缓存
        switch (object.toLowerCase()) {
          case 'all':
            await clearAllCaches()
            break
          case 'home':
            await clearHomeCaches()
            break
          case 'game':
            await clearGameCaches()
            break
          case 'blog':
            await clearBlogCaches()
            break
          case 'navigation':
            await clearNavigationCaches()
            break
          default:
            throw new Error(`未知的缓存类型: ${object}`)
        }
        
        setStatus('success')
        setMessage('缓存清理完成！')
        
        // 3秒后自动关闭页面
        setTimeout(() => {
          if (window.opener) {
            window.close()
          } else {
            window.history.back()
          }
        }, 3000)
        
      } catch (error) {
        setStatus('error')
        setMessage(`清理缓存失败: ${error.message}`)
        console.error('Cache clear error:', error)
      }
    }

    // 延迟执行，让用户看到界面
    setTimeout(clearCache, 500)
  }, [object])

  const clearAllCaches = async () => {
    const result = clearAllAppCaches()
    setDetails([
      `清理了 ${result.clearedKeys.length} 个缓存项`,
      ...result.clearedKeys.map(key => `✓ ${key}`),
      ...(result.errors.length > 0 ? ['错误:'].concat(result.errors.map(err => `✗ ${err}`)) : [])
    ])
    
    if (!result.success) {
      throw new Error('部分缓存清理失败')
    }
  }

  const clearHomeCaches = async () => {
    const keys = [CACHE_KEYS.HOME_VALUE, CACHE_KEYS.HOME_TIMESTAMP]
    const clearedKeys: string[] = []
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key)
        clearedKeys.push(key)
      } catch (error) {
        console.error(`Failed to clear ${key}:`, error)
      }
    })
    
    setDetails([
      `清理了首页缓存 ${clearedKeys.length}/${keys.length} 项`,
      ...clearedKeys.map(key => `✓ ${key}`)
    ])
    
    // 触发存储事件
    window.dispatchEvent(new Event('storage'))
  }

  const clearGameCaches = async () => {
    const keys = [
      CACHE_KEYS.GAME_LIST_VALUE,
      CACHE_KEYS.GAME_LIST_TIMESTAMP,
      CACHE_KEYS.GAME_DETAILS_VALUE,
      CACHE_KEYS.GAME_DETAILS_TIMESTAMP
    ]
    const clearedKeys: string[] = []
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key)
        clearedKeys.push(key)
      } catch (error) {
        console.error(`Failed to clear ${key}:`, error)
      }
    })
    
    // 清理动态游戏缓存
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith('game-')) {
        try {
          localStorage.removeItem(key)
          clearedKeys.push(key)
        } catch (error) {
          console.error(`Failed to clear ${key}:`, error)
        }
      }
    }
    
    setDetails([
      `清理了游戏缓存 ${clearedKeys.length} 项`,
      ...clearedKeys.map(key => `✓ ${key}`)
    ])
    
    window.dispatchEvent(new Event('storage'))
  }

  const clearBlogCaches = async () => {
    const keys = [
      CACHE_KEYS.BLOG_DETAILS_VALUE,
      CACHE_KEYS.BLOG_DETAILS_TIMESTAMP
    ]
    const clearedKeys: string[] = []
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key)
        clearedKeys.push(key)
      } catch (error) {
        console.error(`Failed to clear ${key}:`, error)
      }
    })
    
    // 清理评论相关缓存
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_KEYS.COMMENT_UPDATE_PREFIX)) {
        try {
          localStorage.removeItem(key)
          clearedKeys.push(key)
        } catch (error) {
          console.error(`Failed to clear ${key}:`, error)
        }
      }
    }
    
    setDetails([
      `清理了博客缓存 ${clearedKeys.length} 项`,
      ...clearedKeys.map(key => `✓ ${key}`)
    ])
    
    window.dispatchEvent(new Event('storage'))
  }

  const clearNavigationCaches = async () => {
    const keys = [
      CACHE_KEYS.NAVIGATION_VALUE,
      CACHE_KEYS.NAVIGATION_TIMESTAMP
    ]
    const clearedKeys: string[] = []
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key)
        clearedKeys.push(key)
      } catch (error) {
        console.error(`Failed to clear ${key}:`, error)
      }
    })
    
    setDetails([
      `清理了导航缓存 ${clearedKeys.length} 项`,
      ...clearedKeys.map(key => `✓ ${key}`)
    ])
    
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mb-4">
            {status === 'loading' && (
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            )}
            {status === 'success' && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <h1 className="text-xl font-bold mb-2">
            缓存清理工具
          </h1>
          
          <p className={`text-sm ${
            status === 'loading' ? 'text-gray-600' :
            status === 'success' ? 'text-green-600' :
            'text-red-600'
          }`}>
            {message}
          </p>
          
          {object !== 'all' && (
            <p className="text-xs text-gray-500 mt-1">
              清理类型: {object}
            </p>
          )}
        </div>
        
        {details.length > 0 && (
          <div className="bg-gray-50 rounded p-3 max-h-48 overflow-y-auto">
            <div className="text-xs space-y-1">
              {details.map((detail, index) => (
                <div 
                  key={index}
                  className={`${
                    detail.startsWith('✓') ? 'text-green-600' :
                    detail.startsWith('✗') ? 'text-red-600' :
                    'text-gray-700 font-medium'
                  }`}
                >
                  {detail}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mt-4 text-center text-xs text-gray-500">
            页面将在 3 秒后自动关闭
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              重试
            </button>
          </div>
        )}
      </div>
    </div>
  )
}