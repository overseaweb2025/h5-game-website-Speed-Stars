"use client"

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, Volume2, VolumeX } from 'lucide-react'

interface GameErrorHandlerProps {
  children: React.ReactNode
  gameName?: string
}

interface GameError {
  type: 'permissions' | 'audio' | 'webgl' | 'unity' | 'general'
  message: string
  solution?: string
}

export default function GameErrorHandler({ children, gameName = "游戏" }: GameErrorHandlerProps) {
  const [errors, setErrors] = useState<GameError[]>([])
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)

  useEffect(() => {
    // 监听游戏相关错误
    const handleError = (event: ErrorEvent) => {
      const error = event.error || { message: event.message }
      
      let gameError: GameError | null = null

      if (error.message?.includes('Permissions Policy')) {
        gameError = {
          type: 'permissions',
          message: '游戏需要设备传感器权限才能正常运行',
          solution: '请在浏览器设置中允许此网站访问传感器权限，或尝试刷新页面'
        }
      } else if (error.message?.includes('AudioContext')) {
        gameError = {
          type: 'audio',
          message: '音频上下文未激活',
          solution: '点击页面任意位置激活音频功能'
        }
      } else if (error.message?.includes('WebGL') || error.message?.includes('Unity')) {
        gameError = {
          type: 'webgl',
          message: 'WebGL 或 Unity 加载错误',
          solution: '请确保浏览器支持 WebGL，或尝试刷新页面'
        }
      } else if (error.message?.includes('Pointer_stringify')) {
        gameError = {
          type: 'unity',
          message: 'Unity 版本兼容性警告',
          solution: '这是一个已知的兼容性警告，不会影响游戏运行'
        }
      }

      if (gameError) {
        setErrors(prev => {
          const exists = prev.find(e => e.type === gameError!.type)
          if (!exists) {
            return [...prev, gameError!]
          }
          return prev
        })
      }
    }

    // 监听控制台错误
    const originalConsoleError = console.error
    console.error = (...args) => {
      originalConsoleError(...args)
      
      const message = args.join(' ')
      if (message.includes('Permissions Policy') || 
          message.includes('SecurityError') ||
          message.includes('AudioContext') ||
          message.includes('Pointer_stringify')) {
        handleError({ 
          error: { message }, 
          message, 
          filename: '', 
          lineno: 0, 
          colno: 0 
        } as ErrorEvent)
      }
    }

    window.addEventListener('error', handleError)
    
    return () => {
      window.removeEventListener('error', handleError)
      console.error = originalConsoleError
    }
  }, [])

  // 激活音频上下文
  const enableAudio = async () => {
    try {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(ctx)
        
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }
        
        setAudioEnabled(true)
        setErrors(prev => prev.filter(e => e.type !== 'audio'))
      } else if (audioContext.state === 'suspended') {
        await audioContext.resume()
        setAudioEnabled(true)
        setErrors(prev => prev.filter(e => e.type !== 'audio'))
      }
    } catch (error) {
      // Silent error handling - audio activation failed
    }
  }

  // 重新加载页面
  const reloadPage = () => {
    window.location.reload()
  }

  // 清除特定错误
  const dismissError = (type: GameError['type']) => {
    setErrors(prev => prev.filter(e => e.type !== type))
  }

  // 获取错误图标
  const getErrorIcon = (type: GameError['type']) => {
    switch (type) {
      case 'audio':
        return audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  // 获取错误颜色
  const getErrorColor = (type: GameError['type']) => {
    switch (type) {
      case 'unity':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800'
      case 'permissions':
      case 'webgl':
        return 'border-red-500 bg-red-50 text-red-800'
      case 'audio':
        return 'border-blue-500 bg-blue-50 text-blue-800'
      default:
        return 'border-gray-500 bg-gray-50 text-gray-800'
    }
  }

  return (
    <div className="relative">
      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="absolute top-4 left-4 right-4 z-50 space-y-2">
          {errors.map((error, index) => (
            <div
              key={`${error.type}-${index}`}
              className={`flex items-start space-x-3 p-4 rounded-lg border-2 shadow-lg backdrop-blur-sm ${getErrorColor(error.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getErrorIcon(error.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {error.message}
                </p>
                {error.solution && (
                  <p className="mt-1 text-xs opacity-80">
                    {error.solution}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {error.type === 'audio' && (
                    <button
                      onClick={enableAudio}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      激活音频
                    </button>
                  )}
                  {(error.type === 'permissions' || error.type === 'webgl') && (
                    <button
                      onClick={reloadPage}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      刷新页面
                    </button>
                  )}
                  <button
                    onClick={() => dismissError(error.type)}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    忽略
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 音频激活覆盖层 */}
      {errors.some(e => e.type === 'audio') && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center cursor-pointer"
          onClick={enableAudio}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center shadow-xl">
            <VolumeX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              激活游戏音频
            </h3>
            <p className="text-gray-600 mb-4">
              点击此处启用 {gameName} 的音频功能
            </p>
            <button
              onClick={enableAudio}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              启用音频
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}