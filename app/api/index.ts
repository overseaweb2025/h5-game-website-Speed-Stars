
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import { token_tool } from '@/lib/utils'

// 检测运行环境
const isServer = typeof window === 'undefined'

// 根据环境设置API地址
const getApiUrl = () => {
  if (isServer) {
    // 服务端直接使用外部API地址
    return process.env.NEXT_PUBLIC_API_URL || 'http://www.xingnengyun.com'
  }
  return '/api/proxy'
}

const NEXT_API_URL = getApiUrl()



const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: NEXT_API_URL,
    timeout: 20000, // 增加到20秒超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false, // 关闭凭据发送以避免预检复杂化
    // 添加重试配置
    validateStatus: function (status) {
      return status >= 200 && status < 300 // 默认
    },
    // 最大重定向次数
    maxRedirects: 5,
    // 不在客户端设置 CORS 头，这应该由服务器处理
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 在服务端环境中不使用localStorage，因为它只在客户端可用
      // Request config logging removed for production
      
      // 服务端环境直接调用外部API，客户端使用代理
      if (isServer) {
        // 服务端直接构建外部API URL
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://www.xingnengyun.com'
        const configUrl = config.url || ''
        
        // 构建完整的目标 URL
        let originalUrl: string
        try {
          originalUrl = `${baseApiUrl}${configUrl}`
          
          // 如果有 params，添加到 URL 中
          if (config.params && typeof config.params === 'object') {
            const cleanParams = Object.fromEntries(
              Object.entries(config.params).filter(([_, value]) => 
                value !== undefined && value !== null && value !== ''
              )
            )
            
            if (Object.keys(cleanParams).length > 0) {
              const urlParams = new URLSearchParams(cleanParams)
              originalUrl += `?${urlParams.toString()}`
            }
            config.params = undefined
          }
          
          // 验证URL
          new URL(originalUrl)
          
          // 服务端直接设置为外部API URL
          config.url = originalUrl
          config.baseURL = ''
        } catch (error) {
          console.error('Server URL construction failed:', error)
          const fallbackUrl = `${baseApiUrl}/api/v1/game/list`
          config.url = fallbackUrl
          config.baseURL = ''
        }
      } else {
        // 客户端使用代理
        if (config.baseURL === '/api/proxy') {
          const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://www.xingnengyun.com'
          const configUrl = config.url || ''
          
          let originalUrl: string
          try {
            originalUrl = `${baseApiUrl}${configUrl}`
            
            if (config.params && typeof config.params === 'object') {
              const cleanParams = Object.fromEntries(
                Object.entries(config.params).filter(([_, value]) => 
                  value !== undefined && value !== null && value !== ''
                )
              )
              
              if (Object.keys(cleanParams).length > 0) {
                const urlParams = new URLSearchParams(cleanParams)
                originalUrl += `?${urlParams.toString()}`
              }
              config.params = undefined
            }
            
            new URL(originalUrl)
            config.url = `?url=${encodeURIComponent(originalUrl)}`
          } catch (error) {
            console.error('Client URL construction failed:', error)
            const fallbackUrl = `${baseApiUrl}/api/v1/game/list`
            config.url = `?url=${encodeURIComponent(fallbackUrl)}`
          }
        }
      }
      
      // 只处理认证相关的请求头 - 检查原始URL而不是代理后的URL
      const isAuthRequest = config.url?.includes('/api/v1/auth') || 
                           (config.baseURL === '/api/proxy' && config.url?.includes('api%2Fv1%2Fauth'))
      
      if (config.method?.toLowerCase() === 'post' && !isAuthRequest) {
        // 只在客户端环境中处理token和toast
        if (!isServer) {
          const token = token_tool.getToken()
          if (token) {
            config.headers.Authorization = `${token_tool.getTokenType()} ${token}`
          } else {
            // 动态导入toast以避免服务端错误
            import('@/lib/ui_tool').then(({ toast }) => {
              toast.error('User not logged in, please login first')
            })
            return Promise.reject(new Error('User not logged in'))
          }
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
      // 成功响应处理 - 只在客户端显示toast
      if (response.data?.message && !isServer) {
        import('@/lib/ui_tool').then(({ toast }) => {
          toast.success(response.data.message)
        })
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
            // 401错误时自动删除存储的token并触发登出 - 只在客户端执行
            if (!isServer) {
              token_tool.clearToken()
              import('@/lib/ui_tool').then(({ toast }) => {
                toast.error('Login expired, please login again')
              })
              
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
            errorMessage = (data as any)?.message || 'Server internal error, please try again later'
            break
          case 502:
            errorMessage = 'Bad gateway, server is temporarily unavailable'
            break  
          case 503:
            errorMessage = 'Service unavailable, please try again later'
            break
          case 504:
            errorMessage = 'Gateway timeout, please try again later'
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
      
      // 只在客户端显示错误toast
      if (!isServer) {
        import('@/lib/ui_tool').then(({ toast }) => {
          toast.error(errorMessage)
        })
      }
      return Promise.reject(error)
    }
  )

  return instance
}

const api = createAxiosInstance()

export default api
export { NEXT_API_URL }