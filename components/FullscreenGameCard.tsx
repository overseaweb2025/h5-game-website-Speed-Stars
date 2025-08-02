"use client"

import { useState, useEffect } from 'react'
import { X, RotateCcw, Maximize, RotateCw } from 'lucide-react'

interface FullscreenGameCardProps {
  isOpen: boolean
  onClose: () => void
  gameUrl: string
  gameTitle: string
}

export default function FullscreenGameCard({ 
  isOpen, 
  onClose, 
  gameUrl, 
  gameTitle 
}: FullscreenGameCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showRotationTip, setShowRotationTip] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  
  // 根据设备类型选择URL
  const getProxiedUrl = (originalUrl: string) => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const isMobileDevice = width < 768
      
      // 在移动端使用代理来模拟桌面环境
      if (isMobileDevice) {
        return `/api/game-proxy?url=${encodeURIComponent(originalUrl)}`
      }
    }
    return originalUrl
  }

  // 检测设备方向和屏幕尺寸
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobileDevice = width < 768
      const isLandscapeOrientation = width > height
      
      setIsMobile(isMobileDevice)
      setIsLandscape(isLandscapeOrientation)
      
      // 在移动设备上，如果是横屏游戏但设备是竖屏，显示旋转提示
      if (isMobileDevice && !isLandscapeOrientation && isOpen) {
        setShowRotationTip(true)
        // 3秒后自动隐藏提示
        setTimeout(() => setShowRotationTip(false), 3000)
      } else {
        setShowRotationTip(false)
      }
    }
    
    // 模拟桌面User-Agent（在移动端）
    if (typeof window !== 'undefined' && window.navigator && isMobile) {
      // 尝试修改navigator.userAgent (只读，但可以尝试其他方法)
      try {
        Object.defineProperty(window.navigator, 'userAgent', {
          get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          configurable: true
        })
      } catch (error) {
        console.log('无法修改User-Agent:', error)
      }
    }
    
    if (isOpen) {
      checkOrientation()
      window.addEventListener('resize', checkOrientation)
      window.addEventListener('orientationchange', checkOrientation)
      
      return () => {
        window.removeEventListener('resize', checkOrientation)
        window.removeEventListener('orientationchange', checkOrientation)
      }
    }
  }, [isOpen])

  // 当卡片打开时重置加载状态
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [isOpen])

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleRefresh = () => {
    setIsLoading(true)
    const iframe = document.getElementById('fullscreen-game-iframe') as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  const handleFullscreen = () => {
    const gameContainer = document.getElementById('fullscreen-game-container')
    if (!document.fullscreenElement) {
      gameContainer?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900">
      {/* 旋转提示 - 仅在移动端横屏游戏且设备竖屏时显示 */}
      {showRotationTip && isMobile && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] bg-black bg-opacity-90 text-white px-6 py-4 rounded-xl shadow-2xl animate-pulse">
          <div className="flex items-center space-x-3">
            <RotateCw className="w-8 h-8 text-blue-400 animate-spin" style={{ animationDuration: '2s' }} />
            <div>
              <p className="text-lg font-bold mb-1">最佳游戏体验</p>
              <p className="text-sm text-gray-300">请将设备横屏以获得更好的游戏体验</p>
            </div>
          </div>
        </div>
      )}

      {/* 导航栏 */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-md">
            {gameTitle}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 翻转提示按钮 - 仅在移动端显示 */}
          {isMobile && (
            <button
              onClick={() => {
                setShowRotationTip(true)
                setTimeout(() => setShowRotationTip(false), 3000)
              }}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="显示旋转提示"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="重新加载游戏"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="全屏模式"
          >
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="关闭游戏"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* 游戏容器 */}
      <div
        id="fullscreen-game-container"
        className="relative w-full"
        style={{ 
          height: 'calc(100vh - 64px)',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {/* 加载指示器 */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4 mx-auto"></div>
              <p className="text-lg">游戏加载中...</p>
              <p className="text-sm text-gray-400 mt-2">{gameTitle}</p>
            </div>
          </div>
        )}

        {/* 游戏iframe */}
        <iframe
          id="fullscreen-game-iframe"
          src={getProxiedUrl(gameUrl)}
          title={gameTitle}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; microphone; camera"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-downloads"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => {
            console.log('Fullscreen game iframe loaded')
            setIsLoading(false)
            
            // 尝试在iframe加载后执行一些操作
            const iframe = document.getElementById('fullscreen-game-iframe') as HTMLIFrameElement
            if (iframe && iframe.contentWindow) {
              try {
                // 在移动端尝试模拟桌面环境
                if (isMobile) {
                  iframe.contentWindow.postMessage({
                    type: 'SIMULATE_DESKTOP',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                  }, '*')
                }
              } catch (error) {
                console.log('无法与iframe通信:', error)
              }
            }
          }}
          onError={(e) => {
            console.error('Fullscreen game iframe failed to load:', e)
            setIsLoading(false)
          }}
          style={{
            backgroundColor: '#000',
            minHeight: '100%',
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none'
          }}
        />
      </div>
    </div>
  )
}