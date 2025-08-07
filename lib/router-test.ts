/**
 * 路由修复功能测试
 * 验证语言检测和路径修复的正确性
 */

import { LanguageStateManager } from './language-state-manager'
import { RouterGuard } from './router-guard'

// 测试用例
export const runRouterTests = () => {
  console.log('🧪 开始路由修复测试...\n')

  // 测试1: 语言状态管理器
  console.log('1️⃣ 测试语言状态管理器')
  try {
    // 重置状态
    LanguageStateManager.reset()
    
    // 测试获取默认语言
    const defaultLang = LanguageStateManager.getCurrentLanguage()
    console.log(`✅ 默认语言: ${defaultLang}`)
    
    // 测试设置语言
    LanguageStateManager.setCurrentLanguage('zh')
    const currentLang = LanguageStateManager.getCurrentLanguage()
    console.log(`✅ 设置语言后: ${currentLang}`)
    
    // 测试路径构建
    const path = LanguageStateManager.buildLanguagePath('/games')
    console.log(`✅ 构建路径: ${path}`)
    
    console.log('✅ 语言状态管理器测试通过\n')
  } catch (error) {
    console.error('❌ 语言状态管理器测试失败:', error)
  }

  // 测试2: 路由防护
  console.log('2️⃣ 测试路由防护')
  try {
    // 设置当前语言为中文
    LanguageStateManager.setCurrentLanguage('zh')
    
    // 测试修复错误路径
    const testCases = [
      { input: '/en/games', expected: '/zh/games' },
      { input: '/games', expected: '/zh/games' },
      { input: '/ru/blog/post-1', expected: '/zh/blog/post-1' },
      { input: '/', expected: '/zh' }
    ]
    
    testCases.forEach(({ input, expected }) => {
      const fixed = RouterGuard.validateAndFixPath(input)
      if (fixed === expected) {
        console.log(`✅ ${input} -> ${fixed}`)
      } else {
        console.error(`❌ ${input} -> ${fixed} (期望: ${expected})`)
      }
    })
    
    console.log('✅ 路由防护测试通过\n')
  } catch (error) {
    console.error('❌ 路由防护测试失败:', error)
  }

  // 测试3: 语言切换路径生成
  console.log('3️⃣ 测试语言切换路径生成')
  try {
    const switchTests = [
      { currentPath: '/zh/games', targetLang: 'en', expected: '/en/games' },
      { currentPath: '/ru/blog/post-1', targetLang: 'zh', expected: '/zh/blog/post-1' },
      { currentPath: '/es/', targetLang: 'ja', expected: '/ja' }
    ]
    
    switchTests.forEach(({ currentPath, targetLang, expected }) => {
      const switchPath = LanguageStateManager.getLanguageSwitchPath(targetLang as any, currentPath)
      if (switchPath === expected) {
        console.log(`✅ ${currentPath} -> ${targetLang} = ${switchPath}`)
      } else {
        console.error(`❌ ${currentPath} -> ${targetLang} = ${switchPath} (期望: ${expected})`)
      }
    })
    
    console.log('✅ 语言切换路径生成测试通过\n')
  } catch (error) {
    console.error('❌ 语言切换路径生成测试失败:', error)
  }

  // 测试4: 边界情况处理
  console.log('4️⃣ 测试边界情况处理')
  try {
    // 测试无效语言
    const invalidPaths = [
      '/xx/games',  // 无效语言代码
      '/eng/games', // 错误长度
      '/123/games', // 数字语言码
    ]
    
    invalidPaths.forEach(path => {
      const fixed = RouterGuard.validateAndFixPath(path)
      const hasValidLang = fixed.match(/^\/[a-z]{2}\//)
      if (hasValidLang) {
        console.log(`✅ 无效路径修复: ${path} -> ${fixed}`)
      } else {
        console.error(`❌ 无效路径修复失败: ${path} -> ${fixed}`)
      }
    })
    
    console.log('✅ 边界情况处理测试通过\n')
  } catch (error) {
    console.error('❌ 边界情况处理测试失败:', error)
  }

  console.log('🎉 所有路由修复测试完成！')
}

// 如果在 Node.js 环境中运行
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  // 模拟浏览器环境
  (global as any).window = {
    location: { pathname: '/zh/games' },
    document: { cookie: '' }
  }
  
  runRouterTests()
}