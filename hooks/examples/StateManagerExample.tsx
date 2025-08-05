import React, { useEffect, useState } from 'react';
import { useStateManager } from '../useStateManager';

const StateManagerExample: React.FC = () => {
  const stateManager = useStateManager();
  const [selectedGameId, setSelectedGameId] = useState<number>(1);
  const [gameSlugToDelete, setGameSlugToDelete] = useState<string>('speed-stars');
  const [blogSlugToDelete, setBlogSlugToDelete] = useState<string>('example-blog');

  useEffect(() => {
    // 组件挂载时检查初始化状态
    const initStatus = stateManager.getInitializationStatus();
    console.log('Initialization Status:', initStatus);
  }, [stateManager]);

  // Game相关操作示例
  const handleGameOperations = () => {
    const { game } = stateManager;
    
    console.log('All Games:', game.getAllGames());
    console.log('Game Data Loading:', game.gameData.loading);
    console.log('Game Categories:', game.gameData.categoriesWithGames);
  };

  // User相关操作示例
  const handleUserOperations = async () => {
    const { user } = stateManager;
    
    console.log('Is Authenticated:', user.isAuthenticated());
    console.log('User ID:', user.getUserId());
    
    if (user.isAuthenticated()) {
      console.log('User Profile:', user.userProfile.profile);
      console.log('Favorite Games:', user.userProfile.favoriteGames);
      console.log('Game History:', user.userProfile.gameHistory);
    }
  };

  // 切换游戏收藏状态
  const handleToggleFavorite = async () => {
    const { user } = stateManager;
    
    if (user.isAuthenticated()) {
      try {
        await user.toggleGameFavorite(selectedGameId);
        console.log(`Toggled favorite for game ${selectedGameId}`);
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
      }
    } else {
      console.log('User not authenticated');
    }
  };

  // 刷新所有数据
  const handleRefreshAll = async () => {
    try {
      await stateManager.refreshAllData();
      console.log('All data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // 清除所有缓存
  const handleClearCache = () => {
    stateManager.clearAllCache();
    console.log('All cache cleared');
  };

  // 获取特定游戏详情
  const handleGetGameDetails = async () => {
    const { game } = stateManager;
    
    try {
      const gameDetails = await game.getGameBySlug('speed-stars');
      console.log('Game Details:', gameDetails);
    } catch (error) {
      console.error('Failed to get game details:', error);
    }
  };

  // 删除指定游戏
  const handleDeleteGame = async () => {
    if (!gameSlugToDelete.trim()) {
      alert('请输入要删除的游戏slug');
      return;
    }

    const confirmed = confirm(`确定要删除游戏 "${gameSlugToDelete}" 及其所有相关数据吗？\n\n这将删除：\n- 游戏详情缓存\n- 游戏历史记录\n- 用户收藏记录\n- 本地存储数据\n- 相关的网站数据\n\n此操作不可撤销！`);
    
    if (confirmed) {
      try {
        await stateManager.deleteGameAndAllRelatedData(gameSlugToDelete);
        alert(`游戏 "${gameSlugToDelete}" 删除成功！`);
      } catch (error) {
        console.error('删除游戏失败:', error);
        alert(`删除游戏失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  };

  // 删除指定博客
  const handleDeleteBlog = async () => {
    if (!blogSlugToDelete.trim()) {
      alert('请输入要删除的博客slug');
      return;
    }

    const confirmed = confirm(`确定要删除博客 "${blogSlugToDelete}" 及其所有相关数据吗？\n\n这将删除：\n- 博客文章缓存\n- 博客评论数据\n- 用户评论历史\n- 本地存储数据\n- 搜索索引\n- SEO数据\n\n此操作不可撤销！`);
    
    if (confirmed) {
      try {
        await stateManager.deleteBlogAndAllRelatedData(blogSlugToDelete);
        alert(`博客 "${blogSlugToDelete}" 删除成功！`);
      } catch (error) {
        console.error('删除博客失败:', error);
        alert(`删除博客失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  };

  // Website相关操作
  const handleWebsiteOperations = () => {
    const { website } = stateManager;
    
    console.log('Website Data:', website.websiteData.websiteData);
    console.log('Website Loading:', website.websiteData.loading);
    
    if (website.websiteData.websiteData) {
      console.log('Website Info Available');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">统一状态管理器示例</h1>
      
      {/* 状态显示区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Game状态 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Game 状态</h2>
          <div className="space-y-2 text-sm">
            <div><strong>游戏数量:</strong> {stateManager.game.gameData.allGames.length}</div>
            <div><strong>加载状态:</strong> {stateManager.game.gameData.loading ? '加载中' : '已完成'}</div>
            <div><strong>分类数量:</strong> {stateManager.game.gameData.categoriesWithGames.length}</div>
            <div><strong>游戏历史:</strong> {stateManager.game.gameHistory.history?.length || 0} 条</div>
          </div>
        </div>

        {/* User状态 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">User 状态</h2>
          <div className="space-y-2 text-sm">
            <div><strong>认证状态:</strong> {stateManager.user.isAuthenticated() ? '已登录' : '未登录'}</div>
            <div><strong>用户ID:</strong> {stateManager.user.getUserId() || '无'}</div>
            <div><strong>收藏游戏:</strong> {stateManager.user.userProfile.favoriteGames?.length || 0} 个</div>
            <div><strong>评论数量:</strong> {stateManager.user.userProfile.commentHistory?.length || 0} 条</div>
          </div>
        </div>

        {/* Website状态 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Website 状态</h2>
          <div className="space-y-2 text-sm">
            <div><strong>网站数据:</strong> {stateManager.website.websiteData.websiteData ? '已加载' : '未加载'}</div>
            <div><strong>加载状态:</strong> {stateManager.website.websiteData.loading ? '加载中' : '已完成'}</div>
            <div><strong>错误信息:</strong> {stateManager.website.websiteData.error || '无'}</div>
          </div>
        </div>

        {/* 初始化状态 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">初始化状态</h2>
          <div className="space-y-2 text-sm">
            {Object.entries(stateManager.getInitializationStatus()).map(([key, status]) => (
              <div key={key}>
                <strong>{key}:</strong> 
                <span className={status ? 'text-green-600' : 'text-red-600'}>
                  {status ? ' ✓ 已初始化' : ' ✗ 未初始化'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 操作按钮区域 */}
      <div className="space-y-6">
        {/* Game操作 */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Game 操作</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGameOperations}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              查看游戏数据
            </button>
            <button
              onClick={handleGetGameDetails}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              获取游戏详情
            </button>
            <button
              onClick={() => stateManager.game.refreshAllGameData()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              刷新游戏数据
            </button>
            <button
              onClick={() => stateManager.game.clearAllGameCache()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              清除游戏缓存
            </button>
          </div>
        </div>

        {/* User操作 */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">User 操作</h3>
          <div className="flex flex-wrap gap-3 mb-3">
            <button
              onClick={handleUserOperations}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              查看用户数据
            </button>
            <button
              onClick={() => stateManager.user.refreshUserData()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              刷新用户数据
            </button>
            <button
              onClick={() => stateManager.user.clearUserCache()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              清除用户缓存
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm">游戏ID:</label>
            <input
              type="number"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(Number(e.target.value))}
              className="px-2 py-1 border rounded w-20"
              min="1"
            />
            <button
              onClick={handleToggleFavorite}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              disabled={!stateManager.user.isAuthenticated()}
            >
              切换收藏
            </button>
          </div>
        </div>

        {/* Website操作 */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Website 操作</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleWebsiteOperations}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              查看网站数据
            </button>
            <button
              onClick={() => stateManager.website.refreshWebsiteData()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              刷新网站数据
            </button>
            <button
              onClick={() => stateManager.website.clearWebsiteCache()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              清除网站缓存
            </button>
          </div>
        </div>

        {/* 删除操作 */}
        <div className="border rounded-lg p-4 border-red-200">
          <h3 className="text-lg font-semibold mb-3 text-red-600">🗑️ 删除操作 (危险操作)</h3>
          
          {/* 删除游戏 */}
          <div className="mb-4 p-3 bg-red-50 rounded">
            <h4 className="font-medium mb-2 text-red-800">删除游戏及所有相关数据</h4>
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm text-red-700">游戏Slug:</label>
              <input
                type="text"
                value={gameSlugToDelete}
                onChange={(e) => setGameSlugToDelete(e.target.value)}
                className="px-3 py-1 border border-red-300 rounded flex-1 max-w-xs"
                placeholder="如: speed-stars"
              />
              <button
                onClick={handleDeleteGame}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
              >
                删除游戏
              </button>
            </div>
            <p className="text-xs text-red-600">
              将删除：游戏详情、历史记录、用户收藏、缓存数据等
            </p>
          </div>

          {/* 删除博客 */}
          <div className="p-3 bg-red-50 rounded">
            <h4 className="font-medium mb-2 text-red-800">删除博客及所有相关数据</h4>
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm text-red-700">博客Slug:</label>
              <input
                type="text"
                value={blogSlugToDelete}
                onChange={(e) => setBlogSlugToDelete(e.target.value)}
                className="px-3 py-1 border border-red-300 rounded flex-1 max-w-xs"
                placeholder="如: example-blog"
              />
              <button
                onClick={handleDeleteBlog}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
              >
                删除博客
              </button>
            </div>
            <p className="text-xs text-red-600">
              将删除：博客文章、评论、用户评论历史、SEO数据等
            </p>
          </div>
        </div>

        {/* 全局操作 */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">全局操作</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefreshAll}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            >
              刷新所有数据
            </button>
            <button
              onClick={handleClearCache}
              className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
            >
              清除所有缓存
            </button>
            <button
              onClick={() => console.log('Is Initialized:', stateManager.isInitialized())}
              className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold"
            >
              检查初始化状态
            </button>
          </div>
        </div>
      </div>

      {/* 调试信息 */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">调试信息</h3>
        <p className="text-sm text-gray-600">
          打开浏览器控制台查看详细的操作日志和数据输出。
        </p>
      </div>
    </div>
  );
};

export default StateManagerExample;