import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, CookieIcon, SettingsIcon, BarChart3Icon, ShieldCheckIcon } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | GameHub Central - How We Use Cookies",
  description:
    "Learn about GameHub Central's cookie usage. Understand what cookies we use, why we use them, and how to control your cookie preferences.",
  keywords: "cookie policy, cookies, tracking, web storage, GameHub Central cookies",
  openGraph: {
    title: "Cookie Policy | GameHub Central - How We Use Cookies",
    description:
      "Learn about GameHub Central's cookie usage. Understand what cookies we use, why we use them, and how to control your cookie preferences.",
    url: "https://speed-stars.net/cookies",
    siteName: "GameHub Central",
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/cookies",
}

export default function CookiesPage() {
  return (
    <main className="bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">🍪</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          📊
        </div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-15 pop-in" style={{ animationDelay: "0.6s" }}>
          ⚙️
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

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-text mb-4 pop-in">
              Cookie <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-text/80 max-w-3xl mx-auto">
              Learn about how we use cookies to improve your gaming experience
            </p>
            <div className="mt-4 text-sm text-text/60">
              <p>Last updated: December 2024</p>
            </div>
          </div>

          {/* What Are Cookies */}
          <div className="card cartoon-shadow border-4 border-accent mb-12 pop-in">
            <div className="flex items-start space-x-4">
              <CookieIcon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-black text-accent mb-2">What Are Cookies?</h2>
                <p className="text-text/80 leading-relaxed">
                  Cookies are small text files stored on your device when you visit websites. They help websites remember 
                  your preferences, improve functionality, and provide analytics. At GameHub Central, we use cookies 
                  responsibly to enhance your gaming experience while respecting your privacy.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Types of Cookies */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[0.5deg] transition-transform pop-in">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🍪</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">Types of Cookies We Use</h2>
              </div>
              <div className="text-text/90 space-y-6 leading-relaxed">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Essential Cookies */}
                  <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-6 border-4 border-green-400">
                    <div className="flex items-center mb-4">
                      <ShieldCheckIcon className="w-6 h-6 text-green-700 mr-2" />
                      <h3 className="font-black text-green-800">Essential Cookies</h3>
                    </div>
                    <p className="text-sm text-green-800 mb-3">
                      <strong>Required:</strong> These cookies are necessary for our website to function properly.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-green-700">
                      <li>Session management</li>
                      <li>Security features</li>
                      <li>Basic site functionality</li>
                      <li>Load balancing</li>
                    </ul>
                    <div className="mt-3 text-xs text-green-600">
                      <strong>Duration:</strong> Session or up to 1 year<br />
                      <strong>Control:</strong> Cannot be disabled
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 border-4 border-blue-400">
                    <div className="flex items-center mb-4">
                      <BarChart3Icon className="w-6 h-6 text-blue-700 mr-2" />
                      <h3 className="font-black text-blue-800">Analytics Cookies</h3>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">
                      <strong>Optional:</strong> Help us understand how you use our games and website.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-blue-700">
                      <li>Page views and popular games</li>
                      <li>User interaction patterns</li>
                      <li>Performance metrics</li>
                      <li>Error tracking</li>
                    </ul>
                    <div className="mt-3 text-xs text-blue-600">
                      <strong>Duration:</strong> Up to 2 years<br />
                      <strong>Control:</strong> Can be disabled
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-6 border-4 border-purple-400">
                    <div className="flex items-center mb-4">
                      <SettingsIcon className="w-6 h-6 text-purple-700 mr-2" />
                      <h3 className="font-black text-purple-800">Functional Cookies</h3>
                    </div>
                    <p className="text-sm text-purple-800 mb-3">
                      <strong>Optional:</strong> Remember your preferences and settings.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-purple-700">
                      <li>Language preferences</li>
                      <li>Game settings</li>
                      <li>Display preferences</li>
                      <li>Volume settings</li>
                    </ul>
                    <div className="mt-3 text-xs text-purple-600">
                      <strong>Duration:</strong> Up to 1 year<br />
                      <strong>Control:</strong> Can be disabled
                    </div>
                  </div>

                  {/* Local Storage */}
                  <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-6 border-4 border-orange-400">
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-2">💾</div>
                      <h3 className="font-black text-orange-800">Local Storage</h3>
                    </div>
                    <p className="text-sm text-orange-800 mb-3">
                      <strong>Game Data:</strong> Stores your game progress and achievements.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-orange-700">
                      <li>Game save states</li>
                      <li>High scores</li>
                      <li>Achievement progress</li>
                      <li>Custom game settings</li>
                    </ul>
                    <div className="mt-3 text-xs text-orange-600">
                      <strong>Duration:</strong> Until manually cleared<br />
                      <strong>Control:</strong> Clear via browser settings
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔗</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">Third-Party Services</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  We use carefully selected third-party services to provide better functionality. These services may set their own cookies:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">📊 Google Analytics</h4>
                    <p className="text-sm mb-2">Helps us understand website usage and improve our services.</p>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-xs text-secondary hover:underline">
                      Google Privacy Policy ↗
                    </a>
                  </div>
                  <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-lg p-4 border-2 border-accent/20">
                    <h4 className="font-black text-accent mb-2">🎮 Game Providers</h4>
                    <p className="text-sm mb-2">Some games may use cookies for save functionality and preferences.</p>
                    <p className="text-xs text-accent/80">Varies by game provider</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Control Cookies */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">⚙️</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">How to Control Cookies</h2>
              </div>
              <div className="text-text/90 space-y-6 leading-relaxed">
                <p>
                  You have full control over cookies. Here's how to manage them:
                </p>
                
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 border-2 border-accent/20">
                  <h3 className="font-black text-accent mb-4">🌐 Browser Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-bold mb-2">Chrome:</h4>
                      <p>Settings → Privacy & Security → Cookies</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Firefox:</h4>
                      <p>Options → Privacy & Security → Cookies</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Safari:</h4>
                      <p>Preferences → Privacy → Cookie Settings</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Edge:</h4>
                      <p>Settings → Site Permissions → Cookies</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 border-4 border-blue-400">
                  <h3 className="font-black text-blue-800 mb-3">📱 Mobile Browsers</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>iOS Safari:</strong> Settings → Safari → Block All Cookies</p>
                    <p><strong>Android Chrome:</strong> Chrome Menu → Settings → Site Settings → Cookies</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-6 border-4 border-yellow-400">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h3 className="font-black text-yellow-800 mb-2">Important Note</h3>
                      <p className="text-sm text-yellow-800">
                        Disabling cookies may affect game functionality, including the ability to save progress 
                        and maintain preferences. Essential cookies cannot be disabled as they're required for 
                        basic website operation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opt-Out Options */}
            <div className="card cartoon-shadow border-4 border-accent-3 transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🚫</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-3">Opt-Out Options</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  You can opt out of specific tracking and analytics:
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-accent-3/10 to-primary/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <h4 className="font-black text-accent-3 mb-2">🔍 Google Analytics</h4>
                    <p className="text-sm mb-2">
                      Install the Google Analytics Opt-out Browser Add-on to prevent data collection.
                    </p>
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                       className="text-xs text-accent-3 hover:underline">
                      Download Opt-out Add-on ↗
                    </a>
                  </div>
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">🌐 Do Not Track</h4>
                    <p className="text-sm">
                      Enable "Do Not Track" in your browser settings. We respect this preference where technically possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie Duration */}
            <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">⏰</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-4">Cookie Duration & Deletion</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-accent-4/20 to-primary/20">
                        <th className="border-2 border-accent-4/30 p-3 text-left font-black">Cookie Type</th>
                        <th className="border-2 border-accent-4/30 p-3 text-left font-black">Duration</th>
                        <th className="border-2 border-accent-4/30 p-3 text-left font-black">Deletion</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border-2 border-accent-4/20 p-3 font-medium">Session Cookies</td>
                        <td className="border-2 border-accent-4/20 p-3">Until browser closes</td>
                        <td className="border-2 border-accent-4/20 p-3">Automatic</td>
                      </tr>
                      <tr className="bg-accent-4/5">
                        <td className="border-2 border-accent-4/20 p-3 font-medium">Functional Cookies</td>
                        <td className="border-2 border-accent-4/20 p-3">Up to 1 year</td>
                        <td className="border-2 border-accent-4/20 p-3">Manual or automatic</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-accent-4/20 p-3 font-medium">Analytics Cookies</td>
                        <td className="border-2 border-accent-4/20 p-3">Up to 2 years</td>
                        <td className="border-2 border-accent-4/20 p-3">Manual or automatic</td>
                      </tr>
                      <tr className="bg-accent-4/5">
                        <td className="border-2 border-accent-4/20 p-3 font-medium">Local Storage</td>
                        <td className="border-2 border-accent-4/20 p-3">Until manually cleared</td>
                        <td className="border-2 border-accent-4/20 p-3">Manual only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Updates to Policy */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔄</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">Updates to This Policy</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. 
                  When we make significant changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Update the "Last modified" date at the top of this policy</li>
                  <li>Notify users through our website or other appropriate means</li>
                  <li>Provide a summary of key changes when applicable</li>
                </ul>
                <p>
                  We encourage you to review this policy periodically to stay informed about our cookie practices.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📞</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">Questions About Cookies?</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  If you have questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-4 border-2 border-secondary/20">
                  <p><strong>Email:</strong> privacy@speed-stars.net</p>
                  <p><strong>Support:</strong> support@speed-stars.net</p>
                  <p><strong>Address:</strong> 36 Central Avenue, California, USA</p>
                  <p><strong>Phone:</strong> +1 (607) 023-1235</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-16 text-center">
            <div className="card cartoon-shadow border-4 border-primary max-w-2xl mx-auto transform hover:scale-105 transition-transform pop-in">
              <div className="text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-2xl font-black text-text mb-4">Related Policies</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/privacy"
                    className="btn-secondary text-lg jello"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.1s" }}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/help"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}