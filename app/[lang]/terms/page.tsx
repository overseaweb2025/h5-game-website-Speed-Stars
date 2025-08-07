import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, ScaleIcon, FileTextIcon, AlertTriangleIcon } from "lucide-react"
import type { Metadata } from "next"
import { getDictionary } from "@/lib/lang/i18n"
import { Locale } from "@/lib/lang/dictionaraies"

export const metadata: Metadata = {
  title: "Terms of Service | GameHub Central - Legal Terms & Conditions",
  description:
    "Read GameHub Central's Terms of Service. Understand your rights and responsibilities when using our free HTML5 gaming platform.",
  keywords: "terms of service, legal terms, conditions, GameHub Central terms",
  openGraph: {
    title: "Terms of Service | GameHub Central - Legal Terms & Conditions",
    description:
      "Read GameHub Central's Terms of Service. Understand your rights and responsibilities when using our free HTML5 gaming platform.",
    url: "https://speed-stars.net/terms",
    siteName: "GameHub Central",
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/terms",
}

export default async function TermsPage({params}: {params: {lang: Locale}}) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  return (
    <main className="bg-background">
      <Header t={t}  lang={lang}/>

      <section className="py-12 md:py-16 bg-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">⚖️</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          📋
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
              {t?.legal?.termsOfServiceTitle || "Terms of Service"}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              {t?.legal?.legalTermsDescription || "Legal terms and conditions for using GameHub Central"}
            </p>
            <div className="mt-4 text-sm text-white/60">
              <p>{t?.legal?.lastUpdated || "Last updated: December 2024"}</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="card cartoon-shadow border-4 border-accent-2 mb-12 pop-in">
            <div className="flex items-start space-x-4">
              <AlertTriangleIcon className="w-8 h-8 text-accent-2 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-black text-accent-2 mb-2">{t?.legal?.importantNotice || "Important Notice"}</h2>
                <p className="text-white/80 leading-relaxed">
                  {t?.legal?.termsAcceptanceText || "By accessing and using GameHub Central, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our services."}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Section 1 */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[0.5deg] transition-transform pop-in">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">1️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">{t?.legal?.acceptanceOfTerms || "Acceptance of Terms"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection1Content1 || "These Terms of Service govern your use of GameHub Central, operated by GameHub Central ('we,' 'us,' or 'our'). By accessing or using our website and services, you agree to comply with and be bound by these terms."}
                </p>
                <p>
                  {t?.legal?.termsSection1Content2 || "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services after changes are posted constitutes acceptance of the modified terms."}
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">2️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">{t?.legal?.useOfServices || "Use of Services"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection2Content1 || "GameHub Central provides free access to HTML5 games and related content. You may use our services for personal, non-commercial purposes in accordance with these terms."}
                </p>
                <p className="font-medium">{t?.legal?.termsSection2Content2 || "You agree NOT to:"}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t?.legal?.termsSection2List1 || "Use our services for any illegal or unauthorized purpose"}</li>
                  <li>{t?.legal?.termsSection2List2 || "Attempt to hack, reverse engineer, or modify any games or content"}</li>
                  <li>{t?.legal?.termsSection2List3 || "Distribute viruses or harmful code through our platform"}</li>
                  <li>{t?.legal?.termsSection2List4 || "Violate any applicable laws or regulations"}</li>
                  <li>{t?.legal?.termsSection2List5 || "Interfere with or disrupt our services or servers"}</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">3️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">{t?.legal?.intellectualProperty || "Intellectual Property"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection3Content1 || "All content on GameHub Central, including games, graphics, text, and software, is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws."}
                </p>
                <p>
                  {t?.legal?.termsSection3Content2 || "You may not copy, reproduce, distribute, or create derivative works from our content without explicit written permission. Games are provided for your personal enjoyment only."}
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="card cartoon-shadow border-4 border-accent-3 transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">4️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-3">{t?.legal?.userConduct || "User Conduct"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection4Content1 || "You are responsible for your conduct while using our services. We expect all users to:"}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t?.legal?.termsSection4List1 || "Respect other users and maintain a friendly environment"}</li>
                  <li>{t?.legal?.termsSection4List2 || "Use appropriate language and behavior"}</li>
                  <li>{t?.legal?.termsSection4List3 || "Report any technical issues or inappropriate content"}</li>
                  <li>{t?.legal?.termsSection4List4 || "Respect the integrity of games and not attempt to cheat or exploit"}</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">5️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-4">{t?.legal?.privacyAndData || "Privacy and Data"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection5Content1 || "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using our services, you consent to our data practices as described in our Privacy Policy."}
                </p>
                <p>
                  {t?.legal?.termsSection5Content2 || "We do not require personal information to play games. Any data collected is used solely to improve your gaming experience and our services."}
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">6️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">{t?.legal?.disclaimers || "Disclaimers"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection6Content1 || "Our services are provided 'as is' without warranties of any kind. We do not guarantee that:"}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t?.legal?.termsSection6List1 || "Our services will be uninterrupted or error-free"}</li>
                  <li>{t?.legal?.termsSection6List2 || "All games will work on every device or browser"}</li>
                  <li>{t?.legal?.termsSection6List3 || "Content will always be available or up-to-date"}</li>
                  <li>{t?.legal?.termsSection6List4 || "Our services will meet your specific requirements"}</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">7️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">{t?.legal?.limitationOfLiability || "Limitation of Liability"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection7Content1 || "GameHub Central shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our services, including but not limited to lost profits, data loss, or business interruption."}
                </p>
                <p>
                  {t?.legal?.termsSection7Content2 || "Our total liability to you shall not exceed the amount paid by you to use our services (which is currently zero, as our services are free)."}
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">8️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">{t?.legal?.termination || "Termination"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection8Content1 || "We reserve the right to terminate or suspend access to our services at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other users or our services."}
                </p>
                <p>
                  {t?.legal?.termsSection8Content2 || "You may discontinue using our services at any time. Upon termination, your right to use our services ceases immediately."}
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="card cartoon-shadow border-4 border-accent-2 transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.8s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">9️⃣</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-2">{t?.legal?.contactInfo || "Contact Information"}</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  {t?.legal?.termsSection9Content1 || "If you have questions about these Terms of Service, please contact us:"}
                </p>
                <div className="bg-gradient-to-r from-accent-2/10 to-primary/10 rounded-xl p-4 border-2 border-accent-2/20">
                  <p><strong>{t?.legal?.email || "Email"}:</strong> support@speed-stars.net</p>
                  <p><strong>{t?.legal?.address || "Address"}:</strong> 36 Central Avenue, California, USA</p>
                  <p><strong>{t?.legal?.phone || "Phone"}:</strong> +1 (607) 023-1235</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-16 text-center">
            <div className="card cartoon-shadow border-4 border-primary max-w-2xl mx-auto transform hover:scale-105 transition-transform pop-in">
              <div className="text-center">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-2xl font-black text-white mb-4">{t?.legal?.relatedDocuments || "Related Documents"}</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/privacy"
                    className="btn-secondary text-lg jello"
                  >
                    {t?.footer?.privacyPolicy || "Privacy Policy"}
                  </Link>
                  <Link
                    href="/cookies"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.1s" }}
                  >
                    {t?.footer?.cookiePolicy || "Cookie Policy"}
                  </Link>
                  <Link
                    href="/dmca"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {t?.footer?.dmca || "DMCA Policy"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer t={t}  lang={lang} />
    </main>
  )
}