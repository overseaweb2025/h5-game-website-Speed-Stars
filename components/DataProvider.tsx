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
    // 防止重复执行的标记
    if (typeof window !== 'undefined' && window.__DATA_PROVIDER_LOADED) {
      return
    }
    
    // 只执行一次数据获取
    const fetchCriticalData = async () => {
      const maxRetries = 3
      const retryDelay = 1000 // 1秒

      // 带重试的API请求函数
      const fetchWithRetry = async (fetchFn: () => Promise<any>, name: string, retryCount = 0): Promise<any> => {
        try {
          const result = await fetchFn()
          console.log(`[DataProvider] Successfully fetched ${name}`)
          return result
        } catch (error: any) {
          const errorStatus = error?.response?.status
          console.error(`[DataProvider] Error fetching ${name} (attempt ${retryCount + 1}):`, {
            status: errorStatus,
            message: error?.message,
            url: error?.config?.url
          })
          
          // 检查是否为可重试的错误
          const isRetryable = errorStatus === 500 || errorStatus === 502 || errorStatus === 503 || 
                             errorStatus === 504 || errorStatus === 429 || !errorStatus
          
          if (isRetryable && retryCount < maxRetries) {
            // 指数退避重试策略
            const delay = retryDelay * Math.pow(2, retryCount)
            console.log(`[DataProvider] Retrying ${name} in ${delay}ms... (${retryCount + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, delay))
            return fetchWithRetry(fetchFn, name, retryCount + 1)
          }
          
          // 最终失败时记录错误但不中断其他请求
          console.warn(`[DataProvider] Final failure for ${name} after ${retryCount + 1} attempts:`, error?.message)
          safeErrorLog(error, `DataProvider-${name}`)
          return null
        }
      }

      try {
        // 使用 Promise.allSettled 避免一个失败影响其他请求
        const results = await Promise.allSettled([
          // 1. 检查并获取游戏列表数据
          (async () => {
            try {
              const existingGameData = getLangGamelistBylang(lang)
              if (!existingGameData || existingGameData.length === 0) {
                console.log(`[DataProvider] Fetching game list data for ${lang}`)
                const result = await fetchWithRetry(
                  () => getGameListData(lang, true),
                  'GameListData'
                )
                return result
              } else {
                console.log(`[DataProvider] Game list data for ${lang} already exists, skipping fetch`)
                return Promise.resolve({ cached: true })
              }
            } catch (error) {
              console.error(`[DataProvider] Game list data fetch wrapper error:`, error)
              return null
            }
          })(),

          // 2. 检查并获取导航数据
          (async () => {
            try {
              if (!navState || !navState.top_navigation || navState.top_navigation.length === 0) {
                console.log(`[DataProvider] Fetching navigation data`)
                const navResponse = await fetchWithRetry(
                  () => getNavLanguage(),
                  'NavigationData'
                )
                if (navResponse?.data?.data) {
                  updateLanguage(navResponse.data.data)
                  console.log(`[DataProvider] Navigation data updated successfully`)
                }
                return navResponse
              } else {
                console.log(`[DataProvider] Navigation data already exists, skipping fetch`)
                return Promise.resolve({ cached: true })
              }
            } catch (error) {
              console.error(`[DataProvider] Navigation data fetch wrapper error:`, error)
              return null
            }
          })(),

          // 3. 检查并获取首页数据
          (async () => {
            try {
              const existingHomeData = getHomeInfoByLang(lang)
              if (!existingHomeData) {
                console.log(`[DataProvider] Fetching home data for ${lang}`)
                const result = await fetchWithRetry(
                  () => autoGetHomeData(true, lang),
                  'HomeData'
                )
                return result
              } else {
                console.log(`[DataProvider] Home data for ${lang} already exists, skipping fetch`)
                return Promise.resolve({ cached: true })
              }
            } catch (error) {
              console.error(`[DataProvider] Home data fetch wrapper error:`, error)
              return null
            }
          })()
        ])

        // 检查结果并记录
        const gameListResult = results[0]
        const navResult = results[1] 
        const homeResult = results[2]

        const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length
        const failureCount = results.filter(result => result.status === 'rejected').length
        const cachedCount = results.filter(result => 
          result.status === 'fulfilled' && result.value?.cached === true
        ).length

        console.log(`[DataProvider] Data fetch results for ${lang}:`, {
          successful: successCount,
          failed: failureCount, 
          cached: cachedCount,
          gameList: gameListResult.status,
          navigation: navResult.status,
          home: homeResult.status
        })

        // 记录详细的失败信息
        results.forEach((result, index) => {
          const names = ['GameList', 'Navigation', 'Home']
          if (result.status === 'rejected') {
            console.error(`[DataProvider] ${names[index]} request failed:`, result.reason)
          }
        })

        // 如果所有请求都失败（不包括缓存命中），显示降级提示
        const allNewRequestsFailed = results.every(result => 
          result.status === 'rejected' || result.value?.cached === true
        )
        
        if (allNewRequestsFailed && failureCount > 0) {
          console.warn('[DataProvider] All new API requests failed, using cached/default data')
          // 可以在这里触发降级逻辑或用户提示
          if (typeof window !== 'undefined') {
            // 可选：显示离线模式提示
            console.log('[DataProvider] App running in offline/cached mode')
          }
        } else if (successCount > 0) {
          console.log(`[DataProvider] Successfully fetched ${successCount} data sources`)
        }

      } catch (error) {
        // 这里捕获的是Promise.allSettled之外的错误（应该很少发生）
        const shouldShowToUser = safeErrorLog(error, 'DataProvider-Critical')
        
        if (shouldShowToUser) {
          console.error('[DataProvider] Critical error in data fetching:', error)
        }
      }
    }

    // 标记已开始执行
    if (typeof window !== 'undefined') {
      window.__DATA_PROVIDER_LOADED = true
    }
    
    fetchCriticalData()
  }, []) // 添加lang依赖，但用全局标记防止重复执行

  // 这个组件不渲染任何内容，只负责数据获取
  return null
}