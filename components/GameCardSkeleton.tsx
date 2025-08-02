"use client"

import React from 'react'

interface GameCardSkeletonProps {
  size?: 'small' | 'medium' | 'large' | 'horizontal-scroll'
  className?: string
  showTag?: boolean
}

export const GameCardSkeleton: React.FC<GameCardSkeletonProps> = ({ 
  size = 'small',
  className = '', 
  showTag = true 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return 'w-full h-48'
      case 'medium':
        return 'w-full h-32'
      case 'horizontal-scroll':
        return 'w-32 h-20'
      case 'small':
      default:
        return 'w-full h-20'
    }
  }

  const getCardClasses = () => {
    switch (size) {
      case 'large':
        return 'p-3'
      case 'medium':
        return 'p-2'
      case 'horizontal-scroll':
        return 'p-1'
      case 'small':
      default:
        return 'p-2'
    }
  }

  const getTextClasses = () => {
    switch (size) {
      case 'large':
        return 'h-4 mb-2'
      case 'medium':
        return 'h-3 mb-1'
      case 'horizontal-scroll':
        return 'h-2 mb-1'
      case 'small':
      default:
        return 'h-3 mb-1'
    }
  }

  return (
    <div className={`
      bg-black/80 
      rounded-xl 
      border 
      border-gray-800/50 
      overflow-hidden
      animate-pulse
      ${getCardClasses()}
      ${className}
    `}>
      {/* 游戏图片骨架 */}
      <div className={`
        bg-gray-800/60 
        rounded-lg 
        ${getSizeClasses()}
        mb-2
        relative
        overflow-hidden
      `}>
        {/* 微妙的加载动画 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer"/>
        
        {/* 标签骨架 */}
        {showTag && (
          <div className="absolute top-1 left-1">
            <div className="bg-gray-700/60 rounded-full px-2 py-1 w-12 h-5"></div>
          </div>
        )}
      </div>

      {/* 游戏标题骨架 */}
      <div className={`
        bg-gray-800/60 
        rounded 
        ${getTextClasses()}
        w-3/4
      `}></div>

      {/* 副标题骨架（仅在较大尺寸时显示） */}
      {(size === 'large' || size === 'medium') && (
        <div className="bg-gray-800/40 rounded h-2 w-1/2"></div>
      )}
    </div>
  )
}

// 垂直游戏卡片骨架（用于左右侧边栏）
export const VerticalGameCardSkeleton: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  return (
    <div className={`
      flex 
      items-center 
      gap-3 
      p-2 
      bg-black/80 
      rounded-xl 
      border 
      border-gray-800/50
      animate-pulse
      ${className}
    `}>
      {/* 游戏图片骨架 */}
      <div className="relative w-16 h-12 bg-gray-800/60 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer"></div>
        {/* 标签骨架 */}
        <div className="absolute top-0.5 left-0.5">
          <div className="bg-gray-700/60 rounded-full w-6 h-3"></div>
        </div>
      </div>

      {/* 文本内容骨架 */}
      <div className="flex-1 space-y-1">
        <div className="bg-gray-800/60 rounded h-3 w-full"></div>
        <div className="bg-gray-800/40 rounded h-2 w-2/3"></div>
      </div>
    </div>
  )
}

// 水平网格游戏卡片骨架（用于底部网格）
export const GridGameCardSkeleton: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  return (
    <div className={`
      bg-black/80 
      rounded-xl 
      border 
      border-gray-800/50 
      p-2
      animate-pulse
      ${className}
    `}>
      {/* 游戏图片骨架 */}
      <div className="relative w-full h-16 bg-gray-800/60 rounded-lg mb-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer"></div>
        {/* 标签骨架 */}
        <div className="absolute top-1 left-1">
          <div className="bg-gray-700/60 rounded-full w-8 h-3"></div>
        </div>
      </div>

      {/* 游戏标题骨架 */}
      <div className="bg-gray-800/60 rounded h-2 w-full mb-1"></div>
      <div className="bg-gray-800/40 rounded h-2 w-3/4"></div>
    </div>
  )
}

// 骨架卡片生成器 - 用于批量生成指定数量的骨架卡片
export const generateSkeletonCards = (
  count: number, 
  SkeletonComponent: React.FC<{ className?: string }>,
  baseClassName: string = ''
): React.ReactNode[] => {
  return Array.from({ length: count }, (_, index) => (
    <SkeletonComponent 
      key={`skeleton-${index}`} 
      className={baseClassName}
    />
  ))
}

export default GameCardSkeleton