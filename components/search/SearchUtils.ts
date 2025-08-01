import { Game as APIGame } from "@/app/api/types/Get/game"

export interface SearchResult {
  id: string
  name: string
  display_name: string
  category?: string
  cover?: string
  slug: string
}

export class SearchEngine {
  // 简单的搜索函数
  static search(
    query: string, 
    games: APIGame[], 
    options: {
      maxResults?: number
      minScore?: number
      includeDescription?: boolean
      includeCategory?: boolean
    } = {}
  ): SearchResult[] {
    if (!query.trim() || !games.length) return []

    const { maxResults = 50 } = options
    const searchTerm = query.toLowerCase()

    const results = games
      .filter(game => 
        game.display_name.toLowerCase().includes(searchTerm) ||
        (game.category && game.category.toLowerCase().includes(searchTerm))
      )
      .map(game => ({
        id: game.name,
        name: game.name,
        display_name: game.display_name,
        category: game.category,
        cover: game.cover,
        slug: game.name
      }))
      .slice(0, maxResults)

    return results
  }

  // 获取热门搜索词
  static getPopularSearches(games: APIGame[], limit: number = 8): string[] {
    if (!games.length) return []

    // 提取所有分类
    const categories = games
      .map(game => game.category)
      .filter(Boolean)
      .filter((category, index, arr) => arr.indexOf(category) === index) // 去重

    // 返回前几个分类作为热门搜索
    return categories.slice(0, limit)
  }
}