"use client"

import { heroData } from "@/data/home/hero-data"
import GameFrame from "./GameFrame"
import ContentSections from "./ContentSections"
import ActionButtons from "./ActionButtons"
import { Game as APIGame } from "@/app/api/types/Get/game"
import LeftSide from "../hero/LeftSide"
import RightSide from "../hero/RightSide"
import BootomGames from "../hero/BootonGames"
import { Locale } from "@/lib/lang/dictionaraies"
interface DesktopHeroProps {
  title?: string
  homeData?: any
  randomGames: APIGame[]
  iframeHeight: string
  scrollToSection: (sectionId: string) => void
  t?: any
  lang?: string
}

export default function DesktopHero({ 
  title, 
  homeData, 
  randomGames, 
  iframeHeight, 
  scrollToSection, 
  t,
  lang = 'en'
}: DesktopHeroProps) {
  return (
    <div className="w-full">
      {/* 桌面端显示标题 */}
      <p className="hidden lg:block text-5xl md:text-6xl lg:text-7xl text-text font-black mb-4 leading-tight text-center pop-in">
        <span className="gradient-text">{title || ''}</span>
        <span className="gradient-text">{homeData?.title}</span>
      </p>

      {/* Game container with side panels - Desktop layout */}
      <div className="hidden lg:flex justify-center items-start gap-6 xl:gap-3 mb-6 mx-auto max-w-[1980px] w-full px-4">
        
        {/* Left side panel - 仅在超大屏幕显示 */}
        <div className="hidden xl:block">

          <LeftSide GameList={randomGames}/>
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
          <BootomGames 
            GameList={randomGames}
            t={t}
          />

          {/* Content sections */}
          <ContentSections homeData={homeData} />

          {/* Action buttons */}
          <ActionButtons scrollToSection={scrollToSection} />
        </div>

        {/* Right side panel - 仅在超大屏幕显示 */}
        <div className="hidden xl:block">
           <RightSide GameList={randomGames}/>
        </div>

      </div>
    </div>
  )
}