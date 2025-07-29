"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { 
  getUserProfile, 
  getUserGameHistory, 
  getUserFavoriteGames, 
  getUserCommentHistory,
  addGameToFavorites,
  removeGameFromFavorites
} from '@/app/api/user/profile'
import { 
  UserProfileResponse, 
  GameHistory, 
  FavoriteGame, 
  CommentHistory 
} from '@/app/api/types/Get/user-profile'

interface UseUserProfileReturn {
  // 数据状态
  profile: UserProfileResponse | null
  gameHistory: GameHistory[]
  favoriteGames: FavoriteGame[]
  commentHistory: CommentHistory[]
  
  // 加载状态
  loading: boolean
  error: string | null
  
  // 操作函数
  refreshProfile: () => Promise<void>
  loadGameHistory: () => Promise<void>
  loadFavoriteGames: () => Promise<void>
  loadCommentHistory: () => Promise<void>
  toggleFavoriteGame: (gameId: number) => Promise<void>
  
  // 状态检查
  isGameFavorited: (gameId: number) => boolean
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [favoriteGames, setFavoriteGames] = useState<FavoriteGame[]>([])
  const [commentHistory, setCommentHistory] = useState<CommentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取用户ID
  const getUserId = useCallback(() => {
    return session?.user?.id || session?.user?.email || ''
  }, [session])

  // 刷新用户资料
  const refreshProfile = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await getUserProfile(userId)
      setProfile(response.data.data)
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError('Failed to load user profile')
      
      // 如果API不可用，使用模拟数据
      setProfile({
        profile: {
          id: userId,
          name: session?.user?.name || 'User',
          email: session?.user?.email || '',
          avatar: session?.user?.image || null,
          joinDate: '2024-01-15',
          level: 12,
          experience: 2450,
          achievements: 23
        },
        stats: {
          totalGamesPlayed: 15,
          totalPlayTime: 1250,
          favoriteGamesCount: 5,
          commentsCount: 8,
          averageRating: 4.2,
          achievementsCount: 23,
          currentLevel: 12,
          nextLevelExperience: 3000,
          currentExperience: 2450
        },
        recentGames: [],
        favoriteGames: [],
        recentComments: [],
        achievements: []
      })
    } finally {
      setLoading(false)
    }
  }, [getUserId, session])

  // 加载游戏历史
  const loadGameHistory = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      const response = await getUserGameHistory(userId, 1, 20)
      setGameHistory(response.data.data)
    } catch (err) {
      console.error('Error fetching game history:', err)
      
      // 使用模拟数据
      setGameHistory([
        {
          id: 1,
          gameId: 1,
          gameName: "sniper-challenge-game",
          gameDisplayName: "Sniper Challenge Game",
          lastPlayed: "2024-01-20T10:30:00Z",
          playTime: 45,
          sessionsCount: 3,
          highScore: 1250,
          gameImage: "/placeholder.svg?height=80&width=120&text=Sniper&bg=4a9eff&color=white"
        },
        {
          id: 2,
          gameId: 7,
          gameName: "super-slime",
          gameDisplayName: "Super Slime",
          lastPlayed: "2024-01-19T15:45:00Z",
          playTime: 32,
          sessionsCount: 2,
          gameImage: "/placeholder.svg?height=80&width=120&text=Slime&bg=8b4513&color=white"
        },
        {
          id: 3,
          gameId: 12,
          gameName: "dig-tycoon",
          gameDisplayName: "Dig Tycoon",
          lastPlayed: "2024-01-18T20:15:00Z",
          playTime: 67,
          sessionsCount: 4,
          gameImage: "/placeholder.svg?height=80&width=120&text=Dig&bg=2196f3&color=white"
        }
      ])
    }
  }, [getUserId])

  // 加载收藏游戏
  const loadFavoriteGames = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      const response = await getUserFavoriteGames(userId, 1, 20)
      setFavoriteGames(response.data.data)
    } catch (err) {
      console.error('Error fetching favorite games:', err)
      
      // 使用模拟数据
      setFavoriteGames([
        {
          id: 1,
          gameId: 1,
          gameName: "sniper-challenge-game",
          gameDisplayName: "Sniper Challenge Game",
          addedDate: "2024-01-10",
          gameImage: "/placeholder.svg?height=80&width=120&text=Sniper&bg=4a9eff&color=white"
        },
        {
          id: 2,
          gameId: 11,
          gameName: "twisted-tangle",
          gameDisplayName: "Twisted Tangle",
          addedDate: "2024-01-12",
          gameImage: "/placeholder.svg?height=80&width=120&text=Tangle&bg=8b008b&color=white"
        }
      ])
    }
  }, [getUserId])

  // 加载评论历史
  const loadCommentHistory = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      const response = await getUserCommentHistory(userId, 1, 20)
      setCommentHistory(response.data.data)
    } catch (err) {
      console.error('Error fetching comment history:', err)
      
      // 使用模拟数据
      setCommentHistory([
        {
          id: 1,
          gameId: 1,
          gameName: "sniper-challenge-game",
          gameDisplayName: "Sniper Challenge Game",
          comment: "Amazing game with great graphics! Love the precision required.",
          rating: 5,
          createdAt: "2024-01-15T14:30:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
          likes: 12
        },
        {
          id: 2,
          gameId: 7,
          gameName: "super-slime",
          gameDisplayName: "Super Slime",
          comment: "Fun and addictive gameplay. Perfect for quick breaks.",
          rating: 4,
          createdAt: "2024-01-14T09:15:00Z",
          updatedAt: "2024-01-14T09:15:00Z",
          likes: 8
        }
      ])
    }
  }, [getUserId])

  // 切换游戏收藏状态
  const toggleFavoriteGame = useCallback(async (gameId: number) => {
    const userId = getUserId()
    if (!userId) return

    const isFavorited = favoriteGames.some(game => game.gameId === gameId)

    try {
      if (isFavorited) {
        await removeGameFromFavorites(userId, gameId)
        setFavoriteGames(prev => prev.filter(game => game.gameId !== gameId))
      } else {
        await addGameToFavorites(userId, gameId)
        // 重新加载收藏列表
        await loadFavoriteGames()
      }
    } catch (err) {
      console.error('Error toggling favorite game:', err)
      // 模拟本地状态更新
      if (isFavorited) {
        setFavoriteGames(prev => prev.filter(game => game.gameId !== gameId))
      } else {
        // 添加到收藏（模拟）
        const newFavorite: FavoriteGame = {
          id: Date.now(),
          gameId,
          gameName: `game-${gameId}`,
          gameDisplayName: `Game ${gameId}`,
          addedDate: new Date().toISOString().split('T')[0],
          gameImage: `/placeholder.svg?height=80&width=120&text=Game${gameId}&bg=4a9eff&color=white`
        }
        setFavoriteGames(prev => [...prev, newFavorite])
      }
    }
  }, [getUserId, favoriteGames, loadFavoriteGames])

  // 检查游戏是否已收藏
  const isGameFavorited = useCallback((gameId: number) => {
    return favoriteGames.some(game => game.gameId === gameId)
  }, [favoriteGames])

  // 初始化数据
  useEffect(() => {
    if (session?.user?.id || session?.user?.email) {
      const initData = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const userId = session.user?.id || session.user?.email || ''
          
          // 并行加载所有数据
          await Promise.allSettled([
            (async () => {
              try {
                const response = await getUserProfile(userId)
                setProfile(response.data.data)
              } catch (err) {
                console.error('Error fetching user profile:', err)
                setProfile({
                  profile: {
                    id: userId,
                    name: session?.user?.name || 'User',
                    email: session?.user?.email || '',
                    avatar: session?.user?.image || null,
                    joinDate: '2024-01-15',
                    level: 12,
                    experience: 2450,
                    achievements: 23
                  },
                  stats: {
                    totalGamesPlayed: 15,
                    totalPlayTime: 1250,
                    favoriteGamesCount: 5,
                    commentsCount: 8,
                    averageRating: 4.2,
                    achievementsCount: 23,
                    currentLevel: 12,
                    nextLevelExperience: 3000,
                    currentExperience: 2450
                  },
                  recentGames: [],
                  favoriteGames: [],
                  recentComments: [],
                  achievements: []
                })
              }
            })(),
            (async () => {
              try {
                const response = await getUserGameHistory(userId, 1, 20)
                setGameHistory(response.data.data)
              } catch (err) {
                console.error('Error fetching game history:', err)
                setGameHistory([
                  {
                    id: 1,
                    gameId: 1,
                    gameName: "sniper-challenge-game",
                    gameDisplayName: "Sniper Challenge Game",
                    lastPlayed: "2024-01-20T10:30:00Z",
                    playTime: 45,
                    sessionsCount: 3,
                    highScore: 1250,
                    gameImage: "/placeholder.svg?height=80&width=120&text=Sniper&bg=4a9eff&color=white"
                  }
                ])
              }
            })(),
            (async () => {
              try {
                const response = await getUserFavoriteGames(userId, 1, 20)
                setFavoriteGames(response.data.data)
              } catch (err) {
                console.error('Error fetching favorite games:', err)
                setFavoriteGames([
                  {
                    id: 1,
                    gameId: 1,
                    gameName: "sniper-challenge-game",
                    gameDisplayName: "Sniper Challenge Game",
                    addedDate: "2024-01-10",
                    gameImage: "/placeholder.svg?height=80&width=120&text=Sniper&bg=4a9eff&color=white"
                  }
                ])
              }
            })(),
            (async () => {
              try {
                const response = await getUserCommentHistory(userId, 1, 20)
                setCommentHistory(response.data.data)
              } catch (err) {
                console.error('Error fetching comment history:', err)
                setCommentHistory([
                  {
                    id: 1,
                    gameId: 1,
                    gameName: "sniper-challenge-game",
                    gameDisplayName: "Sniper Challenge Game",
                    comment: "Amazing game with great graphics!",
                    rating: 5,
                    createdAt: "2024-01-15T14:30:00Z",
                    updatedAt: "2024-01-15T14:30:00Z",
                    likes: 12
                  }
                ])
              }
            })()
          ])
        } finally {
          setLoading(false)
        }
      }
      
      initData()
    }
  }, [session?.user?.id, session?.user?.email])

  return {
    // 数据状态
    profile,
    gameHistory,
    favoriteGames,
    commentHistory,
    
    // 加载状态
    loading,
    error,
    
    // 操作函数
    refreshProfile,
    loadGameHistory,
    loadFavoriteGames,
    loadCommentHistory,
    toggleFavoriteGame,
    
    // 状态检查
    isGameFavorited
  }
}