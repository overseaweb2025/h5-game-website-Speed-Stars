"use client"

import { useEffect, useState } from 'react'
import GameListCard from "./gamelist_card/index"
import { useCategorySEO } from '@/hooks/useCategorySEO'
import { CategorySEO } from '@/app/api/types/Get/game'

interface CategoryPageClientProps {
  category: string
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const decodedCategory = decodeURIComponent(category)
  const [seoData, setSeoData] = useState<CategorySEO | null>(null)
  
  // 使用SEO状态管理器
  const {
    data: cachedSEO,
    isLoading: seoLoading,
    error: seoError,
    getCategorySEO,
    isCached
  } = useCategorySEO(category)

  useEffect(() => {
    // 如果有缓存数据，直接使用
    if (cachedSEO) {
      setSeoData(cachedSEO)
    } else if (!seoLoading) {
      // 如果没有缓存数据且不在加载中，获取SEO数据
      getCategorySEO(category).then(data => {
        if (data) {
          setSeoData(data)
        }
      }).catch(err => {
        console.warn('Failed to load category SEO:', err)
        // 设置默认SEO数据
        setSeoData({
          page_title: `${decodedCategory} Games - Free Online Games`,
          page_description: `Play free ${decodedCategory.toLowerCase()} games online. Enjoy our collection of ${decodedCategory.toLowerCase()} games with no downloads required.`,
          page_keywords: `${decodedCategory}, games, online games, free games, browser games, ${decodedCategory.toLowerCase()} games`
        })
      })
    }
  }, [category, cachedSEO, seoLoading, getCategorySEO, decodedCategory])

  // 动态页面描述，优先使用API的SEO数据
  const getPageDescription = () => {
    if (seoData?.page_description) {
      return seoData.page_description
    }
    return `Our free online ${decodedCategory.toLowerCase()} games include classic 2D platform games, cartoony adventures, and a range of strategy and 3D titles.`
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              {decodedCategory}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              {getPageDescription()}
            </p>
            
            {/* 开发环境显示SEO调试信息 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-300">
                <div className="mb-2">
                  <strong>SEO Debug:</strong>
                </div>
                <div>Status: {seoLoading ? 'Loading...' : seoError ? 'Error' : 'Ready'}</div>
                <div>Cached: {isCached ? 'Yes' : 'No'}</div>
                {seoData && (
                  <div className="mt-2">
                    <div>Title: {seoData.page_title || 'Not set'}</div>
                    <div>Description: {seoData.page_description ? seoData.page_description.substring(0, 100) + '...' : 'Not set'}</div>
                    <div>Keywords: {seoData.page_keywords || 'Not set'}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <GameListCard category={category} />
        </div>
      </div>
    </div>
  )
}