import api from '..'
import {GoogleLogin} from '@/app/api/types'
export const login = async (username: string, password: string) => {
    try {
        const response = await api.post('/login', { username, password });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
}

// Google OAuth 登录，将 Google token 传给后端获取 JWT
export const googleLogin = async (userInfo?: GoogleLogin) => {
  return await api.post('/api/v1/auth', userInfo);
}
// 自动登录
export const autoLogin = async () => {
    // 这里的token 是在拦截器里面配置的
    return await api.post('/api/v1/auth/auto-login');
}