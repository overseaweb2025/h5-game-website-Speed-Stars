// 用户基本信息
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string | null
  joinDate: string
  level: number
  experience: number
  achievements: number
}

// 游戏历史记录
export interface GameHistory {
  id: number
  gameId: number
  gameName: string
  gameDisplayName: string
  lastPlayed: string
  playTime: number // 分钟
  sessionsCount: number
  highScore?: number
  gameImage: string
}

// 收藏的游戏
export interface FavoriteGame {
  id: number
  gameId: number
  gameName: string
  gameDisplayName: string
  addedDate: string
  gameImage: string
}

// 评论历史
export interface CommentHistory {
  id: number
  gameId: number
  gameName: string
  gameDisplayName: string
  comment: string
  rating: number
  createdAt: string
  updatedAt: string
  likes: number
}

// 用户统计信息
export interface UserStats {
  totalGamesPlayed: number
  totalPlayTime: number // 分钟
  favoriteGamesCount: number
  commentsCount: number
  averageRating: number
  achievementsCount: number
  currentLevel: number
  nextLevelExperience: number
  currentExperience: number
}

// 用户成就
export interface UserAchievement {
  id: number
  title: string
  description: string
  icon: string
  unlockedAt: string
  category: 'gaming' | 'social' | 'milestone' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// 用户完整资料响应
export interface UserProfileResponse {
  profile: UserProfile
  stats: UserStats
  recentGames: GameHistory[]
  favoriteGames: FavoriteGame[]
  recentComments: CommentHistory[]
  achievements: UserAchievement[]
}