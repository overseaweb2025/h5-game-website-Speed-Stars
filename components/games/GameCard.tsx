"use client"

import Link from "next/link"
import { useState } from "react"
import { GameCardProps } from "./types"

const GameCard = ({ game, className = "", size = 'medium' }: GameCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <Link
      href={`/game/${game.name}`}
      className={`group block relative overflow-visible rounded-[7px] transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
      style={{ minWidth: size === 'horizontal-scroll' ? '180px' : 'auto' }}
    >
      <div className="relative w-full h-full bg-gray-800 rounded-[7px] overflow-hidden" style={{ aspectRatio: size === 'horizontal-scroll' ? '4/3' : 'auto' }}>
        {!imageError ? (
          <img
            src={game.image}
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
                {imageError ? 'Image failed to load' : 'Loading...'}
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