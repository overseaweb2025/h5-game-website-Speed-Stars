'use client'

import { useState, useEffect } from 'react'
import { clearAllAppCaches, getCacheUsageInfo, clearSpecificCache, CACHE_KEYS } from '@/lib/cache-clear-utils'

/**
 * 缓存管理组件
 * 用于开发和调试时管理应用缓存
 */
export default function CacheManager() {
  const [cacheInfo, setCacheInfo] = useState({
    totalKeys: 0,
    appCacheKeys: 0,
    otherKeys: 0,
    estimatedSize: '0 KB'
  })
  const [isClearing, setIsClearing] = useState(false)
  const [lastClearResult, setLastClearResult] = useState<{
    success: boolean
    clearedKeys: string[]
    errors: string[]
  } | null>(null)

  // 刷新缓存信息
  const refreshCacheInfo = () => {
    setCacheInfo(getCacheUsageInfo())
  }

  // 组件挂载时获取缓存信息
  useEffect(() => {
    refreshCacheInfo()
    
    // 设置定时刷新
    const interval = setInterval(refreshCacheInfo, 5000)
    return () => clearInterval(interval)
  }, [])

  // 清空所有缓存
  const handleClearAllCaches = async () => {
    setIsClearing(true)
    try {
      const result = clearAllAppCaches()
      setLastClearResult(result)
      
      // 短暂延迟后刷新信息
      setTimeout(() => {
        refreshCacheInfo()
        setIsClearing(false)
      }, 1000)
    } catch (error) {
      console.error('Error clearing caches:', error)
      setLastClearResult({
        success: false,
        clearedKeys: [],
        errors: [`Unexpected error: ${error.message}`]
      })
      setIsClearing(false)
    }
  }

  // 清空特定缓存
  const handleClearSpecificCache = (cacheType: keyof typeof CACHE_KEYS) => {
    const success = clearSpecificCache(cacheType)
    if (success) {
      refreshCacheInfo()
    }
  }

  // 打开统一的缓存清空页面
  const openClearCachePage = (object: string = 'all') => {
    const url = `/clear?object=${object}`
    window.open(url, '_blank', 'width=600,height=500')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🧹 缓存管理器</h2>
        
        {/* 缓存使用情况 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">总缓存键</h3>
            <p className="text-2xl font-bold text-blue-600">{cacheInfo.totalKeys}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-green-800 mb-2">应用缓存</h3>
            <p className="text-2xl font-bold text-green-600">{cacheInfo.appCacheKeys}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">其他缓存</h3>
            <p className="text-2xl font-bold text-yellow-600">{cacheInfo.otherKeys}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">估计大小</h3>
            <p className="text-2xl font-bold text-purple-600">{cacheInfo.estimatedSize}</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleClearAllCaches}
            disabled={isClearing}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {isClearing ? '正在清空...' : '🗑️ 清空所有缓存'}
          </button>
          
          <button
            onClick={() => openClearCachePage('all')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            🌐 打开缓存清空页面
          </button>
          
          <button
            onClick={refreshCacheInfo}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            🔄 刷新信息
          </button>
        </div>

        {/* 特定缓存清空 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">清空特定缓存</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => handleClearSpecificCache('GAME_LIST_VALUE')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm transition-colors"
            >
              游戏列表
            </button>
            <button
              onClick={() => handleClearSpecificCache('HOME_VALUE')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm transition-colors"
            >
              首页数据
            </button>
            <button
              onClick={() => handleClearSpecificCache('BLOG_DETAILS_VALUE')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm transition-colors"
            >
              博客详情
            </button>
            <button
              onClick={() => handleClearSpecificCache('GAME_DETAILS_VALUE')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm transition-colors"
            >
              游戏详情
            </button>
            <button
              onClick={() => handleClearSpecificCache('NAVIGATION_VALUE')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm transition-colors"
            >
              导航数据
            </button>
          </div>
          
          {/* 通过统一页面清空特定缓存 */}
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600 mb-2">或通过统一页面清空:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openClearCachePage('home')}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs transition-colors"
              >
                🏠 首页
              </button>
              <button
                onClick={() => openClearCachePage('game')}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs transition-colors"
              >
                🎮 游戏
              </button>
              <button
                onClick={() => openClearCachePage('blog')}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs transition-colors"
              >
                📝 博客
              </button>
              <button
                onClick={() => openClearCachePage('navigation')}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs transition-colors"
              >
                🧭 导航
              </button>
            </div>
          </div>
        </div>

        {/* 清空结果显示 */}
        {lastClearResult && (
          <div className={`p-4 rounded-lg border ${
            lastClearResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              lastClearResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastClearResult.success ? '✅ 清空成功' : '❌ 清空失败'}
            </h3>
            
            {lastClearResult.clearedKeys.length > 0 && (
              <div className="mb-3">
                <p className="font-semibold text-gray-700 mb-2">
                  已清空的键 ({lastClearResult.clearedKeys.length}):
                </p>
                <div className="bg-white p-2 rounded border max-h-32 overflow-y-auto">
                  {lastClearResult.clearedKeys.map((key, index) => (
                    <div key={index} className="text-sm text-gray-600 font-mono">
                      ✓ {key}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {lastClearResult.errors.length > 0 && (
              <div>
                <p className="font-semibold text-red-700 mb-2">
                  错误信息 ({lastClearResult.errors.length}):
                </p>
                <div className="bg-white p-2 rounded border max-h-32 overflow-y-auto">
                  {lastClearResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      ✗ {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 说明信息 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">💡 说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>应用缓存</strong>: 包括游戏列表、首页数据、博客详情等应用相关缓存</li>
            <li>• <strong>其他缓存</strong>: 其他第三方或系统缓存，不会被应用缓存清空操作影响</li>
            <li>• <strong>估计大小</strong>: 基于键名和值长度的粗略估算</li>
            <li>• 清空缓存会触发storage事件，通知所有打开的标签页刷新数据</li>
          </ul>
        </div>
      </div>
    </div>
  )
}