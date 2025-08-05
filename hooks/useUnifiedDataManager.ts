import { useCallback, useMemo } from 'react';
import { useGameDetails } from './useGameDetails';
import { useGameHistory } from './useGameHistory';
import { useHomeGameData } from './useHomeGameData';
import { useWebsiteData } from './useWebsiteData';

export interface UnifiedDataManager {
  // 游戏详情管理
  gameDetails: ReturnType<typeof useGameDetails>;
  
  // 游戏历史管理
  gameHistory: ReturnType<typeof useGameHistory>;
  
  // 首页游戏数据管理
  homeGameData: ReturnType<typeof useHomeGameData>;
  
  // 网站数据管理
  websiteData: ReturnType<typeof useWebsiteData>;
  
  // 联动操作
  deleteGameAndRelatedData: (gameSlug: string) => Promise<void>;
  updateGameAndRefreshRelated: (gameSlug: string) => Promise<void>;
  
  // 全量数据更新
  refreshAllData: () => Promise<void>;
  
  // 数据清理
  clearAllCache: () => void;
}

export const useUnifiedDataManager = (gameSlug?: string): UnifiedDataManager => {
  const gameDetails = useGameDetails(gameSlug || '');
  const gameHistory = useGameHistory();
  const homeGameData = useHomeGameData();
  const websiteData = useWebsiteData();

  // 删除游戏及相关数据
  const deleteGameAndRelatedData = useCallback(async (targetGameSlug: string) => {
    try {
      // 清除游戏相关的本地存储
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`gameHistory_${targetGameSlug}`);
        localStorage.removeItem(`gameDetails_${targetGameSlug}`);
        localStorage.removeItem(`gameTimer_${targetGameSlug}`);
        localStorage.removeItem(`gamePlay_${targetGameSlug}`);
      }
      
      // 清除历史记录
      if (gameHistory.clearHistory) {
        gameHistory.clearHistory();
      }
      
      console.log(`Successfully deleted game ${targetGameSlug} and all related data`);
    } catch (error) {
      console.error(`Failed to delete game ${targetGameSlug} and related data:`, error);
      throw error;
    }
  }, [gameHistory]);

  // 更新游戏并刷新相关数据
  const updateGameAndRefreshRelated = useCallback(async (targetGameSlug: string) => {
    try {
      // 先删除旧缓存
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`gameDetails_${targetGameSlug}`);
        localStorage.removeItem(`gameHistory_${targetGameSlug}`);
      }
      
      // 清除游戏详情缓存并重新获取
      if (gameDetails.clearGameCache) {
        gameDetails.clearGameCache(targetGameSlug);
      }
      if (gameDetails.getGameDetails) {
        await gameDetails.getGameDetails(targetGameSlug);
      }
      
      // 刷新首页游戏数据
      if (homeGameData.refreshData) {
        await homeGameData.refreshData();
      }
      
      console.log(`Successfully updated game ${targetGameSlug} and refreshed related data`);
    } catch (error) {
      console.error(`Failed to update game ${targetGameSlug}:`, error);
      throw error;
    }
  }, [gameDetails, homeGameData]);

  // 刷新所有数据
  const refreshAllData = useCallback(async () => {
    try {
      // 清除所有缓存
      clearAllCache();
      
      // 刷新各个模块的数据
      if (gameDetails.clearAllCache) {
        gameDetails.clearAllCache();
      }
      
      if (homeGameData.refreshData) {
        await homeGameData.refreshData();
      }

      // 刷新网站数据
      if (websiteData.refreshData) {
        websiteData.refreshData();
      }
      
      console.log('Successfully refreshed all data');
    } catch (error) {
      console.error('Failed to refresh all data:', error);
      throw error;
    }
  }, [gameDetails, homeGameData]);

  // 清理所有缓存
  const clearAllCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      // 清除游戏相关缓存
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('game') || 
            key.startsWith('blog') || 
            key.startsWith('websiteData') ||
            key.startsWith('userProfile') ||
            key.startsWith('gamePlay')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('All cache cleared');
    }
  }, []);

  return useMemo(() => ({
    gameDetails,
    gameHistory,
    homeGameData,
    websiteData,
    deleteGameAndRelatedData,
    updateGameAndRefreshRelated,
    refreshAllData,
    clearAllCache
  }), [
    gameDetails,
    gameHistory,
    homeGameData,
    websiteData,
    deleteGameAndRelatedData,
    updateGameAndRefreshRelated,
    refreshAllData,
    clearAllCache
  ]);
};