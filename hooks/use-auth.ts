"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { token_tool } from "@/lib/utils"

export function useAuth() {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = token_tool.getToken()
      const hasToken = !!token
      
      setIsAuthenticated(hasToken)
      setIsLoading(false)
      
      console.log("🔍 Auth Status:", {
        hasToken,
        nextAuthStatus: status,
        isAuthenticated: hasToken
      })
    }

    // Check immediately
    checkAuthStatus()
    
    // Also check when session status changes
    if (status !== "loading") {
      checkAuthStatus()
    }
  }, [status])

  return {
    isAuthenticated,
    isLoading: status === "loading" || isLoading,
    session,
    token: token_tool.getToken(),
    // Helper functions
    hasValidToken: () => !!token_tool.getToken(),
    clearAuth: () => {
      token_tool.clearToken()
      setIsAuthenticated(false)
    }
  }
}

// Hook specifically for checking if user is logged in (based on token only)
export function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkToken = () => {
      const token = token_tool.getToken()
      setIsLoggedIn(!!token)
    }

    // Check immediately
    checkToken()
    
    // Remove the periodic check to prevent unnecessary API calls
    // Token changes will be handled by NextAuth session management
    
  }, [])

  return isLoggedIn
}