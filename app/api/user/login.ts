import api from '../index'
export const login = async (username: string, password: string) => {
    try {
        const response = await api.post('/login', { username, password });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
}

//  刷新 token
export const refreshToken = async (refreshToken: string) => {
    try {
        const response = await api.post('/refresh', { refreshToken });
        return response.data;
    } catch (error) {
        throw new Error('Token refresh failed');
    }
}

// Google OAuth 登录，将 Google token 传给后端获取 JWT
export const googleLogin = async (googleToken: string, userInfo?: any) => {
    try {
        console.log('Google Token:', googleToken);
        const response = await api.post('/auth/google', { 
            token: googleToken,
            userInfo 
        });
        console.log('Backend response:', response.data);
        return response.data;
    } catch (error) {
        throw new Error('Google login failed');
    }
}

// 验证 JWT token
export const refresh_JWT  = async (token: string) => {
    try {
        const response = await api.post('/jwt', { token });
        return response.data;
    } catch (error) {
        throw new Error('JWT validation failed');
    }
}