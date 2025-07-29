import api from '../index'
import { ApiResponse } from '../types'
import { 
  UserProfileResponse, 
  GameHistory, 
  FavoriteGame, 
  CommentHistory,
  UserStats,
  UserAchievement 
} from '../types/Get/user-profile'

// 获取用户完整资料
export const getUserProfile = (userId: string) => {
  return api.get<ApiResponse<UserProfileResponse>>(`/api/v1/user/${userId}/profile`)
}

// 获取用户游戏历史
export const getUserGameHistory = (userId: string, page: number = 1, limit: number = 10) => {
  return api.get<ApiResponse<GameHistory[]>>(`/api/v1/user/${userId}/games/history`, {
    params: { page, limit }
  })
}

// 获取用户收藏游戏
export const getUserFavoriteGames = (userId: string, page: number = 1, limit: number = 10) => {
  return api.get<ApiResponse<FavoriteGame[]>>(`/api/v1/user/${userId}/games/favorites`, {
    params: { page, limit }
  })
}

// 获取用户评论历史
export const getUserCommentHistory = (userId: string, page: number = 1, limit: number = 10) => {
  return api.get<ApiResponse<CommentHistory[]>>(`/api/v1/user/${userId}/comments`, {
    params: { page, limit }
  })
}

// 获取用户统计信息
export const getUserStats = (userId: string) => {
  return api.get<ApiResponse<UserStats>>(`/api/v1/user/${userId}/stats`)
}

// 获取用户成就
export const getUserAchievements = (userId: string) => {
  return api.get<ApiResponse<UserAchievement[]>>(`/api/v1/user/${userId}/achievements`)
}

// 添加游戏到收藏
export const addGameToFavorites = (userId: string, gameId: number) => {
  return api.post<ApiResponse<{ success: boolean }>>(`/api/v1/user/${userId}/games/favorites`, {
    gameId
  })
}

// 从收藏中移除游戏
export const removeGameFromFavorites = (userId: string, gameId: number) => {
  return api.delete<ApiResponse<{ success: boolean }>>(`/api/v1/user/${userId}/games/favorites/${gameId}`)
}

// 记录游戏游玩时间
export const recordGamePlaytime = (userId: string, gameId: number, playTime: number) => {
  return api.post<ApiResponse<{ success: boolean }>>(`/api/v1/user/${userId}/games/playtime`, {
    gameId,
    playTime
  })
}

// 更新用户资料
export const updateUserProfile = (userId: string, profileData: Partial<{
  name: string
  avatar: string
}>) => {
  return api.put<ApiResponse<{ success: boolean }>>(`/api/v1/user/${userId}/profile`, profileData)
}