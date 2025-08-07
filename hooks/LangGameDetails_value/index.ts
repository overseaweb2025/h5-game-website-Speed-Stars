'use client'
import { useState, useEffect, useCallback } from 'react'
import { GameDetails, LangGameData } from '@/app/api/types/Get/game'
import { Locale } from '@/lib/lang/dictionaraies'
import { getGameDetails } from '@/app/api/game'
import { shouldForceRefresh } from '@/lib/cache-utils'

const STORAGE_KEY = 'language-GameDetails-value'
const TIMESTAMP_KEY = 'language-GameDetails-timestamp'

// 缓存过期时间（5分钟）
const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5分钟

// 🛠️ 检查缓存是否过期
function isCacheExpired(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const timestamp = window.localStorage.getItem(TIMESTAMP_KEY)
    if (!timestamp) return true
    const lastUpdated = parseInt(timestamp, 10)
    return Date.now() - lastUpdated > CACHE_EXPIRY_TIME
  } catch (error) {
    console.error('[useLangGameDetails] Failed to check cache expiry:', error)
    return true
  }
}

// 1. 全局状态存储
let globalGameDetailsState: LangGameData | null = null

// 2. 监听器存储
const gameDetailsListeners = new Set<() => void>()

// 3. 更新全局状态并通知所有监听器
// 采用函数式更新，避免闭包问题
const updateGlobalState = (updater: (currentState: LangGameData | null) => LangGameData) => {
  const newState = updater(globalGameDetailsState)
  globalGameDetailsState = newState
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalGameDetailsState))
      // 更新时间戳
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error("Failed to save state to localStorage:", error)
    }
  }
  
  gameDetailsListeners.forEach(listener => listener())
}

/**
 * 4. 强制清空所有数据
 */
const clearAllData = () => {
  globalGameDetailsState = null
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TIMESTAMP_KEY)
    } catch (error) {
      console.error("Failed to remove data from localStorage:", error)
    }
  }
  gameDetailsListeners.forEach(listener => listener())
}

/**
 * 5. 清空指定游戏的缓存数据 - 根据name字段删除
 */
const clearGameCache = (lang: Locale, gameSlug: string) => {
  updateGlobalState((currentState) => {
    // 如果没有数据，初始化默认结构
    const safeState = currentState || {
      en: [], zh: [], ru: [], es: [], vi: [],
      hi: [], fr: [], tl: [], ja: [], ko: []
    } as LangGameData
    
    const key = lang as keyof LangGameData
    const langData = safeState[key]
    
    if (!langData) return safeState
    
    // 过滤掉指定游戏的数据 - 使用name字段匹配
    const filteredData = langData.filter((item: GameDetails) => item.name !== gameSlug)
    
    console.log(`[LangGameDetails] Cleared cache for game: ${gameSlug} in language: ${lang}`)
    
    return {
      ...safeState,
      [key]: filteredData
    }
  })
}

/**
 * 6. 删除指定语言的指定游戏数据 - 专门用于发布评论时清缓存
 */
const deleteSpecificGameData = (lang: Locale, gameSlug: string) => {
  updateGlobalState((currentState) => {
    const safeState = currentState || {
      en: [], zh: [], ru: [], es: [], vi: [],
      hi: [], fr: [], tl: [], ja: [], ko: []
    } as LangGameData
    
    const key = lang as keyof LangGameData
    const langData = safeState[key]
    
    if (!langData || langData.length === 0) {
      console.log(`[LangGameDetails] No data found for ${lang}, nothing to delete`)
      return safeState
    }
    
    // 查找要删除的游戏
    const gameToDelete = langData.find((item: GameDetails) => item.name === gameSlug)
    if (!gameToDelete) {
      console.log(`[LangGameDetails] Game ${gameSlug} not found in ${lang} cache`)
      return safeState
    }
    
    // 过滤掉指定游戏
    const filteredData = langData.filter((item: GameDetails) => item.name !== gameSlug)
    
    console.log(`[LangGameDetails] Successfully deleted game cache: ${gameSlug} from ${lang} (was: ${gameToDelete.display_name})`)
    
    return {
      ...safeState,
      [key]: filteredData
    }
  })
}

// 7. 自定义 Hook
export const useLangGameDetails = () => {
  const [langGameDataState, setLangGameDataState] = useState<LangGameData | null>(() => {
    if (typeof window === 'undefined') return globalGameDetailsState
    
    // 检查缓存是否过期
    if (isCacheExpired()) {
      console.log('[useLangGameDetails] Cache expired, clearing data')
      try {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(TIMESTAMP_KEY)
      } catch (error) {
        console.error('[useLangGameDetails] Failed to clear expired cache:', error)
      }
      return globalGameDetailsState
    }
    
    try {
      const storedState = localStorage.getItem(STORAGE_KEY)
      if (storedState) {
        globalGameDetailsState = JSON.parse(storedState)
        return globalGameDetailsState
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error)
    }
    return globalGameDetailsState
  })

  useEffect(() => {
    const listener = () => {
      setLangGameDataState(globalGameDetailsState)
    }
    gameDetailsListeners.add(listener)

    return () => {
      gameDetailsListeners.delete(listener)
    }
  }, [])

  const updateLanguage = useCallback((newState: Partial<LangGameData>) => {
    updateGlobalState((currentState) => {
      const safeState = currentState || {
        en: [], zh: [], ru: [], es: [], vi: [],
        hi: [], fr: [], tl: [], ja: [], ko: []
      } as LangGameData
      
      return {
        ...safeState,
        ...newState
      } as LangGameData
    })
  }, [])
  
  // 修复后的 updataLanguageByLang 函数
  const updataLangGameDetailsByLang = useCallback((newState: GameDetails, lang: Locale) => {
    updateGlobalState((currentState) => {
      // 确保当前状态不为null，否则初始化
      const safeState = currentState || {
        en: [], zh: [], ru: [], es: [], vi: [],
        hi: [], fr: [], tl: [], ja: [], ko: []
      } as LangGameData

      const key = lang as keyof LangGameData
      const updatedLangData = [...safeState[key]] // 创建一个新数组

      // 查找是否有匹配项
      const existingItemIndex = updatedLangData.findIndex(item => item.display_name === newState.display_name)

      if (existingItemIndex > -1) {
        // 如果找到，则更新该项
        updatedLangData[existingItemIndex] = {
          ...updatedLangData[existingItemIndex],
          ...newState
        }
      } else {
        // 如果没有找到，则添加新项
        updatedLangData.push(newState)
      }

      return {
        ...safeState,
        [key]: updatedLangData
      }
    })
  }, [])

  const clearLanguageData = useCallback(() => {
    clearAllData()
  }, [])

  const clearSpecificGameCache = useCallback((lang: Locale, gameSlug: string) => {
    clearGameCache(lang, gameSlug)
  }, [])

  // 专门用于发布评论时删除游戏缓存的方法
  const deleteGameFromCache = useCallback((lang: Locale, gameSlug: string) => {
    deleteSpecificGameData(lang, gameSlug)
  }, [])

  const getGameDetailsFromCache = useCallback((lang: Locale, name: string) => {
    if (!langGameDataState) return null;

    const gameDetailsForLang = langGameDataState[lang as keyof typeof langGameDataState];

    if (!gameDetailsForLang) {
      return null;
    }

    return gameDetailsForLang.find((item: GameDetails) => item.name === name);
  }, [langGameDataState])
  
  const autoGetData = useCallback((lang: Locale, slug: string, force: boolean = true) => {
    // 检查缓存是否过期
    const cacheExpired = isCacheExpired()
    
    // 检查是否需要强制刷新
    const needsForceRefresh = shouldForceRefresh(slug, lang)
    
    // 当force为true且缓存未过期且不需要强制刷新时，检查缓存中是否已存在该游戏详情
    if (force && !cacheExpired && !needsForceRefresh) {
      const existingData = getGameDetailsFromCache(lang, slug)
      if (existingData) {
        console.log(`[useLangGameDetails] Data for ${lang}/${slug} already exists and cache is valid, skipping fetch`)
        return Promise.resolve()
      }
    }

    // 确定获取数据的原因
    let fetchReason = ''
    if (cacheExpired) {
      fetchReason = 'cache expired'
    } else if (needsForceRefresh) {
      fetchReason = 'force refresh requested'
    } else if (!force) {
      fetchReason = 'forced fetch'
    } else {
      fetchReason = 'data not found in cache'
    }
    
    console.log(`[useLangGameDetails] Fetching fresh data for ${lang}/${slug} - ${fetchReason}`)
    
    return getGameDetails(slug, lang).then(res => {
      if (res?.data?.data) {
        // 确保res.data.data是一个完整的GameDetails对象，而不是Partial
        updataLangGameDetailsByLang(res.data.data, lang)
      }
    }).catch(error => {
      console.error(`[useLangGameDetails] Failed to fetch game details for ${lang}/${slug}:`, error)
    })
  }, [updataLangGameDetailsByLang, getGameDetailsFromCache]) 
  // 返回由 useState 管理的本地状态变量
  return { 
    LangGameDetails: langGameDataState, 
    updateLanguage, 
    updataLangGameDetailsByLang, 
    clearLanguageData, 
    clearSpecificGameCache,
    deleteGameFromCache, // 新增：专门用于发布评论时删除游戏缓存
    autoGetData,
    getGameDetailsFromCache
  }
}