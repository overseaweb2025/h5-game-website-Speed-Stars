"use client"

/**
 * 统一路由跳转工具
 * 提供项目中所有页面跳转的统一管理
 */

// 获取当前语言
export const getCurrentLang = (): string => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
    return langMatch ? langMatch[1] : 'en'
  }
  return 'en'
}

// 构建带语言前缀的路径
export const buildLangPath = (path: string, lang?: string): string => {
  const currentLang = lang || getCurrentLang()
  // 确保路径以 / 开头
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/${currentLang}${cleanPath}`
}

// 游戏相关的跳转方法
export class GameRouter {
  /**
   * 跳转到游戏详情页
   */
  static toGameDetail(gameSlug: string, lang?: string): void {
    const path = buildLangPath(`/game/${gameSlug}`, lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到游戏播放页（移动端）
   */
  static toGamePlay(gameSlug: string, gameUrl: string, gameTitle?: string, lang?: string): void {
    const encodedUrl = encodeURIComponent(gameUrl)
    const encodedTitle = gameTitle ? encodeURIComponent(gameTitle) : ''
    
    let path = buildLangPath(`/play/${gameSlug}/${encodedUrl}`, lang)
    if (encodedTitle) {
      path += `?title=${encodedTitle}`
    }
    
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到游戏分类页
   */
  static toGameCategory(categorySlug: string, lang?: string): void {
    const path = buildLangPath(`/games/c/${categorySlug}`, lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到所有游戏页面
   */
  static toAllGames(lang?: string): void {
    const path = buildLangPath('/games', lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }
}

// 页面跳转方法
export class PageRouter {
  /**
   * 跳转到首页
   */
  static toHome(lang?: string): void {
    const path = buildLangPath('/', lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到关于页面
   */
  static toAbout(lang?: string): void {
    const path = buildLangPath('/about', lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到联系页面
   */
  static toContact(lang?: string): void {
    const path = buildLangPath('/contact', lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到博客页面
   */
  static toBlog(lang?: string): void {
    const path = buildLangPath('/blog', lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到博客详情页
   */
  static toBlogPost(slug: string, lang?: string): void {
    const path = buildLangPath(`/blog/${slug}`, lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }
}

// 用户相关跳转
export class UserRouter {
  /**
   * 跳转到登录页
   */
  static toSignIn(lang?: string): void {
    const path = buildLangPath('/auth/signin', lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * 跳转到用户页面
   */
  static toUser(lang?: string): void {
    const path = buildLangPath('/user', lang)
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }
}

// Hook版本的路由工具（用于组件内部）
export const useAppRouter = () => {
  return {
    // 游戏相关
    toGameDetail: (gameSlug: string, lang?: string) => GameRouter.toGameDetail(gameSlug, lang),
    toGamePlay: (gameSlug: string, gameUrl: string, gameTitle?: string, lang?: string) => 
      GameRouter.toGamePlay(gameSlug, gameUrl, gameTitle, lang),
    toGameCategory: (categorySlug: string, lang?: string) => GameRouter.toGameCategory(categorySlug, lang),
    toAllGames: (lang?: string) => GameRouter.toAllGames(lang),
    
    // 页面相关
    toHome: (lang?: string) => PageRouter.toHome(lang),
    toAbout: (lang?: string) => PageRouter.toAbout(lang),
    toContact: (lang?: string) => PageRouter.toContact(lang),
    toBlog: (lang?: string) => PageRouter.toBlog(lang),
    toBlogPost: (slug: string, lang?: string) => PageRouter.toBlogPost(slug, lang),
    
    // 用户相关
    toSignIn: (lang?: string) => UserRouter.toSignIn(lang),
    toUser: (lang?: string) => UserRouter.toUser(lang),
  }
}

// 兼容旧版本的JumpRouter
export const JumpRouter = (address: string): void => {
  if (typeof window !== 'undefined') {
    window.location.href = address
  }
}

// 工具函数
export const RouterUtils = {
  /**
   * 获取当前页面的语言
   */
  getCurrentLang,
  
  /**
   * 构建带语言前缀的路径
   */
  buildLangPath,
  
  /**
   * 返回上一页
   */
  goBack: (): void => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  },
  
  /**
   * 刷新当前页面
   */
  reload: (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  },
  
  /**
   * 检查是否为移动端
   */
  isMobile: (): boolean => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  },
  
  /**
   * 检查是否为小屏幕设备
   */
  isSmallScreen: (): boolean => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024
    }
    return false
  }
}

//解析工具 - 兼容旧版本
export const addString = (lang: string, address: string): string => {
  return `/${lang}${address.startsWith('/') ? address : `/${address}`}`
}

export default {
  Game: GameRouter,
  Page: PageRouter,
  User: UserRouter,
  Utils: RouterUtils,
  useAppRouter,
  JumpRouter // 向后兼容
}