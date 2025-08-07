import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, CookieIcon, SettingsIcon, BarChart3Icon, ShieldCheckIcon } from "lucide-react"
import type { Metadata } from "next"
import { getDictionary } from "@/lib/lang/i18n"
import { Locale } from "@/lib/lang/dictionaraies"

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

export default async function CookiesPage({params}: {params: {lang: Locale}}) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  return (
    <main className="bg-background">
      <Header t={t}  lang={lang}/>

      <section className="py-12 md:py-16 bg-gray-900 relative overflow-hidden">
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
              className="inline-flex items-center text-primary hover:text-primary-hover font-black text-lg group bg-gray-900 rounded-full px-6 py-3 shadow-cartoon border-4 border-primary cartoon-shadow transform hover:scale-110 hover:rotate-2 transition-all jello"
            >
              <ChevronLeftIcon className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
{t?.common?.back || "Back to Home"}
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 pop-in">
              {t?.legal?.cookiePolicyTitle || "Cookie Policy"}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              {t?.legal?.cookieDescription || "Learn about how we use cookies to improve your gaming experience"}
            </p>
            <div className="mt-4 text-sm text-white/60">
              <p>{t?.legal?.lastUpdated || "Last updated: December 2024"}</p>
            </div>
          </div>

          {/* What Are Cookies */}
          <div className="card cartoon-shadow border-4 border-accent mb-12 pop-in">
            <div className="flex items-start space-x-4">
              <CookieIcon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-black text-accent mb-2">{t?.legal?.whatAreCookies || "What Are Cookies?"}</h2>
                <p className="text-white/80 leading-relaxed">
                  {t?.legal?.whatAreCookiesDesc || "Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences, improve functionality, and provide analytics. At GameHub Central, we use cookies responsibly to enhance your gaming experience while respecting your privacy."}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Types of Cookies */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[0.5deg] transition-transform pop-in">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🍪</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">{t?.legal?.cookieTypesTitle || "Types of Cookies We Use"}</h2>
              </div>
              <div className="text-white/90 space-y-6 leading-relaxed">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Essential Cookies */}
                  <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-6 border-4 border-green-400">
                    <div className="flex items-center mb-4">
                      <ShieldCheckIcon className="w-6 h-6 text-green-700 mr-2" />
                      <h3 className="font-black text-green-800">{t?.legal?.essentialCookies || "Essential Cookies"}</h3>
                    </div>
                    <p className="text-sm text-green-800 mb-3">
                      <strong>{t?.legal?.required || "Required"}:</strong> {t?.legal?.essentialCookiesDesc || "These cookies are necessary for our website to function properly."}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-green-700">
                      <li>{t?.legal?.sessionManagement || "Session management"}</li>
                      <li>{t?.legal?.securityFeatures || "Security features"}</li>
                      <li>{t?.legal?.basicSiteFunctionality || "Basic site functionality"}</li>
                      <li>{t?.legal?.loadBalancing || "Load balancing"}</li>
                    </ul>
                    <div className="mt-3 text-xs text-green-600">
                      <strong>{t?.legal?.duration || "Duration"}:</strong> {t?.legal?.essentialDuration || "Session or up to 1 year"}<br />
                      <strong>{t?.legal?.control || "Control"}:</strong> {t?.legal?.cannotBeDisabled || "Cannot be disabled"}
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 border-4 border-blue-400">
                    <div className="flex items-center mb-4">
                      <BarChart3Icon className="w-6 h-6 text-blue-700 mr-2" />
                      <h3 className="font-black text-blue-800">{t?.legal?.analyticsCookies || "Analytics Cookies"}</h3>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">
                      <strong>{t?.legal?.optional || "Optional"}:</strong> {t?.legal?.analyticsCookiesDesc || "Help us understand how you use our games and website."}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-blue-700">
                      <li>{t?.legal?.pageViewsGames || "Page views and popular games"}</li>
                      <li>{t?.legal?.userInteraction || "User interaction patterns"}</li>
                      <li>{t?.legal?.performanceMetrics || "Performance metrics"}</li>
                      <li>{t?.legal?.errorTracking || "Error tracking"}</li>
                    </ul>
                    <div className="mt-3 text-xs text-blue-600">
                      <strong>{t?.legal?.duration || "Duration"}:</strong> {t?.legal?.analyticsDuration || "Up to 2 years"}<br />
                      <strong>{t?.legal?.control || "Control"}:</strong> {t?.legal?.canBeDisabled || "Can be disabled"}
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-6 border-4 border-purple-400">
                    <div className="flex items-center mb-4">
                      <SettingsIcon className="w-6 h-6 text-purple-700 mr-2" />
                      <h3 className="font-black text-purple-800">{t?.legal?.functionalCookies || "Functional Cookies"}</h3>
                    </div>
                    <p className="text-sm text-purple-800 mb-3">
                      <strong>{t?.legal?.optional || "Optional"}:</strong> {t?.legal?.functionalCookiesDesc || "Remember your preferences and settings."}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-purple-700">
                      <li>{t?.legal?.languagePreferences || "Language preferences"}</li>
                      <li>{t?.legal?.gameSettings || "Game settings"}</li>
                      <li>{t?.legal?.displayPreferences || "Display preferences"}</li>
                      <li>{t?.legal?.volumeSettings || "Volume settings"}</li>
                    </ul>
                    <div className="mt-3 text-xs text-purple-600">
                      <strong>{t?.legal?.duration || "Duration"}:</strong> {t?.legal?.functionalDuration || "Up to 1 year"}<br />
                      <strong>{t?.legal?.control || "Control"}:</strong> {t?.legal?.canBeDisabled || "Can be disabled"}
                    </div>
                  </div>

                  {/* Local Storage */}
                  <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-6 border-4 border-orange-400">
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-2">💾</div>
                      <h3 className="font-black text-orange-800">{t?.legal?.localStorage || "Local Storage"}</h3>
                    </div>
                    <p className="text-sm text-orange-800 mb-3">
                      <strong>{t?.legal?.gameData || "Game Data"}:</strong> {t?.legal?.localStorageDesc || "Stores your game progress and achievements."}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-orange-700">
                      <li>{t?.legal?.gameSaveStates || "Game save states"}</li>
                      <li>{t?.legal?.highScores || "High scores"}</li>
                      <li>{t?.legal?.achievementProgress || "Achievement progress"}</li>
                      <li>{t?.legal?.customGameSettings || "Custom game settings"}</li>
                    </ul>
                    <div className="mt-3 text-xs text-orange-600">
                      <strong>{t?.legal?.duration || "Duration"}:</strong> {t?.legal?.untilManuallyCleared || "Until manually cleared"}<br />
                      <strong>{t?.legal?.control || "Control"}:</strong> {t?.legal?.clearViaBrowser || "Clear via browser settings"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔗</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">{t?.legal?.thirdPartyServices || "Third-Party Services"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.thirdPartyServicesDesc || "We use carefully selected third-party services to provide better functionality. These services may set their own cookies:"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">📊 {t?.legal?.googleAnalytics || "Google Analytics"}</h4>
                    <p className="text-sm mb-2">{t?.legal?.googleAnalyticsDesc || "Helps us understand website usage and improve our services."}</p>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-xs text-secondary hover:underline">
                      {t?.legal?.googlePrivacyPolicy || "Google Privacy Policy"} ↗
                    </a>
                  </div>
                  <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-lg p-4 border-2 border-accent/20">
                    <h4 className="font-black text-accent mb-2">🎮 {t?.legal?.gameProviders || "Game Providers"}</h4>
                    <p className="text-sm mb-2">{t?.legal?.gameProvidersDesc || "Some games may use cookies for save functionality and preferences."}</p>
                    <p className="text-xs text-accent/80">{t?.legal?.variesByProvider || "Varies by game provider"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Control Cookies */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">⚙️</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">{t?.legal?.manageCookies || "How to Control Cookies"}</h2>
              </div>
              <div className="text-white/90 space-y-6 leading-relaxed">
                <p>
                  {t?.legal?.cookieControlDesc || "You have full control over cookies. Here's how to manage them:"}
                </p>
                
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 border-2 border-accent/20">
                  <h3 className="font-black text-accent mb-4">🌐 {t?.legal?.browserSettings || "Browser Settings"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-bold mb-2">{t?.legal?.chrome || "Chrome"}:</h4>
                      <p>{t?.legal?.chromeSettings || "Settings → Privacy & Security → Cookies"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">{t?.legal?.firefox || "Firefox"}:</h4>
                      <p>{t?.legal?.firefoxSettings || "Options → Privacy & Security → Cookies"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">{t?.legal?.safari || "Safari"}:</h4>
                      <p>{t?.legal?.safariSettings || "Preferences → Privacy → Cookie Settings"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">{t?.legal?.edge || "Edge"}:</h4>
                      <p>{t?.legal?.edgeSettings || "Settings → Site Permissions → Cookies"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 border-4 border-blue-400">
                  <h3 className="font-black text-blue-800 mb-3">📱 {t?.legal?.mobileBrowsers || "Mobile Browsers"}</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>{t?.legal?.iOSSafari || "iOS Safari"}:</strong> {t?.legal?.iOSSettings || "Settings → Safari → Block All Cookies"}</p>
                    <p><strong>{t?.legal?.androidChrome || "Android Chrome"}:</strong> {t?.legal?.androidSettings || "Chrome Menu → Settings → Site Settings → Cookies"}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-6 border-4 border-yellow-400">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h3 className="font-black text-yellow-800 mb-2">{t?.legal?.importantNote || "Important Note"}</h3>
                      <p className="text-sm text-yellow-800">
                        {t?.legal?.disablingCookiesWarning || "Disabling cookies may affect game functionality, including the ability to save progress and maintain preferences. Essential cookies cannot be disabled as they're required for basic website operation."}
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
                <h2 className="text-2xl md:text-3xl font-black text-accent-3">{t?.legal?.optOutOptions || "Opt-Out Options"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.optOutDesc || "You can opt out of specific tracking and analytics:"}
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-accent-3/10 to-primary/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <h4 className="font-black text-accent-3 mb-2">🔍 {t?.legal?.googleAnalytics || "Google Analytics"}</h4>
                    <p className="text-sm mb-2">
                      {t?.legal?.googleOptOutDesc || "Install the Google Analytics Opt-out Browser Add-on to prevent data collection."}
                    </p>
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                       className="text-xs text-accent-3 hover:underline">
                      {t?.legal?.downloadOptOut || "Download Opt-out Add-on"} ↗
                    </a>
                  </div>
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">🌐 {t?.legal?.doNotTrack || "Do Not Track"}</h4>
                    <p className="text-sm">
                      {t?.legal?.doNotTrackDesc || "Enable 'Do Not Track' in your browser settings. We respect this preference where technically possible."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie Duration */}
            <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">⏰</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-4">{t?.legal?.cookieDuration || "Cookie Duration & Deletion"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-accent-4/20 to-primary/20">
                        <th className="border-2 border-accent-4/30 p-3 text-left font-black">{t?.legal?.cookieType || "Cookie Type"}</th>
                        <th className="border-2 border-accent-4/30 p-3 text-left font-black">{t?.legal?.duration || "Duration"}</th>
                        <th className="border-2 border-accent-4/30 p-3 text-left font-black">{t?.legal?.deletion || "Deletion"}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border-2 border-accent-4/20 p-3 font-medium">{t?.legal?.sessionCookies || "Session Cookies"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.untilBrowserCloses || "Until browser closes"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.automatic || "Automatic"}</td>
                      </tr>
                      <tr className="bg-accent-4/5">
                        <td className="border-2 border-accent-4/20 p-3 font-medium">{t?.legal?.functionalCookies || "Functional Cookies"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.upTo1Year || "Up to 1 year"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.manualOrAutomatic || "Manual or automatic"}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-accent-4/20 p-3 font-medium">{t?.legal?.analyticsCookies || "Analytics Cookies"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.upTo2Years || "Up to 2 years"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.manualOrAutomatic || "Manual or automatic"}</td>
                      </tr>
                      <tr className="bg-accent-4/5">
                        <td className="border-2 border-accent-4/20 p-3 font-medium">{t?.legal?.localStorage || "Local Storage"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.untilManuallyCleared || "Until manually cleared"}</td>
                        <td className="border-2 border-accent-4/20 p-3">{t?.legal?.manualOnly || "Manual only"}</td>
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
                <h2 className="text-2xl md:text-3xl font-black text-primary">{t?.legal?.updatesToPolicy || "Updates to This Policy"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.policyUpdateDesc || "We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. When we make significant changes, we will:"}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t?.legal?.updateLastModified || "Update the 'Last modified' date at the top of this policy"}</li>
                  <li>{t?.legal?.notifyUsers || "Notify users through our website or other appropriate means"}</li>
                  <li>{t?.legal?.provideSummary || "Provide a summary of key changes when applicable"}</li>
                </ul>
                <p>
                  {t?.legal?.reviewPeriodically || "We encourage you to review this policy periodically to stay informed about our cookie practices."}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📞</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">{t?.legal?.questionsAboutCookies || "Questions About Cookies?"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.cookieQuestionsDesc || "If you have questions about our use of cookies or this Cookie Policy, please contact us:"}
                </p>
                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-4 border-2 border-secondary/20">
                  <p><strong>{t?.legal?.email || "Email"}:</strong> privacy@speed-stars.net</p>
                  <p><strong>{t?.legal?.support || "Support"}:</strong> support@speed-stars.net</p>
                  <p><strong>{t?.legal?.address || "Address"}:</strong> {t?.footer?.address || "36 Central Avenue, California, USA"}</p>
                  <p><strong>{t?.legal?.phone || "Phone"}:</strong> {t?.footer?.phone || "+1 (607) 023-1235"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-16 text-center">
            <div className="card cartoon-shadow border-4 border-primary max-w-2xl mx-auto transform hover:scale-105 transition-transform pop-in">
              <div className="text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-2xl font-black text-white mb-4">{t?.legal?.relatedPolicies || "Related Policies"}</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/privacy"
                    className="btn-secondary text-lg jello"
                  >
                    {t?.footer?.privacyPolicy || "Privacy Policy"}
                  </Link>
                  <Link
                    href="/terms"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.1s" }}
                  >
                    {t?.footer?.termsOfService || "Terms of Service"}
                  </Link>
                  <Link
                    href="/help"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {t?.footer?.helpCenter || "Help Center"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer t={t}  lang={lang}/>
    </main>
  )
}