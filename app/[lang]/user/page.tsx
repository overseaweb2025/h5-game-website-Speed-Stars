"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { UserCircleIcon, GamepadIcon, HeartIcon, MessageCircleIcon, ClockIcon, StarIcon, TrophyIcon, CalendarIcon } from "lucide-react"
import { useGameHistory } from "@/hooks/useGameHistory"

interface GameHistory {
  id: number
  name: string
  display_name: string
  lastPlayed: string
  playTime: number
  image: string
}

// interface FavoriteGame {
//   id: number
//   name: string
//   display_name: string
//   addedDate: string
//   image: string
// }

interface CommentHistory {
  id: number
  gameName: string
  gameDisplayName: string
  comment: string
  rating: number
  createdAt: string
}

interface UserStats {
  totalGamesPlayed: number
  totalPlayTime: number
  favoriteGames: number
  commentsCount: number
  joinDate: string
  level: number
  achievements: number
}

export default function UserPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'comments'>('overview')
  
  // 游戏历史记录功能
  const { 
    history: realGameHistory, 
    stats: gameStats, 
    isEnabled: historyEnabled,
    getRecentGames 
  } = useGameHistory()
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalGamesPlayed: 0,
    totalPlayTime: 0,
    favoriteGames: 0,
    commentsCount: 0,
    joinDate: '',
    level: 1,
    achievements: 0
  })
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  // const [favoriteGames, setFavoriteGames] = useState<FavoriteGame[]>([])
  const [commentHistory, setCommentHistory] = useState<CommentHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/")
      return
    }

    // 加载数据，结合真实游戏历史记录
    setTimeout(() => {
      // 使用真实游戏历史数据更新统计信息
      const realStats = historyEnabled && gameStats ? {
        totalGamesPlayed: gameStats.totalGames,
        totalPlayTime: Math.floor(gameStats.totalPlayTime / 60), // 转换为分钟
        favoriteGames: 0, // 隐藏收藏功能
        commentsCount: 8, // 保持模拟数据
        joinDate: session.user?.email ? '2024-01-15' : '',
        level: Math.min(Math.floor(gameStats.totalGames / 5) + 1, 50), // 根据游戏数量计算等级
        achievements: Math.floor(gameStats.totalGames / 2) // 根据游戏数量计算成就
      } : {
        totalGamesPlayed: 0,
        totalPlayTime: 0,
        favoriteGames: 0,
        commentsCount: 8,
        joinDate: session.user?.email ? '2024-01-15' : '',
        level: 1,
        achievements: 0
      }
      
      setUserStats(realStats)

      // 不再设置模拟的gameHistory，因为我们使用真实的realGameHistory

      // setFavoriteGames([
      //   {
      //     id: 1,
      //     name: "sniper-challenge-game",
      //     display_name: "Sniper Challenge Game",
      //     addedDate: "2024-01-10",
      //     image: "/placeholder.svg?height=80&width=120&text=Sniper&bg=4a9eff&color=white"
      //   },
      //   {
      //     id: 2,
      //     name: "twisted-tangle",
      //     display_name: "Twisted Tangle",
      //     addedDate: "2024-01-12",
      //     image: "/placeholder.svg?height=80&width=120&text=Tangle&bg=8b008b&color=white"
      //   }
      // ])

      setCommentHistory([
        {
          id: 1,
          gameName: "sniper-challenge-game",
          gameDisplayName: "Sniper Challenge Game",
          comment: "Amazing game with great graphics! Love the precision required.",
          rating: 5,
          createdAt: "2024-01-15T14:30:00Z"
        },
        {
          id: 2,
          gameName: "super-slime",
          gameDisplayName: "Super Slime",
          comment: "Fun and addictive gameplay. Perfect for quick breaks.",
          rating: 4,
          createdAt: "2024-01-14T09:15:00Z"
        }
      ])

      setLoading(false)
    }, 1000)
  }, [session, status, router, historyEnabled, gameStats, realGameHistory])

  if (status === "loading" || loading) {
    return (
      <main className="bg-background min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!session) {
    return (
      <main className="bg-background min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64 flex-col gap-4">
          <div className="text-white text-xl">Please sign in to view your profile</div>
          <button
            onClick={() => signIn()}
            className="bg-accent hover:bg-accent-2 text-white font-bold py-2 px-4 rounded-lg"
          >
            Sign In
          </button>
        </div>
        <Footer />
      </main>
    )
  }

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ))
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* User Profile Header */}
        <div className="bg-gradient-to-r from-accent via-primary to-secondary rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center md:text-left">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-22 h-22 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {session.user?.name || session.user?.email || 'Gamer'}
              </h1>
              <p className="text-white/80 mb-2">{session.user?.email}</p>
              <div className="flex items-center text-white/60 text-sm">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Joined {formatDate(userStats.joinDate)}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <GamepadIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalGamesPlayed}</div>
                <div className="text-white/80 text-sm">Games Played</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <ClockIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatPlayTime(userStats.totalPlayTime)}</div>
                <div className="text-white/80 text-sm">Play Time</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <TrophyIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Lv.{userStats.level}</div>
                <div className="text-white/80 text-sm">Level</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <StarIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.achievements}</div>
                <div className="text-white/80 text-sm">Achievements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-2xl mb-6 p-2 shadow-lg">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: UserCircleIcon },
              { id: 'history', label: 'Game History', icon: ClockIcon },
              { id: 'comments', label: 'Comments', icon: MessageCircleIcon }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-accent text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-700 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-accent" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {historyEnabled && realGameHistory.length > 0 ? (
                      getRecentGames(10).map((game, index) => (
                        <div key={`${game.slug}-${game.visitedAt}`} className="flex items-center gap-3 bg-gray-600 rounded-lg p-3">
                          <div className="w-12 h-8 rounded flex-shrink-0">
                            {game.image && game.image !== '' ? (
                              <img
                                src={game.image}
                                alt={game.name}
                                className="w-full h-full rounded object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const placeholder = target.nextElementSibling as HTMLElement;
                                  if (placeholder) placeholder.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full rounded flex items-center justify-center ${game.image && game.image !== '' ? 'hidden' : 'flex'}`}>
                              <div className="text-white text-2xl flex items-center justify-center">🎮</div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{game.name}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(game.visitedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })} • {Math.floor(game.visitDuration / 60)}m {game.visitDuration % 60}s
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          {!historyEnabled 
                            ? "Game history is disabled. Please sign in to track your activity." 
                            : "No recent activity. Start playing games to see your history here!"
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-700 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2 text-accent" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    {/* Favorite Games - Hidden */}
                    {/* <div className="flex justify-between items-center">
                      <span className="text-gray-400">Favorite Games</span>
                      <span className="text-white font-semibold">{userStats.favoriteGames}</span>
                    </div> */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Comments Written</span>
                      <span className="text-white font-semibold">{userStats.commentsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Achievements</span>
                      <span className="text-white font-semibold">{userStats.achievements}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Current Level</span>
                      <span className="text-accent font-semibold">Level {userStats.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Game History</h2>
                {historyEnabled && realGameHistory.length > 0 && (
                  <div className="text-sm text-gray-400">
                    {realGameHistory.length} games played
                  </div>
                )}
              </div>
              
              {historyEnabled && realGameHistory.length > 0 ? (
                <div className="space-y-3">
                  {realGameHistory.map((game, index) => (
                    <div key={`${game.slug}-${game.visitedAt}`} className="flex items-center gap-4 bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors">
                      <div className="w-20 h-14 rounded-lg flex-shrink-0">
                        {game.image && game.image !== '' ? (
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                        ) : null}
                     <div className={`w-full h-full rounded-lg flex items-center justify-center ${game.image && game.image !== '' ? 'hidden' : 'flex'}`}>
                         <div className="text-white text-3xl flex items-center justify-center">🎮</div>
                     </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg">{game.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                          <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            Played: {new Date(game.visitedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="flex items-center">
                            <GamepadIcon className="w-4 h-4 mr-1" />
                            Duration: {Math.floor(game.visitDuration / 60)}m {game.visitDuration % 60}s
                          </span>
                          {game.category && (
                            <span className="flex items-center">
                              <TrophyIcon className="w-4 h-4 mr-1 text-purple-400" />
                              {game.category}
                            </span>
                          )}
                        </div>
                        {game.description && (
                          <p className="text-gray-500 text-sm mt-1 truncate">{game.description}</p>
                        )}
                      </div>
                      <a 
                        href={`/game/${game.slug}`}
                        className="bg-accent hover:bg-accent-2 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Play Again
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GamepadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {!historyEnabled ? "Game History Disabled" : "No Game History Yet"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {!historyEnabled 
                      ? "Please sign in to track your gaming history and see detailed statistics."
                      : "Start playing games to build your gaming history! Play any game for at least 30 seconds to save it here."
                    }
                  </p>
                  {!historyEnabled && (
                    <p className="text-sm text-gray-500">
                      History tracking is only available for logged-in users.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}


          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Comment History</h2>
              <div className="space-y-4">
                {commentHistory.map(comment => (
                  <div key={comment.id} className="bg-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{comment.gameDisplayName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">{renderStars(comment.rating)}</div>
                          <span className="text-gray-400 text-sm">{formatDateTime(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}