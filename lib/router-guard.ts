/**
 * 路由防护工具
 * 防止路由跳转到错误的语言路径
 */

import { useEffect } from 'react'
import { Locale } from '@/lib/lang/dictionaraies'
import { LanguageStateManager } from '@/lib/language-state-manager'

// 路由防护类
export class RouterGuard {
  /**
   * 验证并修复路径的语言前缀
   * @param path 要跳转的路径
   * @param targetLanguage 目标语言（可选）
   * @returns 修复后的正确路径
   */
  static validateAndFixPath(path: string, targetLanguage?: Locale): string {
    const currentLanguage = targetLanguage || LanguageStateManager.getCurrentLanguage()
    
    // 提取路径中的语言代码
    const pathLangMatch = path.match(/^\/([a-z]{2})(?:\/|$)/)
    const pathLanguage = pathLangMatch ? pathLangMatch[1] as Locale : null
    
    // 如果路径已包含正确的语言，直接返回
    if (pathLanguage === currentLanguage) {
      return path
    }
    
    // 移除错误的语言前缀
    let cleanPath = path
    if (pathLanguage) {
      cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/')
    }
    
    // 添加正确的语言前缀
    const fixedPath = `/${currentLanguage}${cleanPath === '/' ? '' : cleanPath}`
    
    console.log(`[RouterGuard] Fixed path from "${path}" to "${fixedPath}"`)
    return fixedPath
  }
  
  /**
   * 安全的路由跳转
   * @param path 目标路径
   * @param targetLanguage 目标语言（可选）
   * @param replace 是否替换当前历史记录
   */
  static safeNavigate(path: string, targetLanguage?: Locale, replace: boolean = false): void {
    try {
      const safePath = this.validateAndFixPath(path, targetLanguage)
      
      if (typeof window !== 'undefined') {
        if (replace) {
          window.history.replaceState(null, '', safePath)
        } else {
          window.location.href = safePath
        }
      }
      
      console.log(`[RouterGuard] Safe navigation to: ${safePath}`)
    } catch (error) {
      console.error('[RouterGuard] Navigation error:', error)
      // 降级到首页
      const fallbackPath = `/${targetLanguage || LanguageStateManager.getCurrentLanguage()}/`
      if (typeof window !== 'undefined') {
        window.location.href = fallbackPath
      }
    }
  }
  
  /**
   * 检查当前路径是否需要重定向
   */
  static checkAndRedirectCurrentPath(): boolean {
    if (typeof window === 'undefined') return false
    
    const currentPath = window.location.pathname
    const fixedPath = this.validateAndFixPath(currentPath)
    
    if (currentPath !== fixedPath) {
      console.log(`[RouterGuard] Redirecting from ${currentPath} to ${fixedPath}`)
      window.location.replace(fixedPath)
      return true
    }
    
    return false
  }
  
  /**
   * 创建安全的链接 href 属性
   */
  static createSafeHref(path: string, targetLanguage?: Locale): string {
    return this.validateAndFixPath(path, targetLanguage)
  }
  
  /**
   * 批量验证多个路径
   */
  static validatePaths(paths: string[], targetLanguage?: Locale): string[] {
    return paths.map(path => this.validateAndFixPath(path, targetLanguage))
  }
}

// 增强的路由工具函数
export const createSafeRouter = () => {
  const currentLanguage = LanguageStateManager.getCurrentLanguage()
  
  return {
    // 游戏相关安全跳转
    toGameDetail: (gameSlug: string, lang?: Locale) => {
      const path = `/game/${gameSlug}`
      RouterGuard.safeNavigate(path, lang || currentLanguage)
    },
    
    toGameCategory: (categorySlug: string, lang?: Locale) => {
      const path = `/games/c/${categorySlug}`
      RouterGuard.safeNavigate(path, lang || currentLanguage)
    },
    
    toAllGames: (lang?: Locale) => {
      RouterGuard.safeNavigate('/games', lang || currentLanguage)
    },
    
    // 页面相关安全跳转
    toHome: (lang?: Locale) => {
      RouterGuard.safeNavigate('/', lang || currentLanguage)
    },
    
    toAbout: (lang?: Locale) => {
      RouterGuard.safeNavigate('/about', lang || currentLanguage)
    },
    
    toContact: (lang?: Locale) => {
      RouterGuard.safeNavigate('/contact', lang || currentLanguage)
    },
    
    toBlog: (lang?: Locale) => {
      RouterGuard.safeNavigate('/blog', lang || currentLanguage)
    },
    
    toBlogPost: (slug: string, lang?: Locale) => {
      const path = `/blog/${slug}`
      RouterGuard.safeNavigate(path, lang || currentLanguage)
    },
    
    // 用户相关安全跳转
    toSignIn: (lang?: Locale) => {
      RouterGuard.safeNavigate('/auth/signin', lang || currentLanguage)
    },
    
    toUser: (lang?: Locale) => {
      RouterGuard.safeNavigate('/user', lang || currentLanguage)
    },
    
    // 工具方法
    createSafeHref: (path: string, lang?: Locale) => {
      return RouterGuard.createSafeHref(path, lang || currentLanguage)
    },
    
    getCurrentLanguage: () => currentLanguage
  }
}

// React Hook 版本
export function useSafeRouter() {
  return createSafeRouter()
}

// 页面加载时检查路径的Hook
export function useRouterGuard() {
  useEffect(() => {
    // 页面加载后检查并修复路径
    const needsRedirect = RouterGuard.checkAndRedirectCurrentPath()
    
    if (!needsRedirect) {
      console.log('[RouterGuard] Current path is valid')
    }
  }, [])
}

export default RouterGuard