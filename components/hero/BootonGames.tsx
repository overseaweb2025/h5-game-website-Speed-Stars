import { games } from "@/app/api/types/Get/game"
import GameCard from "../games/GameCard"
interface PropSide {
    t:any
    GameList:games
}
const BootomGames =  ({GameList,t}:PropSide)=>{
    return (
        <>
           <div className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow mb-6 rounded-xl p-4">
                  <h2 className="text-lg font-bold text-white mb-4">{t?.hero?.discoverMoreGames || "Discover More Games"}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {GameList.length > 0 ? (
                      GameList.slice(0, 4).map((randomGame, index) => (
                        <GameCard
                          key={`discover-${randomGame.id}-${index}`}
                          game={randomGame}
                          className="w-full"
                          size="small"
                          isHomepage={true}
                        />
                      ))
                    ) : (
                      // Default placeholder cards when no game data
                      Array.from({ length: 4 }, (_, index) => (
                        <div key={`bottom-placeholder-${index}`} className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/50 p-4 min-h-[160px] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎮</div>
                            <div className="text-white text-sm font-medium">{t?.common?.loading || "Loading..."}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
        </>
    )
}

export default BootomGames