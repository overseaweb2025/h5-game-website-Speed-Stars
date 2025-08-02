"use client"

import { useEffect, useState } from 'react'

export default function AuthDebugPage() {
  const [envCheck, setEnvCheck] = useState({
    googleId: false,
    googleSecret: false,
    nextauthUrl: false,
    nextauthSecret: false
  })

  useEffect(() => {
    // This will only run on client side, but we can check what's available
    fetch('/api/auth/debug')
      .then(res => res.json())
      .then(data => setEnvCheck(data))
      .catch(err => console.error('Debug check failed:', err))
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-8">Auth Debug Information</h1>
        
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-text mb-4">Environment Variables Check</h2>
          <div className="space-y-2">
            <div className={`flex items-center justify-between p-2 rounded ${envCheck.googleId ? 'bg-green-100' : 'bg-red-100'}`}>
              <span>GOOGLE_ID</span>
              <span>{envCheck.googleId ? '✅ Set' : '❌ Missing'}</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded ${envCheck.googleSecret ? 'bg-green-100' : 'bg-red-100'}`}>
              <span>GOOGLE_SECRET</span>
              <span>{envCheck.googleSecret ? '✅ Set' : '❌ Missing'}</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded ${envCheck.nextauthUrl ? 'bg-green-100' : 'bg-red-100'}`}>
              <span>NEXTAUTH_URL</span>
              <span>{envCheck.nextauthUrl ? '✅ Set' : '❌ Missing'}</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded ${envCheck.nextauthSecret ? 'bg-green-100' : 'bg-red-100'}`}>
              <span>NEXTAUTH_SECRET</span>
              <span>{envCheck.nextauthSecret ? '✅ Set' : '❌ Missing'}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-text mb-4">Current URL Information</h2>
          <div className="space-y-2 text-sm">
            <div>Current Host: {typeof window !== 'undefined' ? window.location.host : 'Server-side'}</div>
            <div>Current Origin: {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</div>
            <div>Expected OAuth Callback: {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : 'Server-side'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}