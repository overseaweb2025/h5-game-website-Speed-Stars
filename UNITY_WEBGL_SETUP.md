# Unity WebGL 游戏集成指南

本文档说明如何在项目中集成Unity WebGL游戏并解决常见问题。

## 🎯 已解决的问题

### 1. 权限策略错误
**问题**: Unity游戏尝试访问设备传感器时出现 `SecurityError: Failed to construct 'RelativeOrientationSensor'` 等错误。

**解决方案**:
- 在 `next.config.mjs` 中设置了全局权限策略
- 在 `layout.tsx` 中添加了HTTP权限策略头部
- 允许所有传感器访问: `accelerometer=*, gyroscope=*, magnetometer=*` 等

### 2. 音频上下文问题
**问题**: `The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.`

**解决方案**:
- 创建了 `GameErrorHandler` 组件自动检测音频问题
- 提供用户友好的音频激活界面
- 自动在用户交互后激活音频上下文

### 3. Unity过时函数警告
**问题**: `The JavaScript function 'Pointer_stringify(ptrToSomeCString)' is obsoleted`

**解决方案**:
- 在 `unity-webgl-optimizer.js` 中过滤这些警告
- 将过时函数警告转换为兼容性提示
- 不影响用户体验

### 4. Manifest.json 404错误
**问题**: 浏览器尝试加载不存在的manifest文件

**解决方案**:
- 确保 `public/manifest.json` 存在并正确配置
- 在 `layout.tsx` 中正确链接manifest文件

## 🛠️ 集成步骤

### 1. 使用游戏错误处理器

```tsx
import GameErrorHandler from '@/components/GameErrorHandler'

function GamePage() {
  return (
    <GameErrorHandler gameName="Speed Stars">
      {/* 你的游戏内容 */}
      <div id="unity-container">
        {/* Unity游戏容器 */}
      </div>
    </GameErrorHandler>
  )
}
```

### 2. 使用游戏加载器

```tsx
import GameLoader from '@/components/GameLoader'

function GamePage() {
  const [gameLoaded, setGameLoaded] = useState(false)

  return (
    <div className="relative w-full h-screen">
      {!gameLoaded && (
        <GameLoader
          gameName="Speed Stars"
          onLoad={() => setGameLoaded(true)}
          onError={(error) => console.error('Game load error:', error)}
        />
      )}
      
      {/* Unity游戏容器 */}
      <div id="unity-container" className={gameLoaded ? 'block' : 'hidden'}>
        {/* 游戏内容 */}
      </div>
    </div>
  )
}
```

### 3. Unity游戏事件监听

Unity优化脚本提供了以下自定义事件：

```javascript
// 音频激活完成
window.addEventListener('unity-audio-activated', () => {
  console.log('游戏音频已激活')
})

// WebGL优化完成
window.addEventListener('unity-webgl-optimized', () => {
  console.log('WebGL优化完成')
})

// FPS更新
window.addEventListener('unity-fps-update', (event) => {
  console.log('当前FPS:', event.detail.fps)
})

// 性能警告
window.addEventListener('unity-performance-warning', (event) => {
  console.log('性能警告:', event.detail.message)
})

// Unity错误
window.addEventListener('unity-error', (event) => {
  console.log('Unity错误:', event.detail.message)
})
```

## 🎮 最佳实践

### 1. 游戏容器设置

```css
#unity-container {
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

#unity-canvas {
  width: 100%;
  height: 100%;
  background: #232323;
}
```

### 2. 响应式设计

```tsx
// 检测设备类型
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// 根据设备调整游戏配置
const gameConfig = {
  width: isMobile ? window.innerWidth : 1024,
  height: isMobile ? window.innerHeight : 768,
  resizable: true
}
```

### 3. 内存管理

```javascript
// 页面卸载时清理资源
useEffect(() => {
  return () => {
    if (window.UnityOptimizer) {
      window.UnityOptimizer.cleanup()
    }
  }
}, [])
```

## 🔧 故障排除

### 常见问题及解决方案

1. **游戏无法加载**
   - 检查WebGL支持: 访问 https://get.webgl.org/
   - 确认浏览器版本支持WebGL 2.0
   - 检查网络连接和游戏文件路径

2. **音频无法播放**
   - 确保用户已经与页面交互
   - 使用 `GameErrorHandler` 自动处理音频激活
   - 检查浏览器音频策略设置

3. **性能问题**
   - 监听 `unity-fps-update` 事件
   - 在低性能设备上降低游戏质量设置
   - 考虑使用游戏内的性能调整选项

4. **移动设备问题**
   - 确保权限策略允许传感器访问
   - 测试触摸控制是否正常工作
   - 检查移动浏览器的兼容性

## 📱 移动设备支持

### iOS Safari
- 支持WebGL和音频
- 需要用户交互激活音频
- 支持设备传感器（需要HTTPS）

### Android Chrome
- 完整支持WebGL 2.0
- 自动音频激活支持
- 设备传感器需要权限策略

### 移动优化建议
1. 使用适当的画布尺寸
2. 优化触摸控制
3. 减少内存使用
4. 考虑网络带宽限制

## 🚀 性能优化

### 1. 预加载优化
- 使用 `GameLoader` 显示加载进度
- 预加载关键游戏资源
- 实现资源缓存策略

### 2. 运行时优化
- 监控FPS和内存使用
- 动态调整游戏质量
- 实现智能垃圾回收

### 3. 网络优化
- 压缩游戏资源
- 使用CDN加速
- 实现断线重连机制

---

通过以上配置和组件，你的Unity WebGL游戏应该能够在现代浏览器中稳定运行，并提供良好的用户体验。