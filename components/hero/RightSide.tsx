import { games } from "@/app/api/types/Get/game"
import GameCard from "../games/GameCard"

interface PropSide {
    GameList: games
    t?: any
}

const RightSide = ({ GameList, t }: PropSide) => {
    return (
        <div 
            className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow flex-shrink-0"
            style={{ 
                width: "200px",
                borderRadius: '12px'
            }}
        >
            <div className="p-3">
                <h3 className="text-lg font-bold text-white mb-3 text-center"></h3>
                <div className="grid grid-cols-1 gap-4">
                    {GameList.length > 0 ? (
                        GameList.slice(0, 8).map((game, index) => {
                            const tags = ['New', 'Hot', 'Top rated'];
                            const taggedGame = {
                                ...game,
                                tag: tags[index % 3]
                            };
                            return (
                                <GameCard
                                    key={`right-${game.id}-${index}`}
                                    game={taggedGame}
                                    className="w-full"
                                    size="small"
                                    isHomepage={true}
                                />
                            );
                        })
                    ) : (
                        Array.from({ length: 8 }, (_, index) => {
                            const tags = ['New', 'Hot', 'Top rated'];
                            const tag = tags[index % 3];
                            return (
                                <div key={`right-placeholder-${index}`} className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/50 p-2 aspect-square flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl mb-1">🎮</div>
                                        <div className="text-white text-xs font-medium">{t?.common?.loading || "Loading..."}</div>
                                    </div>
                                    <div className={`absolute -top-1 -left-1 px-2 py-0.5 text-xs font-bold text-white rounded-[6px] shadow-lg z-10 ${
                                        tag === 'Hot' ? 'bg-red-500' : 
                                        tag === 'New' ? 'bg-purple-500' : 
                                        'bg-blue-500'
                                    }`}>
                                        {tag}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default RightSide