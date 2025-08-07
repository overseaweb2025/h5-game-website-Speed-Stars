# 路由跳转语言问题修复指南

## 问题分析

之前的路由跳转问题主要由以下原因造成：

1. **语言检测逻辑过于简单** - 中间件仅基于 Accept-Language 头部的粗略检查
2. **状态不一致** - 各组件之间的语言状态可能不同步
3. **缺乏防护机制** - 没有验证路径语言的正确性
4. **Cookie管理缺失** - 用户语言偏好未持久化存储

## 修复方案

### 1. 增强中间件语言检测 (`middleware.ts`)

**优化前：**
```typescript
// 过于简单的检测
if (acceptLanguage.includes('zh')) {
  return 'zh';
}
```

**优化后：**
```typescript
// 多层级优先级检测
function getLocale(request: NextRequest) {
  // 1. URL 查询参数 (?lang=zh)
  // 2. Cookie 偏好设置
  // 3. 完整的 Accept-Language 解析
  // 4. 默认语言降级
}
```

### 2. 全局语言状态管理器 (`lib/language-state-manager.ts`)

**核心功能：**
- 统一的语言状态管理
- Cookie 自动持久化
- 状态变更监听
- 路径构建工具

**使用示例：**
```typescript
import { LanguageStateManager } from '@/lib/language-state-manager'

// 获取当前语言
const currentLang = LanguageStateManager.getCurrentLanguage()

// 切换语言
LanguageStateManager.setCurrentLanguage('zh')

// 构建语言路径
const path = LanguageStateManager.buildLanguagePath('/games')

// 订阅语言变更
const unsubscribe = LanguageStateManager.subscribe((lang) => {
  console.log('Language changed to:', lang)
})
```

### 3. 路由防护系统 (`lib/router-guard.ts`)

**核心功能：**
- 路径验证和修复
- 安全的路由跳转
- 错误降级处理
- 批量路径处理

**使用示例：**
```typescript
import { RouterGuard, useSafeRouter } from '@/lib/router-guard'

// 直接使用类方法
const safePath = RouterGuard.validateAndFixPath('/en/games') // 自动修复为当前语言
RouterGuard.safeNavigate('/games') // 安全跳转

// React Hook 方式
const router = useSafeRouter()
router.toGameDetail('game-slug') // 自动使用正确语言
router.createSafeHref('/games') // 创建安全链接
```

### 4. 优化语言选择器 (`components/LanguageSelector.tsx`)

**主要改进：**
- 集成语言状态管理器
- 自动 Cookie 设置
- 错误处理机制
- 路径验证

## 修复后的优势

### ✅ 语言检测准确性
- **多层优先级**：URL参数 > Cookie > Accept-Language > 默认
- **完整解析**：支持 zh-CN, zh-TW 等复杂语言标识
- **质量权重**：按 Accept-Language 的 q 值排序

### ✅ 状态一致性
- **全局状态**：所有组件共享统一语言状态
- **自动同步**：状态变更自动通知所有监听器
- **持久化**：Cookie 自动管理，30天有效期

### ✅ 路由安全性
- **路径验证**：自动检查和修复错误路径
- **错误处理**：完整的降级处理机制
- **类型安全**：完整的 TypeScript 类型定义

### ✅ 用户体验
- **记忆偏好**：用户选择的语言自动记住
- **快速切换**：使用 replace 避免历史记录堆积
- **平滑跳转**：减少不必要的重定向

## 使用建议

### 1. 组件中使用安全路由

**推荐做法：**
```typescript
import { useSafeRouter } from '@/lib/router-guard'

export function GameCard({ game }) {
  const router = useSafeRouter()
  
  const handleClick = () => {
    router.toGameDetail(game.slug) // 自动使用正确语言
  }
  
  return (
    <a href={router.createSafeHref(`/game/${game.slug}`)} onClick={handleClick}>
      {game.title}
    </a>
  )
}
```

### 2. 页面组件中添加路由防护

```typescript
import { useRouterGuard } from '@/lib/router-guard'

export default function GamePage() {
  useRouterGuard() // 自动检查和修复路径
  
  return <div>Game content</div>
}
```

### 3. 服务器端组件中的处理

```typescript
export default async function Page({ params }) {
  const lang = params.lang || 'en'
  
  // 验证语言有效性
  if (!['en', 'zh', 'ru', 'es', 'vi', 'hi', 'fr', 'tl', 'ja', 'ko'].includes(lang)) {
    notFound()
  }
  
  return <div>Content for {lang}</div>
}
```

## 测试验证

### 自动化测试
- ✅ 中间件语言检测准确性
- ✅ 状态管理器功能完整性  
- ✅ 路由防护系统有效性
- ✅ Cookie 持久化机制

### 用户场景测试
- ✅ 首次访问语言检测
- ✅ 手动切换语言
- ✅ 浏览器后退/前进
- ✅ 直接访问带语言路径
- ✅ 访问错误语言路径的修复

## 监控和调试

**控制台日志：**
- `[LanguageStateManager]` - 语言状态变更
- `[RouterGuard]` - 路径修复和跳转
- `[LanguageSelector]` - 语言选择操作
- `[ISR Middleware]` - 中间件处理

**Chrome DevTools：**
- Application > Cookies > `preferred-language`
- Network > Headers > `Accept-Language`
- Console > 语言相关日志

## 迁移指导

### 替换旧的路由跳转代码

**旧代码：**
```typescript
import { JumpRouter } from '@/lib/router'
JumpRouter('/games') // 可能跳转到错误语言
```

**新代码：**
```typescript
import { useSafeRouter } from '@/lib/router-guard'
const router = useSafeRouter()
router.toAllGames() // 自动使用正确语言
```

### 更新链接组件

**旧代码：**
```jsx
<Link href={`/${lang}/games`}>Games</Link>
```

**新代码：**
```jsx
<Link href={router.createSafeHref('/games')}>Games</Link>
```

---

## 总结

通过这套完整的修复方案，现在可以：
1. **准确检测用户语言偏好**
2. **防止跳转到错误语言路径**  
3. **确保全站语言状态一致**
4. **提供平滑的多语言体验**

系统现在具备完善的容错和恢复机制，即使出现异常情况也能自动修复到正确状态。