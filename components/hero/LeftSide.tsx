import { games } from "@/app/api/types/Get/game"
import GameCard from "../games/GameCard"
interface PropSide {
    GameList:games
}
const LeftSide = ({GameList}:PropSide)=>{
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
                    {GameList.map((game,index)=>{
                        return(
                        <GameCard
                          key={`left-${game.id}-${index}`}
                          game={game}
                          className="w-full"
                          size="small"
                          isHomepage={true}
                        />
                        )
                    })}
           
                  </div>
                </div>
              </div>    
        </>
    )
}

export default LeftSide