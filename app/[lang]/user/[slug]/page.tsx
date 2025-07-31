"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { useSession } from "next-auth/react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getUserBySlug, StaticUserData } from "@/data/users/users-data"
import { getUserGameHistory, getUserGameStats, formatGameHistoryForDisplay } from "@/utils/gameHistoryUtils"
import { UserCircleIcon, GamepadIcon, HeartIcon, MessageCircleIcon, ClockIcon, StarIcon, TrophyIcon, CalendarIcon, ShareIcon, EyeIcon } from "lucide-react"

export default function UserProfilePage() {
  const { data: session } = useSession()
  const params = useParams()
  const slug = params.slug as string
  const [userData, setUserData] = useState<StaticUserData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'comments' | 'achievements'>('overview')
  const [loading, setLoading] = useState(true)
  const [realGameHistory, setRealGameHistory] = useState<any[]>([])
  const [isCurrentUser, setIsCurrentUser] = useState(false)

  // 刷新游戏历史记录的函数
  const refreshGameHistory = () => {
    if (isCurrentUser && session?.user) {
      const currentUserId = session.user.id || session.user.email || 'anonymous'
      const history = getUserGameHistory(currentUserId)
      const formattedHistory = formatGameHistoryForDisplay(history)
      setRealGameHistory(formattedHistory)
    }
  }

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const user = getUserBySlug(slug)
      if (!user) {
        notFound()
      }
      setUserData(user)
      
      // 检查是否是当前登录用户的页面
      const currentUserId = session?.user?.id || session?.user?.email || 'anonymous'
      const isCurrentUserPage = session?.user && (
        slug === currentUserId || 
        slug === session.user.email?.split('@')[0] ||
        user.profile.email === session.user.email
      )
      
      setIsCurrentUser(!!isCurrentUserPage)
      
      // 如果是当前用户，加载真实的游戏历史记录
      if (isCurrentUserPage) {
        const history = getUserGameHistory(currentUserId)
        const formattedHistory = formatGameHistoryForDisplay(history)
        setRealGameHistory(formattedHistory)
      }
      
      setLoading(false)
    }, 500)
  }, [slug, session])

  // 页面获得焦点时自动刷新游戏历史记录
  useEffect(() => {
    const handleFocus = () => {
      if (isCurrentUser && activeTab === 'history') {
        refreshGameHistory()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isCurrentUser, activeTab])

  if (loading) {
    return (
      <main className="bg-background min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading user profile...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!userData) {
    notFound()
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/20'
      case 'rare': return 'text-blue-400 bg-blue-400/20'
      case 'epic': return 'text-purple-400 bg-purple-400/20'
      case 'legendary': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gaming': return '🎮'
      case 'social': return '💬'
      case 'milestone': return '🏆'
      case 'special': return '⭐'
      default: return '🎯'
    }
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Notice */}
        <div className={`border rounded-lg p-3 mb-6 flex items-center ${
          isCurrentUser 
            ? 'bg-green-600/20 border-green-400/30' 
            : 'bg-blue-600/20 border-blue-400/30'
        }`}>
          <EyeIcon className={`w-5 h-5 mr-2 ${
            isCurrentUser 
              ? 'text-green-400' 
              : 'text-blue-400'
          }`} />
          <span className={`text-sm ${
            isCurrentUser 
              ? 'text-green-200' 
              : 'text-blue-200'
          }`}>
            {isCurrentUser 
              ? 'This is your profile - real game history will be displayed' 
              : 'You\'re viewing a public user profile'
            }
          </span>
        </div>

        {/* User Profile Header */}
        <div className="bg-gradient-to-r from-accent via-primary to-secondary rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center md:text-left">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                {userData.profile.avatar ? (
                  <img
                    src={userData.profile.avatar}
                    alt="Profile"
                    className="w-22 h-22 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {userData.profile.name}
              </h1>
              <p className="text-white/80 mb-2">@{userData.slug}</p>
              <div className="flex items-center text-white/60 text-sm mb-3">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Joined {formatDate(userData.profile.joinDate)}
              </div>
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors">
                <ShareIcon className="w-4 h-4 mr-2" />
                Share Profile
              </button>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <GamepadIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userData.stats.totalGamesPlayed}</div>
                <div className="text-white/80 text-sm">Games Played</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <ClockIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatPlayTime(userData.stats.totalPlayTime)}</div>
                <div className="text-white/80 text-sm">Play Time</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <TrophyIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Lv.{userData.stats.currentLevel}</div>
                <div className="text-white/80 text-sm">Level</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <StarIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userData.stats.achievementsCount}</div>
                <div className="text-white/80 text-sm">Achievements</div>
              </div>
            </div>
          </div>

          {/* Experience Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-white/80 text-sm mb-2">
              <span>Level {userData.stats.currentLevel}</span>
              <span>{userData.stats.currentExperience} / {userData.stats.nextLevelExperience} XP</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${(userData.stats.currentExperience / userData.stats.nextLevelExperience) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-2xl mb-6 p-2 shadow-lg">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: UserCircleIcon },
              { id: 'history', label: 'Game History', icon: ClockIcon },
              { id: 'comments', label: 'Comments', icon: MessageCircleIcon },
              { id: 'achievements', label: 'Achievements', icon: TrophyIcon }
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
                    {userData.recentGames.slice(0, 3).map(game => (
                      <div key={game.id} className="flex items-center gap-3 bg-gray-600 rounded-lg p-3">
                        <img
                          src={game.gameImage}
                          alt={game.gameDisplayName}
                          className="w-12 h-8 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{game.gameDisplayName}</p>
                          <p className="text-gray-400 text-sm">{formatDateTime(game.lastPlayed)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-700 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2 text-accent" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Favorite Games</span>
                      <span className="text-white font-semibold">{userData.stats.favoriteGamesCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Comments Written</span>
                      <span className="text-white font-semibold">{userData.stats.commentsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Rating</span>
                      <span className="text-white font-semibold">{userData.stats.averageRating}⭐</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Current Level</span>
                      <span className="text-accent font-semibold">Level {userData.stats.currentLevel}</span>
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
                {isCurrentUser && (
                  <button
                    onClick={refreshGameHistory}
                    className="bg-accent hover:bg-accent-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Refresh
                  </button>
                )}
              </div>
              
              {isCurrentUser ? (
                // 显示真实的游戏历史记录
                realGameHistory.length > 0 ? (
                  <div className="space-y-3">
                    {realGameHistory.map(record => (
                      <div key={record.id} className="flex items-center gap-4 bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors">
                        <div className="w-20 h-14 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                          <GamepadIcon className="w-8 h-8 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-lg">{record.gameDisplayName}</h3>
                          <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                            <span className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              Played: {record.formattedDate}
                            </span>
                            <span className="flex items-center">
                              <GamepadIcon className="w-4 h-4 mr-1" />
                              Duration: {record.formattedDuration}
                            </span>
                            <span className="flex items-center">
                              <TrophyIcon className="w-4 h-4 mr-1 text-green-400" />
                              Completed session
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GamepadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Game History Yet</h3>
                    <p className="text-gray-400 mb-4">Start playing games to build your gaming history!</p>
                    <p className="text-sm text-gray-500">Play any game for at least 10 seconds to save it to your history.</p>
                  </div>
                )
              ) : (
                // 显示静态数据用于公共配置文件
                <div className="space-y-3">
                  {userData.recentGames.map(game => (
                    <div key={game.id} className="flex items-center gap-4 bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors">
                      <img
                        src={game.gameImage}
                        alt={game.gameDisplayName}
                        className="w-20 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg">{game.gameDisplayName}</h3>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                          <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            Last played: {formatDateTime(game.lastPlayed)}
                          </span>
                          <span className="flex items-center">
                            <GamepadIcon className="w-4 h-4 mr-1" />
                            Play time: {formatPlayTime(game.playTime)}
                          </span>
                          {game.highScore && (
                            <span className="flex items-center">
                              <TrophyIcon className="w-4 h-4 mr-1" />
                              High Score: {game.highScore.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Comment History</h2>
              <div className="space-y-4">
                {userData.recentComments.map(comment => (
                  <div key={comment.id} className="bg-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{comment.gameDisplayName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex">{renderStars(comment.rating)}</div>
                          <span className="text-gray-400 text-sm">{formatDateTime(comment.createdAt)}</span>
                          <span className="text-gray-400 text-sm">👍 {comment.likes}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Achievements</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.achievements.map(achievement => (
                  <div key={achievement.id} className="bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{achievement.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity.toUpperCase()}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {getCategoryIcon(achievement.category)} {achievement.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                    <p className="text-gray-400 text-xs">
                      Unlocked {formatDateTime(achievement.unlockedAt)}
                    </p>
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