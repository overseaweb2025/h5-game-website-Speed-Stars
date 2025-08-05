'use client'
import { useState, useEffect, useCallback } from 'react'
import { GameDetails, LangGameData } from '@/app/api/types/Get/game'
import { Locale } from '@/lib/lang/dictionaraies'
import { getGameDetails } from '@/app/api/gameList'

const STORAGE_KEY = 'language-GameDetails-value'

// 1. 全局状态存储
let globalBlogState: LangGameData | null = null

// 2. 监听器存储
const NavListeners = new Set<() => void>()

// 3. 更新全局状态并通知所有监听器
// 采用函数式更新，避免闭包问题
const updateGlobalState = (updater: (currentState: LangGameData | null) => LangGameData) => {
  const newState = updater(globalBlogState)
  globalBlogState = newState
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalBlogState))
  } catch (error) {
    console.error("Failed to save state to localStorage:", error)
  }
  
  NavListeners.forEach(listener => listener())
}

/**
 * 4. 强制清空所有数据
 */
const clearAllData = () => {
  globalBlogState = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to remove data from localStorage:", error)
  }
  NavListeners.forEach(listener => listener())
}

// 5. 自定义 Hook
export const useLangGameDetails = () => {
  const [langGameDataState, setLangGameDataState] = useState<LangGameData | null>(() => {
    try {
      const storedState = localStorage.getItem(STORAGE_KEY)
      if (storedState) {
        globalBlogState = JSON.parse(storedState)
        return globalBlogState
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error)
    }
    return globalBlogState
  })

  useEffect(() => {
    const listener = () => {
      setLangGameDataState(globalBlogState)
    }
    NavListeners.add(listener)

    return () => {
      NavListeners.delete(listener)
    }
  }, [])

  const updateLanguage = useCallback((newState: Partial<LangGameData>) => {
    updateGlobalState((currentState) => ({
      ...currentState,
      ...newState
    } as LangGameData))
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
  
  const autoGetData = useCallback((lang: Locale, slug: string) => {
    getGameDetails(slug).then(res => {
      // 确保res.data.data是一个完整的GameDetails对象，而不是Partial
      updataLangGameDetailsByLang(res.data.data, lang)
    })
  }, [updataLangGameDetailsByLang])

  // 返回由 useState 管理的本地状态变量
  return { LangGameDetails: langGameDataState, updateLanguage, updataLangGameDetailsByLang, clearLanguageData, autoGetData }
}