import { Metadata } from "next"
import { CategorySEO } from '@/app/api/types/Get/game'
import { getCategoryCanonicalUrl } from '@/lib/seo-utils'

type CategoryPageProps = {
  params: {
    category: string
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
    console.error('Error extracting SEO data:', error)
  }
  return null
}

// 创建默认SEO信息
const createDefaultSEO = (category: string): CategorySEO => {
  const decodedCategory = decodeURIComponent(category)
  return {
    page_title: `${decodedCategory} Games - Free Online Games`,
    page_description: `Play free ${decodedCategory.toLowerCase()} games online. Enjoy our collection of ${decodedCategory.toLowerCase()} games with no downloads required.`,
    page_keywords: `${decodedCategory}, games, online games, free games, browser games, ${decodedCategory.toLowerCase()} games`
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
    console.error('Server-side SEO fetch error:', error)
    return null
  }
}

// 生成动态元数据
export async function generateMetadata(
 { params: { category } }: CategoryPageProps
): Promise<Metadata> {
  let seoData: CategorySEO
  
  try {
    // 在服务端尝试获取SEO数据
    const extractedSEO = await fetchCategorySEOServerSide(category)
    
    if (extractedSEO && (extractedSEO.page_title || extractedSEO.page_description || extractedSEO.page_keywords)) {
      seoData = extractedSEO
    } else {
      // 如果API没有返回有效SEO数据，使用默认数据
      seoData = createDefaultSEO(category)
    }
  } catch (error) {
    console.error('Error fetching category SEO data:', error)
    // API失败时使用默认数据
    seoData = createDefaultSEO(category)
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

const CategoryPage = ({ params: { category } }: CategoryPageProps) => {
  return <CategoryPageClient category={category} />
}




export default CategoryPage
