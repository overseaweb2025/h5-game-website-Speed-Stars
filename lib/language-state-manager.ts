/**
 * 全局语言状态管理器
 * 确保全站语言状态的一致性，防止路由跳转到错误语言
 */

import { useState, useEffect } from 'react'
import { Locale, localesArrary } from '@/lib/lang/dictionaraies'

// 语言状态管理类
export class LanguageStateManager {
  private static currentLanguage: Locale | null = null
  private static listeners = new Set<(lang: Locale) => void>()

  /**
   * 获取当前语言（优先级：内存状态 > URL > Cookie > 浏览器 > 默认）
   */
  static getCurrentLanguage(): Locale {
    // 1. 如果内存中有当前语言状态，直接返回
    if (this.currentLanguage) {
      return this.currentLanguage
    }

    // 2. 从 URL 路径中获取
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const urlLang = this.extractLanguageFromPath(pathname)
      if (urlLang) {
        this.currentLanguage = urlLang
        return urlLang
      }
    }

    // 3. 从 Cookie 中获取
    const cookieLang = this.getLanguageFromCookie()
    if (cookieLang) {
      this.currentLanguage = cookieLang
      return cookieLang
    }

    // 4. 从浏览器语言获取
    const browserLang = this.getBrowserLanguage()
    if (browserLang) {
      this.currentLanguage = browserLang
      return browserLang
    }

    // 5. 返回默认语言
    this.currentLanguage = 'en'
    return 'en'
  }

  /**
   * 设置当前语言
   */
  static setCurrentLanguage(language: Locale) {
    if (!this.isValidLanguage(language)) {
      console.warn(`[LanguageStateManager] Invalid language: ${language}`)
      return
    }

    const previousLanguage = this.currentLanguage
    this.currentLanguage = language

    // 设置 Cookie
    this.setLanguageCookie(language)

    // 通知所有监听器
    this.notifyListeners(language)

    console.log(`[LanguageStateManager] Language changed from ${previousLanguage} to ${language}`)
  }

  /**
   * 订阅语言变化
   */
  static subscribe(listener: (lang: Locale) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 重置语言状态（用于测试或特殊情况）
   */
  static reset() {
    this.currentLanguage = null
    this.listeners.clear()
  }

  /**
   * 从路径中提取语言代码
   */
  private static extractLanguageFromPath(path: string): Locale | null {
    const match = path.match(/^\/([a-z]{2})(?:\/|$)/)
    if (match) {
      const lang = match[1] as Locale
      return this.isValidLanguage(lang) ? lang : null
    }
    return null
  }

  /**
   * 从 Cookie 获取语言
   */
  private static getLanguageFromCookie(): Locale | null {
    if (typeof window === 'undefined') return null

    try {
      const value = `; ${document.cookie}`
      const parts = value.split(`; preferred-language=`)
      if (parts.length === 2) {
        const lang = parts.pop()?.split(';').shift()
        return lang && this.isValidLanguage(lang as Locale) ? lang as Locale : null
      }
    } catch (error) {
      console.error('[LanguageStateManager] Error reading language cookie:', error)
    }
    return null
  }

  /**
   * 从浏览器设置获取语言
   */
  private static getBrowserLanguage(): Locale | null {
    if (typeof window === 'undefined') return null

    try {
      const browserLang = navigator.language?.toLowerCase()
      if (browserLang) {
        // 检查完整匹配
        if (this.isValidLanguage(browserLang as Locale)) {
          return browserLang as Locale
        }
        // 检查语言前缀
        const langPrefix = browserLang.split('-')[0] as Locale
        if (this.isValidLanguage(langPrefix)) {
          return langPrefix
        }
      }
    } catch (error) {
      console.error('[LanguageStateManager] Error detecting browser language:', error)
    }
    return null
  }

  /**
   * 设置语言 Cookie
   */
  private static setLanguageCookie(language: Locale) {
    if (typeof window !== 'undefined') {
      try {
        document.cookie = `preferred-language=${language}; max-age=${30 * 24 * 60 * 60}; path=/; samesite=lax`
      } catch (error) {
        console.error('[LanguageStateManager] Error setting language cookie:', error)
      }
    }
  }

  /**
   * 验证语言代码是否有效
   */
  private static isValidLanguage(language: string): language is Locale {
    return localesArrary.includes(language as Locale)
  }

  /**
   * 通知所有监听器
   */
  private static notifyListeners(language: Locale) {
    this.listeners.forEach(listener => {
      try {
        listener(language)
      } catch (error) {
        console.error('[LanguageStateManager] Error in language change listener:', error)
      }
    })
  }

  /**
   * 构建带语言前缀的路径
   */
  static buildLanguagePath(path: string, language?: Locale): string {
    const lang = language || this.getCurrentLanguage()
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${lang}${cleanPath === '/' ? '' : cleanPath}`
  }

  /**
   * 检查路径是否包含正确的语言前缀
   */
  static validateLanguagePath(path: string): boolean {
    const language = this.extractLanguageFromPath(path)
    return language === this.getCurrentLanguage()
  }

  /**
   * 获取语言切换的目标路径
   */
  static getLanguageSwitchPath(targetLanguage: Locale, currentPath?: string): string {
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/')
    // 移除当前语言前缀
    const pathWithoutLang = path.replace(/^\/[a-z]{2}(\/|$)/, '/')
    // 添加新语言前缀
    return `/${targetLanguage}${pathWithoutLang === '/' ? '' : pathWithoutLang}`
  }
}

// React Hook 版本
export function useLanguageState() {
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(() => 
    LanguageStateManager.getCurrentLanguage()
  )

  useEffect(() => {
    const unsubscribe = LanguageStateManager.subscribe(setCurrentLanguage)
    return unsubscribe
  }, [])

  const changeLanguage = (language: Locale) => {
    LanguageStateManager.setCurrentLanguage(language)
  }

  return {
    currentLanguage,
    changeLanguage,
    buildPath: (path: string) => LanguageStateManager.buildLanguagePath(path),
    getSwitchPath: (targetLang: Locale) => LanguageStateManager.getLanguageSwitchPath(targetLang)
  }
}

// 兼容性导出
export default LanguageStateManager