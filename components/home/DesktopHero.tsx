"use client"

import { heroData } from "@/data/home/hero-data"
import SidePanel from "./SidePanel"
import GameFrame from "./GameFrame"
import BottomGamesPanel from "./BottomGamesPanel"
import ContentSections from "./ContentSections"
import ActionButtons from "./ActionButtons"
import { Game as APIGame } from "@/app/api/types/Get/game"

interface DesktopHeroProps {
  title?: string
  homeData?: any
  randomGames: APIGame[]
  iframeHeight: string
  scrollToSection: (sectionId: string) => void
  t?: any
}

export default function DesktopHero({ 
  title, 
  homeData, 
  randomGames, 
  iframeHeight, 
  scrollToSection, 
  t 
}: DesktopHeroProps) {
  return (
    <div className="w-full">
      {/* 桌面端显示标题 */}
      <h1 className="hidden lg:block text-5xl md:text-6xl lg:text-7xl text-text font-black mb-4 leading-tight text-center pop-in">
        {title ? (
          <span className="gradient-text">{title}</span>
        ) : homeData?.title ? (
          <span className="gradient-text">{homeData.title}</span>
        ) : (
          <>
            <span className="gradient-text">{heroData.title.main}</span>
            <span className="text-accent-2 text-stroke">{heroData.title.subtitle}</span>
          </>
        )}
      </h1>

      {/* Game container with side panels - Desktop layout */}
      <div className="hidden lg:flex justify-center items-start gap-6 xl:gap-3 mb-6 mx-auto max-w-[1980px] w-full px-4">
        
        {/* Left side panel - 仅在超大屏幕显示 */}
        <div className="hidden xl:block">
          <SidePanel 
            randomGames={randomGames}
            side="left"
            t={t}
          />
        </div>

        {/* Main center container - lg屏幕下增加1/5宽度 */}
        <div className="flex-1 min-w-0 p-6 lg:w-[120%] lg:max-w-none xl:w-auto xl:max-w-[1650px] mx-auto">
          {/* Game frame */}
          <GameFrame 
            homeData={homeData}
            iframeHeight={iframeHeight}
            t={t}
          />

          {/* Bottom games panel */}
          <BottomGamesPanel 
            randomGames={randomGames}
            t={t}
          />

          {/* Content sections */}
          <ContentSections homeData={homeData} />

          {/* Action buttons */}
          <ActionButtons scrollToSection={scrollToSection} />
        </div>

        {/* Right side panel - 仅在超大屏幕显示 */}
        <div className="hidden xl:block">
          <SidePanel 
            randomGames={randomGames}
            side="right"
            t={t}
          />
        </div>

      </div>
    </div>
  )
}