
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import { token_tool } from '@/lib/utils'
import { toast } from '@/lib/ui_tool'

// 本地服务器API地址 - Always use proxy to avoid CORS issues
const NEXT_API_URL = '/api/proxy'

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: NEXT_API_URL,
    timeout: 15000, // 增加超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false, // 关闭凭据发送以避免预检复杂化
    // 不在客户端设置 CORS 头，这应该由服务器处理
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 在服务端环境中不使用localStorage，因为它只在客户端可用
      // Request config logging removed for production
      
      // 使用代理处理所有请求
      if (config.baseURL === '/api/proxy') {
        // 验证基础 API URL
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://www.xingnengyun.com'
        const configUrl = config.url || ''
        
        // 确保 URL 格式正确
        let originalUrl: string
        try {
          // 构建完整的目标 URL，包括查询参数
          originalUrl = `${baseApiUrl}${configUrl}`
          
          // 如果有 params，添加到 URL 中
          if (config.params && typeof config.params === 'object') {
            // 过滤掉 undefined 或 null 值
            const cleanParams = Object.fromEntries(
              Object.entries(config.params).filter(([_, value]) => 
                value !== undefined && value !== null && value !== ''
              )
            )
            
            if (Object.keys(cleanParams).length > 0) {
              const urlParams = new URLSearchParams(cleanParams)
              originalUrl += `?${urlParams.toString()}`
            }
            config.params = undefined // 清除原始参数，避免重复添加
          }
          
          // 验证构建的 URL 是否有效
          new URL(originalUrl)
          
          config.url = `?url=${encodeURIComponent(originalUrl)}`
        } catch (error) {
          console.error('Invalid URL construction:', {
            baseApiUrl,
            configUrl,
            originalUrl: originalUrl || 'undefined',
            params: config.params,
            error: error instanceof Error ? error.message : error
          })
          
          // 使用安全的默认URL
          const fallbackUrl = `${baseApiUrl}/api/v1/game/list`
          config.url = `?url=${encodeURIComponent(fallbackUrl)}`
        }
      }
      
      // 只处理认证相关的请求头 - 检查原始URL而不是代理后的URL
      const isAuthRequest = config.url?.includes('/api/v1/auth') || 
                           (config.baseURL === '/api/proxy' && config.url?.includes('api%2Fv1%2Fauth'))
      
      if (config.method?.toLowerCase() === 'post' && !isAuthRequest) {
        const token = token_tool.getToken()
        if (token) {
          config.headers.Authorization = `${token_tool.getTokenType()} ${token}`
        } else {
          // 没有token时提示用户未登录
          toast.error('User not logged in, please login first')
          return Promise.reject(new Error('User not logged in'))
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 成功响应处理
      if (response.data?.message) {
        toast.success(response.data.message)
      }
      return response
    },
    (error: AxiosError) => {
      // 错误响应处理
      let errorMessage = 'Request failed'
      
      if (error.response) {
        // 服务器响应错误
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            errorMessage = (data as any)?.message || 'Invalid request parameters'
            break
          case 401:
            errorMessage = 'Unauthorized access'
            // 401错误时自动删除存储的token并触发登出
            if (typeof window !== 'undefined') {
              token_tool.clearToken()
              toast.error('Login expired, please login again')
              
              // 触发NextAuth登出
              import('next-auth/react').then(({ signOut }) => {
                signOut({ callbackUrl: '/' })
              })
            }
            break
          case 403:
            errorMessage = 'Access forbidden'
            break
          case 404:
            errorMessage = 'Resource not found'
            break
          case 422:
            errorMessage = (data as any)?.message || 'Request data validation failed'
            // Validation error details logging removed for production
            break
          case 429:
            errorMessage = 'Frequent requests'
          case 500:
            errorMessage = 'Internal server error'
            break
          default:
            errorMessage = (data as any)?.message || `Request failed (${status})`
        }
      } else if (error.request) {
        // 网络错误或CORS错误
        if (error.message?.includes('CORS') || error.message?.includes('Cross-Origin')) {
          errorMessage = 'Cross-origin request blocked, please check server CORS configuration'
        } else {
          errorMessage = 'Network connection failed'
        }
      } else {
        // 其他错误
        if (error.message?.includes('CORS') || error.message?.includes('Cross-Origin')) {
          errorMessage = 'Cross-origin request failed'
        } else {
          errorMessage = error.message || 'Unknown error'
        }
      }
      
      toast.error(errorMessage)
      return Promise.reject(error)
    }
  )

  return instance
}

const api = createAxiosInstance()

export default api
export { NEXT_API_URL }