import { useState, useEffect, useCallback } from 'react'
import { getGameHome } from '@/app/api/game'
import { Locale } from '@/lib/lang/dictionaraies'
import { HomeGameInfo, LangHomeInfo } from '@/app/api/types/Get/home'
import { safeErrorLog } from '@/lib/error-filter'

const STORAGE_KEY = 'language-home-value'
const TIMESTAMP_KEY = 'language-home-timestamp'

// 首页缓存过期时间（5分钟）
const HOME_CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5分钟

// 🛠️ 检查首页缓存是否过期
function isHomeCacheExpired(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const timestamp = window.localStorage.getItem(TIMESTAMP_KEY)
    if (!timestamp) return true
    const lastUpdated = parseInt(timestamp, 10)
    return Date.now() - lastUpdated > HOME_CACHE_EXPIRY_TIME
  } catch (error) {
    console.error('[useHomeLanguage] Failed to check cache expiry:', error)
    return true
  }
}

// 1. 全局状态存储
let globalHomeState: LangHomeInfo | null = null

// 2. 监听器存储
const HomeListeners = new Set<() => void>()

/**
 * 3. 更新全局状态并通知所有监听器
 * 这里实现了嵌套的浅合并，以确保只更新特定语言的数据
 * @param newState 要合并的新状态，例如 { 'en-US': { title: 'New Title' } }
 */
const updateHomeState = (newState: Partial<LangHomeInfo>) => {
  // 进行嵌套的浅合并
  const mergedState: LangHomeInfo = { ...globalHomeState } as LangHomeInfo

  for (const lang in newState) {
    if (Object.prototype.hasOwnProperty.call(newState, lang)) {
      mergedState[lang as Locale] = {
        ...mergedState[lang as Locale],
        ...newState[lang as Locale]
      } as HomeGameInfo;
    }
  }

  globalHomeState = mergedState

  // 保存到 localStorage 并更新时间戳
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalHomeState))
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error("Failed to save state to localStorage:", error)
    }
  }

  // 通知所有监听器
  HomeListeners.forEach(listener => listener())
}

/**
 * 4. 强制清空所有数据
 * 将全局状态设为 null，并从 localStorage 中移除数据，然后通知所有监听器。
 */
const clearAllData = () => {
  globalHomeState = null
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TIMESTAMP_KEY)
    } catch (error) {
      console.error("Failed to remove data from localStorage:", error)
    }
  }
  HomeListeners.forEach(listener => listener())
}

// 5. 自定义 Hook，用于在组件中获取、订阅状态和操作数据
export const useHomeLanguage = () => {
  // 组件内部状态，用于触发组件重新渲染
  // 注意：这个 state 只是一个“哨兵”，它的作用是触发组件重新渲染，
  // 它的值不再是我们要直接使用的。
  const [, setTriggerUpdate] = useState<number>(0);

  useEffect(() => {
    // 首次加载时，尝试从 localStorage 获取数据
    if (globalHomeState === null && typeof window !== 'undefined') {
      // 检查缓存是否过期
      if (isHomeCacheExpired()) {
        console.log('[useHomeLanguage] Home cache expired, clearing data')
        try {
          localStorage.removeItem(STORAGE_KEY)
          localStorage.removeItem(TIMESTAMP_KEY)
        } catch (error) {
          console.error('[useHomeLanguage] Failed to clear expired cache:', error)
        }
      } else {
        try {
          const storedState = localStorage.getItem(STORAGE_KEY)
          if (storedState) {
            globalHomeState = JSON.parse(storedState)
            // 首次加载时也需要触发一次渲染
            setTriggerUpdate(c => c + 1)
            console.log('[useHomeLanguage] Loaded home data from cache')
          }
        } catch (error) {
          console.error("Failed to load state from localStorage:", error)
        }
      }
    }

    // 订阅全局状态变化
    const listener = () => {
      // 当全局状态更新时，我们只触发一次组件重新渲染
      setTriggerUpdate(c => c + 1)
    }
    HomeListeners.add(listener)

    // 清理函数，在组件卸载时移除监听器
    return () => {
      HomeListeners.delete(listener)
    }
  }, [])

  /**
   * 更新指定语言的数据
   * @param lang 语言代码，如 'en' 或 'zh'
   * @param data 对应语言的新数据
   */
  const updateLanguage = useCallback((lang: Locale, data: Partial<HomeGameInfo>) => {
    updateHomeState({ [lang]: data } as Partial<LangHomeInfo>)
  }, [])

  const clearLanguageData = useCallback(() => {
    clearAllData()
  }, [])

  const autoGetHomeData = useCallback((lang: Locale, force: boolean = false) => {
    const cacheExpired = isHomeCacheExpired();
    const dataExists = globalHomeState && globalHomeState[lang];

    // 如果不强制刷新，并且数据存在且缓存有效，则跳过
    if (!force && dataExists && !cacheExpired) {
      console.log(`[useHomeLanguage] Home data for ${lang} exists and cache is valid, skipping fetch.`);
      return Promise.resolve();
    }

    // 打印获取数据的原因
    if (force) {
      console.log(`[useHomeLanguage] Force fetching home data for ${lang}.`);
    } else if (!dataExists) {
      console.log(`[useHomeLanguage] No home data for ${lang}, fetching.`);
    } else if (cacheExpired) {
      console.log(`[useHomeLanguage] Home cache expired, fetching fresh data for ${lang}.`);
    }
    
    return getGameHome(lang).then(res => {
      if (res?.data?.data) {
        updateLanguage(lang, res.data.data)
        console.log(`[useHomeLanguage] Successfully updated home data for ${lang}`)
      }
    }).catch(error => {
      safeErrorLog(error, 'useHomeLanguage')
    })
  }, [updateLanguage])

  /**
   * 获取指定语言的 HomeGameInfo 数据
   * @param lang 语言代码，如 'zh' 或 'en'
   * @returns 对应语言的 HomeGameInfo 对象或 null
   */
  const getHomeInfoByLang = useCallback((lang: Locale): HomeGameInfo | null => {
    return globalHomeState?.[lang] || null;
  }, []);


  // 返回全局变量，因为它始终是最新值
  return {
    homeState: globalHomeState,
    updateLanguage,
    clearLanguageData,
    autoGetHomeData, // 更新函数名
    getHomeInfoByLang
  }
}