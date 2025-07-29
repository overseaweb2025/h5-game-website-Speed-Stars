import { GamePlayRecord } from '@/hooks/useGamePlayTracker'

const STORAGE_KEY = 'game_play_history'

// 获取用户的游戏历史记录
export const getUserGameHistory = (userId?: string): GamePlayRecord[] => {
  if (!userId) return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const allRecords: GamePlayRecord[] = JSON.parse(stored)
    // 过滤出属于指定用户的记录
    return allRecords.filter(record => record.userId === userId)
  } catch (error) {
    console.error('Error reading game history:', error)
    return []
  }
}

// 获取用户游戏统计信息
export const getUserGameStats = (userId?: string) => {
  if (!userId) return {
    totalGamesPlayed: 0,
    totalPlayTime: 0,
    uniqueGames: 0,
    averagePlayTime: 0,
    lastPlayedDate: null
  }

  const history = getUserGameHistory(userId)
  
  if (history.length === 0) {
    return {
      totalGamesPlayed: 0,
      totalPlayTime: 0,
      uniqueGames: 0,
      averagePlayTime: 0,
      lastPlayedDate: null
    }
  }

  const uniqueGameIds = new Set(history.map(record => record.gameId))
  const totalPlayTime = history.reduce((sum, record) => sum + record.playDuration, 0)
  const lastPlayedDate = history.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]?.createdAt

  return {
    totalGamesPlayed: history.length,
    totalPlayTime: Math.round(totalPlayTime / 60), // 转换为分钟
    uniqueGames: uniqueGameIds.size,
    averagePlayTime: Math.round(totalPlayTime / history.length),
    lastPlayedDate
  }
}

// 格式化游戏历史记录用于显示
export const formatGameHistoryForDisplay = (history: GamePlayRecord[]) => {
  return history
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(record => ({
      id: record.id,
      gameId: record.gameId,
      gameDisplayName: record.gameDisplayName,
      playDuration: record.playDuration,
      playStartTime: record.playStartTime,
      createdAt: record.createdAt,
      formattedDuration: formatDuration(record.playDuration),
      formattedDate: formatDateTime(record.createdAt)
    }))
}

// 格式化持续时间
const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

// 格式化日期时间
const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}