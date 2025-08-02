"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { GameCardProps } from "./types"

const GameCard = ({ game, className = "", size = 'medium', t, isHomepage = false }: GameCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // 检测移动端状态
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

  // 根据size设置不同的尺寸样式 - 移动端尺寸减少1/3
  const getSizeStyles = () => {
    
    switch (size) {
      case 'tiny':
        return {
          width: '100%',
          minWidth: isMobile ? '53px' : '80px', // 80 * 2/3 = 53
          height: isMobile ? '53px' : '80px',
          aspectRatio: '1/1'
        }
      case 'small':
        return {
          width: '100%',
          minWidth: isMobile ? '72px' : '140px', // 移动端缩小到72px适应小屏幕
          height: isMobile ? '72px' : '140px',
          aspectRatio: '1/1'
        }
      case 'medium':
        return {
          width: '100%',
          minWidth: isMobile ? '120px' : '180px', // 180 * 2/3 = 120
          height: isMobile ? '120px' : '180px',
          aspectRatio: '1/1'
        }
      case 'large':
        return {
          width: '100%',
          minWidth: isMobile ? '150px' : '240px', // 移动端缩小到150px适应小屏幕
          height: isMobile ? '150px' : '295px', // 移动端缩小到150px适应小屏幕
          aspectRatio: '1/1' // 移动端也是正方形
        }
      case 'horizontal-scroll':
        return {
          width: isMobile ? '133px' : '200px', // 200 * 2/3 = 133
          minWidth: isMobile ? '133px' : '200px',
          height: isMobile ? '133px' : '200px',
          aspectRatio: '1/1'
        }
      default:
        return {
          width: '100%',
          minWidth: isMobile ? '120px' : '180px', // 180 * 2/3 = 120
          height: isMobile ? '120px' : '180px',
          aspectRatio: '1/1'
        }
    }
  }

  const sizeStyles = getSizeStyles()

  const handleGameClick = (e: React.MouseEvent) => {
    // 在首页时，直接跳转到play页面
    if (isHomepage && game.package?.url) {
      e.preventDefault()
      
      const getCurrentLang = () => {
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname
          const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
          return langMatch ? langMatch[1] : 'en'
        }
        return 'en'
      }
      
      const currentLang = getCurrentLang()
      const gameUrl = game.package.url
      const gameTitle = game.display_name
      const encodedUrl = encodeURIComponent(gameUrl)
      const encodedTitle = encodeURIComponent(gameTitle)
      
      window.location.href = `/${currentLang}/play/${game.name}/${encodedUrl}?title=${encodedTitle}&url=${encodedUrl}`
    }
    // 非首页时使用默认的Link跳转逻辑（跳转到游戏内页）
  }

  // 根据是否在首页决定href
  const getHref = () => {
    if (isHomepage && game.package?.url) {
      // 首页时返回空字符串，因为我们会用onClick处理
      return "#"
    }
    return `/game/${game.name}`
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
        {!imageError && (game.cover || game.image) && (game.cover !== '' && game.image !== '') ? (
          <img
            src={game.cover || game.image}
            alt={game.display_name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(false)
            }}
          />
        ) : null}
        
        {/* 占位符 - 当图片不存在、为空字符串、未加载或加载失败时显示 */}
        {(!imageLoaded || imageError || !(game.cover || game.image) || game.cover === '' || game.image === '') && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="text-center text-white">
              <div className={`mb-2 ${
                size === 'tiny' ? 'text-lg' :
                size === 'small' ? 'text-2xl' :
                'text-4xl'
              }`}>🎮</div>
              <div className={`font-medium px-2 ${
                size === 'tiny' ? 'text-[8px]' :
                size === 'small' ? 'text-xs' :
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
            <h3 className={`text-white font-bold leading-tight drop-shadow-lg ${
              size === 'large' ? 'text-sm sm:text-base md:text-lg' : 
              size === 'small' ? 'text-xs sm:text-sm' : 
              size === 'horizontal-scroll' ? 'text-xs sm:text-sm' :
              'text-sm'
            }`}>
              {game.display_name}
            </h3>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
      </div>
      
      {/* Tag badge - moved outside the overflow-hidden container */}
      {game.tag && (
        <div className={`absolute -top-1 -left-1 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-[4px] shadow-lg z-10 ${
          game.tag === 'Hot' ? 'bg-red-500' : 
          game.tag === 'New' ? 'bg-purple-500' : 
          game.tag === 'Updated' ? 'bg-blue-500' :
          'bg-orange-500'
        }`}>
          {game.tag}
        </div>
      )}
    </Link>
  )
}

export default GameCard