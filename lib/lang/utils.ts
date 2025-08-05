import { language } from '@/app/api/types/Get/language'
import { Locale ,localesArrary} from '@/lib/lang/dictionaraies'
import { footer_nav, languageNav, top_navigation } from '@/app/api/types/Get/nav'
// 获取默认语言
export function getDefaultLocale(): Locale {
  return 'en'
}

// 获取支持的语言列表
export function getSupportedLocales(): Locale[] {
  return localesArrary
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
    zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    tl: { name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
    ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
  };
  return localeMap[locale] || localeMap[getDefaultLocale()];
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

//判断返回序列值- 多语言 根据lang 返回指定数据值 返回 top navigation

export const langSequence = (navstate:language<top_navigation[]>,lang:string )=>{
    const values : top_navigation[] = [
      {
        url: '/games',
        text: 'game',
        icon: ''
      }
    ]
    if(!navstate) return values
    if (lang === 'en') return navstate.en; // 英语
    if (lang === 'zh') return navstate.zh; // 中文
    if (lang === 'ru') return navstate.ru; // 俄语
    if (lang === 'es') return navstate.es; // 西班牙语
    if (lang === 'vi') return navstate.vi; // 越南语
    if (lang === 'hi') return navstate.hi; // 印地语
    if (lang === 'fr') return navstate.fr; // 法语
    if (lang === 'tl') return navstate.tl; // 他加禄语
    if (lang === 'ja') return navstate.ja; // 日语
    if (lang === 'ko') return navstate.ko; // 韩语

    return []
}

//判断返回序列值- 多语言 根据lang 返回指定数据值

export const langSequence_footernavigation = (navstate:language<footer_nav[]>,lang:string )=>{

    if(!navstate) return []
    if (lang === 'en') return navstate.en; // 英语
    if (lang === 'zh') return navstate.zh; // 中文
    if (lang === 'ru') return navstate.ru; // 俄语
    if (lang === 'es') return navstate.es; // 西班牙语
    if (lang === 'vi') return navstate.vi; // 越南语
    if (lang === 'hi') return navstate.hi; // 印地语
    if (lang === 'fr') return navstate.fr; // 法语
    if (lang === 'tl') return navstate.tl; // 他加禄语
    if (lang === 'ja') return navstate.ja; // 日语
    if (lang === 'ko') return navstate.ko; // 韩语

    return []
}


// 一键返回当前语言路径数据
export const langSequenceT = <T,>(navSequence: language<T>,lang: Locale): T | null => {
  if (!navSequence) return null
  switch (lang) {
    case 'en': return navSequence.en ?? null
    case 'zh': return navSequence.zh ?? null
    case 'ru': return navSequence.ru ?? null
    case 'es': return navSequence.es ?? null
    case 'vi': return navSequence.vi ?? null
    case 'hi': return navSequence.hi ?? null
    case 'fr': return navSequence.fr ?? null
    case 'tl': return navSequence.tl ?? null
    case 'ja': return navSequence.ja ?? null
    case 'ko': return navSequence.ko ?? null
    default: return null
  }
}