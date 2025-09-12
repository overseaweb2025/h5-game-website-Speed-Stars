"use client"

import { useState, useEffect } from "react"
import { GameDetails } from "@/app/api/types/Get/game"
import { useGamePlayTracker } from "@/hooks/useGamePlayTracker"
import { heroData } from "@/data/home/hero-data"

interface GameFrameProps {
  homeData?: any
  iframeHeight: string
  t?: any
}

export default function GameFrame({ homeData, iframeHeight, t }: GameFrameProps) {
  const {
    initializeGame,
    setGameContainerRef,
    setIframeRef,
  } = useGamePlayTracker()

  // 初始化首页游戏追踪
  useEffect(() => {
    if (homeData?.game) {
      initializeGame({
        id: homeData.game.package.url || homeData?.title || 'Free Game' || 'Free Game',
        name: homeData.game.cover || homeData?.title || 'Free Game' || 'Free Game',
        displayName: homeData?.title || 'Free Game' || ''
      })
    }
  }, [homeData, initializeGame])

  return (
    <div
      id="game-frame"
      ref={setGameContainerRef}
      className="relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 mb-6 bg-black"
      style={{ 
        width: "100%", 
        height: iframeHeight,
        minHeight: "200px",
        borderRadius: '12px',
        aspectRatio: '2/1' // 宽比高大两倍
      }}
    >
      {(homeData?.game?.package?.url || heroData.gameIframeSrc) ? (
        <iframe
          ref={setIframeRef}
          src={homeData?.game?.package?.url || heroData.gameIframeSrc}
          title={homeData?.title || 'Free Game' || t?.hero?.speedStarUnblocked || " Game"}
          className="absolute top-0 left-0 w-full h-full border-0"
          style={{
            backgroundColor: '#000',
            imageRendering: 'auto'
          }}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        />
      ) : !homeData ? (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
            <h2 className="text-2xl font-black text-text mb-3">{t?.hero?.loadingGame || "Loading Game..."}</h2>
            <p className="text-text/80">{t?.hero?.pleaseWait || "Please wait while we load the game data"}</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-3xl font-black text-text mb-3">{t?.hero?.comingSoon || "Coming Soon!"}</h2>
            <p className="text-text/80 text-lg">{t?.hero?.awesomeGameAvailableSoon || "This awesome game will be available soon."}</p>
          </div>
        </div>
      )}
    </div>
  )
}