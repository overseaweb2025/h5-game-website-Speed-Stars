// hooks/useLangGameList.ts
'use client'
import { useState, useEffect, useCallback } from 'react'
import {CATEGORIES_DATA}from '@/data/games/zh-games'
// 假设这些类型已定义
import { game, gamelist, games, LangGameList } from '@/app/api/types/Get/game'
import { Locale } from '@/lib/lang/dictionaraies'
import { getGameList } from '@/app/api/game'
import { safeErrorLog } from '@/lib/error-filter'

// 存储 key
const STORAGE_KEY = 'language-Gamelist-value'
const TIMESTAMP_KEY = 'language-Gamelist-timestamp'

// 缓存过期时间（5分钟）
const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5分钟

// 默认空状态
const initialLangGameList: LangGameList = {
  en: [], zh: [], ru: [], es: [], vi: [],
  hi: [], fr: [], tl: [], ja: [], ko: []
}

// 🛠️ 检查缓存是否过期
function isCacheExpired(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const timestamp = window.localStorage.getItem(TIMESTAMP_KEY)
    if (!timestamp) return true
    const lastUpdated = parseInt(timestamp, 10)
    return Date.now() - lastUpdated > CACHE_EXPIRY_TIME
  } catch (error) {
    console.error('[useLangGameList] Failed to check cache expiry:', error)
    return true
  }
}

// 🛠️ 安全读取 localStorage（仅客户端）
function getStoredLangGameList(): LangGameList {
  if (typeof window === 'undefined') return initialLangGameList
  
  // 检查缓存是否过期
  if (isCacheExpired()) {
    console.log('[useLangGameList] Cache expired, clearing data')
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(TIMESTAMP_KEY)
    } catch (error) {
      console.error('[useLangGameList] Failed to clear expired cache:', error)
    }
    return initialLangGameList
  }
  
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : initialLangGameList
  } catch (error) {
    console.error('[useLangGameList] Failed to parse localStorage:', error)
    return initialLangGameList
  }
}

// 🛠️ 写入 localStorage
function setStoredLangGameList(data: LangGameList) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // 更新时间戳
    window.localStorage.setItem(TIMESTAMP_KEY, Date.now().toString())
    // 触发 storage 事件（跨标签页同步）
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.error('[useLangGameList] Failed to save to localStorage:', error)
  }
}

// 🧠 监听器集合（用于状态变化通知）
const listeners = new Set<() => void>()

// 🔁 通知所有监听器更新
function notifyListeners() {
  listeners.forEach(listener => listener())
}

// 🔁 更新状态的核心函数（函数式更新）
function updateLangGameList(updater: (prev: LangGameList) => LangGameList) {
  const prev = getStoredLangGameList()
  const next = updater(prev)
  setStoredLangGameList(next)
  notifyListeners()
}

// 🧹 清空所有数据
function clearLangGameList() {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error('[useLangGameList] Failed to remove from localStorage:', error)
    }
  }
  // 更新内存状态并通知
  notifyListeners()
}

// 💠 自定义 Hook
export const useLangGameList = () => {
  // 初始化状态：只在客户端读 localStorage，服务端用默认值
  const [state, setState] = useState<LangGameList>(getStoredLangGameList)

  // ✅ 注册监听器
  useEffect(() => {
    const listener = () => {
      setState(getStoredLangGameList())
    }
    listeners.add(listener)

    // 🔔 监听跨标签页的 storage 事件（可选）
    const handleStorage = () => {
      setState(getStoredLangGameList())
    }

    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // ✅ 更新整个语言映射表
  const updateLanguage = useCallback((newData: Partial<LangGameList>) => {
    updateLangGameList(prev => ({ ...prev, ...newData }))
  }, [])

  // ✅ 更新指定语言的数据
  const updateLangGameListByLang = useCallback((lang: Locale, data: gamelist) => {
    updateLangGameList(prev => {
      const key = lang as keyof LangGameList
      if (key in prev) {
        return { ...prev, [key]: data }
      }
      console.warn(`[useLangGameList] Invalid language code: ${lang}`)
      return prev
    })
  }, [])

  // ✅ 清空所有数据
  const clearLanguageData = useCallback(() => {
    clearLangGameList()
  }, [])

  //返回特定 语言的 数据集合
  const getLangGamelistBylang = useCallback((lang: Locale) => {
    if(lang === 'en')return state.en
    if(lang === 'zh')return state.zh
    if(lang === 'ru')return state.ru
    if(lang === 'es')return state.es
    if(lang === 'vi')return state.vi
    if(lang === 'hi')return state.hi
    if(lang === 'fr')return state.fr
    if(lang === 'tl')return state.tl
    if(lang === 'ja')return state.ja
    if(lang === 'ko')return state.ko
  }, [state])

  // ✅ 自动获取数据（根据语言）
  const autoGetData = useCallback((lang: Locale, force: boolean = true) => {
    // 检查缓存是否过期
    const cacheExpired = isCacheExpired()
    
    // 当force为true且缓存未过期时，检查该语言的数据是否已存在
    if (force && !cacheExpired) {
      const existingData = getLangGamelistBylang(lang)
      if (existingData && existingData.length > 0) {
        console.log(`[useLangGameList] Data for ${lang} already exists and cache is valid, skipping fetch`)
        return Promise.resolve()
      }
    }

    // 如果缓存过期或没有数据，则获取数据
    if (cacheExpired) {
      console.log(`[useLangGameList] Cache expired, fetching fresh data for ${lang}`)
    } else {
      console.log(`[useLangGameList] Fetching data for ${lang}${!force ? ' (forced fetch)' : ''}`)
    }
    
    return getGameList()
      .then(res => {
        if (res.data?.data) {
          updateLangGameListByLang(lang, res.data.data)
        }
      })
      .catch(err => {
        safeErrorLog(err, 'useLangGameList')
      })
  }, [updateLangGameListByLang, getLangGamelistBylang])

//返回解析后的游戏总和 类型 [{},{}] 对象是game
const getLangGames = useCallback((lang: Locale) => {
    const gameListForLang = state[lang as keyof LangGameList];

    if (!gameListForLang) {
        return [];
    }

    // 明确告诉 TypeScript，累加器 allGames 的类型是 game[]
    return gameListForLang.reduce<games>((allGames, category) => {
        return allGames.concat(category.games);
    }, []); // 初始值仍然是 []
}, [state]);

  // 🔁 返回状态和方法
  return {
    LangGameList: state,
    updateLanguage,
    updateLangGameListByLang,
    clearLanguageData,
    autoGetData,
    getLangGamelistBylang,
    getLangGames
  }
}