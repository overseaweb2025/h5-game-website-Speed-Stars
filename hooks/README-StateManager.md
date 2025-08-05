# 统一状态管理器 (useStateManager)

## 概述

`useStateManager` 是一个统一的状态管理器，用于管理应用中所有相关的状态管理器的调用方法和使用。它将不同领域的hooks组织到一个统一的接口中，提供更好的可维护性和使用体验。

## 特性

- 🎮 **Game管理** - 统一管理游戏相关的所有状态
- 👤 **User管理** - 统一管理用户认证和资料相关状态  
- 📝 **Blog管理** - 预留博客相关状态管理接口
- 🌐 **Website管理** - 管理网站数据和SEO相关状态
- 🔄 **全局操作** - 提供跨领域的数据刷新和缓存清理
- 📊 **状态监控** - 实时监控各模块的初始化状态

## 架构结构

```
useStateManager
├── game          # 游戏状态管理器
├── user          # 用户状态管理器  
├── blog          # 博客状态管理器 (预留)
├── website       # 网站状态管理器
└── 全局操作       # 跨领域操作方法
```

## 基本使用

```tsx
import { useStateManager } from '@/hooks/useStateManager';

const MyComponent = () => {
  const stateManager = useStateManager();

  // 使用游戏状态
  const { game } = stateManager;
  console.log('所有游戏:', game.getAllGames());

  // 使用用户状态
  const { user } = stateManager;
  console.log('是否登录:', user.isAuthenticated());

  // 全局操作
  const handleRefreshAll = async () => {
    await stateManager.refreshAllData();
  };

  return (
    <div>
      {/* 您的组件内容 */}
    </div>
  );
};
```

## 详细API

### Game 状态管理器

#### 可用的hooks
- `gameData` - 游戏列表数据管理
- `gameDetails` - 游戏详情数据管理  
- `gameHistory` - 游戏历史记录管理
- `gamePlayTracker` - 游戏时长追踪
- `homeGameData` - 首页游戏数据管理

#### 方法
```tsx
const { game } = stateManager;

// 获取所有游戏
const allGames = game.getAllGames();

// 获取特定游戏详情
const gameDetails = await game.getGameBySlug('speed-stars');

// 检查游戏是否被收藏
const isFavorited = game.isGameFavorited(gameId);

// 创建游戏页面计时器
const timer = game.createGamePageTimer({
  gameInfo: { id: '1', name: 'speed-stars', slug: 'speed-stars' },
  threshold: 30
});

// 刷新所有游戏数据
await game.refreshAllGameData();

// 清除所有游戏缓存
game.clearAllGameCache();

// 删除指定游戏及其所有相关数据
await game.deleteGameAndRelatedData('speed-stars');
```

#### 可用数据
```tsx
// 游戏列表数据
game.gameData.allGames           // 所有游戏
game.gameData.categoriesWithGames // 有游戏的分类
game.gameData.loading            // 加载状态
game.gameData.error             // 错误信息

// 游戏历史
game.gameHistory.history        // 历史记录数组
game.gameHistory.stats          // 统计信息

// 游戏追踪
game.gamePlayTracker.isTracking // 是否正在追踪
game.gamePlayTracker.elapsedTime // 已追踪时间
```

### User 状态管理器

#### 可用的hooks
- `auth` - 用户认证状态管理
- `userProfile` - 用户资料管理

#### 方法
```tsx
const { user } = stateManager;

// 检查认证状态
const isLoggedIn = user.isAuthenticated();

// 获取用户ID
const userId = user.getUserId();

// 切换游戏收藏状态
await user.toggleGameFavorite(gameId);

// 刷新用户数据
await user.refreshUserData();

// 清除用户缓存
user.clearUserCache();
```

#### 可用数据
```tsx
// 认证信息
user.auth.isAuthenticated       // 是否已认证
user.auth.session              // 会话信息
user.auth.token                // 认证令牌

// 用户资料
user.userProfile.profile       // 用户资料
user.userProfile.favoriteGames // 收藏的游戏
user.userProfile.gameHistory   // 游戏历史
user.userProfile.commentHistory // 评论历史
```

### Website 状态管理器

#### 可用的hooks
- `websiteData` - 网站数据管理
- `categorySEO` - 分类SEO数据管理

#### 方法
```tsx
const { website } = stateManager;

// 刷新网站数据
website.refreshWebsiteData();

// 清除网站缓存
website.clearWebsiteCache();
```

#### 可用数据
```tsx
// 网站数据
website.websiteData.websiteData // 网站配置数据
website.websiteData.loading     // 加载状态
website.websiteData.error       // 错误信息

// SEO数据
website.categorySEO             // 分类SEO信息
```

### Blog 状态管理器 (预留)

```tsx
const { blog } = stateManager;

// 刷新博客数据
await blog.refreshBlogData();

// 清除博客缓存
blog.clearBlogCache();

// 删除指定博客及其所有相关数据
await blog.deleteBlogAndRelatedData('example-blog');
```

### 全局操作

#### 数据刷新
```tsx
// 刷新所有数据
await stateManager.refreshAllData();

// 刷新特定领域数据
await stateManager.game.refreshAllGameData();
await stateManager.user.refreshUserData();
await stateManager.website.refreshWebsiteData();
```

#### 缓存管理
```tsx
// 清除所有缓存
stateManager.clearAllCache();

// 清除特定领域缓存
stateManager.game.clearAllGameCache();
stateManager.user.clearUserCache();
stateManager.website.clearWebsiteCache();
```

#### 全局删除操作
```tsx
// 删除游戏及所有跨模块相关数据
await stateManager.deleteGameAndAllRelatedData('speed-stars');

// 删除博客及所有跨模块相关数据
await stateManager.deleteBlogAndAllRelatedData('example-blog');
```

**删除操作说明:**
- `deleteGameAndAllRelatedData()` - 跨模块删除游戏数据，包括游戏详情、用户收藏、历史记录、缓存等
- `deleteBlogAndAllRelatedData()` - 跨模块删除博客数据，包括文章、评论、用户评论历史、SEO数据等
- 这些是危险操作，会永久删除数据，使用时需要谨慎

#### 状态检查
```tsx
// 检查是否已初始化
const isReady = stateManager.isInitialized();

// 获取详细初始化状态
const initStatus = stateManager.getInitializationStatus();
// 返回: { game: boolean, user: boolean, blog: boolean, website: boolean }
```

## 使用场景

### 1. 页面初始化
```tsx
const MyPage = () => {
  const stateManager = useStateManager();

  useEffect(() => {
    // 检查初始化状态
    const initStatus = stateManager.getInitializationStatus();
    
    if (!initStatus.game) {
      // 如果游戏数据未初始化，刷新游戏数据
      stateManager.game.refreshAllGameData();
    }
    
    if (!initStatus.user && stateManager.user.isAuthenticated()) {
      // 如果用户已登录但数据未初始化，刷新用户数据
      stateManager.user.refreshUserData();
    }
  }, []);

  return <div>我的页面</div>;
};
```

### 2. 用户登录后刷新数据
```tsx
const LoginHandler = () => {
  const stateManager = useStateManager();

  const handleLoginSuccess = async () => {
    // 用户登录成功后，刷新相关数据
    await Promise.all([
      stateManager.user.refreshUserData(),
      stateManager.game.refreshAllGameData() // 刷新游戏数据以获取用户相关信息
    ]);
  };

  return (
    <button onClick={handleLoginSuccess}>
      登录成功处理
    </button>
  );
};
```

### 3. 游戏页面集成
```tsx
const GamePage = ({ gameSlug }: { gameSlug: string }) => {
  const stateManager = useStateManager();

  useEffect(() => {
    // 获取游戏详情
    stateManager.game.getGameBySlug(gameSlug);
    
    // 如果用户已登录，检查收藏状态
    if (stateManager.user.isAuthenticated()) {
      // 可以检查游戏收藏状态等
    }
  }, [gameSlug]);

  const handleToggleFavorite = async (gameId: number) => {
    if (stateManager.user.isAuthenticated()) {
      await stateManager.user.toggleGameFavorite(gameId);
    }
  };

  return (
    <div>
      {/* 游戏页面内容 */}
    </div>
  );
};
```

### 4. 管理面板/调试工具
```tsx
const AdminPanel = () => {
  const stateManager = useStateManager();

  const handleClearAllCache = () => {
    if (confirm('确定要清除所有缓存吗？')) {
      stateManager.clearAllCache();
      alert('缓存已清除');
    }
  };

  const handleRefreshAllData = async () => {
    try {
      await stateManager.refreshAllData();
      alert('数据刷新成功');
    } catch (error) {
      alert('数据刷新失败');
    }
  };

  const handleDeleteGame = async (gameSlug: string) => {
    const confirmed = confirm(
      `确定要删除游戏 "${gameSlug}" 及其所有相关数据吗？\n\n` +
      '这将删除：\n' +
      '- 游戏详情缓存\n' +
      '- 游戏历史记录\n' +
      '- 用户收藏记录\n' +
      '- 本地存储数据\n' +
      '- 相关的网站数据\n\n' +
      '此操作不可撤销！'
    );
    
    if (confirmed) {
      try {
        await stateManager.deleteGameAndAllRelatedData(gameSlug);
        alert(`游戏 "${gameSlug}" 删除成功！`);
      } catch (error) {
        alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  };

  return (
    <div>
      <button onClick={handleClearAllCache}>清除所有缓存</button>
      <button onClick={handleRefreshAllData}>刷新所有数据</button>
      <button onClick={() => handleDeleteGame('speed-stars')}>删除游戏</button>
    </div>
  );
};
```

### 5. 内容管理系统集成
```tsx
const ContentManager = () => {
  const stateManager = useStateManager();

  // 删除游戏内容
  const handleDeleteGameContent = async (gameSlug: string) => {
    try {
      // 执行跨模块删除
      await stateManager.deleteGameAndAllRelatedData(gameSlug);
      
      // 可以添加其他业务逻辑，如通知其他服务
      console.log(`游戏 ${gameSlug} 已从系统中完全移除`);
      
    } catch (error) {
      console.error('删除游戏内容失败:', error);
    }
  };

  // 删除博客内容
  const handleDeleteBlogContent = async (blogSlug: string) => {
    try {
      // 执行跨模块删除
      await stateManager.deleteBlogAndAllRelatedData(blogSlug);
      
      console.log(`博客 ${blogSlug} 已从系统中完全移除`);
      
    } catch (error) {
      console.error('删除博客内容失败:', error);
    }
  };

  return (
    <div>
      {/* 内容管理界面 */}
    </div>
  );
};
```

## 最佳实践

### 1. 错误处理
```tsx
const MyComponent = () => {
  const stateManager = useStateManager();

  const handleOperation = async () => {
    try {
      await stateManager.refreshAllData();
    } catch (error) {
      console.error('操作失败:', error);
      // 处理错误
    }
  };
};
```

### 2. 性能优化
```tsx
const MyComponent = () => {
  const stateManager = useStateManager();

  // 只在需要时获取数据，避免不必要的重复请求
  const gameData = useMemo(() => {
    return stateManager.game.getAllGames();
  }, [stateManager.game.gameData.data]);

  return <div>{/* 使用 gameData */}</div>;
};
```

### 3. 条件性数据加载
```tsx
const UserDashboard = () => {
  const stateManager = useStateManager();

  useEffect(() => {
    // 只有在用户登录时才加载用户相关数据
    if (stateManager.user.isAuthenticated()) {
      stateManager.user.refreshUserData();
    }
  }, [stateManager.user.auth.isAuthenticated]);

  if (!stateManager.user.isAuthenticated()) {
    return <LoginPrompt />;
  }

  return <UserContent />;
};
```

## 注意事项

1. **内存管理**: 统一状态管理器会同时维护多个hook的状态，注意在不需要时适当清理缓存
2. **性能考虑**: 避免在组件的每次渲染中都调用刷新方法
3. **错误处理**: 各个子管理器的操作都可能失败，需要适当的错误处理
4. **认证状态**: 某些操作需要用户登录，使用前先检查认证状态
5. **数据同步**: 不同管理器之间的数据可能存在关联，注意保持数据一致性

## 扩展说明

### 添加新的状态管理器

如果需要添加新的领域状态管理器，请按照以下步骤：

1. 在对应的接口中添加新的hook引用
2. 在创建函数中实现相关逻辑
3. 更新主要的`useStateManager` hook
4. 添加相应的文档和示例

### Blog管理器实现

当博客相关的hooks可用时，可以按照以下方式实现：

```tsx
// 添加blog相关的hooks导入
import { useBlogPosts } from './useBlogPosts';
import { useBlogComments } from './useBlogComments';

// 更新BlogStateManager接口
export interface BlogStateManager {
  blogPosts: ReturnType<typeof useBlogPosts>;
  blogComments: ReturnType<typeof useBlogComments>;
  // ... 其他方法
}

// 实现createBlogStateManager函数
const createBlogStateManager = (): BlogStateManager => {
  const blogPosts = useBlogPosts();
  const blogComments = useBlogComments();
  
  // ... 实现逻辑
  
  return {
    blogPosts,
    blogComments,
    // ... 其他方法
  };
};
```

这样的设计确保了状态管理器的可扩展性和维护性。