/**
 * 游戏分类多语言工具函数
 */

// 分类名翻译映射函数
export function getCategoryTranslation(categoryName: string, t: any): string {
  if (!categoryName || !t?.categories) {
    return categoryName || 'Games'
  }

  // 将分类名转换为小写并移除空格和特殊字符以匹配翻译键
  const normalizeKey = (str: string) => 
    str.toLowerCase()
       .replace(/\s+/g, '')
       .replace(/[^a-z0-9]/g, '')

  const key = normalizeKey(categoryName)
  
  // 尝试获取翻译，如果不存在则返回原始分类名
  return t.categories[key] || categoryName
}

// 预定义的分类名标准化映射
export const CATEGORY_KEYS = {
  '2player': '2player',
  'action': 'action',
  'adventure': 'adventure',
  'racing': 'racing', 
  'puzzle': 'puzzle',
  'sports': 'sports',
  'basketball': 'basketball',
  'io': 'io',
  'shooting': 'shooting',
  'platform': 'platform',
  'strategy': 'strategy',
  'driving': 'driving',
  'football': 'football',
  'soccer': 'soccer',
  'multiplayer': 'multiplayer',
  'user': 'user',
  'originals': 'originals',
  'trending': 'trending',
  'updated': 'updated',
  'new': 'new',
  'hot': 'hot',
  'featured': 'featured',
  'games': 'games'
} as const

// 类型定义
export type CategoryKey = keyof typeof CATEGORY_KEYS