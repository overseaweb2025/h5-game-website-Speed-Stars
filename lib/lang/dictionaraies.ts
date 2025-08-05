export const dictionaries = {
  en: () => import('@/public/dictionaries/en.json').then((module) =>module.default),
  zh: () => import('@/public/dictionaries/zh.json').then((module) =>module.default),
  ru: () => import('@/public/dictionaries/ru.json').then((module) =>module.default),
  es: () => import('@/public/dictionaries/es.json').then((module) =>module.default),
  vi: () => import('@/public/dictionaries/vi.json').then((module) =>module.default),
  hi: () => import('@/public/dictionaries/hi.json').then((module) =>module.default),
  fr: () => import('@/public/dictionaries/fr.json').then((module) =>module.default),
  tl: () => import('@/public/dictionaries/tl.json').then((module) =>module.default),
  ja: () => import('@/public/dictionaries/ja.json').then((module) =>module.default),
  ko: () => import('@/public/dictionaries/ko.json').then((module) =>module.default),
  
};
// 类别限制
export type Locale = keyof typeof dictionaries;
// 属性转化为数组
export const localesArrary = Object.keys(dictionaries) as Locale[];