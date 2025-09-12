"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Home, Search, Info } from "lucide-react"
import { useLangGameList } from "@/hooks/LangGamelist_value"
import GameCard from "@/components/games/GameCard"
import { heroData } from "@/data/home/hero-data"
import { Game as APIGame, game } from "@/app/api/types/Get/game"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Locale } from "@/lib/lang/dictionaraies"
import FullscreenGameModal from "./FullscreenGaameModal" // Import the new component
import { replaceHeadingsWithP } from "@/utils/utils"


interface MobileHeroProps {
  homeData?: any
  t?: any
  lang: Locale
}

export default function MobileHero({ homeData, t, lang }: MobileHeroProps) {
  const router = useRouter()
  const { getLangGames, getLangGamelistBylang } = useLangGameList()
  const [showTitleDialog, setShowTitleDialog] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState('')
  
  // New state for the full-screen game modal
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [modalGame, setModalGame] = useState({ title: '', url: '' });

  // 获取多语言游戏数据
  const allAvailableGames = getLangGames(lang)
  const gamesToShow = allAvailableGames.slice(0, 30)

  // New function to handle opening the game modal
  const handlePlayGame = () => {
    // Check if homeData and game URL exist before opening
    if (homeData && homeData.game?.package?.url) {
      setModalGame({
        title: homeData.title || heroData.title.main,
        url: homeData.game.package.url,
      });
      setIsGameModalOpen(true);
    }
  };

  return (
    <div className="lg:hidden mb-6 px-4 mx-auto max-w-screen-xl">
      {/* 第一行：固定定位的功能卡片 + 游戏标题卡片 */}
      <div className="relative mb-5 w-full">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {/* 固定定位的功能卡片 */}
          <div className="col-span-1 relative">
            <div className="fixed z-30 bg-gray-900 border border-gray-700 rounded-[9px] shadow-lg shadow-black/20 transition-shadow duration-300 h-[73px] p-1" style={{ width: 'calc((100vw - 80px) / 3 - 12px)' }}>
              {/* 2行网格布局 */}
              <div className="grid grid-rows-2 h-full gap-0">
                {/* 第一行：占据2个格子 */}
                <div className="row-span-1 grid grid-cols-2 gap-0 border-b border-gray-700">
                  <div className="col-span-2 bg-gray-900 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">{t?.hero?.gameCenter || "游戏中心"}</span>
                  </div>
                </div>
                
                {/* 第二行：2个div，无间隔，中间有分隔线 */}
                <div className="row-span-1 grid grid-cols-2 gap-0">
                  <div 
                    className="bg-gray-900 flex items-center justify-center border-r border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => router.push('/')}
                  >
                    <Home className="w-4 h-4 text-blue-400" />
                  </div>
                  <div 
                    className="bg-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => router.push('/search')}
                  >
                    <Search className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="bg-gray-900 border border-gray-700 rounded-[9px] px-4 py-3 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-shadow duration-300 flex items-center justify-between h-[73px]">
              <div className="text-left flex-1">
                <p 
                  className="text-base font-black text-white leading-tight cursor-pointer hover:text-blue-400 transition-colors"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onClick={() => {
                    const title = homeData?.title || heroData.title.main
                    setSelectedTitle(title)
                    setShowTitleDialog(true)
                  }}
                  title={homeData?.title || heroData.title.main}
                >
                  {homeData?.title || heroData.title.main}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t?.hero?.category || "分类名"}: {homeData?.game?.category || "Games"}
                </p>
              </div>
              <Info 
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors ml-2 flex-shrink-0"
                onClick={() => {
                  const title = homeData?.title || heroData.title.main
                  setSelectedTitle(title)
                  setShowTitleDialog(true)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 统一3列网格布局，增加间距避免重合 */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        
        {/* 第二行：完整尺寸内嵌游戏 - 占据3格 */}
        <div className="col-span-3">
          <div
            id="game-frame-mobile-full"
            className="relative w-full rounded-[9px] overflow-hidden shadow-lg hover:shadow-xl bg-black cursor-pointer group"
            style={{ 
              aspectRatio: '3/2', // 宽高比为1.5:1
              width: '100%'
            }}
            // Add the new onClick handler here
            onClick={handlePlayGame} 
          >
          
          {/* 游戏封面图片 */}
          {homeData ? (
            <img
              src={homeData.game?.cover}
              alt={homeData.title || t?.hero?.speedStarUnblocked || " Game"}
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={{
                backgroundColor: '#000',
                imageRendering: 'auto',
              }}
              onError={(e) => {
                // 如果图片加载失败，显示占位符
                e.currentTarget.style.display = 'none';
                const placeholder = e.currentTarget.nextElementSibling;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* 蒙板和播放按钮 (your existing code) */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-opacity-30">
            {/* 白色圆圈包围的三角播放按钮 */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 transform transition-all duration-300 group-hover:scale-110">
              <div className="w-0 h-0 border-l-[12px] border-l-blue-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent bg-white" style={{ marginLeft: '2px' }}></div>
            </div>
            {/* 开始游戏文字 */}
            <p className="text-white text-lg font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              {t?.hero?.startGame || "开始游戏"}
            </p>
          </div>
          
          </div>
        </div>

        {/* 第三行开始：30个游戏卡片 - 每行3个 */}
        {gamesToShow.length > 0 ? (
          gamesToShow.map((game, index) => (
            <div key={`mobile-featured-${game.id}-${index}`} className="col-span-1">
              <GameCard
                game={game}
                className="w-full aspect-square"
                size="tiny"
                isHomepage={true}
                lang={lang}
              />
            </div>
          ))
        ) : null}
        
        {/* 首页移动端：在游戏卡片下方显示page_content内容 */}
        {homeData?.page_content?.About && (
          <div className="col-span-3 mt-6">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                dangerouslySetInnerHTML={{
                  __html: replaceHeadingsWithP(homeData.page_content.About)
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* 标题弹窗 */}
      <Dialog open={showTitleDialog} onOpenChange={setShowTitleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t?.hero?.gameTitle || "游戏标题"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedTitle}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* The new FullscreenGameModal component */}
      <FullscreenGameModal
        title={modalGame.title}
        url={modalGame.url}
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
      />
    </div>
  )
}