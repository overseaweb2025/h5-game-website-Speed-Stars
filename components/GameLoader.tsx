"use client"

import { useState, useEffect } from 'react'
import { Play, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

interface GameLoaderProps {
  gameName: string
  gameUrl?: string
  onLoad?: () => void
  onError?: (error: string) => void
  className?: string
}

export default function GameLoader({ 
  gameName, 
  gameUrl, 
  onLoad, 
  onError, 
  className = "" 
}: GameLoaderProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [userInteracted, setUserInteracted] = useState(false)

  // 开始加载游戏
  const startLoading = () => {
    setLoadingState('loading')
    setLoadingProgress(0)
    setUserInteracted(true)
    
    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // 模拟游戏加载
    setTimeout(() => {
      clearInterval(progressInterval)
      setLoadingProgress(100)
      
      setTimeout(() => {
        setLoadingState('loaded')
        onLoad?.()
      }, 500)
    }, 3000 + Math.random() * 2000)
  }

  // 重试加载
  const retryLoading = () => {
    setLoadingState('idle')
    setErrorMessage('')
    setLoadingProgress(0)
  }

  // 监听Unity游戏加载事件
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 监听Unity游戏加载完成
      const handleUnityLoaded = () => {
        if (loadingState === 'loading') {
          setLoadingProgress(100)
          setTimeout(() => {
            setLoadingState('loaded')
            onLoad?.()
          }, 300)
        }
      }

      // 监听Unity游戏加载错误
      const handleUnityError = (event: any) => {
        if (loadingState === 'loading') {
          const errorMsg = event.detail?.message || '游戏加载失败'
          setErrorMessage(errorMsg)
          setLoadingState('error')
          onError?.(errorMsg)
        }
      }

      window.addEventListener('unity-loaded', handleUnityLoaded)
      window.addEventListener('unity-error', handleUnityError)

      return () => {
        window.removeEventListener('unity-loaded', handleUnityLoaded)
        window.removeEventListener('unity-error', handleUnityError)
      }
    }
  }, [loadingState, onLoad, onError])

  // 渲染加载状态
  const renderLoadingContent = () => {
    switch (loadingState) {
      case 'idle':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{gameName}</h2>
              <p className="text-gray-300 mb-6">准备开始游戏体验</p>
              <button
                onClick={startLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                开始游戏
              </button>
            </div>
            {!userInteracted && (
              <div className="text-center text-sm text-gray-400 max-w-md">
                <p>🎮 点击开始按钮启动游戏</p>
                <p>📱 支持移动设备和桌面浏览器</p>
                <p>🔊 建议开启音效获得最佳体验</p>
              </div>
            )}
          </div>
        )

      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              {/* 进度环 */}
              <svg className="absolute inset-0 w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - loadingProgress / 100)}`}
                  className="transition-all duration-300"
                />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">加载中</h2>
              <p className="text-gray-300 mb-2">{gameName} 正在启动...</p>
              <div className="text-lg font-semibold text-white">
                {Math.round(loadingProgress)}%
              </div>
            </div>
            <div className="text-center text-sm text-gray-400 max-w-md">
              <p>🎯 正在加载游戏资源</p>
              <p>⚡ 首次加载可能需要较长时间</p>
              <p>🌐 请保持网络连接稳定</p>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">加载失败</h2>
              <p className="text-gray-300 mb-2">{errorMessage || '游戏加载遇到问题'}</p>
              <button
                onClick={retryLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重试加载
              </button>
            </div>
            <div className="text-center text-sm text-gray-400 max-w-md">
              <p>💡 请检查网络连接</p>
              <p>🔄 尝试刷新页面</p>
              <p>🖥️ 确保浏览器支持WebGL</p>
            </div>
          </div>
        )

      case 'loaded':
        return null // 游戏已加载，不显示覆盖层

      default:
        return null
    }
  }

  if (loadingState === 'loaded') {
    return null
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center z-50 ${className}`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 p-8 max-w-lg mx-auto">
        {renderLoadingContent()}
      </div>
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}