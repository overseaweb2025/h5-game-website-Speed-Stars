import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, ShieldIcon, EyeIcon, LockIcon, DatabaseIcon } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | GameHub Central - Your Privacy Matters",
  description:
    "Read GameHub Central's Privacy Policy. Learn how we protect your privacy and handle your data while you enjoy our free HTML5 games.",
  keywords: "privacy policy, data protection, privacy rights, GameHub Central privacy",
  openGraph: {
    title: "Privacy Policy | GameHub Central - Your Privacy Matters",
    description:
      "Read GameHub Central's Privacy Policy. Learn how we protect your privacy and handle your data while you enjoy our free HTML5 games.",
    url: "https://speed-stars.net/privacy",
    siteName: "GameHub Central",
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/privacy",
}

export default function PrivacyPage() {
  return (
    <main className="bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">🔐</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          🛡️
        </div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-15 pop-in" style={{ animationDelay: "0.6s" }}>
          👁️
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
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-text/80 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we protect your data.
            </p>
            <div className="mt-4 text-sm text-text/60">
              <p>Last updated: December 2024</p>
            </div>
          </div>

          {/* Privacy Commitment */}
          <div className="card cartoon-shadow border-4 border-accent mb-12 pop-in">
            <div className="flex items-start space-x-4">
              <ShieldIcon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-black text-accent mb-2">Our Privacy Commitment</h2>
                <p className="text-text/80 leading-relaxed">
                  At GameHub Central, we believe privacy is a fundamental right. We are committed to being transparent 
                  about how we collect, use, and protect your information. We collect minimal data and never sell 
                  your personal information to third parties.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Section 1 */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[0.5deg] transition-transform pop-in">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">1️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">Information We Collect</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border-2 border-primary/20">
                  <h3 className="font-black text-primary mb-2">📊 Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>IP address and general location (city/country level)</li>
                    <li>Browser type and version</li>
                    <li>Device type and operating system</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referring website information</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-4 border-2 border-secondary/20">
                  <h3 className="font-black text-secondary mb-2">👤 Personal Information</h3>
                  <p className="text-sm">
                    We do NOT require registration or personal information to play games. 
                    Any personal information (like email) is only collected if you voluntarily 
                    contact us through our support forms.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">2️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">How We Use Your Information</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">🎮 Service Improvement</h4>
                    <p className="text-sm">Analyze usage patterns to improve game performance and user experience</p>
                  </div>
                  <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-lg p-4 border-2 border-accent/20">
                    <h4 className="font-black text-accent mb-2">🔧 Technical Support</h4>
                    <p className="text-sm">Troubleshoot technical issues and provide customer support</p>
                  </div>
                  <div className="bg-gradient-to-r from-accent-3/10 to-accent-4/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <h4 className="font-black text-accent-3 mb-2">📈 Analytics</h4>
                    <p className="text-sm">Understand which games are popular and optimize our content</p>
                  </div>
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border-2 border-primary/20">
                    <h4 className="font-black text-primary mb-2">🛡️ Security</h4>
                    <p className="text-sm">Protect against fraud, abuse, and security threats</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">3️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">Cookies and Tracking</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  We use cookies and similar technologies to enhance your gaming experience:
                </p>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border-2 border-accent/20">
                    <h4 className="font-black text-accent mb-2">🍪 Essential Cookies</h4>
                    <p className="text-sm">Required for basic site functionality and game loading</p>
                  </div>
                  <div className="bg-gradient-to-r from-secondary/10 to-accent-2/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">📊 Analytics Cookies</h4>
                    <p className="text-sm">Help us understand how users interact with our games (can be disabled)</p>
                  </div>
                  <div className="bg-gradient-to-r from-accent-3/10 to-accent-4/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <h4 className="font-black text-accent-3 mb-2">💾 Local Storage</h4>
                    <p className="text-sm">Saves game progress and preferences in your browser</p>
                  </div>
                </div>
                <p className="text-sm italic">
                  You can control cookies through your browser settings. Note that disabling cookies may affect game functionality.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="card cartoon-shadow border-4 border-accent-3 transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">4️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-3">Data Sharing and Disclosure</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-4 border-4 border-green-400">
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-2">✅</div>
                    <h3 className="font-black text-green-800">What We DON'T Do</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-green-800">
                    <li>We do NOT sell your personal information</li>
                    <li>We do NOT share data with advertisers</li>
                    <li>We do NOT track you across other websites</li>
                    <li>We do NOT require personal information to play games</li>
                  </ul>
                </div>
                <p>
                  We may share aggregated, non-personal information for analytical purposes. 
                  Personal information is only shared in these limited circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">5️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-4">Data Security</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  We implement appropriate security measures to protect your information:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-accent-4/10 to-primary/10 rounded-lg p-4 border-2 border-accent-4/20">
                    <h4 className="font-black text-accent-4 mb-2">🔒 Encryption</h4>
                    <p className="text-sm">All data transmission is encrypted using HTTPS</p>
                  </div>
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">🔐 Access Control</h4>
                    <p className="text-sm">Limited access to data on a need-to-know basis</p>
                  </div>
                  <div className="bg-gradient-to-r from-accent-2/10 to-accent-3/10 rounded-lg p-4 border-2 border-accent-2/20">
                    <h4 className="font-black text-accent-2 mb-2">📱 Regular Updates</h4>
                    <p className="text-sm">Security systems are regularly updated and monitored</p>
                  </div>
                  <div className="bg-gradient-to-r from-primary/10 to-accent-4/10 rounded-lg p-4 border-2 border-primary/20">
                    <h4 className="font-black text-primary mb-2">💾 Data Minimization</h4>
                    <p className="text-sm">We collect only what's necessary for our services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">6️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">Your Rights and Choices</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  You have the following rights regarding your information:
                </p>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border-2 border-primary/20">
                    <h4 className="font-black text-primary mb-2">👁️ Right to Know</h4>
                    <p className="text-sm">Request information about what data we collect and how we use it</p>
                  </div>
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">✏️ Right to Correct</h4>
                    <p className="text-sm">Request correction of inaccurate personal information</p>
                  </div>
                  <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-lg p-4 border-2 border-accent/20">
                    <h4 className="font-black text-accent mb-2">🗑️ Right to Delete</h4>
                    <p className="text-sm">Request deletion of your personal information (where legally permissible)</p>
                  </div>
                  <div className="bg-gradient-to-r from-accent-3/10 to-accent-4/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <h4 className="font-black text-accent-3 mb-2">🚫 Right to Opt-Out</h4>
                    <p className="text-sm">Disable cookies and analytics through browser settings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">7️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">Children's Privacy</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-4 border-4 border-blue-400">
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-2">👶</div>
                    <h3 className="font-black text-blue-800">COPPA Compliance</h3>
                  </div>
                  <p className="text-sm text-blue-800">
                    Our games are designed to be family-friendly and safe for children. We do not knowingly collect 
                    personal information from children under 13 without parental consent.
                  </p>
                </div>
                <p>
                  If we become aware that we have collected personal information from a child under 13 without 
                  parental consent, we will take steps to delete that information promptly.
                </p>
                <p>
                  Parents who believe their child has provided personal information to us may contact us to request 
                  removal of that information.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">8️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">International Users</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  GameHub Central is operated from the United States. If you are accessing our services from outside 
                  the US, please be aware that your information may be transferred to, stored, and processed in the US.
                </p>
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 border-2 border-accent/20">
                  <h3 className="font-black text-accent mb-2">🌍 GDPR Rights</h3>
                  <p className="text-sm">
                    If you are in the European Union, you have additional rights under GDPR, including the right to 
                    data portability and the right to object to processing.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="card cartoon-shadow border-4 border-accent-2 transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.8s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">9️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-2">Contact Us About Privacy</h2>
              </div>
              <div className="text-text/90 space-y-4 leading-relaxed">
                <p>
                  If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
                </p>
                <div className="bg-gradient-to-r from-accent-2/10 to-primary/10 rounded-xl p-4 border-2 border-accent-2/20">
                  <p><strong>Privacy Officer:</strong> privacy@speed-stars.net</p>
                  <p><strong>General Support:</strong> support@speed-stars.net</p>
                  <p><strong>Address:</strong> 36 Central Avenue, California, USA</p>
                  <p><strong>Phone:</strong> +1 (607) 023-1235</p>
                </div>
                <p className="text-sm italic">
                  We will respond to privacy-related inquiries within 30 days.
                </p>
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
                    href="/terms"
                    className="btn-secondary text-lg jello"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/cookies"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.1s" }}
                  >
                    Cookie Policy
                  </Link>
                  <Link
                    href="/dmca"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    DMCA Policy
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