// SEO相关的工具函数

/**
 * 获取canonical域名
 */
export const getCanonicalDomain = (): string => {
  return process.env.CANONICAL_DOMAIN || 'https://speed-stars.net'
}

/**
 * 生成canonical URL
 * @param path 路径，以/开头，如：/games/c/action
 */
export const getCanonicalUrl = (path: string): string => {
  const domain = getCanonicalDomain()
  // 确保path以/开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${domain}${normalizedPath}`
}

/**
 * 生成类别页面的canonical URL
 * @param category 类别名称，如：action
 */
export const getCategoryCanonicalUrl = (category: string): string => {
  return getCanonicalUrl(`/games/c/${encodeURIComponent(category)}`)
}

/**
 * 生成游戏页面的canonical URL
 * @param gameSlug 游戏slug，如：super-slime
 */
export const getGameCanonicalUrl = (gameSlug: string): string => {
  return getCanonicalUrl(`/game/${encodeURIComponent(gameSlug)}`)
}

/**
 * 生成主页的canonical URL
 */
export const getHomeCanonicalUrl = (): string => {
  return getCanonicalUrl('/')
}

/**
 * 生成games列表页的canonical URL
 */
export const getGamesCanonicalUrl = (): string => {
  return getCanonicalUrl('/games')
}