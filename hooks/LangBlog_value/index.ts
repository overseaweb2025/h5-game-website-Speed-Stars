import { useState, useEffect, useCallback } from 'react'
import { blog, LangBlog } from '@/app/api/types/Get/blog'
import { Locale } from '@/lib/lang/dictionaraies'
import { getPagration } from '@/app/api/blog'
import { postBlog } from '@/app/api/types/Post/blog'

const STORAGE_KEY = 'language-blog-value'
const TIMESTAMP_KEY = 'language-blog-timestamp'

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
    console.error('[useLangBlog] Failed to check cache expiry:', error)
    return true
  }
}

// 1. 全局状态存储 blog 页面的每一条blog 数据
let globalBlogState: LangBlog | null = {
  en: [],
  zh: [],
  ru: [],
  es: [],
  vi: [],
  hi: [],
  fr: [],
  tl: [],
  ja: [],
  ko: []
}

// 2. 监听器存储
const langBlog = new Set<() => void>()

// 3. 更新全局状态并通知所有监听器
const updateNavState = (newState: Partial<LangBlog>) => {
  // 合并新状态
  globalBlogState = { ...globalBlogState, ...newState } as LangBlog
  
  // 保存到 localStorage 并更新时间戳
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalBlogState))
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error("Failed to save state to localStorage:", error)
    }
  }
  
  // 通知所有监听器
  langBlog.forEach(listener => listener())
}

/**
 * 4. 强制清空所有数据
 * 将全局状态设为 null，并从 localStorage 中移除数据，然后通知所有监听器。
 */
const clearAllData = () => {
  globalBlogState = null
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TIMESTAMP_KEY)
    } catch (error) {
      console.error("Failed to remove data from localStorage:", error)
    }
  }
  langBlog.forEach(listener => listener())
}

// ... (其他代码保持不变) ...

// 5. 自定义 Hook，用于在组件中获取、订阅状态和操作数据
export const useLangBlog= () => {
  // 组件内部状态，用于触发组件重新渲染
  // 注意：这个 state 只是一个“哨兵”，它的作用是触发组件重新渲染，
  // 它的值不再是我们要直接使用的。
  const [, setTriggerUpdate] = useState<number>(0); 

  useEffect(() => {
    // 首次加载时，尝试从 localStorage 获取数据
    if (globalBlogState === null && typeof window !== 'undefined') {
      // 检查缓存是否过期
      if (isCacheExpired()) {
        console.log('[useLangBlog] Cache expired, clearing data')
        try {
          localStorage.removeItem(STORAGE_KEY)
          localStorage.removeItem(TIMESTAMP_KEY)
        } catch (error) {
          console.error('[useLangBlog] Failed to clear expired cache:', error)
        }
      } else {
        try {
          const storedState = localStorage.getItem(STORAGE_KEY)
          if (storedState) {
            globalBlogState = JSON.parse(storedState)
            // 首次加载时也需要触发一次渲染
            setTriggerUpdate(c => c + 1) 
            console.log('[useLangBlog] Loaded blog data from cache')
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
    langBlog.add(listener)

    // 清理函数，在组件卸载时移除监听器
    return () => {
      langBlog.delete(listener)
    }
  }, [])

  const updateLanguage = useCallback((newState: Partial<LangBlog>) => {
    updateNavState(newState)
  }, [])

  
  const updataLanguageByLang = useCallback((newState: Partial<blog>,lang:Locale) => {
   // 更新指定数据
   // 确保 globalBlogState 不为 null
    if (!globalBlogState) {
      console.error("Global state is not initialized.");
      return;
    }

    // 根据传入的 lang 字段更新对应的数据
    // 使用一个临时变量来存储更新后的状态
    let updatedState = { ...globalBlogState };

    if (lang === 'en') {
      updatedState.en = { ...updatedState.en, ...newState };
    } else if (lang === 'zh') {
      updatedState.zh = { ...updatedState.zh, ...newState };
    } else if (lang === 'ru') {
      updatedState.ru = { ...updatedState.ru, ...newState };
    } else if (lang === 'es') {
      updatedState.es = { ...updatedState.es, ...newState };
    } else if (lang === 'vi') {
      updatedState.vi = { ...updatedState.vi, ...newState };
    } else if (lang === 'hi') {
      updatedState.hi = { ...updatedState.hi, ...newState };
    } else if (lang === 'fr') {
      updatedState.fr = { ...updatedState.fr, ...newState };
    } else if (lang === 'tl') {
      updatedState.tl = { ...updatedState.tl, ...newState };
    } else if (lang === 'ja') {
      updatedState.ja = { ...updatedState.ja, ...newState };
    } else if (lang === 'ko') {
      updatedState.ko = { ...updatedState.ko, ...newState };
    } else {
      console.error(`Invalid language code: ${lang}`);
      return;
    }

    // 调用 updateNavState 来更新全局状态并通知所有监听器
    updateNavState(updatedState);
  }, [])
  const clearLanguageData = useCallback(() => {
    clearAllData()
  }, [])

  const autoGetData = useCallback((lang:Locale, form:postBlog, force: boolean = true) => {
      // 检查缓存是否过期
      const cacheExpired = isCacheExpired()
      
      // 当force为true且缓存未过期时，检查该语言的数据是否已存在
      if (force && !cacheExpired) {
        const existingData = globalBlogState?.[lang as keyof LangBlog]
        if (existingData && Object.keys(existingData).length > 0) {
          console.log(`[useLangBlog] Data for ${lang} already exists and cache is valid, skipping fetch`)
          return Promise.resolve()
        }
      }

      // 如果缓存过期或没有数据，则获取数据
      if (cacheExpired) {
        console.log(`[useLangBlog] Cache expired, fetching fresh data for ${lang}`)
      } else {
        console.log(`[useLangBlog] Fetching data for ${lang}${!force ? ' (forced fetch)' : ''}`)
      }
      
      return getPagration(form).then(res=>{
          if (res?.data?.data) {
            updataLanguageByLang(res.data.data,lang)
          }
      }).catch(error => {
          console.error(`[useLangBlog] Failed to fetch blog data for ${lang}:`, error)
      })
  },[updataLanguageByLang])

  
  // 返回全局变量，因为它始终是最新值
  return { LangBlog: globalBlogState, updateLanguage, clearLanguageData ,autoGetData,updataLanguageByLang}
}