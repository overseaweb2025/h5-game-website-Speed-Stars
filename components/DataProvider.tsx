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
      try {
        // 1. 检查并获取游戏列表数据
        const existingGameData = getLangGamelistBylang(lang)
        if (!existingGameData || existingGameData.length === 0) {
          console.log(`[DataProvider] Fetching game list data for ${lang}`)
          await getGameListData(lang, true) // force = true 表示检查缓存
        } else {
          console.log(`[DataProvider] Game list data for ${lang} already exists, skipping fetch`)
        }

        // 2. 检查并获取导航数据
        if (!navState || !navState.top_navigation || navState.top_navigation.length === 0) {
          console.log(`[DataProvider] Fetching navigation data`)
          const navResponse = await getNavLanguage()
          if (navResponse.data?.data) {
            updateLanguage(navResponse.data.data)
          }
        } else {
          console.log(`[DataProvider] Navigation data already exists, skipping fetch`)
        }

        // 3. 检查并获取首页数据
        const existingHomeData = getHomeInfoByLang(lang)
        if (!existingHomeData) {
          console.log(`[DataProvider] Fetching home data for ${lang}`)
          await autoGetHomeData(true, lang) // force = true 表示检查缓存
        } else {
          console.log(`[DataProvider] Home data for ${lang} already exists, skipping fetch`)
        }

      } catch (error) {
        // 使用统一的错误过滤工具
        const shouldShowToUser = safeErrorLog(error, 'DataProvider')
        
        if (shouldShowToUser) {
          // 只有后端API错误和网络错误才会到这里
          // 可以在这里添加用户友好的错误提示
          // 例如: toast.error('网络连接失败，请稍后重试')
          
          console.log('[DataProvider] This error should be shown to user via toast')
        }
        // Unity 错误和其他被过滤的错误不会显示给用户
      }
    }

    fetchCriticalData()
  }, []) // 空依赖数组，确保只执行一次

  // 这个组件不渲染任何内容，只负责数据获取
  return null
}