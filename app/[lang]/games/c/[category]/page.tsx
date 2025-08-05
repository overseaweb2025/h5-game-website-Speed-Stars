import { Metadata } from "next"
import { CategorySEO } from '@/app/api/types/Get/game'
import { getCategoryCanonicalUrl } from '@/lib/seo-utils'
import { getDictionary } from "@/lib/lang/i18n"

type CategoryPageProps = {
  params: {
    category: string
    lang: Locale
  }
}


// 从API响应中提取SEO信息
const extractSEOFromResponse = (response: any): CategorySEO | null => {
  try {
    if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const firstGame = response.data.data[0]
      if (firstGame.category) {
        return {
          page_title: firstGame.category.page_title || '',
          page_description: firstGame.category.page_description || '',
          page_keywords: firstGame.category.page_keywords || ''
        }
      }
    }
  } catch (error) {
    // Silent error handling
  }
  return null
}

// 创建默认SEO信息 - 立即可用，包含分类名称
const createDefaultSEO = (category: string, lang: Locale = 'en'): CategorySEO => {
  const decodedCategory = decodeURIComponent(category)
  
  // 根据语言生成不同的默认文案
  const translations = {
    en: {
      title: `${decodedCategory} Games - Free Online ${decodedCategory} Games Collection`,
      description: `Discover the best free ${decodedCategory.toLowerCase()} games online! Play ${decodedCategory.toLowerCase()} games instantly in your browser - no downloads required. Enjoy hours of ${decodedCategory.toLowerCase()} gaming fun with our handpicked collection of HTML5 games.`,
      keywords: `${decodedCategory}, ${decodedCategory.toLowerCase()} games, free ${decodedCategory.toLowerCase()} games, online ${decodedCategory.toLowerCase()} games, HTML5 ${decodedCategory.toLowerCase()} games, browser games, free online games`
    },
    zh: {
      title: `${decodedCategory}游戏 - 免费在线${decodedCategory}游戏合集`,
      description: `发现最好的免费${decodedCategory}游戏！在浏览器中即时玩${decodedCategory}游戏 - 无需下载。享受我们精心挑选的HTML5游戏合集，畅玩数小时${decodedCategory}游戏乐趣。`,
      keywords: `${decodedCategory}, ${decodedCategory}游戏, 免费${decodedCategory}游戏, 在线${decodedCategory}游戏, HTML5游戏, 浏览器游戏, 免费在线游戏`
    }
  }
  
  const t = translations[lang as keyof typeof translations] || translations.en
  
  return {
    page_title: t.title,
    page_description: t.description,
    page_keywords: t.keywords
  }
}

// 服务端获取SEO数据的函数
async function fetchCategorySEOServerSide(category: string): Promise<CategorySEO | null> {
  try {
    // 在服务端环境中，直接调用外部API而不通过代理
    const url = `https://www.xingnengyun.com/api/v1/game/list?category=${encodeURIComponent(category)}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // 服务端请求不需要CORS
      cache: 'no-store', // 确保每次都获取最新数据
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return extractSEOFromResponse({ data })
  } catch (error) {
    // Silent error handling
    return null
  }
}

// 生成动态元数据
export async function generateMetadata(
 { params: { category, lang } }: CategoryPageProps
): Promise<Metadata> {
  let seoData: CategorySEO
  
  try {
    // 在服务端尝试获取SEO数据
    const extractedSEO = await fetchCategorySEOServerSide(category)
    
    if (extractedSEO && (extractedSEO.page_title || extractedSEO.page_description || extractedSEO.page_keywords)) {
      seoData = extractedSEO
    } else {
      // 如果API没有返回有效SEO数据，使用默认数据
      seoData = createDefaultSEO(category, lang)
    }
  } catch (error) {
    // API失败时使用默认数据
    seoData = createDefaultSEO(category, lang)
  }

  const title = seoData.page_title || `${decodeURIComponent(category)} Games - Free Online Games`
  const description = seoData.page_description || `Play free ${decodeURIComponent(category).toLowerCase()} games online. Enjoy our collection of ${decodeURIComponent(category).toLowerCase()} games with no downloads required.`
  const keywords = seoData.page_keywords || `${decodeURIComponent(category)}, games, online games, free games, browser games`
  const canonicalUrl = getCategoryCanonicalUrl(category)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  }
}

import CategoryPageClient from './CategoryPageClient'
import { Locale } from "@/lib/lang/dictionaraies"

const CategoryPage = async ({ params: { category, lang } }: CategoryPageProps) => {
  const t = await getDictionary(lang as Locale);
  return <CategoryPageClient category={category} t={t} />
}




export default CategoryPage
