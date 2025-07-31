"use client"

import { SessionProvider, useSession, signOut } from "next-auth/react"
import type { Session } from "next-auth"
import { useEffect, useState, useRef } from "react"
import { token_tool } from "@/lib/utils"
import { GoogleLogin } from '@/app/api/types'
import { googleLogin } from '@/app/api/user/login'
import { toast } from '@/lib/ui_tool'

// Component to handle token-based authentication
function TokenManager() {
  const { data: session, status } = useSession()
  const [initialized, setInitialized] = useState(false)
  const processedSessionRef = useRef<string | null>(null)

  useEffect(() => {
    // 只在status确定后执行一次
    if (status === "loading") return

    // 使用session ID避免重复处理同一个session
    const sessionId = session?.user?.email || 'anonymous'
    
    if (!initialized && processedSessionRef.current !== sessionId) {
      
      if(status === "authenticated" && session?.user) {
        // 如果用户已登录，尝试获取并设置token
        const token = token_tool.getToken()
        if (token) {
          // Token already exists
        } else {
          //如果登录了第三方 但是发现没有 token 就去我们的服务器上去获取token
          const userInfo: GoogleLogin = {
            name: session.user.name || '',
            email: session.user.email || '',
            provider_name: 'google',
            provider_id: session.user.id || ''
          }
          
          // 防止重复API调用
          googleLogin(userInfo).then(res=>{
            // 如果登录成功，保存token
            if(res.data.code === 200) {
              token_tool.saveToken(res.data.data.token)
              // 只在第一次成功获取token时显示欢迎提示
              if (processedSessionRef.current !== sessionId) {
                toast.welcome(session.user.name || 'User')
              }
            }
          }).catch(error => {
            // 只在真正的登录失败时显示错误，避免路由切换时重复显示
            if (processedSessionRef.current !== sessionId) {
              toast.error('Login failed, please try again')
            }
          })
        }
      } else if (status === "unauthenticated") {
        // 如果用户未登录，清除token（但不显示错误提示，因为可能是正常的未登录状态）
        const existingToken = token_tool.getToken()
        if (existingToken) {
          token_tool.clearToken()
        }
      }
      
      processedSessionRef.current = sessionId
      setInitialized(true)
    }
  }, [session, status, initialized])

  return null
}

// Auth status checker component


interface ProvidersProps {
  children: React.ReactNode
  session?: Session | null
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <TokenManager />
      {children}
    </SessionProvider>
  )
}