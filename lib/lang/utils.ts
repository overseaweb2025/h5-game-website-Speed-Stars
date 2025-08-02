import { Locale } from './i18n'

// 获取默认语言
export function getDefaultLocale(): Locale {
  return 'en'
}

// 获取支持的语言列表
export function getSupportedLocales(): Locale[] {
  return ['en', 'zh']
}

// 验证语言代码是否有效
export function isValidLocale(locale: string): locale is Locale {
  return getSupportedLocales().includes(locale as Locale)
}

// 从浏览器获取首选语言
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return getDefaultLocale()
  }

  const browserLang = navigator.language.toLowerCase()
  
  // 检查完全匹配
  if (isValidLocale(browserLang)) {
    return browserLang as Locale
  }
  
  // 检查语言代码前缀
  const langPrefix = browserLang.split('-')[0]
  if (isValidLocale(langPrefix)) {
    return langPrefix as Locale
  }
  
  // 中文相关的变体
  if (browserLang.startsWith('zh')) {
    return 'zh'
  }
  
  return getDefaultLocale()
}

// 获取语言显示名称
export function getLocaleDisplayName(locale: Locale): { name: string; nativeName: string; flag: string } {
  const localeMap: Record<Locale, { name: string; nativeName: string; flag: string }> = {
    en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
    zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
  }
  
  return localeMap[locale] || localeMap[getDefaultLocale()]
}

// 切换语言的URL路径
export function getLocalizedPath(path: string, locale: Locale): string {
  // 移除现有的语言前缀
  const pathWithoutLocale = path.replace(/^\/[a-z]{2}(\/|$)/, '/')
  
  // 添加新的语言前缀  
  return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
}

// 从路径中提取语言代码
export function getLocaleFromPath(path: string): Locale {
  const segments = path.split('/')
  const possibleLocale = segments[1]
  
  if (isValidLocale(possibleLocale)) {
    return possibleLocale as Locale
  }
  
  return getDefaultLocale()
}