import { useCallback, useMemo } from 'react';

// Game相关hooks
import { useGameData } from './useGameData';
import { useGameDetails } from './useGameDetails';
import { useGameHistory } from './useGameHistory';
import { useGamePlayTracker } from './useGamePlayTracker';
import { useGamePageTimer } from './useGamePageTimer';
import { useHomeGameData } from './useHomeGameData';

// User相关hooks
import { useAuth } from './use-auth';
import { useUserProfile } from './useUserProfile';

// Website相关hooks
import { useWebsiteData } from './useWebsiteData';

// 其他hooks
import { useCategorySEO } from './useCategorySEO';

// Game管理器接口
export interface GameStateManager {
  // 游戏数据管理
  gameData: ReturnType<typeof useGameData>;
  gameDetails: ReturnType<typeof useGameDetails>;
  gameHistory: ReturnType<typeof useGameHistory>;
  gamePlayTracker: ReturnType<typeof useGamePlayTracker>;
  homeGameData: ReturnType<typeof useHomeGameData>;
  
  // 游戏页面计时器（需要参数，所以提供创建函数）
  createGamePageTimer: (options: Parameters<typeof useGamePageTimer>[0]) => ReturnType<typeof useGamePageTimer>;
  
  // 操作方法
  refreshAllGameData: () => Promise<void>;
  clearAllGameCache: () => void;
  deleteGameAndRelatedData: (gameSlug: string) => Promise<void>;
  
  // 便捷方法
  getAllGames: () => ReturnType<typeof useGameData>['allGames'];
  getGameBySlug: (slug: string) => Promise<any>;
  isGameFavorited: (gameId: number) => boolean;
}

// User管理器接口
export interface UserStateManager {
  // 认证管理
  auth: ReturnType<typeof useAuth>;
  
  // 用户资料管理
  userProfile: ReturnType<typeof useUserProfile>;
  
  // 操作方法
  refreshUserData: () => Promise<void>;
  clearUserCache: () => void;
  
  // 便捷方法
  isAuthenticated: () => boolean;
  getUserId: () => string;
  toggleGameFavorite: (gameId: number) => Promise<void>;
}

// Blog管理器接口（目前没有具体的blog hooks，预留接口）
export interface BlogStateManager {
  // 博客数据（预留）
  // blogData: any;
  // blogPosts: any;
  
  // 操作方法（预留）
  refreshBlogData: () => Promise<void>;
  clearBlogCache: () => void;
  deleteBlogAndRelatedData: (blogSlug: string) => Promise<void>;
  
  // 便捷方法（预留）
  // getAllPosts: () => any[];
  // getPostBySlug: (slug: string) => any;
}

// 网站数据管理器接口
export interface WebsiteStateManager {
  websiteData: ReturnType<typeof useWebsiteData>;
  categorySEO: ReturnType<typeof useCategorySEO>;
  
  // 操作方法
  refreshWebsiteData: () => void;
  clearWebsiteCache: () => void;
}

// 统一状态管理器接口
export interface UnifiedStateManager {
  // 各个领域的状态管理器
  game: GameStateManager;
  user: UserStateManager;
  blog: BlogStateManager;
  website: WebsiteStateManager;
  
  // 全局操作
  refreshAllData: () => Promise<void>;
  clearAllCache: () => void;
  
  // 全局删除操作
  deleteGameAndAllRelatedData: (gameSlug: string) => Promise<void>;
  deleteBlogAndAllRelatedData: (blogSlug: string) => Promise<void>;
  
  // 状态检查
  isInitialized: () => boolean;
  getInitializationStatus: () => {
    game: boolean;
    user: boolean;
    blog: boolean;
    website: boolean;
  };
}

// 游戏状态管理器实现
const createGameStateManager = (): GameStateManager => {
  const gameData = useGameData();
  const gameDetails = useGameDetails();
  const gameHistory = useGameHistory();
  const gamePlayTracker = useGamePlayTracker();
  const homeGameData = useHomeGameData();

  const refreshAllGameData = useCallback(async () => {
    // 刷新游戏数据
    if (gameData.refresh) {
      gameData.refresh();
    }
    
    // 清除游戏详情缓存
    if (gameDetails.clearAllCache) {
      gameDetails.clearAllCache();
    }
    
    // 刷新首页游戏数据
    if (homeGameData.refreshData) {
      await homeGameData.refreshData();
    }
  }, [gameData, gameDetails, homeGameData]);

  const clearAllGameCache = useCallback(() => {
    // 清除游戏详情缓存
    if (gameDetails.clearAllCache) {
      gameDetails.clearAllCache();
    }
    
    // 清除首页游戏缓存
    if (homeGameData.clearCache) {
      homeGameData.clearCache();
    }
    
    // 清除游戏历史
    if (gameHistory.clearHistory) {
      gameHistory.clearHistory();
    }

    // 清除本地存储中的游戏相关数据
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('game') || key.startsWith('play')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [gameDetails, homeGameData, gameHistory]);

  const getAllGames = useCallback(() => {
    return gameData.allGames;
  }, [gameData.allGames]);

  const getGameBySlug = useCallback(async (slug: string) => {
    if (gameDetails.getGameDetails) {
      return await gameDetails.getGameDetails(slug);
    }
    return null;
  }, [gameDetails]);

  const isGameFavorited = useCallback((gameId: number) => {
    // 这里需要从用户状态管理器获取，暂时返回false
    return false;
  }, []);

  const createGamePageTimer = useCallback((options: Parameters<typeof useGamePageTimer>[0]) => {
    return useGamePageTimer(options);
  }, []);

  // 删除指定游戏及其相关数据
  const deleteGameAndRelatedData = useCallback(async (gameSlug: string) => {
    try {
      console.log(`开始删除游戏: ${gameSlug} 及其相关数据`);

      // 1. 清除游戏详情缓存
      if (gameDetails.clearGameCache) {
        gameDetails.clearGameCache(gameSlug);
        console.log(`已清除游戏 ${gameSlug} 的详情缓存`);
      }

      // 2. 从游戏历史中移除该游戏
      if (gameHistory.removeGame) {
        gameHistory.removeGame(gameSlug);
        console.log(`已从游戏历史中移除 ${gameSlug}`);
      }

      // 3. 停止该游戏的追踪（如果正在追踪）
      if (gamePlayTracker.gameInfo?.name === gameSlug || gamePlayTracker.gameInfo?.id === gameSlug) {
        gamePlayTracker.resetTracking();
        console.log(`已停止游戏 ${gameSlug} 的追踪`);
      }

      // 4. 清除本地存储中该游戏的相关数据
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        const gameKeys = keys.filter(key => 
          key.includes(gameSlug) || 
          key.includes(`game_${gameSlug}`) ||
          key.includes(`gameDetails_${gameSlug}`) ||
          key.includes(`gameHistory_${gameSlug}`) ||
          key.includes(`gameTimer_${gameSlug}`) ||
          key.includes(`gamePlay_${gameSlug}`)
        );
        
        gameKeys.forEach(key => {
          localStorage.removeItem(key);
          console.log(`已清除本地存储: ${key}`);
        });
      }

      // 5. 刷新游戏数据以反映删除操作
      if (gameData.refresh) {
        gameData.refresh();
        console.log('已刷新游戏数据');
      }

      // 6. 刷新首页游戏数据
      if (homeGameData.refreshData) {
        await homeGameData.refreshData();
        console.log('已刷新首页游戏数据');
      }

      console.log(`成功删除游戏 ${gameSlug} 及其所有相关数据`);

    } catch (error) {
      console.error(`删除游戏 ${gameSlug} 时发生错误:`, error);
      throw new Error(`删除游戏失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [gameData, gameDetails, gameHistory, gamePlayTracker, homeGameData]);

  return {
    gameData,
    gameDetails,
    gameHistory,
    gamePlayTracker,
    homeGameData,
    createGamePageTimer,
    refreshAllGameData,
    clearAllGameCache,
    deleteGameAndRelatedData,
    getAllGames,
    getGameBySlug,
    isGameFavorited
  };
};

// 用户状态管理器实现
const createUserStateManager = (): UserStateManager => {
  const auth = useAuth();
  const userProfile = useUserProfile();

  const refreshUserData = useCallback(async () => {
    if (userProfile.refreshProfile) {
      await userProfile.refreshProfile();
    }
    
    if (userProfile.loadGameHistory) {
      await userProfile.loadGameHistory();
    }
    
    if (userProfile.loadFavoriteGames) {
      await userProfile.loadFavoriteGames();
    }
    
    if (userProfile.loadCommentHistory) {
      await userProfile.loadCommentHistory();
    }
  }, [userProfile]);

  const clearUserCache = useCallback(() => {
    if (auth.clearAuth) {
      auth.clearAuth();
    }
    
    // 清除用户相关的本地存储
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('user') || key.startsWith('profile') || key.startsWith('auth')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [auth]);

  const isAuthenticated = useCallback(() => {
    return auth.isAuthenticated;
  }, [auth.isAuthenticated]);

  const getUserId = useCallback(() => {
    return auth.session?.user?.id || auth.session?.user?.email || '';
  }, [auth.session]);

  const toggleGameFavorite = useCallback(async (gameId: number) => {
    if (userProfile.toggleFavoriteGame) {
      await userProfile.toggleFavoriteGame(gameId);
    }
  }, [userProfile]);

  return {
    auth,
    userProfile,
    refreshUserData,
    clearUserCache,
    isAuthenticated,
    getUserId,
    toggleGameFavorite
  };
};

// 博客状态管理器实现（预留）
const createBlogStateManager = (): BlogStateManager => {
  const refreshBlogData = useCallback(async () => {
    // 预留：刷新博客数据
    console.log('Blog data refresh - not implemented yet');
  }, []);

  const clearBlogCache = useCallback(() => {
    // 预留：清除博客缓存
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('blog') || key.startsWith('post')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);

  // 删除指定博客及其相关数据
  const deleteBlogAndRelatedData = useCallback(async (blogSlug: string) => {
    try {
      console.log(`开始删除博客: ${blogSlug} 及其相关数据`);

      // 1. 清除博客文章缓存（预留实现）
      // if (blogPosts.clearPostCache) {
      //   blogPosts.clearPostCache(blogSlug);
      //   console.log(`已清除博客 ${blogSlug} 的文章缓存`);
      // }

      // 2. 清除博客评论（预留实现）
      // if (blogComments.clearPostComments) {
      //   blogComments.clearPostComments(blogSlug);
      //   console.log(`已清除博客 ${blogSlug} 的评论`);
      // }

      // 3. 清除本地存储中该博客的相关数据
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        const blogKeys = keys.filter(key => 
          key.includes(blogSlug) || 
          key.includes(`blog_${blogSlug}`) ||
          key.includes(`blogPost_${blogSlug}`) ||
          key.includes(`blogComments_${blogSlug}`) ||
          key.includes(`blogDetails_${blogSlug}`) ||
          key.includes(`post_${blogSlug}`)
        );
        
        blogKeys.forEach(key => {
          localStorage.removeItem(key);
          console.log(`已清除本地存储: ${key}`);
        });
      }

      // 4. 从搜索索引中移除（预留实现）
      // if (searchIndex.removeFromIndex) {
      //   searchIndex.removeFromIndex(blogSlug, 'blog');
      //   console.log(`已从搜索索引中移除博客 ${blogSlug}`);
      // }

      // 5. 清除相关的SEO数据（预留实现）
      // if (seoManager.clearBlogSEO) {
      //   seoManager.clearBlogSEO(blogSlug);
      //   console.log(`已清除博客 ${blogSlug} 的SEO数据`);
      // }

      // 6. 刷新博客列表数据（预留实现）
      await refreshBlogData();
      console.log('已刷新博客列表数据');

      // 7. 通知其他相关模块（预留实现）
      // 例如：更新网站地图、更新RSS feed等
      // if (sitemapManager.updateSitemap) {
      //   await sitemapManager.updateSitemap();
      //   console.log('已更新网站地图');
      // }

      console.log(`成功删除博客 ${blogSlug} 及其所有相关数据`);

    } catch (error) {
      console.error(`删除博客 ${blogSlug} 时发生错误:`, error);
      throw new Error(`删除博客失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [refreshBlogData]);

  return {
    refreshBlogData,
    clearBlogCache,
    deleteBlogAndRelatedData
  };
};

// 网站数据管理器实现
const createWebsiteStateManager = (): WebsiteStateManager => {
  const websiteData = useWebsiteData();
  const categorySEO = useCategorySEO();

  const refreshWebsiteData = useCallback(() => {
    if (websiteData.refreshData) {
      websiteData.refreshData();
    }
  }, [websiteData]);

  const clearWebsiteCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('website') || key.startsWith('seo')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);

  return {
    websiteData,
    categorySEO,
    refreshWebsiteData,
    clearWebsiteCache
  };
};

// 主要的统一状态管理器Hook
export const useStateManager = (): UnifiedStateManager => {
  // 创建各个子管理器
  const game = createGameStateManager();
  const user = createUserStateManager();
  const blog = createBlogStateManager();
  const website = createWebsiteStateManager();

  // 全局刷新所有数据
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.allSettled([
        game.refreshAllGameData(),
        user.refreshUserData(),
        blog.refreshBlogData(),
        website.refreshWebsiteData()
      ]);
    } catch (error) {
      console.error('Failed to refresh all data:', error);
    }
  }, [game, user, blog, website]);

  // 清除所有缓存
  const clearAllCache = useCallback(() => {
    try {
      game.clearAllGameCache();
      user.clearUserCache();
      blog.clearBlogCache();
      website.clearWebsiteCache();
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    }
  }, [game, user, blog, website]);

  // 检查是否已初始化
  const isInitialized = useCallback(() => {
    return !!(
      game.gameData.data.length > 0 ||
      website.websiteData.websiteData ||
      user.auth.session
    );
  }, [game.gameData.data, website.websiteData.websiteData, user.auth.session]);

  // 获取初始化状态
  const getInitializationStatus = useCallback(() => {
    return {
      game: game.gameData.data.length > 0 && !game.gameData.loading,
      user: user.auth.isAuthenticated && !!user.userProfile.profile,
      blog: true, // 预留，目前总是true
      website: !!website.websiteData.websiteData && !website.websiteData.loading
    };
  }, [game, user, website]);

  // 全局删除游戏及所有相关数据（跨模块）
  const deleteGameAndAllRelatedData = useCallback(async (gameSlug: string) => {
    try {
      console.log(`开始全局删除游戏: ${gameSlug} 及其所有相关数据`);

      // 1. 调用游戏模块的删除方法
      await game.deleteGameAndRelatedData(gameSlug);

      // 2. 从用户收藏中移除（如果存在）
      if (user.isAuthenticated()) {
        try {
          // 尝试从用户收藏中移除该游戏
          const favoriteGames = user.userProfile.favoriteGames || [];
          const gameToRemove = favoriteGames.find(fav => 
            fav.gameName === gameSlug || 
            fav.gameDisplayName.toLowerCase().replace(/\s+/g, '-') === gameSlug
          );
          
          if (gameToRemove) {
            await user.toggleGameFavorite(gameToRemove.gameId);
            console.log(`已从用户收藏中移除游戏 ${gameSlug}`);
          }
        } catch (error) {
          console.warn(`从用户收藏中移除游戏 ${gameSlug} 时出现警告:`, error);
        }
      }

      // 3. 清除网站级别的相关数据（如搜索索引等）
      try {
        // 清除可能存在的网站级别缓存
        if (typeof window !== 'undefined') {
          const siteKeys = Object.keys(localStorage).filter(key =>
            key.includes('search') && key.includes(gameSlug) ||
            key.includes('sitemap') && key.includes(gameSlug) ||
            key.includes('recent') && key.includes(gameSlug)
          );
          
          siteKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`已清除网站级别缓存: ${key}`);
          });
        }
      } catch (error) {
        console.warn(`清除网站级别数据时出现警告:`, error);
      }

      // 4. 刷新网站数据以更新统计信息
      try {
        website.refreshWebsiteData();
        console.log('已刷新网站数据');
      } catch (error) {
        console.warn('刷新网站数据时出现警告:', error);
      }

      console.log(`全局删除游戏 ${gameSlug} 成功完成`);

    } catch (error) {
      console.error(`全局删除游戏 ${gameSlug} 时发生错误:`, error);
      throw new Error(`全局删除游戏失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [game, user, website]);

  // 全局删除博客及所有相关数据（跨模块）
  const deleteBlogAndAllRelatedData = useCallback(async (blogSlug: string) => {
    try {
      console.log(`开始全局删除博客: ${blogSlug} 及其所有相关数据`);

      // 1. 调用博客模块的删除方法
      await blog.deleteBlogAndRelatedData(blogSlug);

      // 2. 清除用户评论历史中的相关记录
      if (user.isAuthenticated()) {
        try {
          // 检查用户评论历史中是否有该博客的评论
          const commentHistory = user.userProfile.commentHistory || [];
          const hasCommentOnBlog = commentHistory.some(comment => 
            comment.gameName === blogSlug || 
            comment.gameDisplayName.toLowerCase().replace(/\s+/g, '-') === blogSlug
          );
          
          if (hasCommentOnBlog) {
            // 刷新用户评论历史
            await user.userProfile.loadCommentHistory();
            console.log(`已刷新用户评论历史，移除博客 ${blogSlug} 相关评论`);
          }
        } catch (error) {
          console.warn(`处理用户评论历史时出现警告:`, error);
        }
      }

      // 3. 清除网站级别的相关数据
      try {
        // 清除可能存在的网站级别缓存
        if (typeof window !== 'undefined') {
          const siteKeys = Object.keys(localStorage).filter(key =>
            key.includes('search') && key.includes(blogSlug) ||
            key.includes('sitemap') && key.includes(blogSlug) ||
            key.includes('recent') && key.includes(blogSlug) ||
            key.includes('rss') && key.includes(blogSlug)
          );
          
          siteKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`已清除网站级别缓存: ${key}`);
          });
        }
      } catch (error) {
        console.warn(`清除网站级别数据时出现警告:`, error);
      }

      // 4. 刷新网站数据以更新统计信息和SEO
      try {
        website.refreshWebsiteData();
        console.log('已刷新网站数据');
      } catch (error) {
        console.warn('刷新网站数据时出现警告:', error);
      }

      console.log(`全局删除博客 ${blogSlug} 成功完成`);

    } catch (error) {
      console.error(`全局删除博客 ${blogSlug} 时发生错误:`, error);
      throw new Error(`全局删除博客失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [blog, user, website]);

  return useMemo(() => ({
    game,
    user,
    blog,
    website,
    refreshAllData,
    clearAllCache,
    deleteGameAndAllRelatedData,
    deleteBlogAndAllRelatedData,
    isInitialized,
    getInitializationStatus
  }), [
    game,
    user,
    blog,
    website,
    refreshAllData,
    clearAllCache,
    deleteGameAndAllRelatedData,
    deleteBlogAndAllRelatedData,
    isInitialized,
    getInitializationStatus
  ]);
};

export default useStateManager;