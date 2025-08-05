// hooks/useLangGameList.ts
'use client'
import { useState, useEffect, useCallback } from 'react'

// 假设这些类型已定义
import { gamelist, LangGameList } from '@/app/api/types/Get/game'
import { Locale } from '@/lib/lang/dictionaraies'
import { getGameList } from '@/app/api/gameList'

// 存储 key
const STORAGE_KEY = 'language-Gamelist-value'

// 默认空状态
const initialLangGameList: LangGameList = {
  en: [], zh: [], ru: [], es: [], vi: [],
  hi: [], fr: [], tl: [], ja: [], ko: []
}

// 🛠️ 安全读取 localStorage（仅客户端）
function getStoredLangGameList(): LangGameList {
  if (typeof window === 'undefined') return initialLangGameList
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
    window.addEventListener('storage', handleStorage)

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

  // ✅ 自动获取数据（根据语言）
  const autoGetData = useCallback((lang: Locale) => {
    getGameList()
      .then(res => {
        if (res.data?.data) {
          updateLangGameListByLang(lang, res.data.data)
        }
      })
      .catch(err => {
        console.error('[useLangGameList] Failed to fetch game list:', err)
      })
  }, [updateLangGameListByLang])

  //返回特定 语言的 数据集合
  const getLangGamelistBylang =useCallback((lang: Locale)=>{
    if(lang === 'zh'){
      console.log('中文数据',state.zh)
    }
    if(lang=== 'en')console.log('English message ',state.en)
    
  },[])
  // 🔁 返回状态和方法
  return {
    LangGameList: state,
    updateLanguage,
    updateLangGameListByLang,
    clearLanguageData,
    autoGetData,
    getLangGamelistBylang
  }
}