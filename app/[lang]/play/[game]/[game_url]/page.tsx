"use client"

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw, Maximize, RotateCw } from 'lucide-react'

interface PlayPageParams {
  lang: string,
  game: string,
  game_url: string
}

export default function GamePlayPage() {
  const params = useParams() as unknown as PlayPageParams
  const searchParams = useSearchParams()
  const router = useRouter()
  const [gameUrl, setGameUrl] = useState<string>('')
  const [gameTitle, setGameTitle] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  const [showRotationTip, setShowRotationTip] = useState(false)
  const [loadingError, setLoadingError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const titleFromParams = searchParams.get('title')
    
    // 优先使用路径参数中的URL
    let finalUrl = ''
    if (params.game_url) {
      try {
        finalUrl = decodeURIComponent(params.game_url)
      } catch (error) {
        console.error('Failed to decode URL from path:', error)
        finalUrl = params.game_url
      }
    }
    setGameUrl(finalUrl)
    setGameTitle(titleFromParams ? decodeURIComponent(titleFromParams) : 'Speed Stars')
  }, [params, searchParams])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    if (typeof window !== 'undefined') {
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleBack = () => {
    router.back()
  }

  const handleRotation = () => {
    setShowRotationTip(true)
    setTimeout(() => setShowRotationTip(false), 3000)
  }

  const handleReload = () => {
    setLoadingError(false)
    if (iframeRef.current) {
      // 强制重新加载 iframe，清除缓存
      iframeRef.current.src = `${iframeRef.current.src.split('?')[0]}?${Date.now()}`
    }
  }

  const handleFullScreen = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        iframe.requestFullscreen().catch(err => {
          console.log('Error attempting to enable full-screen mode:', err)
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 旋转提示 - 仅在移动端显示 */}
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

      {/* 自定义导航栏 */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between z-50 w-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="返回"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-md">
            {gameTitle}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isMobile && (
            <button
              onClick={handleRotation}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="显示旋转提示"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <button
            onClick={handleReload}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="重新加载游戏"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleFullScreen}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="全屏模式"
          >
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      
      {/* 游戏内容区域 - 强制绝对居中 */}
      <div className="flex-1 bg-black w-full overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
            {gameUrl && !loadingError ? (
              <iframe 
                key={gameUrl} // 添加 key 强制重新渲染 iframe
                ref={iframeRef}
                src={gameUrl}
                title={gameTitle}
                className="border-none rounded-lg shadow-2xl"
                allowFullScreen
                style={{
                  width: 'calc(100vw - 64px)', // 固定宽度，左右各留32px边距
                  height: 'calc(100vh - 128px)', // 固定高度，上下留足够边距
                  maxWidth: '1200px', // 最大宽度限制
                  maxHeight: '800px', // 最大高度限制
                  minWidth: '320px',
                  minHeight: '240px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: '#000',
                  pointerEvents: 'auto',
                  display: 'block',
                  position: 'relative',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                }}
              />
            ) : loadingError ? (
              <div className="w-full h-full flex items-center justify-center text-white p-4">
                <div className="text-center max-w-md">
                  <p className="text-xl text-red-500 font-bold mb-4">游戏加载失败 😔</p>
                  <p className="text-sm text-gray-300 mb-6">
                    请尝试点击下方按钮重新加载。如果问题持续存在，可能是由于游戏服务器或安全限制。
                  </p>
                  <button
                    onClick={handleReload}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    重新加载
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4 mx-auto"></div>
                  <p className="text-lg">游戏加载中...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}