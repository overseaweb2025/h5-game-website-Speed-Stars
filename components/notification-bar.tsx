'use client'

import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted'
const CONSENT_EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000 // 1个月 (30天)

// 检查cookie同意状态是否过期
function isCookieConsentExpired(): boolean {
  if (typeof window === 'undefined') return true
  
  try {
    const consentData = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consentData) return true
    
    const { timestamp } = JSON.parse(consentData)
    return Date.now() - timestamp > CONSENT_EXPIRY_TIME
  } catch (error) {
    console.error('[NotificationBar] Failed to check consent expiry:', error)
    return true
  }
}

// 获取cookie同意状态
function getCookieConsentStatus(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const consentData = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consentData || isCookieConsentExpired()) return false
    
    const { accepted } = JSON.parse(consentData)
    return accepted === true
  } catch (error) {
    console.error('[NotificationBar] Failed to get consent status:', error)
    return false
  }
}

// 设置cookie同意状态
function setCookieConsentStatus(accepted: boolean) {
  if (typeof window === 'undefined') return
  
  try {
    const consentData = {
      accepted,
      timestamp: Date.now()
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData))
  } catch (error) {
    console.error('[NotificationBar] Failed to save consent status:', error)
  }
}

// 重置cookie同意状态 (开发用途)
export function resetCookieConsent() {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY)
    console.log('[NotificationBar] Cookie consent status has been reset')
  } catch (error) {
    console.error('[NotificationBar] Failed to reset consent status:', error)
  }
}

export default function NotificationBar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 检查用户是否已经同意cookie
    const hasConsented = getCookieConsentStatus()
    
    if (!hasConsented) {
      // 如果没有同意，则显示通知栏
      setIsVisible(true)
      
      // 15秒后自动消失
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleGetItClick = () => {
    // 保存同意状态到localStorage，持续1个月
    setCookieConsentStatus(true)
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-black text-white text-center py-2 text-sm z-50 flex items-center justify-center gap-2">
      <span>Speed Stars uses Google OAuth, GitHub OAuth, NextAuth sessions, Google AdSense, Plausible Analytics, localStorage for game data/language settings, Unity WebGL games, and cookies for authentication & preferences</span>
      <button
        onClick={handleGetItClick}
        className="bg-white text-black px-3 py-1 rounded text-xs hover:bg-gray-200 transition-colors whitespace-nowrap"
      >
        get it
      </button>
    </div>
  )
}