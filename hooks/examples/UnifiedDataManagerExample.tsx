import React from 'react';
import { useUnifiedDataManager } from '../useUnifiedDataManager';

const UnifiedDataManagerExample: React.FC = () => {
  const dataManager = useUnifiedDataManager();

  // 删除游戏及相关数据的示例
  const handleDeleteGame = async (gameSlug: string) => {
    try {
      await dataManager.deleteGameAndRelatedData(gameSlug);
      console.log(`游戏 ${gameSlug} 及相关数据已删除`);
    } catch (error) {
      console.error('删除游戏失败:', error);
    }
  };

  // 更新游戏并刷新相关数据的示例
  const handleUpdateGame = async (gameSlug: string) => {
    try {
      await dataManager.updateGameAndRefreshRelated(gameSlug);
      console.log(`游戏 ${gameSlug} 已更新并刷新相关数据`);
    } catch (error) {
      console.error('更新游戏失败:', error);
    }
  };

  // 刷新所有数据的示例
  const handleRefreshAllData = async () => {
    try {
      await dataManager.refreshAllData();
      console.log('所有数据已刷新');
    } catch (error) {
      console.error('刷新数据失败:', error);
    }
  };

  // 清除所有缓存的示例
  const handleClearAllCache = () => {
    dataManager.clearAllCache();
    console.log('所有缓存已清除');
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">统一数据管理器示例</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 游戏管理 */}
        <div className="border p-4 rounded col-span-2">
          <h3 className="text-lg font-semibold mb-2">游戏管理</h3>
          <button 
            onClick={() => handleDeleteGame('example-game')}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2 mb-2"
          >
            删除游戏及相关数据
          </button>
          <button 
            onClick={() => handleUpdateGame('example-game')}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          >
            更新游戏并刷新
          </button>
        </div>

        {/* 全局操作 */}
        <div className="border p-4 rounded col-span-2">
          <h3 className="text-lg font-semibold mb-2">全局操作</h3>
          <button 
            onClick={handleRefreshAllData}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            刷新所有数据
          </button>
          <button 
            onClick={handleClearAllCache}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            清除所有缓存
          </button>
        </div>
      </div>

      {/* 数据状态显示 */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">数据状态</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <strong>游戏详情状态:</strong> {dataManager.gameDetails.isLoading ? '加载中' : '已加载'}
          </div>
          <div>
            <strong>游戏历史:</strong> {dataManager.gameHistory.history?.length || 0} 条记录
          </div>
          <div>
            <strong>首页游戏数据:</strong> {dataManager.homeGameData.loading ? '加载中' : '已加载'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDataManagerExample;