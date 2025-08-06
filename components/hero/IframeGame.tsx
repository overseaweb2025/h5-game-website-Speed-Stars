import { GameDetails } from "@/app/api/types/Get/game" 
import { useGamePlayTracker } from "@/hooks/useGamePlayTracker"
import { useState, useEffect } from "react"

interface PropIframe {
    gameDetails: GameDetails
    t?: any
}

const IframeGame = ({ gameDetails, t }: PropIframe) => {
    // We can remove iframeHeight and isDesktop state as CSS will handle this.
    // The component will still re-render on window resize, but the style
    // will be handled by CSS-in-JS or Tailwind CSS if used.
    
    const {
        initializeGame,
        setGameContainerRef,
        setIframeRef,
    } = useGamePlayTracker()

    // No need for a complex resize effect.
    useEffect(() => {
        if (gameDetails) {
            initializeGame({
                id: gameDetails.rating  || gameDetails.name,
                name: gameDetails.name || gameDetails.page_title,
                displayName: gameDetails.display_name || gameDetails.page_title
            })
        }
    }, [gameDetails, initializeGame])
    
    return (
        <div
            id="game-frame"
            ref={setGameContainerRef}
            className="relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 mb-6 bg-black"
            style={{ 
                // Set a fixed landscape aspect ratio, e.g., 16:9
                // You can adjust this to 16/9, 4/3, etc. based on your needs.
                // 16/9 is a good standard for landscape.
                aspectRatio: '16 / 9',
                width: "100%", // The width will be 100% of the parent
                // The height will be calculated automatically by the browser
                borderRadius: '12px',
                minHeight: '300px' // Keep a minimum height for very small screens
            }}
        >
            {gameDetails?.package?.url ? (
                <iframe
                    ref={setIframeRef}
                    src={gameDetails.package.url}
                    title={gameDetails.display_name || gameDetails.name || "Game"}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    style={{
                        backgroundColor: '#000',
                        imageRendering: 'auto'
                    }}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                />
            ) : (
                <NotLoading t={t} />
            )}
        </div>
    )
}

const NotLoading = ({ t }: { t: any }) => {
    return (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-3xl font-black text-text mb-3">{t?.hero?.comingSoon || "Coming Soon!"}</h2>
                <p className="text-text/80 text-lg">{t?.hero?.awesomeGameAvailableSoon || "This awesome game will be available soon."}</p>
            </div>
        </div>
    )
}

export default IframeGame