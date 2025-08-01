"use client"

/**
 * 搜索工具类
 * 提供游戏搜索相关的功能和算法
 */

import { Game as APIGame } from "@/app/api/types/Get/game"

// 搜索结果类型
export interface SearchResult {
  id: string
  name: string
  display_name: string
  slug: string
  category?: string
  description?: string
  image?: string
  cover?: string
  url?: string
  iframe_src?: string
  score: number // 匹配分数
  matchType: 'exact' | 'start' | 'contain' | 'fuzzy' // 匹配类型
}

// 搜索选项
export interface SearchOptions {
  maxResults?: number
  minScore?: number
  includeDescription?: boolean
  includeCategory?: boolean
  caseSensitive?: boolean
}

export class SearchEngine {
  /**
   * 主搜索函数
   */
  static search(
    query: string, 
    games: APIGame[], 
    options: SearchOptions = {}
  ): SearchResult[] {
    const {
      maxResults = 10,
      minScore = 0.3,
      includeDescription = true,
      includeCategory = true,
      caseSensitive = false
    } = options

    if (!query.trim() || games.length === 0) {
      return []
    }

    const searchQuery = caseSensitive ? query : query.toLowerCase()
    const results: SearchResult[] = []

    for (const game of games) {
      const score = this.calculateMatchScore(game, searchQuery, {
        includeDescription,
        includeCategory,
        caseSensitive
      })

      if (score >= minScore) {
        results.push({
          id: game.id,
          name: game.name,
          display_name: game.display_name,
          slug: game.name,
          category: game.category_name,
          description: game.description,
          image: game.image,
          cover: game.cover,
          url: game.url,
          iframe_src: game.iframe_src,
          score,
          matchType: this.getMatchType(game, searchQuery, caseSensitive)
        })
      }
    }

    // 按分数排序，分数高的在前
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, maxResults)
  }

  /**
   * 计算匹配分数
   */
  private static calculateMatchScore(
    game: APIGame, 
    query: string, 
    options: { includeDescription: boolean, includeCategory: boolean, caseSensitive: boolean }
  ): number {
    const { includeDescription, includeCategory, caseSensitive } = options
    
    const name = caseSensitive ? game.display_name : game.display_name.toLowerCase()
    const slug = caseSensitive ? game.name : game.name.toLowerCase()
    const category = caseSensitive ? (game.category_name || '') : (game.category_name || '').toLowerCase()
    const description = caseSensitive ? (game.description || '') : (game.description || '').toLowerCase()

    let maxScore = 0

    // 名称匹配（权重最高）
    const nameScore = this.getStringMatchScore(name, query) * 1.0
    const slugScore = this.getStringMatchScore(slug, query) * 0.9
    maxScore = Math.max(maxScore, nameScore, slugScore)

    // 分类匹配（中等权重）
    if (includeCategory && category) {
      const categoryScore = this.getStringMatchScore(category, query) * 0.7
      maxScore = Math.max(maxScore, categoryScore)
    }

    // 描述匹配（权重较低）
    if (includeDescription && description) {
      const descScore = this.getStringMatchScore(description, query) * 0.5
      maxScore = Math.max(maxScore, descScore)
    }

    return maxScore
  }

  /**
   * 获取字符串匹配分数
   */
  private static getStringMatchScore(text: string, query: string): number {
    if (!text || !query) return 0

    // 完全匹配
    if (text === query) return 1.0

    // 开头匹配
    if (text.startsWith(query)) return 0.9

    // 包含匹配
    if (text.includes(query)) return 0.7

    // 模糊匹配（计算相似度）
    const similarity = this.calculateSimilarity(text, query)
    if (similarity > 0.6) return similarity * 0.6

    return 0
  }

  /**
   * 获取匹配类型
   */
  private static getMatchType(
    game: APIGame, 
    query: string, 
    caseSensitive: boolean
  ): SearchResult['matchType'] {
    const name = caseSensitive ? game.display_name : game.display_name.toLowerCase()
    const slug = caseSensitive ? game.name : game.name.toLowerCase()

    if (name === query || slug === query) return 'exact'
    if (name.startsWith(query) || slug.startsWith(query)) return 'start'
    if (name.includes(query) || slug.includes(query)) return 'contain'
    
    return 'fuzzy'
  }

  /**
   * 计算两个字符串的相似度（Levenshtein距离算法）
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const matrix: number[][] = []
    const len1 = str1.length
    const len2 = str2.length

    if (len1 === 0) return len2 === 0 ? 1 : 0
    if (len2 === 0) return 0

    // 初始化矩阵
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j
    }

    // 填充矩阵
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // 删除
          matrix[i][j - 1] + 1,      // 插入
          matrix[i - 1][j - 1] + cost // 替换
        )
      }
    }

    const distance = matrix[len1][len2]
    const maxLen = Math.max(len1, len2)
    
    return (maxLen - distance) / maxLen
  }

  /**
   * 高亮匹配的文本
   */
  static highlightMatch(text: string, query: string, caseSensitive: boolean = false): string {
    if (!text || !query) return text

    const searchText = caseSensitive ? text : text.toLowerCase()
    const searchQuery = caseSensitive ? query : query.toLowerCase()
    
    const index = searchText.indexOf(searchQuery)
    if (index === -1) return text

    const before = text.substring(0, index)
    const match = text.substring(index, index + query.length)
    const after = text.substring(index + query.length)

    return `${before}<mark class="bg-yellow-300 text-gray-900 px-1 rounded">${match}</mark>${after}`
  }

  /**
   * 获取搜索建议
   */
  static getSuggestions(query: string, games: APIGame[], maxSuggestions: number = 5): string[] {
    if (!query.trim()) return []

    const suggestions = new Set<string>()
    const lowerQuery = query.toLowerCase()

    for (const game of games) {
      const name = game.display_name.toLowerCase()
      const slug = game.name.toLowerCase()
      
      // 添加以查询开头的游戏名称
      if (name.startsWith(lowerQuery)) {
        suggestions.add(game.display_name)
      }
      if (slug.startsWith(lowerQuery)) {
        suggestions.add(game.name)
      }

      if (suggestions.size >= maxSuggestions) break
    }

    return Array.from(suggestions).slice(0, maxSuggestions)
  }

  /**
   * 过滤和分组搜索结果
   */
  static groupResultsByCategory(results: SearchResult[]): Record<string, SearchResult[]> {
    const grouped: Record<string, SearchResult[]> = {}

    for (const result of results) {
      const category = result.category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(result)
    }

    return grouped
  }

  /**
   * 获取热门搜索关键词
   */
  static getPopularSearches(games: APIGame[], count: number = 8): string[] {
    // 简单实现：返回一些分类和热门游戏名称
    const categories = [...new Set(games.map(game => game.category_name).filter(Boolean))]
    const popularGames = games.slice(0, 4).map(game => game.display_name)
    
    return [...categories.slice(0, 4), ...popularGames].slice(0, count)
  }
}

export default SearchEngine