"use client"

import GameCard from "@/components/games/GameCard"
import { Game as APIGame } from "@/app/api/types/Get/game"

interface SidePanelProps {
  randomGames: APIGame[]
  side: 'left' | 'right'
  t?: any
}

// 辅助函数：将 APIGame 转换为 ExtendedGame
const convertToExtendedGame = (apiGame: APIGame): any => ({
  id: apiGame.id,
  name: apiGame.name,
  display_name: apiGame.display_name,
  image: undefined // 将会生成占位图
})

export default function SidePanel({ randomGames, side, t }: SidePanelProps) {
  const isRight = side === 'right'
  
  // 确保左右侧面板游戏不重复且数量均衡
  const getSidePanelGames = () => {
    if (randomGames.length === 0) return []
    
    const totalGames = randomGames.length
    const targetCount = 8
    const halfCount = Math.floor(targetCount / 2) // 4个
    
    if (isRight) {
      // 右侧取后半部分游戏
      const startIndex = Math.min(halfCount, totalGames - targetCount)
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
        {isRight && <h3 className="text-lg font-bold text-white mb-3 text-center"></h3>}
        <div className="grid grid-cols-1 gap-4">
          {sidePanelGames.length > 0 ? (
            sidePanelGames.map((randomGame, index) => {
              const gameData = convertToExtendedGame(randomGame)
              
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
                />
              )
            })
          ) : (
            // Default placeholder cards when no game data
            Array.from({ length: 8 }, (_, index) => {
              const tags = ['New', 'Hot', 'Top rated'];
              const tag = isRight ? tags[index % 3] : undefined;
              
              return (
                <div 
                  key={`${side}-placeholder-${index}`} 
                  className={`${isRight ? 'relative' : ''} bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/50 p-2 aspect-square flex items-center justify-center`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-1">🎮</div>
                    <div className="text-white text-xs font-medium">{t?.common?.loading || "Loading..."}</div>
                  </div>
                  
                  {/* Tag badge for right panel */}
                  {isRight && tag && (
                    <div className={`absolute -top-1 -left-1 px-2 py-0.5 text-xs font-bold text-white rounded-[6px] shadow-lg z-10 ${
                      tag === 'Hot' ? 'bg-red-500' : 
                      tag === 'New' ? 'bg-purple-500' : 
                      'bg-blue-500'
                    }`}>
                      {tag}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}