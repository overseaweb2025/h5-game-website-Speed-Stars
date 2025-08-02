"use client"

import { useState, useRef, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { User, Settings, LogOut, Bell, Shield, Mail, ChevronDown } from "lucide-react"
import Link from "next/link"

interface UserDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const { data: session } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen || !session?.user) return null

  const handleSignOut = async () => {
    await signOut({ callbackUrl: window.location.href })
    onClose()
  }

  const userEmail = session.user.email || 'user@example.com'
  const userName = session.user.name || session.user.email?.split('@')[0] || 'User'
  const userAvatar = session.user.image || '/user_delfut_Auth/88.jfif'

  return (
    <div
      ref={dropdownRef}
      className="fixed top-16 right-4 bg-gray-800 rounded-2xl w-80 p-6 shadow-2xl border border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* User Info Section */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-4 border-green-500">
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/user_delfut_Auth/88.jfif'
            }}
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">@{userName}</h3>
        <p className="text-gray-400 text-sm mb-4">{userEmail}</p>
        
        {/* Profile Button */}
        <Link
          href={`/user/${userName.toLowerCase()}`}
          onClick={onClose}
          className="bg-accent hover:bg-accent-2 text-white font-medium py-2 px-6 rounded-xl transition-colors inline-flex items-center space-x-2"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Link>
      </div>

      {/* Profile Completion Bar */}
      <div className="mb-6 p-4 bg-gray-700 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm font-medium">Your profile is 60% complete</span>
          <button className="text-accent text-sm hover:text-accent-2">Complete Now →</button>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div className="bg-gradient-to-r from-accent to-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1 mb-6">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span>Notification preferences</span>
        </button>
        
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <Shield className="w-5 h-5" />
          <span>Privacy preferences</span>
        </button>
        
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span>Account settings</span>
        </button>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>

      <div className="border-t border-gray-600 pt-4">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <Mail className="w-5 h-5" />
          <span>Contact us</span>
        </button>
      </div>

      {/* Language Selector */}
      <div className="mt-4">
        <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      {/* Footer Links */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-400">About</a>
          <a href="#" className="hover:text-gray-400">Kids site</a>
          <a href="#" className="hover:text-gray-400">Terms & conditions</a>
          <a href="#" className="hover:text-gray-400">Jobs</a>
          <a href="#" className="hover:text-gray-400">Privacy</a>
          <a href="#" className="hover:text-gray-400">Developers</a>
        </div>
      </div>
    </div>
  )
}