"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { X } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  t?: any
}

export default function LoginModal({ isOpen, onClose, t }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  if (!isOpen) return null

  const handleProviderSignIn = async (provider: string) => {
    setIsLoading(true)
    setLoadingProvider(provider)
    
    try {
      await signIn(provider, { 
        callbackUrl: window.location.href,
        redirect: false 
      })
    } catch (error) {
      // Silent error handling for sign in failure
    } finally {
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 relative animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{t?.login?.logInOrSignUp || "Log in or sign up"}</h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">{t?.login?.signingInWith?.replace('{provider}', loadingProvider || '') || `Signing in with ${loadingProvider}...`}</p>
            </div>
          </div>
        )}

        {/* Login Options */}
        {!isLoading && (
          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={() => handleProviderSignIn('google')}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{t?.login?.signInWithGoogle || "Sign in with Google"}</span>
            </button>

            {/* GitHub Sign In */}
            <button
              onClick={() => handleProviderSignIn('github')}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-3 transition-colors border border-gray-600"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>{t?.login?.continueWithGitHub || "Continue with GitHub"}</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">OR</span>
              </div>
            </div>

            {/* Email Input (Placeholder) */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                disabled
              />
              <button
                className="w-full bg-gray-600 text-gray-400 font-medium py-3 px-4 rounded-xl cursor-not-allowed"
                disabled
              >
                Continue
              </button>
              <p className="text-xs text-gray-500 text-center">Email authentication coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}