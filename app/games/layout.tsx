"use client"

import { useState, useCallback } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Saber from "@/components/games/Saber"
import { useResponsive } from "@/shared/hooks"

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [sidebarToggleFunction, setSidebarToggleFunction] = useState<(() => void) | null>(null)

  const { isSmallScreen, isCollapsed, setIsCollapsed } = useResponsive({
    breakpoint: 1024,
    initialCollapsed: false,
    onScreenSizeChange: (isSmall, wasSmall) => {
      if (isSmall && !wasSmall) {
        setIsCollapsed(true)
        setSidebarVisible(true)
      } else if (!isSmall && wasSmall) {
        setSidebarVisible(true)
      }
    }
  })

  const handleSidebarToggle = useCallback((toggleFunction: () => void) => {
    setSidebarToggleFunction(() => toggleFunction)
  }, [])

  const handleToggleButtonClick = useCallback(() => {
    if (sidebarToggleFunction) {
      sidebarToggleFunction()
    }
  }, [sidebarToggleFunction])

  const handleStateChange = useCallback((visible: boolean, collapsed: boolean, hovered: boolean) => {
    setSidebarVisible(visible)
    setIsCollapsed(collapsed)
    setIsHovered(hovered)
  }, [])

  return (
    <main className="bg-gray-900 min-h-screen">
      {/* Header横跨整个宽度 */}
      <Header 
        showSidebarToggle={true}
        onSidebarToggle={handleToggleButtonClick}
      />

      {/* Header下方的内容区域 */}
      <div className="flex">
        {/* 左侧Saber - 占据空间且固定在左边（可选显示） */}
        {sidebarVisible && (
          <div className={`sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${
            isCollapsed && !isHovered ? 'w-16' : 'w-48'
          }`}>
            <Saber 
              onSidebarToggle={handleSidebarToggle}
              onStateChange={handleStateChange}
            />
          </div>
        )}

        {/* 主内容区域 - Main + Footer，占据剩余空间 */}
        <div className="flex-1">
          <div className="bg-gray-900 relative overflow-hidden min-h-screen">
            {/* 装饰性星星，深色背景风格 - 最底层 */}
            <div className="absolute top-20 left-10 text-6xl text-purple-400/20 pop-in -z-10">⭐</div>
            <div className="absolute top-40 right-20 text-4xl text-purple-300/20 pop-in -z-10" style={{ animationDelay: "0.3s" }}>✨</div>
            <div className="absolute bottom-20 left-20 text-5xl text-purple-500/20 pop-in -z-10" style={{ animationDelay: "0.6s" }}>🎮</div>
            
            {/* 游戏内容区域 */}
            <div className={`relative z-10 w-full py-8 transition-all duration-300 ${
              sidebarVisible ? 'px-4 sm:px-6 md:px-8' : 'px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24'
            }`}>
              {children}
            </div>
            
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>
    </main>
  )
}