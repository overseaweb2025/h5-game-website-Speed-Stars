'use client';
import { useState, useEffect, useCallback } from 'react';
import { LangBlogDetails, blogDetails } from '@/app/api/types/Get/blog';
import { Locale } from '@/lib/lang/dictionaraies';
import {getBlogDetails} from '@/app/api/blog'
// 假设这里是获取数据的 API 函数，你需要根据实际情况调整
// 确保这个函数返回的是一个 blogDetails 对象，而不是数组

const STORAGE_KEY = 'language-Blog-Details-value';

// 1. 全局状态存储 (作为单一数据源)
// 初始化为一个完整的空对象，避免空指针错误
let globalBlogState: LangBlogDetails = {
  en: [], zh: [], ru: [], es: [], vi: [],
  hi: [], fr: [], tl: [], ja: [], ko: [],
};

// 2. 监听器存储
const NavListeners = new Set<() => void>();

// 3. 更新全局状态并通知所有监听器
// 采用函数式更新，避免闭包问题和竞态条件
const updateGlobalState = (updater: (currentState: LangBlogDetails) => LangBlogDetails) => {
  const newState = updater(globalBlogState);
  globalBlogState = newState;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalBlogState));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }

  NavListeners.forEach(listener => listener());
};

/**
 * 4. 强制清空所有数据
 */
const clearAllData = () => {
  globalBlogState = {
    en: [], zh: [], ru: [], es: [], vi: [],
    hi: [], fr: [], tl: [], ja: [], ko: [],
  };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to remove data from localStorage:", error);
  }
  NavListeners.forEach(listener => listener());
};

// 5. 自定义 Hook
export const useLangBlogDetails = () => {
  const [langBlogDataState, setLangBlogDataState] = useState<LangBlogDetails>(() => {
    // 首次渲染时从 localStorage 加载数据
    try {
      const storedState = localStorage.getItem(STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        globalBlogState = parsedState;
        return parsedState;
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
    }
    return globalBlogState;
  });

  useEffect(() => {
    const listener = () => {
      setLangBlogDataState(globalBlogState);
    };
    NavListeners.add(listener);

    return () => {
      NavListeners.delete(listener);
    };
  }, []);

  const updateLanguage = useCallback((newState: Partial<LangBlogDetails>) => {
    updateGlobalState((currentState) => ({
      ...currentState,
      ...newState,
    } as LangBlogDetails));
  }, []);

  /**
   * 核心改动: 更新指定语言的博客列表
   * 这个函数现在接受一个**单篇博客详情**，并将其智能地合并到数组中。
   * @param newBlogDetails 单篇博客详情对象
   * @param lang 语言代码
   */
  const updateLangBlogDetails = useCallback((newBlogDetails: blogDetails, lang: Locale) => {
    updateGlobalState((currentState) => {
      const key = lang as keyof LangBlogDetails;
      // 创建一个新对象，保留旧状态
      const newState = { ...currentState };

      if (!newState[key]) {
        newState[key] = [];
      }
      
      const blogDetailsForLang = [...newState[key]];
      // 检查是否已存在同名博客，这里假设 `title` 是唯一标识符
      const existingBlogIndex = blogDetailsForLang.findIndex(blog => blog.title === newBlogDetails.title);

      if (existingBlogIndex > -1) {
        // 如果找到，则用新数据更新旧数据
        blogDetailsForLang[existingBlogIndex] = {
          ...blogDetailsForLang[existingBlogIndex],
          ...newBlogDetails,
        };
      } else {
        // 如果未找到，则将新数据添加到数组末尾
        blogDetailsForLang.push(newBlogDetails);
      }

      // 将更新后的数组赋值给对应语言的键
      newState[key] = blogDetailsForLang;
      return newState;
    });
  }, []);

  const clearLanguageData = useCallback(() => {
    clearAllData();
  }, []);

  /**
   * 从 API 自动获取数据并更新到缓存
   * @param lang 语言代码
   * @param slug 博客的 slug
   */
  const autoGetData = useCallback(async (lang: Locale, slug: string) => {
    // 假设 getBlogDetailsApi(slug) 返回的是一个 blogDetails 对象
    const res = await getBlogDetails(slug,lang);
      updateLangBlogDetails(res.data.data, lang);
    
  }, [updateLangBlogDetails]);

  /**
   * 从缓存数据中获取指定博客的详情
   * @param lang 语言代码
   * @param name 要匹配的博客标题
   * @returns 匹配的 blogDetails 对象，如果未找到则返回 undefined
   */
  const getBlogDetailsFromCache = useCallback((lang: Locale, name: string) => {
    if (!langBlogDataState) return null;

    const blogDetailsForLang = langBlogDataState[lang as keyof typeof langBlogDataState];

    if (!blogDetailsForLang) {
      return null;
    }

    return blogDetailsForLang.find((item: blogDetails) => item.title === name);
  }, [langBlogDataState]);

  return {
    LangBlogDetails: langBlogDataState,
    updateLanguage,
    clearLanguageData,
    autoGetData,
    updateLangBlogDetails,
    getBlogDetailsFromCache,
  };
};

