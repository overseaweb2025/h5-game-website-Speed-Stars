import { GameDetails, games } from "@/app/api/types/Get/game"
import IframeGame from "./IframeGame"
import BootomGames from "./BootonGames"
import ActionButtons from './ActionButtons'
interface PropMainCenter{
    gameDetails:GameDetails
    GameList:games
    t:any
}
const MainCenterContainer = ({gameDetails,GameList,t}:PropMainCenter)=>{
    return(
       <div  className="flex-1 min-w-0 p-6 max-w-[1650px] mx-auto" >
      <IframeGame gameDetails={gameDetails} />
      <BootomGames GameList={GameList} t={t} />
      <ActionButtons/>
      {/* 如果是首页/不是首页 */}
      </div>
    )
}

export default MainCenterContainer