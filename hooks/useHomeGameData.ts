"use client"

import { useState, useEffect } from 'react'
import homeDataManager, { HomeDataStore } from '@/lib/home-data-store'
import { Locale } from '@/lib/lang/dictionaraies'

export const useHomeGameData = (lang: Locale) => {
  const [store, setStore] = useState<HomeDataStore>(homeDataManager.getState())

  useEffect(() => {
    // 订阅状态变化
    const unsubscribe = homeDataManager.subscribe(() => {
      setStore(homeDataManager.getState())
    })

    // 预加载数据（如果缓存无效）
    if (lang) {
      homeDataManager.preloadData(lang)
    }

    return unsubscribe
  }, [lang])

  // 手动刷新数据
  const refreshData = async () => {
    if (!lang) return null
    return await homeDataManager.fetchHomeData(lang)
  }

  // 清除缓存
  const clearCache = (specificLang?: Locale) => {
    homeDataManager.clearCache(specificLang || lang)
  }

  const homeData = store.data[lang]?.data || null
  const seoData = lang ? homeDataManager.getSEOData(lang) : null

  return {
    homeData,
    loading: store.isLoading,
    error: store.error,
    lastFetched: store.data[lang]?.lastFetched || null,
    
    // 便捷的获取方法
    gameUrl: lang ? homeDataManager.getGameUrl(lang) : null,
    pageTitle: seoData?.title,
    pageDescription: seoData?.description,
    pageKeywords: seoData?.keywords,
    category: seoData?.category,
    aboutContent: seoData?.aboutContent,
    
    // 控制方法
    refreshData,
    clearCache,
    
    // 完整的SEO数据
    seoData
  }
}
