/**
 * API 错误处理测试工具
 * 用于测试和验证 500 错误的处理机制
 */

import { APIUtils } from './api-health-checker'
import { safeErrorLog, getUserFriendlyErrorMessage, filterError } from './error-filter'

// 模拟500错误
export const simulate500Error = () => {
  const mockError = {
    response: {
      status: 500,
      data: { message: 'Internal Server Error' }
    },
    config: {
      url: '/api/v1/navigation'
    },
    isAxiosError: true
  }
  
  return mockError
}

// 模拟网络错误
export const simulateNetworkError = () => {
  const mockError = {
    code: 'NETWORK_ERROR',
    message: 'Network connection failed',
    config: {
      url: '/api/v1/navigation'
    },
    isAxiosError: true
  }
  
  return mockError
}

// 测试错误处理功能
export const testErrorHandling = () => {
  console.log('🧪 开始API错误处理测试...\n')
  
  // 测试1: 500错误过滤
  console.log('1️⃣ 测试500错误过滤')
  const error500 = simulate500Error()
  const filtered500 = filterError(error500)
  console.log('500错误过滤结果:', {
    isBackendError: filtered500.isBackendError,
    isServerError: filtered500.isServerError,
    isRetryableError: filtered500.isRetryableError
  })
  
  const shouldShow500 = safeErrorLog(error500, 'Test500')
  console.log('500错误是否显示给用户:', shouldShow500)
  
  const message500 = getUserFriendlyErrorMessage(error500, 'zh')
  console.log('500错误用户提示:', message500)
  console.log('')
  
  // 测试2: 网络错误过滤
  console.log('2️⃣ 测试网络错误过滤')
  const networkError = simulateNetworkError()
  const filteredNetwork = filterError(networkError)
  console.log('网络错误过滤结果:', {
    isBackendError: filteredNetwork.isBackendError,
    isNetworkError: filteredNetwork.isNetworkError,
    isRetryableError: filteredNetwork.isRetryableError
  })
  
  const shouldShowNetwork = safeErrorLog(networkError, 'TestNetwork')
  console.log('网络错误是否显示给用户:', shouldShowNetwork)
  
  const messageNetwork = getUserFriendlyErrorMessage(networkError, 'zh')
  console.log('网络错误用户提示:', messageNetwork)
  console.log('')
  
  // 测试3: API健康检查器
  console.log('3️⃣ 测试API健康检查器')
  APIUtils.HealthChecker.recordFailure(error500)
  APIUtils.HealthChecker.recordFailure(error500)
  APIUtils.HealthChecker.recordFailure(error500)
  
  const healthStatus = APIUtils.HealthChecker.getHealthStatus()
  console.log('API健康状态:', healthStatus)
  
  const shouldUseFallback = APIUtils.HealthChecker.shouldUseFallback()
  console.log('是否使用降级数据:', shouldUseFallback)
  console.log('')
  
  // 测试4: 降级数据提供
  console.log('4️⃣ 测试降级数据提供')
  const fallbackGameList = APIUtils.FallbackDataProvider.getFallbackGameList('zh')
  console.log('降级游戏列表数据:', fallbackGameList.length > 0 ? '✅ 可用' : '❌ 不可用')
  
  const fallbackNav = APIUtils.FallbackDataProvider.getFallbackNavigation('zh')
  console.log('降级导航数据:', fallbackNav.top_navigation.length > 0 ? '✅ 可用' : '❌ 不可用')
  
  const fallbackHome = APIUtils.FallbackDataProvider.getFallbackHomeData('zh')
  console.log('降级首页数据:', fallbackHome.title ? '✅ 可用' : '❌ 不可用')
  console.log('')
  
  console.log('🎉 API错误处理测试完成！')
}

// 在开发环境中自动运行测试
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 延迟执行，避免阻塞页面加载
  setTimeout(() => {
    testErrorHandling()
  }, 2000)
}