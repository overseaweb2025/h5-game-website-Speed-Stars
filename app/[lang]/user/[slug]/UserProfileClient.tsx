"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { useSession } from "next-auth/react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getUserBySlug, StaticUserData } from "@/data/users/users-data"
import { getUserGameHistory, getUserGameStats, formatGameHistoryForDisplay } from "@/utils/gameHistoryUtils"
import { UserCircleIcon, GamepadIcon, HeartIcon, MessageCircleIcon, ClockIcon, StarIcon, TrophyIcon, CalendarIcon, ShareIcon, EyeIcon } from "lucide-react"
import { Locale } from "@/lib/lang/dictionaraies"

interface UserProfileClientProps {
  lang: Locale
  t: any
}

export default function UserProfileClient({ lang, t }: UserProfileClientProps) {
  const { data: session } = useSession()
  const params = useParams()
  const slug = params.slug as string
  const [userData, setUserData] = useState<StaticUserData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'comments' | 'achievements'>('overview')
  const [loading, setLoading] = useState(true)
  const [realGameHistory, setRealGameHistory] = useState<any[]>([])

  const isCurrentUser = session?.user && userData && (
    session.user.email === userData.email ||
    session.user.name === userData.username ||
    session.user.id === userData.id
  )

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const user = getUserBySlug(slug)
        
        if (!user) {
          notFound()
        }
        
        setUserData(user)
        
        if (isCurrentUser || user.isPublic) {
          const history = getUserGameHistory(user.id)
          const displayHistory = formatGameHistoryForDisplay(history)
          setRealGameHistory(displayHistory)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [slug, isCurrentUser])

  useEffect(() => {
    const handleFocus = () => {
      if (isCurrentUser && activeTab === 'history') {
        const history = getUserGameHistory(userData!.id)
        const displayHistory = formatGameHistoryForDisplay(history)
        setRealGameHistory(displayHistory)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isCurrentUser, activeTab])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading user profile...</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">User not found</div>
      </div>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      {/* User profile content would go here */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-4">{userData.username}</h1>
          <p>User profile page content...</p>
        </div>
      </div>
    </main>
  )
}