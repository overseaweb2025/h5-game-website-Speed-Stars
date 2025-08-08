"use client"

import GameCard from "@/components/games/GameCard"
import { Game as APIGame } from "@/app/api/types/Get/game"

interface SidePanelProps {
  randomGames: APIGame[]
  side: 'left' | 'right'
  t?: any
  lang?: string
}

// 辅助函数：将 APIGame 转换为 GameCard 需要的格式
const convertToGameCardFormat = (apiGame: APIGame): any => ({
  id: apiGame.id,
  name: apiGame.name,
  display_name: apiGame.display_name,
  cover: apiGame.cover || undefined,
  image: apiGame.image || undefined,
  package: apiGame.package || undefined
})

export default function SidePanel({ randomGames, side, t, lang = 'en' }: SidePanelProps) {
  const isRight = side === 'right'
  
  // 确保左右侧面板游戏不重复且数量均衡
  const getSidePanelGames = () => {
    if (randomGames.length === 0) return []
    
    const totalGames = randomGames.length
    const targetCount = 6
    
    if (isRight) {
      // 右侧取后半部分游戏
      const startIndex = Math.floor(totalGames / 2)
      return randomGames.slice(startIndex, startIndex + targetCount)
    } else {
      // 左侧取前半部分游戏
      return randomGames.slice(0, Math.min(targetCount, totalGames))
    }
  }
  
  const sidePanelGames = getSidePanelGames()

  return (
    <div 
      className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow flex-shrink-0"
      style={{ 
        width: "200px",
        borderRadius: '12px'
      }}
    >
      <div className="p-3">
        <div className="grid grid-cols-1 gap-3">
          {sidePanelGames.length > 0 ? (
            sidePanelGames.map((randomGame, index) => {
              const gameData = convertToGameCardFormat(randomGame)
              
              // 为右侧面板添加标签
              if (isRight) {
                const tags = ['New', 'Hot', 'Top rated'];
                gameData.tag = tags[index % 3];
              }
              
              return (
                <GameCard
                  key={`${side}-${randomGame.id}-${index}`}
                  game={gameData}
                  className="w-full"
                  size="small"
                  isHomepage={true}
                  t={t}
                  lang={lang}
                />
              )
            })
          ) : (
            // Default placeholder cards when no game data
            Array.from({ length: 6 }, (_, index) => {
              const tags = ['New', 'Hot', 'Top rated'];
              const tag = isRight ? tags[index % 3] : undefined;
              
              const placeholderGame = {
                id: `placeholder-${side}-${index}`,
                name: `placeholder-game-${index}`,
                display_name: t?.common?.loading || "Loading...",
                tag: tag
              }
              
              return (
                <GameCard
                  key={`${side}-placeholder-${index}`}
                  game={placeholderGame}
                  className="w-full"
                  size="small"
                  isHomepage={true}
                  t={t}
                  lang={lang}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}