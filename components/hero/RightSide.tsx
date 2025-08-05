import { games } from "@/app/api/types/Get/game"
import LeftSide from "./LeftSide"
interface PropSide {
    GameList:games
}
const RightSide = ({GameList}:PropSide)=>{
    return (<LeftSide GameList={[]} />)
}


export default RightSide