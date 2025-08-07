let toastModule: any = null


const loadToast = async () => {
  if (!toastModule && typeof window !== 'undefined') {
    try {
      toastModule = await import('react-hot-toast')
    } catch (error) {
      // Failed to load react-hot-toast - silently handled
    }
  }
  return toastModule
}

// 定义允许显示toast的类型
type AllowedToastType = 'login' | 'games' | 'blog'

// 检查是否应该显示toast
const shouldShowToast = (category?: AllowedToastType): boolean => {
  if (!category) return false
  return ['login', 'games', 'blog'].includes(category)
}

// Simple toast function that uses react-hot-toast with custom styling
const showToast = async (message: string, type: 'success' | 'error' = 'error', category?: AllowedToastType) => {
  // 只处理登录和games/blog数据获取的toast
  if (!shouldShowToast(category)) {
    return // 静默忽略其他类型的toast
  }

  if (typeof window !== 'undefined') {
    const toast = await loadToast()
    if (toast) {
      if (type === 'success') {
        toast.default.success(message, {
          duration: 4000,
          style: {
            background: '#10B981', // Green-500
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: '16px',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 10px 25px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
            border: 'none',
            minWidth: '300px',
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#10B981',
          },
        })
      } else {
        toast.default.error(message, {
          duration: 4000,
          style: {
            background: '#EF4444', // Red-500
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: '16px',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 10px 25px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
            border: 'none',
            minWidth: '300px',
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#EF4444',
          },
        })
      }
    } else {
      // Toast fallback - silently handled
    }
  } else {
    // Server-side toast fallback - silently handled
  }
}
// 创建欢迎消息的专用函数
const createWelcomeMessage = (userName: string) => {
  return `Welcome back, ${userName}! 🎮`
}

// 主要显示的方法 - 只处理登录和games/blog数据获取
export const toast = {
  success: (message: string, category?: AllowedToastType) => showToast(message, 'success', category),
  error: (message: string, category?: AllowedToastType) => showToast(message, 'error', category),
  welcome: (userName: string) => showToast(createWelcomeMessage(userName), 'success', 'login'),
  // 专用方法，确保使用正确的类型
  login: {
    success: (message: string) => showToast(message, 'success', 'login'),
    error: (message: string) => showToast(message, 'error', 'login'),
    welcome: (userName: string) => showToast(createWelcomeMessage(userName), 'success', 'login'),
  },
  games: {
    success: (message: string) => showToast(message, 'success', 'games'),
    error: (message: string) => showToast(message, 'error', 'games'),
  },
  blog: {
    success: (message: string) => showToast(message, 'success', 'blog'),
    error: (message: string) => showToast(message, 'error', 'blog'),
  }
}