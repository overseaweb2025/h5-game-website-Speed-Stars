"use client"
import { GameDetails, game, games } from "@/app/api/types/Get/game"
import { useHomeGameData } from "@/hooks/useHomeGameData"
import { useLangGameDetails } from "@/hooks/LangGameDetails_value"
import { useCommentCacheManager } from "@/hooks/useCommentCacheManager"
import { Locale } from "@/lib/lang/dictionaraies"
import { detectPublishingMode, shouldForceRefresh, forceRefreshGameCache } from "@/lib/cache-utils"
import { useEffect } from "react"
import MainCenterContainer from "./MainCenterContainer"
import Title from './Title'
import Breadcrumebs from './Breadcrumebs_navigation'
import LeftSide from "./LeftSide"
import RightSide from "./RightSide"
import MobileLayout from "./MobileLayout"
import ContentSections from "./ContentSections"
import Testimonials from '@/components/testimonials'

interface PropHero {
    t: any
    game?: game
    gameDetails: GameDetails
    GameList: games
    pageTitle?: string
    lang?: Locale
    isPublishing?: boolean
}

const hero = ({ t, game, gameDetails, GameList, pageTitle, lang, isPublishing }: PropHero) => {
    const { homeData } = useHomeGameData()
    const { clearSpecificGameCache, autoGetData } = useLangGameDetails()
    
    // 集成评论缓存管理
    const gameSlug = gameDetails?.name || gameDetails?.display_name
    useCommentCacheManager({ gameSlug, lang })
    
    // 发布时清空对应游戏的缓存，确保刷新时重新获取最新数据
    useEffect(() => {
        const gameSlug = gameDetails?.name || gameDetails?.display_name
        
        if (!lang || !gameSlug) return
        
        // 检测发布模式或外部传入的发布标识
        const isInPublishingMode = isPublishing || detectPublishingMode()
        const needsForceRefresh = shouldForceRefresh(gameSlug, lang)
        
        if (isInPublishingMode || needsForceRefresh) {
            console.log(`[Hero] ${isInPublishingMode ? 'Publishing' : 'Force refresh'} detected, clearing cache for game: ${gameSlug} in language: ${lang}`)
            
            // 清空缓存
            clearSpecificGameCache(lang, gameSlug)
            
            // 设置强制刷新标识
            forceRefreshGameCache(gameSlug, lang)
            
            // 立即重新获取数据，force=false表示强制获取
            setTimeout(() => {
                autoGetData(lang, gameSlug, false)
            }, 100) // 短暂延迟确保缓存已清空
        }
    }, [isPublishing, lang, gameDetails?.name, gameDetails?.gameSlug, clearSpecificGameCache, autoGetData])
    
    return (
        <section className="py-4 md:py-6 bg-gray-900 relative overflow-hidden">
            <div className="container mx-auto px-2 sm:px-4">
                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        {/* Breadcrumbs Navigation */}
                        <Breadcrumebs t={t} gameDetails={gameDetails} />
                        
                        {/* Desktop Title */}
                        <Title 
                            game={game} 
                            gameDetails={gameDetails} 
                            pageTitle={pageTitle}
                        />
                        
                        {/* Desktop Layout - Three column layout with sidebars */}
                        <div className="hidden lg:flex justify-center items-start gap-12 xl:gap-6 mb-6 mx-auto max-w-[2400px] w-full px-4">
                            {/* Left side panel - 仅在超大屏幕显示 */}
                            <div className="hidden xl:block">
                                <LeftSide GameList={GameList} />
                            </div>
                            <MainCenterContainer 
                                gameDetails={gameDetails} 
                                GameList={GameList} 
                                t={t}
                            />
                            {/* Right side panel - 仅在超大屏幕显示 */}
                            <div className="hidden xl:block">
                                <RightSide GameList={GameList} t={t} />
                            </div>
                        </div>
                        
                        {/* Mobile/Tablet Layout */}
                        <MobileLayout 
                            t={t}
                            game={game}
                            gameDetails={gameDetails}
                            GameList={GameList}
                            pageTitle={pageTitle}
                        />
                        <Testimonials gameSlug={gameDetails.name} reviews={gameDetails.reviews} t={t} />
                        {/* Content Sections for mobile */}
                        <div className="lg:hidden">
                            <ContentSections 
                                game={game}
                                gameDetails={gameDetails}
                                homeData={homeData}
                                isMobile={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default hero