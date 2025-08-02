import 'server-only'
const dictionaries = {
  en: () => import('@/public/dictionaries/en.json').then((module) => module.default),
  zh: () => import('@/public/dictionaries/zh.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;
export const getDictionary = async (locale: Locale) => dictionaries[locale]().then((dict) => dict || {});