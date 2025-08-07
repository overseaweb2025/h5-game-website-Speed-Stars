"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { UserCircleIcon, GamepadIcon, HeartIcon, MessageCircleIcon, ClockIcon, StarIcon, TrophyIcon, CalendarIcon } from "lucide-react"
import { useGameHistory } from "@/hooks/useGameHistory"
import { Locale } from "@/lib/lang/dictionaraies"

interface GameHistory {
  id: number
  name: string
  display_name: string
  lastPlayed: string
  playTime: number
  image: string
}

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

interface UserPageClientProps {
  lang: Locale
  t: any
}

export default function UserPageClient({ lang, t }: UserPageClientProps) {

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
  const [commentHistory, setCommentHistory] = useState<CommentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [recentActivityPage, setRecentActivityPage] = useState(1)
  const itemsPerPage = 10

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

  // 分页逻辑
  const totalRecentGames = realGameHistory.length
  const totalPages = Math.ceil(totalRecentGames / itemsPerPage)
  const startIndex = (recentActivityPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRecentGames = realGameHistory.slice(startIndex, endIndex)

  if (status === "loading" || loading) {
    return (
      <main className="bg-background min-h-screen">
        <Header t={t} lang={lang as Locale}/>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">{t?.user?.loading || "Loading..."}</div>
        </div>
      <Footer t={t} lang={lang as Locale}/>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="bg-background min-h-screen">
        <Header t={t} lang={lang as Locale}/>
        <div className="flex items-center justify-center h-64 flex-col gap-4">
          <div className="text-white text-xl">{t?.user?.pleaseSignIn || "Please sign in to view your profile"}</div>
          <button
            onClick={() => signIn()}
            className="bg-accent hover:bg-accent-2 text-white font-bold py-2 px-4 rounded-lg"
          >
            {t?.user?.signIn || "Sign In"}
          </button>
        </div>
      <Footer t={t} lang={lang as Locale}/>
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
        <Header t={t} lang={lang as Locale}/>
      
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
                {session.user?.name || session.user?.email || t?.user?.gamer || 'Gamer'}
              </h1>
              <p className="text-white/80 mb-2">{session.user?.email}</p>
              <div className="flex items-center text-white/60 text-sm">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {t?.user?.joined || "Joined"} {formatDate(userStats.joinDate)}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <GamepadIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalGamesPlayed}</div>
                <div className="text-white/80 text-sm">{t?.user?.gamesPlayed || "Games Played"}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <ClockIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatPlayTime(userStats.totalPlayTime)}</div>
                <div className="text-white/80 text-sm">{t?.user?.playTime || "Play Time"}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <TrophyIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{t?.user?.level || "Lv"}.{userStats.level}</div>
                <div className="text-white/80 text-sm">{t?.user?.level || "Level"}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <StarIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.achievements}</div>
                <div className="text-white/80 text-sm">{t?.user?.achievements || "Achievements"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-2xl mb-6 p-2 shadow-lg">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'overview', label: t?.user?.overview || 'Overview', icon: UserCircleIcon },
              { id: 'history', label: t?.user?.gameHistory || 'Game History', icon: ClockIcon },
              { id: 'comments', label: t?.user?.comments || 'Comments', icon: MessageCircleIcon }
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
              <h2 className="text-2xl font-bold text-white mb-4">{t?.user?.overview || "Overview"}</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2 text-accent" />
                      {t?.user?.recentActivity || "Recent Activity"}
                    </h3>
                    {totalRecentGames > itemsPerPage && (
                      <div className="text-sm text-gray-400">
                        {t?.user?.page || "Page"} {recentActivityPage} {t?.user?.of || "of"} {totalPages}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {historyEnabled && paginatedRecentGames.length > 0 ? (
                      paginatedRecentGames.map((game, index) => (
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
                            ? t?.user?.gameHistoryDisabledDesc || "Game history is disabled. Please sign in to track your activity." 
                            : t?.user?.noGameHistoryDesc || "No recent activity. Start playing games to see your history here!"
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalRecentGames > itemsPerPage && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button
                        onClick={() => setRecentActivityPage(Math.max(1, recentActivityPage - 1))}
                        disabled={recentActivityPage === 1}
                        className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                      >
                        {t?.user?.previous || "Previous"}
                      </button>
                      
                      <span className="text-gray-300 text-sm">
                        {t?.user?.page || "Page"} {recentActivityPage} {t?.user?.of || "of"} {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setRecentActivityPage(Math.min(totalPages, recentActivityPage + 1))}
                        disabled={recentActivityPage === totalPages}
                        className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                      >
                        {t?.user?.next || "Next"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-700 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2 text-accent" />
                    {t?.user?.quickStats || "Quick Stats"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t?.user?.commentsWritten || "Comments Written"}</span>
                      <span className="text-white font-semibold">{userStats.commentsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t?.user?.achievements || "Achievements"}</span>
                      <span className="text-white font-semibold">{userStats.achievements}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t?.user?.currentLevel || "Current Level"}</span>
                      <span className="text-accent font-semibold">{t?.user?.level || "Level"} {userStats.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">{t?.user?.gameHistory || "Game History"}</h2>
                {historyEnabled && realGameHistory.length > 0 && (
                  <div className="text-sm text-gray-400">
                    {realGameHistory.length} {t?.user?.gamesPlayed?.toLowerCase() || "games played"}
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
                            {t?.user?.played || "Played"}: {new Date(game.visitedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="flex items-center">
                            <GamepadIcon className="w-4 h-4 mr-1" />
                            {t?.user?.duration || "Duration"}: {Math.floor(game.visitDuration / 60)}m {game.visitDuration % 60}s
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
                        href={`/${lang}/game/${game.slug}`}
                        className="bg-accent hover:bg-accent-2 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        {t?.user?.playAgain || "Play Again"}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GamepadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {!historyEnabled ? t?.user?.gameHistoryDisabled || "Game History Disabled" : t?.user?.noGameHistoryYet || "No Game History Yet"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {!historyEnabled 
                      ? t?.user?.gameHistoryDisabledDesc || "Please sign in to track your gaming history and see detailed statistics."
                      : t?.user?.noGameHistoryDesc || "Start playing games to build your gaming history! Play any game for at least 30 seconds to save it here."
                    }
                  </p>
                  {!historyEnabled && (
                    <p className="text-sm text-gray-500">
                      {t?.user?.historyTrackingNote || "History tracking is only available for logged-in users."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}


          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">{t?.user?.commentHistory || "Comment History"}</h2>
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

      <Footer t={t} lang={lang as Locale}/>
    </main>
  )
}