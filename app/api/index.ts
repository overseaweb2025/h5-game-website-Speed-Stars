
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import { token_tool } from '@/lib/utils'
import { toast } from '@/lib/ui_tool'

// 本地服务器API地址 - Use localhost for development
const NEXT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://www.xingnengyun.com'

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: NEXT_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 在服务端环境中不使用localStorage，因为它只在客户端可用
      console.log("Request config:", config.url)
        if (config.method?.toLowerCase() === 'post' && config.url !== '/api/v1/auth') {
          const token = token_tool.getToken()
          if (token) {
            config.headers.Authorization = `${token_tool.getTokenType()} ${token}`
          } else {
            // 没有token时提示用户未登录
            toast.error('用户未登录，请先登录')
            return Promise.reject(new Error('用户未登录'))
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
      let errorMessage = '请求失败'
      
      if (error.response) {
        // 服务器响应错误
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            errorMessage = (data as any)?.message || '请求参数错误'
            break
          case 401:
            errorMessage = '未授权访问'
            // 401错误时自动删除存储的token并触发登出
            if (typeof window !== 'undefined') {
              token_tool.clearToken()
              toast.error('登录已过期，请重新登录')
              
              // 触发NextAuth登出
              import('next-auth/react').then(({ signOut }) => {
                signOut({ callbackUrl: '/' })
              })
            }
            break
          case 403:
            errorMessage = '禁止访问'
            break
          case 404:
            errorMessage = '资源未找到'
            break
          case 500:
            errorMessage = '服务器内部错误'
            break
          default:
            errorMessage = (data as any)?.message || `请求失败 (${status})`
        }
      } else if (error.request) {
        // 网络错误
        errorMessage = '网络连接失败'
      } else {
        // 其他错误
        errorMessage = error.message || '未知错误'
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