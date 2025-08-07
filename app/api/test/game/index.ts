// @/app/api/test/game/index.ts

import { Locale } from "@/lib/lang/dictionaraies";
import instance from "..";
import { ApiResponse } from "../../types";
import { GameDetails, gamelist, Game, HomeGameData } from "../../types/Get/game";

// 缓存系统
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();
const CACHE_DURATION = 60 * 1000; // 60秒缓存

// 生成缓存键
const getCacheKey = (endpoint: string, params: any) => {
  const paramString = JSON.stringify(params || {});
  return `${endpoint}:${paramString}`;
};

// 检查缓存是否有效
const isValidCache = (item: CacheItem<any>): boolean => {
  return Date.now() - item.timestamp < CACHE_DURATION;
};

// 获取缓存数据
const getCachedData = <T>(key: string): T | null => {
  const item = cache.get(key);
  if (item && isValidCache(item)) {
    console.log(`[Cache Hit] ${key}`);
    return item.data;
  }
  if (item) {
    cache.delete(key); // 清除过期缓存
  }
  return null;
};

// 设置缓存数据
const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`[Cache Set] ${key}`);
};

export const getGameDetails =  (name: string, lang: Locale = 'en') => {
    return instance.get<ApiResponse<GameDetails>>('/api/v1/game',{params:{
        name,
        lang
      }
    })
};

export const getGameList = (lang?:string) => {

  return instance.get<ApiResponse<gamelist>>('/api/v1/game/list',{
    params:{
      lang
    }
  });
}
//按类获取数据
export const getClassNameGames = (category:string,lang:string = 'en')=>{
  return instance.get<ApiResponse<Game[]>>('/api/v1/game/list',{
    params:{
    category,lang   
    }
  })
}

//获取首页得信息
export const getGameHome = (lang:string = 'en')=>{
  return instance.get<HomeGameData>('/api/v1/index/show',{
    params:{
      lang
    }
  })
}