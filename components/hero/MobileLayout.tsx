"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Search, Info } from "lucide-react"
import { GameDetails, game, games } from "@/app/api/types/Get/game"
import { useGameData } from "@/hooks/useGameData"
import { useHomeGameData } from "@/hooks/useHomeGameData"
import { GameRouter } from "@/lib/router"
import GameCard from "../games/GameCard"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FullscreenGameModal from "@/components/home/FullscreenGaameModal" // 1. Import the modal component

interface MobileLayoutProps {
  t: any
  game?: game
  gameDetails?: GameDetails
  GameList: games
  pageTitle?: string
}

const convertToExtendedGame = (apiGame: any): any => ({
  id: apiGame.id,
  name: apiGame.name,
  display_name: apiGame.display_name,
  image: undefined
})

const MobileLayout = ({ t, game, gameDetails, GameList, pageTitle }: MobileLayoutProps) => {
  const router = useRouter()
  const { homeData, loading: homeDataLoading } = useHomeGameData()
  const { categoriesWithGames } = useGameData()
  const [showTitleDialog, setShowTitleDialog] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState('')

  // 2. New state for the full-screen game modal
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const [modalGame, setModalGame] = useState({ title: '', url: '' })

  // 3. New function to handle opening the game modal
  const handlePlayGame = () => {
    // Determine the game details based on props, prioritizing gameDetails > game > homeData
    const gameToPlay = gameDetails || game || homeData?.data?.game;
    const gameUrl = gameToPlay?.package?.url;

    if (gameUrl) {
      setModalGame({
        title: gameToPlay.display_name || gameToPlay.name || pageTitle || "Game",
        url: gameUrl
      });
      setIsGameModalOpen(true);
    }
  };

  return (
    <div className="lg:hidden mb-6 px-4 mx-auto max-w-screen-xl">
      {/* First row: Fixed function cards + Game title card */}
      <div className="relative mb-5 w-full">
        <div className="grid grid-cols-3 gap-6">
          {/* Fixed function cards */}
          <div className="col-span-1 relative">
            <div className="fixed z-30 bg-gray-800 border border-gray-700 rounded-[9px] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-shadow duration-300 h-[73px] p-1" style={{ width: 'calc((100vw - 80px) / 3 - 12px)' }}>
              <div className="grid grid-rows-2 h-full gap-0">
                <div className="row-span-1 grid grid-cols-2 gap-0 border-b border-gray-600">
                  <div className="col-span-2 bg-gray-800 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">{t?.hero?.gameCenter || "游戏中心"}</span>
                  </div>
                </div>
                <div className="row-span-1 grid grid-cols-2 gap-0">
                  <div 
                    className="bg-gray-800 flex items-center justify-center border-r border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => router.push('/')}
                  >
                    <Home className="w-4 h-4 text-blue-500" />
                  </div>
                  <div 
                    className="bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => router.push('/search')}
                  >
                    <Search className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-[9px] px-4 py-3 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-shadow duration-300 flex items-center justify-between h-[73px]">
              <div className="text-left flex-1">
                <h2 
                  className="text-base font-black text-white leading-tight cursor-pointer hover:text-blue-400 transition-colors"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onClick={() => {
                    const title = game ? (game.display_name || game.name) : (gameDetails ? (gameDetails.display_name || gameDetails.title) : (pageTitle || "Game Center"))
                    setSelectedTitle(title)
                    setShowTitleDialog(true)
                  }}
                  title={game ? (game.display_name || game.name) : (gameDetails ? (gameDetails.display_name || gameDetails.title) : (pageTitle || "Game Center"))}
                >
                  {game ? (game.display_name || game.name) : (gameDetails ? (gameDetails.display_name || gameDetails.title) : (pageTitle || "Game Center"))}
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  {t?.hero?.category || "分类名"}: {game?.category || gameDetails?.category || homeData?.data?.category || "Games"}
                </p>
              </div>
              <Info 
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors ml-2 flex-shrink-0"
                onClick={() => {
                  const title = game ? (game.display_name || game.name) : (gameDetails ? (gameDetails.display_name || gameDetails.title) : (pageTitle || "Game Center"))
                  setSelectedTitle(title)
                  setShowTitleDialog(true)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unified 3-column grid layout */}
      <div className="grid grid-cols-3 gap-4">
        
        {/* Full-size embedded game - spans 3 columns */}
        <div className="col-span-3">
          <div
            id="game-frame-mobile-full"
            className="relative w-full rounded-[9px] overflow-hidden border border-gray-700 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 bg-black cursor-pointer group"
            style={{ 
              aspectRatio: '3/2', // 宽高比为1.5:1
              width: '100%'
            }}
            // 4. Attach the onClick handler to the main div
            onClick={handlePlayGame}
          >
            
            {/* Game cover image */}
            {!homeDataLoading ? (
              <img
                src={gameDetails?.cover || homeData?.data.game.cover}
                alt={pageTitle || game?.display_name || game?.name || t?.hero?.speedStarUnblocked || "Speed Stars Game"}
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{
                  backgroundColor: '#000',
                  imageRendering: 'auto',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            
            {/* Fallback/Loading UI - your existing code */}
            {homeDataLoading ? (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                  <h3 className="text-2xl font-black text-text mb-2">{t?.hero?.loadingGame || "Loading Game..."}</h3>
                  <p className="text-text/80">{t?.hero?.pleaseWait || "Please wait..."}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-3xl font-black text-text mb-2">{t?.hero?.comingSoon || "Coming Soon!"}</h3>
                  <p className="text-text/80 text-lg">{t?.hero?.awesomeGameAvailableSoon || "This awesome game will be available soon."}</p>
                </div>
              </div>
            )}
            
            {/* Overlay and play button */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-opacity-30">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 transform transition-all duration-300 group-hover:scale-110">
                <div className="w-0 h-0 border-l-[12px] border-l-blue-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent bg-white" style={{ marginLeft: '2px' }}></div>
              </div>
              <p className="text-white text-lg font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                {t?.hero?.startGame || "开始游戏"}
              </p>
            </div>
          </div>
        </div>

        {/* Game cards - 30 games, 3 per row */}
        {(() => {
          const filteredCategories = categoriesWithGames.filter(category => 
            category.category_name.toLowerCase() !== '2 player'
          );
          const selectedCategory = filteredCategories.length > 0 ? filteredCategories[0] : categoriesWithGames[0];
          const allAvailableGames = categoriesWithGames.flatMap(category => category.games || []);
          const gamesToShow = GameList.length > 0 ? GameList.slice(0, 30) : allAvailableGames.slice(0, 30);
          
          return (
            <>
              {gamesToShow.length > 0 ? (
                gamesToShow.map((gameItem, index) => (
                  <div key={`mobile-featured-${gameItem.id}-${index}`} className="col-span-1">
                    <GameCard
                      game={gameItem}
                      className="w-full aspect-square"
                      size="tiny"
                      isHomepage={true}
                    />
                  </div>
                ))
              ) : (
                Array.from({ length: 30 }, (_, index) => (
                  <div key={`fallback-${index}`} className="col-span-1">
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-[9px] border border-gray-700 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 p-2 aspect-square flex items-center justify-center transition-shadow duration-300">
                      <div className="text-center">
                        <div className="text-lg mb-1">🎮</div>
                        <div className="text-white text-xs font-medium">{t?.hero?.gameNumber?.replace('{index}', (index + 1).toString()) || `Game ${index + 1}`}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          );
        })()}
        
      </div>
      
      {/* Title Dialog */}
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
      
      {/* 5. Render the new full-screen modal component */}
      <FullscreenGameModal
        title={modalGame.title}
        url={modalGame.url}
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
      />
    </div>
  )
}

export default MobileLayout