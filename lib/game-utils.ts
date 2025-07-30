import { 
  GameDetailsData, 
  GameRating, 
  Breadcrumb, 
  ExtendedGameDetails, 
  HeroGameData,
  GameDetailsParser 
} from "@/app/api/types/Get/game"

// 解析评分字符串，如 "4.5(2votes)" -> { score: 4.5, votes: 2, displayText: "4.5(2votes)" }
export const parseRating = (ratingString: string): GameRating | null => {
  if (!ratingString) return null
  
  const match = ratingString.match(/^([\d.]+)\s*\((\d+)\s*votes?\)$/i)
  if (!match) return null
  
  const score = parseFloat(match[1])
  const votes = parseInt(match[2], 10)
  
  if (isNaN(score) || isNaN(votes)) return null
  
  return {
    score,
    votes,
    displayText: ratingString
  }
}

// 格式化日期字符串
export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// 从面包屑中提取分类信息
export const extractCategoryInfo = (breadcrumbs: Breadcrumb[]): { name: string; path: string } | null => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null
  
  // 查找level为2的项目（通常是分类）
  const categoryBreadcrumb = breadcrumbs.find(crumb => crumb.level === 2)
  if (categoryBreadcrumb) {
    return {
      name: categoryBreadcrumb.name,
      path: categoryBreadcrumb.path
    }
  }
  
  // 如果没有level 2，尝试取第二个项目
  if (breadcrumbs.length >= 2) {
    return {
      name: breadcrumbs[1].name,
      path: breadcrumbs[1].path
    }
  }
  
  return null
}

// 从面包屑中提取游戏slug
export const extractGameSlug = (breadcrumbs: Breadcrumb[]): string | null => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null
  
  // 通常最后一个面包屑是游戏页面
  const gameBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
  if (gameBreadcrumb && gameBreadcrumb.path) {
    // 从路径中提取slug，如 "/game/sniper-challenge-game" -> "sniper-challenge-game"
    const match = gameBreadcrumb.path.match(/\/game\/(.+)$/)
    return match ? match[1] : null
  }
  
  return null
}

// 将display_name转换为不带空格的技术名称格式
export const displayNameToTechnicalName = (displayName: string): string => {
  if (!displayName) return ''
  
  return displayName
    .toLowerCase()                    // 转换为小写
    .replace(/\s+/g, '-')            // 空格替换为连字符
    .replace(/[^\w\-]/g, '')         // 移除特殊字符，保留字母、数字和连字符
    .replace(/\-+/g, '-')            // 多个连字符合并为一个
    .replace(/^\-|\-$/g, '')         // 移除开头和结尾的连字符
}

// 转换为Hero组件所需的格式
export const toHeroGameData = (details: GameDetailsData, slug: string): HeroGameData => {
  const categoryInfo = extractCategoryInfo(details.breadcrumbs)
  return {
    id: slug,
    title: details.display_name,
    description: details.info,
    image: '', // 保证 image 字段为 string，避免 undefined
    category: categoryInfo?.name || '',
    iframeSrc: details.package?.url || '',
    features: [],
    howToPlay: []
  }
}

// 转换为扩展的游戏详情
export const toExtendedDetails = (details: GameDetailsData): ExtendedGameDetails => {
  const parsedRating = parseRating(details.rating)
  const categoryInfo = extractCategoryInfo(details.breadcrumbs)
  const gameSlug = extractGameSlug(details.breadcrumbs)
  
  return {
    ...details,
    parsedRating: parsedRating || undefined,
    formattedReleaseDate: formatDate(details.released_at),
    formattedUpdateDate: formatDate(details.last_updated),
    categoryInfo: categoryInfo || undefined,
    gameSlug: gameSlug || undefined
  }
}

// 创建解析器对象
export const gameDetailsParser: GameDetailsParser = {
  parseRating,
  formatDate,
  extractCategoryInfo,
  extractGameSlug,
  toHeroGameData,
  toExtendedDetails,
  displayNameToTechnicalName
}

// 辅助函数：检查评分是否有效
export const hasValidRating = (details: GameDetailsData): boolean => {
  return parseRating(details.rating) !== null
}

// 辅助函数：获取评分显示文本
export const getRatingDisplay = (details: GameDetailsData): string => {
  const parsed = parseRating(details.rating)
  if (!parsed) return 'No rating'
  
  if (parsed.votes === 0) return 'No votes yet'
  if (parsed.votes === 1) return `${parsed.score}/5 (${parsed.votes} vote)`
  return `${parsed.score}/5 (${parsed.votes} votes)`
}

// 辅助函数：获取星级评分（用于UI显示）
export const getStarRating = (details: GameDetailsData): number => {
  const parsed = parseRating(details.rating)
  return parsed ? Math.round(parsed.score) : 0
}

// 辅助函数：判断游戏是否为新游戏（发布7天内）
export const isNewGame = (details: GameDetailsData): boolean => {
  if (!details.released_at) return false
  
  try {
    const releaseDate = new Date(details.released_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - releaseDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  } catch {
    return false
  }
}

// 辅助函数：判断游戏是否最近更新（更新3天内）
export const isRecentlyUpdated = (details: GameDetailsData): boolean => {
  if (!details.last_updated) return false
  
  try {
    const updateDate = new Date(details.last_updated)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - updateDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  } catch {
    return false
  }
}