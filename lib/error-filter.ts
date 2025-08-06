/**
 * 错误过滤工具
 * 用于过滤掉Unity WebGL等非后端API相关的错误
 * 确保toast和用户提示只显示真正的后端连接问题
 */

export interface FilteredError {
  isBackendError: boolean
  isUnityError: boolean
  isNetworkError: boolean
  originalError: any
}

/**
 * 检查错误是否为Unity WebGL相关错误
 */
export function isUnityRelatedError(error: any): boolean {
  if (!error) return false
  
  const errorString = error?.message || error?.toString?.() || ''
  const errorUrl = error?.config?.url || error?.request?.responseURL || ''
  
  // Unity WebGL 相关关键词
  const unityKeywords = [
    'unity',
    'webgl',
    'Unity',
    'WebGL',
    'unity-webgl-optimizer',
    'UnityLoader',
    'unity3d',
    'UnityEngine'
  ]
  
  return unityKeywords.some(keyword => 
    errorString.toLowerCase().includes(keyword.toLowerCase()) ||
    errorUrl.toLowerCase().includes(keyword.toLowerCase())
  )
}

/**
 * 检查错误是否为网络相关错误
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false
  
  const errorMessage = error?.message || error?.toString?.() || ''
  const networkKeywords = [
    'network error',
    'timeout',
    'failed to fetch',
    'connection refused',
    'no internet',
    'offline'
  ]
  
  return networkKeywords.some(keyword => 
    errorMessage.toLowerCase().includes(keyword.toLowerCase())
  ) || error?.code === 'NETWORK_ERROR'
}

/**
 * 检查错误是否为后端API相关错误
 */
export function isBackendAPIError(error: any): boolean {
  if (!error) return false
  
  // 如果是Unity错误，肯定不是后端API错误
  if (isUnityRelatedError(error)) return false
  
  // 检查是否有HTTP状态码（通常表示后端API响应）
  if (error?.response?.status || error?.status) return true
  
  // 检查是否是axios错误
  if (error?.isAxiosError && !isUnityRelatedError(error)) return true
  
  // 检查URL是否包含API端点
  const url = error?.config?.url || error?.request?.responseURL || ''
  if (url && url.includes('/api/')) return true
  
  return false
}

/**
 * 综合错误过滤函数
 */
export function filterError(error: any): FilteredError {
  return {
    isBackendError: isBackendAPIError(error),
    isUnityError: isUnityRelatedError(error),
    isNetworkError: isNetworkError(error),
    originalError: error
  }
}

/**
 * 安全的错误日志记录
 * Unity错误只在开发环境记录，后端错误始终记录
 */
export function safeErrorLog(error: any, context: string = '') {
  const filtered = filterError(error)
  
  if (filtered.isBackendError) {
    console.error(`[${context}] Backend API Error:`, error)
    return true // 返回true表示应该显示给用户
  } else if (filtered.isUnityError) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[${context}] Unity WebGL Error (filtered):`, error)
    }
    return false // 返回false表示不应该显示给用户
  } else if (filtered.isNetworkError) {
    console.error(`[${context}] Network Error:`, error)
    return true // 网络错误应该显示给用户
  } else {
    console.error(`[${context}] Unknown Error:`, error)
    return true // 未知错误默认显示给用户
  }
}