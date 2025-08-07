import { games } from "@/app/api/types/Get/game"
import GameCard from "../games/GameCard"
interface PropSide {
    GameList:games
}
const LeftSide = ({GameList}:PropSide)=>{
    // 确保左侧面板显示前半部分游戏
    const getLeftSideGames = () => {
        if (!GameList || GameList.length === 0) return []
        const targetCount = 8
        return GameList.slice(0, Math.min(targetCount, GameList.length))
    }
    
    const leftSideGames = getLeftSideGames()
    
    // 如果没有游戏数据，显示占位符
    const showPlaceholders = leftSideGames.length === 0
    return (
        <>
          <div 
                className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow flex-shrink-0"
                style={{ 
                  width: "200px",
                  borderRadius: '12px'
                }}
              >
                <div className="p-3">
                  <div className="grid grid-cols-1 gap-4">
                    {showPlaceholders ? (
                      // 显示占位符，提示数据加载中
                      Array.from({ length: 8 }, (_, index) => (
                        <div key={`left-placeholder-${index}`} className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/50 p-2 aspect-square flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl mb-1">🎮</div>
                            <div className="text-white text-xs font-medium">Loading...</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      leftSideGames.map((game, index) => {
                        return (
                            <GameCard
                                key={`left-${game.id}-${index}`}
                                game={game}
                                className="w-full"
                                size="small"
                                isHomepage={true}
                            />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>    
        </>
    )
}

export default LeftSide