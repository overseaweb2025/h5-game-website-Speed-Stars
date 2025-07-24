
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import toast from 'react-hot-toast'

const NEXT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: NEXT_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 可以在这里添加认证token等
      // const token = localStorage.getItem('token')
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }
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