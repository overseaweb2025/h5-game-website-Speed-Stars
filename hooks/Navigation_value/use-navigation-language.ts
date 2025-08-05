
import { useState, useEffect, useCallback } from 'react'
import { languageNav } from '@/app/api/types/Get/nav'
import { getNavLanguage } from '@/app/api/nav_language'
import { Locale } from '@/lib/lang/dictionaraies'

const STORAGE_KEY = 'language-nav-value'

// 1. 全局状态存储
let globalNavState: languageNav | null = null

// 2. 监听器存储
const NavListeners = new Set<() => void>()

// 3. 更新全局状态并通知所有监听器
const updateNavState = (newState: Partial<languageNav>) => {
  // 合并新状态
  globalNavState = { ...globalNavState, ...newState } as languageNav
  
  // 保存到 localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalNavState))
  } catch (error) {
    console.error("Failed to save state to localStorage:", error)
  }
  
  // 通知所有监听器
  NavListeners.forEach(listener => listener())
}

/**
 * 4. 强制清空所有数据
 * 将全局状态设为 null，并从 localStorage 中移除数据，然后通知所有监听器。
 */
const clearAllData = () => {
  globalNavState = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to remove data from localStorage:", error)
  }
  NavListeners.forEach(listener => listener())
}

// ... (其他代码保持不变) ...

// 5. 自定义 Hook，用于在组件中获取、订阅状态和操作数据
export const useNavgationLanguage = () => {
  // 组件内部状态，用于触发组件重新渲染
  // 注意：这个 state 只是一个“哨兵”，它的作用是触发组件重新渲染，
  // 它的值不再是我们要直接使用的。
  const [, setTriggerUpdate] = useState<number>(0); 

  useEffect(() => {
    // 首次加载时，尝试从 localStorage 获取数据
    if (globalNavState === null) {
      try {
        const storedState = localStorage.getItem(STORAGE_KEY)
        if (storedState) {
          globalNavState = JSON.parse(storedState)
          // 首次加载时也需要触发一次渲染
          setTriggerUpdate(c => c + 1) 
        }
      } catch (error) {
        console.error("Failed to load state from localStorage:", error)
      }
    }

    // 订阅全局状态变化
    const listener = () => {
      // 当全局状态更新时，我们只触发一次组件重新渲染
      setTriggerUpdate(c => c + 1)
    }
    NavListeners.add(listener)

    // 清理函数，在组件卸载时移除监听器
    return () => {
      NavListeners.delete(listener)
    }
  }, [])

  const updateLanguage = useCallback((newState: Partial<languageNav>) => {
    updateNavState(newState)
  }, [])

  const clearLanguageData = useCallback(() => {
    clearAllData()
  }, [])

  const autoGetNavData = useCallback(()=>{
    getNavLanguage().then(res=>{
      updateNavState(res.data.data)
    })
  },[])
  // 返回指定的多语言文本数据
const getNavValueByLang = useCallback((lang: Locale, isTop_navgation: boolean = true) => {
  if (isTop_navgation) {
    if (lang === 'zh') return globalNavState?.top_navigation.zh;
    if (lang === 'en') return globalNavState?.top_navigation.en;
    if (lang === 'ru') return globalNavState?.top_navigation.ru;
    if (lang === 'es') return globalNavState?.top_navigation.es;
    if (lang === 'vi') return globalNavState?.top_navigation.vi;
    if (lang === 'hi') return globalNavState?.top_navigation.hi;
    if (lang === 'fr') return globalNavState?.top_navigation.fr;
    if (lang === 'tl') return globalNavState?.top_navigation.tl;
    if (lang === 'ja') return globalNavState?.top_navigation.ja;
    if (lang === 'ko') return globalNavState?.top_navigation.ko;
  } else {
    if (lang === 'zh') return globalNavState?.footer_nav.zh;
    if (lang === 'en') return globalNavState?.footer_nav.en;
    if (lang === 'ru') return globalNavState?.footer_nav.ru;
    if (lang === 'es') return globalNavState?.footer_nav.es;
    if (lang === 'vi') return globalNavState?.footer_nav.vi;
    if (lang === 'hi') return globalNavState?.footer_nav.hi;
    if (lang === 'fr') return globalNavState?.footer_nav.fr;
    if (lang === 'tl') return globalNavState?.footer_nav.tl;
    if (lang === 'ja') return globalNavState?.footer_nav.ja;
    if (lang === 'ko') return globalNavState?.footer_nav.ko;
  }
}, []);
  // 返回全局变量，因为它始终是最新值
  return { navState: globalNavState, updateLanguage, clearLanguageData ,autoGetNavData}
}