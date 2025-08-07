"use client"

import { useSearchParams, useParams } from "next/navigation"
import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, AlertTriangleIcon, RefreshCwIcon } from "lucide-react"
import { Locale } from "@/lib/lang/dictionaraies"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access denied. You don't have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An unexpected error occurred during authentication.",
  Signin: "An error occurred while trying to sign in.",
  OAuthSignin: "An error occurred while trying to sign in with OAuth.",
  OAuthCallback: "An error occurred during OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "An error occurred during callback.",
  OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email for a verification link.",
  CredentialsSignin: "Invalid credentials. Please check your email and password.",
  SessionRequired: "Please sign in to access this page."
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  
  const errorMessage = errorMessages[error as string] || errorMessages.Default

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'AccessDenied':
        return '🚫'
      case 'Configuration':
        return '⚙️'
      case 'Verification':
        return '⏰'
      case 'OAuthAccountNotLinked':
        return '🔗'
      default:
        return '❌'
    }
  }

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden min-h-screen flex items-center">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">⚠️</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
        🔧
      </div>

      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8 flex justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary-hover font-black text-lg group bg-white rounded-full px-6 py-3 shadow-cartoon border-4 border-primary cartoon-shadow transform hover:scale-110 hover:rotate-2 transition-all jello"
          >
            <ChevronLeftIcon className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-text mb-4 pop-in">
              Authentication <span className="gradient-text">Error</span>
            </h1>
            <p className="text-lg text-text/80">
              Something went wrong during sign in
            </p>
          </div>

          <div className="card cartoon-shadow border-4 border-accent-2 transform hover:scale-[1.02] transition-transform pop-in">
            <div className="text-center">
              <div className="text-6xl mb-4">{getErrorIcon(error || 'Default')}</div>
              <h2 className="text-2xl font-black text-accent-2 mb-4">Oops! Sign In Failed</h2>
              
              <div className="bg-gradient-to-r from-accent-2/10 to-primary/10 rounded-xl p-4 border-2 border-accent-2/20 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangleIcon className="w-6 h-6 text-accent-2 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-black text-text mb-2">Error Details:</h3>
                    <p className="text-text/80 text-sm leading-relaxed">{errorMessage}</p>
                    {error && (
                      <p className="text-text/60 text-xs mt-2">Error Code: {error}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/en/auth/signin"
                    className="btn-primary text-lg jello flex items-center justify-center"
                  >
                    <RefreshCwIcon className="w-5 h-5 mr-2" />
                    Try Again
                  </Link>
                  <Link
                    href="/"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Continue as Guest
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="mt-8">
            <h3 className="text-xl font-black text-text text-center mb-6">Troubleshooting Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[1deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-black text-secondary mb-2">Clear Cache</h4>
                  <p className="text-sm text-text/80">Clear your browser cache and cookies, then try again</p>
                </div>
              </div>
              
              <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[-1deg] transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌐</div>
                  <h4 className="font-black text-accent mb-2">Check Connection</h4>
                  <p className="text-sm text-text/80">Ensure you have a stable internet connection</p>
                </div>
              </div>
              
              <div className="card cartoon-shadow border-4 border-accent-3 transform hover:rotate-[1deg] transition-transform pop-in" style={{ animationDelay: "0.5s" }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔐</div>
                  <h4 className="font-black text-accent-3 mb-2">Account Access</h4>
                  <p className="text-sm text-text/80">Make sure your social account allows third-party access</p>
                </div>
              </div>
              
              <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[-1deg] transition-transform pop-in" style={{ animationDelay: "0.6s" }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">💬</div>
                  <h4 className="font-black text-accent-4 mb-2">Need Help?</h4>
                  <p className="text-sm text-text/80">
                    <Link href="/contact" className="text-accent-4 hover:underline">
                      Contact our support team
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <div className="card cartoon-shadow border-4 border-primary transform hover:scale-105 transition-transform pop-in" style={{ animationDelay: "0.7s" }}>
              <div className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="text-xl font-black text-text mb-3">Still Having Issues?</h3>
                <p className="text-text/80 mb-4">
                  Our support team is here to help you get back to gaming!
                </p>
                <Link
                  href="/help"
                  className="btn-secondary text-lg jello"
                >
                  Visit Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AuthErrorPage() {
  const params = useParams()
  const lang = (params?.lang as Locale) || 'en'
  
  return (
    <main className="bg-background min-h-screen">
      <Header lang={lang} />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="card cartoon-shadow border-4 border-primary p-8 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-xl font-black text-text">Loading...</p>
          </div>
        </div>
      }>
        <AuthErrorContent />
      </Suspense>
      <Footer />
    </main>
  )
}
