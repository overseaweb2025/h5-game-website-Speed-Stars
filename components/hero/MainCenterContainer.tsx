import { GameDetails, games, game } from "@/app/api/types/Get/game"
import IframeGame from "./IframeGame"
import BootomGames from "./BootonGames"
import ActionButtons from './ActionButtons'
import GamePage from "./GamePage"

interface PropMainCenter {
    gameDetails: GameDetails
    GameList: games
    t: any
    game?: game
    homeData?: any
}

const MainCenterContainer = ({ gameDetails, GameList, t }: PropMainCenter) => {
    return (
        <div className="flex-1 min-w-0 p-6 max-w-[1650px] mx-auto">
            <IframeGame gameDetails={gameDetails} t={t} />
            <BootomGames GameList={GameList} t={t} />
            <ActionButtons />
            <GamePage description={gameDetails.introduce} />
            
        </div>
    )
}

export default MainCenterContainer