import { clsx, type ClassValue } from "clsx"
import Cookies from "js-cookie"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const token_tool = {
  saveToken: (token: string, tokenType: string = "Bearer") => {
    const now = new Date().getTime();
    
    Cookies.set('token', token, { path: '/', expires: 1, sameSite: 'Lax' });
    Cookies.set('token_type', tokenType, { path: '/', expires: 1, sameSite: 'Lax' });
    Cookies.set('login_timestamp', now.toString(), { path: '/', expires: 1, sameSite: 'Lax' });
    
    console.log("✅ Token saved with timestamp:", new Date(now));
  },
  
  getToken: () => {
    return Cookies.get('token') || null;
  },
  
  getTokenType: () => {
    return Cookies.get('token_type') || 'Bearer';
  },
  
  getLoginTimestamp: () => {
    const timestamp = Cookies.get('login_timestamp');
    return timestamp ? parseInt(timestamp) : null;
  },
  
  clearToken: () => {
    Cookies.remove('token');
    Cookies.remove('token_type');
    Cookies.remove('login_timestamp');
    console.log("✅ All tokens and timestamp cleared");
  },
  
  // 检查是否需要刷新token（超过3小时）
  shouldRefreshToken: () => {
    const loginTime = token_tool.getLoginTimestamp();
    if (!loginTime) return false;
    
    const now = new Date().getTime();
    const threeHours = 3 * 60 * 60 * 1000; // 3小时的毫秒数
    const timeDiff = now - loginTime;
    
    console.log("🔍 Token age check:", {
      loginTime: new Date(loginTime),
      now: new Date(now),
      timeDiff: Math.round(timeDiff / 1000 / 60) + " minutes",
      shouldRefresh: timeDiff > threeHours
    });
    
    return timeDiff > threeHours;
  }
}