"use client"

import { useEffect } from 'react'
import { Locale } from '@/lib/lang/dictionaraies'
import { useLangGameList } from '@/hooks/LangGamelist_value'
import { useNavgationLanguage } from '@/hooks/Navigation_value/use-navigation-language'
import { useHomeLanguage } from '@/hooks/LangHome_value'
import { getNavLanguage } from '@/app/api/nav_language'
import { safeErrorLog } from '@/lib/error-filter'

interface DataProviderProps {
  lang: Locale
}

/**
 * 数据提供者组件 - 统一管理全局数据获取
 * 只在 Header 组件中使用，确保每个页面只执行一次数据获取
 * 会检查数据是否已存在，避免重复请求
 * 
 * 管理的数据：
 * - 游戏列表数据 (LangGameList)
 * - 导航数据 (Navigation)  
 * - 首页数据 (HomeData)
 */
export default function DataProvider({ lang }: DataProviderProps) {
  const { autoGetData: getGameListData, getLangGamelistBylang } = useLangGameList()
  const { navState, updateLanguage } = useNavgationLanguage()
  const { autoGetHomeData, getHomeInfoByLang } = useHomeLanguage()

  useEffect(() => {
    // 只执行一次数据获取
    const fetchCriticalData = async () => {
      const maxRetries = 3
      const retryDelay = 1000 // 1秒

      // 带重试的API请求函数
      const fetchWithRetry = async (fetchFn: () => Promise<any>, name: string, retryCount = 0): Promise<any> => {
        try {
          return await fetchFn()
        } catch (error: any) {
          console.error(`[DataProvider] Error fetching ${name} (attempt ${retryCount + 1}):`, error)
          
          // 如果是500错误且还有重试次数，则重试
          if (error?.response?.status === 500 && retryCount < maxRetries) {
            console.log(`[DataProvider] Retrying ${name} in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, retryDelay))
            return fetchWithRetry(fetchFn, name, retryCount + 1)
          }
          
          // 最终失败时记录错误但不中断其他请求
          safeErrorLog(error, `DataProvider-${name}`)
          return null
        }
      }

      try {
        // 使用 Promise.allSettled 避免一个失败影响其他请求
        const results = await Promise.allSettled([
          // 1. 检查并获取游戏列表数据
          (async () => {
            const existingGameData = getLangGamelistBylang(lang)
            if (!existingGameData || existingGameData.length === 0) {
              console.log(`[DataProvider] Fetching game list data for ${lang}`)
              return fetchWithRetry(
                () => getGameListData(lang, true),
                'GameListData'
              )
            } else {
              console.log(`[DataProvider] Game list data for ${lang} already exists, skipping fetch`)
              return Promise.resolve(null)
            }
          })(),

          // 2. 检查并获取导航数据
          (async () => {
            if (!navState || !navState.top_navigation || navState.top_navigation.length === 0) {
              console.log(`[DataProvider] Fetching navigation data`)
              const navResponse = await fetchWithRetry(
                () => getNavLanguage(),
                'NavigationData'
              )
              if (navResponse?.data?.data) {
                updateLanguage(navResponse.data.data)
              }
              return navResponse
            } else {
              console.log(`[DataProvider] Navigation data already exists, skipping fetch`)
              return Promise.resolve(null)
            }
          })(),

          // 3. 检查并获取首页数据
          (async () => {
            const existingHomeData = getHomeInfoByLang(lang)
            if (!existingHomeData) {
              console.log(`[DataProvider] Fetching home data for ${lang}`)
              return fetchWithRetry(
                () => autoGetHomeData(true, lang),
                'HomeData'
              )
            } else {
              console.log(`[DataProvider] Home data for ${lang} already exists, skipping fetch`)
              return Promise.resolve(null)
            }
          })()
        ])

        // 检查结果并记录
        const gameListResult = results[0]
        const navResult = results[1] 
        const homeResult = results[2]

        console.log(`[DataProvider] Data fetch results for ${lang}:`, {
          gameList: gameListResult.status,
          navigation: navResult.status,
          home: homeResult.status
        })

        // 如果所有请求都失败，显示降级提示
        const allFailed = results.every(result => result.status === 'rejected')
        if (allFailed) {
          console.warn('[DataProvider] All API requests failed, using cached/default data')
          // 可以在这里触发降级逻辑或用户提示
        }

      } catch (error) {
        // 这里捕获的是Promise.allSettled之外的错误（应该很少发生）
        const shouldShowToUser = safeErrorLog(error, 'DataProvider-Critical')
        
        if (shouldShowToUser) {
          console.error('[DataProvider] Critical error in data fetching:', error)
        }
      }
    }

    fetchCriticalData()
  }, []) // 空依赖数组，确保只执行一次

  // 这个组件不渲染任何内容，只负责数据获取
  return null
}