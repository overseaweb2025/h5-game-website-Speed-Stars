import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, MailIcon, PhoneIcon, MapPinIcon, SendIcon, MessageCircleIcon, ClockIcon } from "lucide-react"
import type { Metadata } from "next"
import { getDictionary } from "@/lib/lang/i18n"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact Us | GameHub Central - Get in Touch",
  description:
    "Contact GameHub Central for support, feedback, or inquiries. We're here to help make your gaming experience even better.",
  keywords: "contact GameHub Central, support, feedback, help, gaming support",
  openGraph: {
    title: "Contact Us | GameHub Central - Get in Touch",
    description:
      "Contact GameHub Central for support, feedback, or inquiries. We're here to help make your gaming experience even better.",
    url: "https://speed-stars.net/contact",
    siteName: "GameHub Central",
    images: [
      {
        url: "https://speed-stars.net/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact GameHub Central",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/contact",
}

export default async function ContactPage({params}: {params: {lang: string}}) {
  const lang = params.lang as "en" | "zh";
  const t = await getDictionary(lang);

  return (
    <main className="bg-background">
      <Header t={t} />

      <section className="py-12 md:py-16 bg-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">📧</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          💬
        </div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-15 pop-in" style={{ animationDelay: "0.6s" }}>
          📞
        </div>

        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8 flex justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-primary hover:text-primary-hover font-black text-lg group bg-white rounded-full px-6 py-3 shadow-cartoon border-4 border-primary cartoon-shadow transform hover:scale-110 hover:rotate-2 transition-all jello"
            >
              <ChevronLeftIcon className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
              {t?.common?.backToHome || "Back to Home"}
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 pop-in">
              {t?.contact?.contactGameHubCentral || "Contact GameHub Central"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              {t?.contact?.contactDescription || "We'd love to hear from you! Get in touch with our team"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[1deg] transition-transform duration-300 pop-in">
                <div className="text-center">
                  <div className="text-5xl mb-4">📧</div>
                  <h3 className="text-2xl font-black text-primary mb-3">{t?.contact?.emailUs || "Email Us"}</h3>
                  <p className="text-gray-200 mb-4">
                    {t?.contact?.emailDescription || "Send us an email and we'll get back to you within 24 hours"}
                  </p>
                  <a 
                    href="mailto:support@speed-stars.net" 
                    className="text-primary hover:text-primary-hover font-black text-lg hover:scale-110 transition-all inline-block"
                  >
                    support@speed-stars.net
                  </a>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[-1deg] transition-transform duration-300 pop-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-center">
                  <div className="text-5xl mb-4">📞</div>
                  <h3 className="text-2xl font-black text-secondary mb-3">{t?.contact?.callUs || "Call Us"}</h3>
                  <p className="text-gray-200 mb-4">
                    {t?.contact?.callDescription || "Available Monday to Friday, 9 AM - 6 PM PST"}
                  </p>
                  <a 
                    href="tel:+16070231235" 
                    className="text-secondary hover:text-secondary-hover font-black text-lg hover:scale-110 transition-all inline-block"
                  >
                    +1 (607) 023-1235
                  </a>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[1deg] transition-transform duration-300 pop-in" style={{ animationDelay: "0.4s" }}>
                <div className="text-center">
                  <div className="text-5xl mb-4">📍</div>
                  <h3 className="text-2xl font-black text-accent mb-3">{t?.contact?.visitUs || "Visit Us"}</h3>
                  <p className="text-gray-200">
                    36 Central Avenue<br />
                    California, USA
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm t={t} />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 pop-in">
                {t?.contact?.frequentlyAskedQuestions || "Frequently Asked"} <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                {t?.contact?.quickAnswers || "Quick answers to common questions"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card cartoon-shadow border-4 border-accent-2 transform hover:rotate-[1deg] transition-transform pop-in">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎮</div>
                  <h3 className="text-xl font-black text-accent-2 mb-3">{t?.contact?.allGamesFree || "Are all games really free?"}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {t?.contact?.allGamesFreeAnswer || "Yes! All games on GameHub Central are completely free to play. No hidden fees, subscriptions, or in-app purchases required."}
                  </p>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[-1deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
                <div className="text-center">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="text-xl font-black text-accent-4 mb-3">{t?.contact?.gamesWorkMobile || "Do games work on mobile?"}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {t?.contact?.gamesWorkMobileAnswer || "Absolutely! Our HTML5 games are designed to work seamlessly on smartphones, tablets, and desktop computers."}
                  </p>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[1deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-xl font-black text-secondary mb-3">{t?.contact?.whyGameNotLoad || "Why won't a game load?"}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {t?.contact?.whyGameNotLoadAnswer || "Try refreshing the page or clearing your browser cache. If issues persist, contact our support team for assistance."}
                  </p>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[-1deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-center">
                  <div className="text-4xl mb-3">🔒</div>
                  <h3 className="text-xl font-black text-primary mb-3">{t?.contact?.isDataSafe || "Is my data safe?"}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {t?.contact?.isDataSafeAnswer || "Yes! We prioritize your privacy and security. We don't collect personal information unless you voluntarily provide it."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="text-center">
            <div className="card cartoon-shadow border-4 border-accent-3 max-w-2xl mx-auto transform hover:scale-105 transition-transform pop-in">
              <div className="text-center">
                <div className="text-5xl mb-4">⏱️</div>
                <h3 className="text-2xl font-black text-white mb-4">{t?.contact?.responseTimes || "Response Times"}</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">{t?.contact?.generalInquiries || "General Inquiries"}</span>
                    <span className="font-black text-accent-3">{t?.contact?.hours24 || "24 hours"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">{t?.contact?.technicalSupportTime || "Technical Support"}</span>
                    <span className="font-black text-primary">{t?.contact?.hours12 || "12 hours"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">{t?.contact?.bugReports || "Bug Reports"}</span>
                    <span className="font-black text-secondary">{t?.contact?.hours6 || "6 hours"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer t={t} />
    </main>
  )
}