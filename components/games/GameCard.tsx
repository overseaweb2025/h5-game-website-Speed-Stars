"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { GameCardProps } from "./types"
import Cookie from "js-cookie"

const GameCard = ({ game, className = "", size = 'medium', t, isHomepage = false, lang = 'en' }: GameCardProps) => {

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // 检测屏幕尺寸状态
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')
  
  useEffect(() => {
    setIsClient(true)
    
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 480) {
        setScreenSize('xs')
        setIsMobile(true)
      } else if (width < 640) {
        setScreenSize('sm')
        setIsMobile(true)
      } else if (width < 768) {
        setScreenSize('md')
        setIsMobile(true)
      } else if (width < 1024) {
        setScreenSize('lg')
        setIsMobile(false)
      } else {
        setScreenSize('xl')
        setIsMobile(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 根据size和屏幕尺寸设置不同的尺寸样式
  const getSizeStyles = () => {
    // 根据屏幕尺寸获取缩放比例
    const getScale = () => {
      switch (screenSize) {
        case 'xs': return 0.5  // 480px以下，卡片大小为原来的50%
        case 'sm': return 0.65 // 480-640px，卡片大小为原来的65%
        case 'md': return 0.8  // 640-768px，卡片大小为原来的80%
        case 'lg': return 0.9  // 768-1024px，卡片大小为原来的90%
        case 'xl': return 1.0  // 1024px以上，原始大小
        default: return 1.0
      }
    }
    
    const scale = getScale()
    
    switch (size) {
      case 'tiny':
        const tinySize = Math.max(50, Math.floor(140 * scale)) // 最小50px
        return {
          width: '100%',
          minWidth: `${tinySize}px`,
          height: `${tinySize}px`,
          aspectRatio: '1/1'
        }
      case 'small':
        const smallSize = Math.max(50, Math.floor(140 * scale)) // 最小50px
        return {
          width: '100%',
          minWidth: `${smallSize}px`,
          height: `${smallSize}px`,
          aspectRatio: '1/1'
        }
      case 'medium':
        const mediumSize = Math.max(80, Math.floor(180 * scale)) // 最小80px
        return {
          width: '100%',
          minWidth: `${mediumSize}px`,
          height: `${mediumSize}px`,
          aspectRatio: '1/1'
        }
      case 'large':
        const largeWidth = Math.max(120, Math.floor(240 * scale)) // 最小120px
        // 在特色游戏布局中，使用flex布局让高度自适应
        return {
          width: '100%',
          minWidth: `${largeWidth}px`,
          height: '100%', // 使用100%高度，让它填充父容器
          aspectRatio: 'auto' // 取消固定比例，让它适应容器
        }
      case 'horizontal-scroll':
        const horizontalSize = Math.max(80, Math.floor(200 * scale)) // 最小80px
        return {
          width: `${horizontalSize}px`,
          minWidth: `${horizontalSize}px`,
          height: `${horizontalSize}px`,
          aspectRatio: '1/1'
        }
      default:
        const defaultSize = Math.max(80, Math.floor(180 * scale)) // 最小80px
        return {
          width: '100%',
          minWidth: `${defaultSize}px`,
          height: `${defaultSize}px`,
          aspectRatio: '1/1'
        }
    }
  }

  const sizeStyles = getSizeStyles()

  const handleGameClick = (e: React.MouseEvent) => {
    // 在首页时，直接跳转到游戏详情页面
    if (isHomepage && game?.package?.url && isClient) {
      e.preventDefault()
      
      // 跳转到游戏详情页面
      window.location.href = `/${Cookie.get('preferred-language')}/game/${game?.name}`
    }
    // 非首页时使用默认的Link跳转逻辑（跳转到游戏内页）
  }

  // 根据是否在首页决定href
// GameCard.tsx

const getHref = () => {
    // 统一跳转到游戏详情页面
    return `/${Cookie.get('preferred-language')}/game/${game?.name}`
}

  return (
    <Link
      href={getHref()}
      className={`group block relative overflow-visible rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${isHomepage && isMobile ? 'aspect-[3/7]' : 'aspect-square'} ${className}`}
      style={sizeStyles}
      onClick={handleGameClick}
    >
      <div 
        className="relative w-full h-full bg-gray-800 rounded-[9px] overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300" 
        style={{ width: '100%', height: '100%' }}
      >
        {/* 只有当图片存在且不为空时才显示图片 */}
        {(game?.cover || game?.image) && (game?.cover !== '' && game?.image !== '') ? (
          <img
            src={game?.cover }
            alt={game?.display_name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              (game?.cover || game?.image) && (game?.cover !== '' && game?.image !== '') ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}
        
        {/* 占位符 - 当图片不存在、为空字符串、未加载或加载失败时显示 */}
        {(!(game?.cover || game?.image) || game?.cover === '' || game?.image === '') && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="text-center text-white">
              <div className={`mb-1 ${
                screenSize === 'xs' ? 'text-sm' :
                screenSize === 'sm' ? 'text-base' :
                size === 'tiny' ? 'text-lg' :
                size === 'small' ? 'text-xl' :
                'text-2xl'
              }`}>🎮</div>
              <div className={`font-medium px-1 ${
                screenSize === 'xs' ? 'text-[6px]' :
                screenSize === 'sm' ? 'text-[7px]' :
                screenSize === 'md' ? 'text-[8px]' :
                size === 'tiny' ? 'text-[9px]' :
                size === 'small' ? 'text-[10px]' :
                'text-xs'
              }`}>
                {imageError ? (t?.hero?.imageFailedToLoad || 'Image failed to load') : (t?.common?.loading || 'Loading...')}
              </div>
            </div>
          </div>
        )}
        
        {/* Game title overlay - 在移动端的tiny size不显示title */}
        {size !== 'tiny' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-3 rounded-b-[7px]">
            <p className={`text-white font-bold leading-tight drop-shadow-lg ${
              size === 'large' ? 'text-sm sm:text-base md:text-lg' : 
              size === 'small' ? 'text-xs sm:text-sm' : 
              size === 'horizontal-scroll' ? 'text-xs sm:text-sm' :
              'text-sm'
            }`}>
              {game?.display_name}
            </p>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
      </div>
      
      {/* Tag badge - moved outside the overflow-hidden container */}
      {game?.tag && (
        <div className={`absolute -top-1 -left-1 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-[4px] shadow-lg z-10 ${
          game?.tag === 'Hot' ? 'bg-red-500' : 
          game?.tag === 'New' ? 'bg-purple-500' : 
          game?.tag === 'Updated' ? 'bg-blue-500' :
          'bg-orange-500'
        }`}>
          {game?.tag}
        </div>
      )}
    </Link>
  )
}

export default GameCard