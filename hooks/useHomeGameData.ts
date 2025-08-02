"use client"

import { useState, useEffect } from 'react'
import homeDataManager, { HomeDataStore } from '@/lib/home-data-store'
import { HomeGameData } from '@/app/api/types/Get/game'

export const useHomeGameData = () => {
  const [store, setStore] = useState<HomeDataStore>(homeDataManager.getState())

  useEffect(() => {
    // 订阅状态变化
    const unsubscribe = homeDataManager.subscribe(() => {
      setStore(homeDataManager.getState())
    })

    // 预加载数据（如果缓存无效）
    homeDataManager.preloadData()

    return unsubscribe
  }, [])

  // 手动刷新数据
  const refreshData = async () => {
    return await homeDataManager.fetchHomeData()
  }

  // 清除缓存
  const clearCache = () => {
    homeDataManager.clearCache()
  }

  const homeData = store.data
  const seoData = homeDataManager.getSEOData()

  return {
    homeData,
    loading: store.isLoading,
    error: store.error,
    lastFetched: store.lastFetched,
    
    // 便捷的获取方法
    gameUrl: homeDataManager.getGameUrl(),
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