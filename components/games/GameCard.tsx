"use client"

import Link from "next/link"
import { useState } from "react"
import { GameCardProps } from "./types"

const GameCard = ({ game, className = "", size = 'medium', t }: GameCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 根据size设置不同的尺寸样式
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: '100%',
          minWidth: '140px',
          height: '120px',
          aspectRatio: '7/6'
        }
      case 'medium':
        return {
          width: '100%',
          minWidth: '180px',
          height: '160px',
          aspectRatio: '9/8'
        }
      case 'large':
        return {
          width: '100%',
          minWidth: '240px',
          height: '255px',
          aspectRatio: '6/5'
        }
      case 'horizontal-scroll':
        return {
          width: '200px',
          minWidth: '180px',
          height: '150px',
          aspectRatio: '4/3'
        }
      default:
        return {
          width: '100%',
          minWidth: '180px',
          height: '160px',
          aspectRatio: '9/8'
        }
    }
  }

  const sizeStyles = getSizeStyles()

  return (
    <Link
      href={`/game/${game.name}`}
      className={`group block relative overflow-visible rounded-[7px] transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
      style={sizeStyles}
    >
      <div 
        className="relative w-full h-full bg-gray-800 rounded-[7px] overflow-hidden border border-gray-600/50" 
        style={{ width: '100%', height: '100%' }}
      >
        {!imageError && (game.cover || game.image) ? (
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
        
        {/* 占位符 - 当图片未加载或加载失败时显示 */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🎮</div>
              <div className="text-xs font-medium px-2">
                {imageError ? (t?.hero?.imageFailedToLoad || 'Image failed to load') : (t?.common?.loading || 'Loading...')}
              </div>
            </div>
          </div>
        )}
        
        {/* Game title overlay */}
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
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-[7px]" />
      </div>
      
      {/* Tag badge - moved outside the overflow-hidden container */}
      {game.tag && (
        <div className={`absolute -top-1 -left-1 px-3 py-1 text-xs font-bold text-white rounded-[6px] shadow-lg z-10 ${
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