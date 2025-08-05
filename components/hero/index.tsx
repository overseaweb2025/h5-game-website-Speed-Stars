"use client"
import { GameDetails, game, games } from "@/app/api/types/Get/game"
import MainCenterContainer from "./MainCenterContainer"
import Title from './Title'
import Breadcrumebs from './Breadcrumebs_navigation'
import LeftSide from "./LeftSide"
import RightSide from "./RightSide"
interface PropHero {
    t:any
    game?:game
    gameDetails:GameDetails
    GameList:games
}
const hero = ({t,game,gameDetails,GameList}:PropHero)=>{
    return (
        <>
   <section className="py-4 md:py-6 bg-gray-900 relative overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="w-full">
    
                {/* 面包屑 */}
                <Breadcrumebs t={t} gameDetails={gameDetails}/>
                 {/* 桌面端显示标题 */}
                <Title/>
                {/* 左边的游戏框 */}
                <div className="flex">
                    <LeftSide GameList={GameList} />
                    {/* Game frame - Optimized for rectangular game display */}
                    <MainCenterContainer gameDetails={gameDetails} GameList={GameList} t={t}/>
                    {/* <RightSide GameList={GameList} /> */}
                </div>
         
                {/* <LeftSide GameList={GameList} /> */}
            </div>

            {/* Mobile/Tablet layout - 统一网格布局 */}
            <div className="lg:hidden mb-6 px-4 mx-auto max-w-screen-xl">
              {/* 第一行：固定定位的功能卡片 + 游戏标题卡片 */}
              <div className="relative mb-5 w-full">
                <div className="grid grid-cols-3 gap-6">
                  {/* 固定定位的功能卡片 */}
                  <div className="col-span-1 relative">
                    <div className="fixed z-30 bg-white rounded-[9px] shadow-lg transition-shadow duration-300 h-[73px] p-1" style={{ width: 'calc((100vw - 80px) / 3 - 12px)' }}>
                      {/* 2行网格布局 */}
                      <div className="grid grid-rows-2 h-full gap-0">
                        {/* 第一行：占据2个格子 */}
                        <div className="row-span-1 grid grid-cols-2 gap-0 border-b border-gray-200">
                          <div className="col-span-2 bg-white flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-800">{t?.hero?.gameCenter || "游戏中心"}</span>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                  
            
                </div>
              </div>

            </div>
          </div>
    </section>
        </>
    )
}
export default hero