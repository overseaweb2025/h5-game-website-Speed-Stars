"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, MailIcon, PhoneIcon, MapPinIcon, SendIcon, MessageCircleIcon, ClockIcon } from "lucide-react"
import type { Metadata } from "next"

const metadata: Metadata = {
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus("success")
      setIsSubmitting(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 2000)
  }

  return (
    <main className="bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
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
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-text mb-4 pop-in">
              Contact <span className="gradient-text">GameHub Central</span>
            </h1>
            <p className="text-xl md:text-2xl text-text/80 max-w-3xl mx-auto">
              We'd love to hear from you! Get in touch with our team
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[1deg] transition-transform duration-300 pop-in">
                <div className="text-center">
                  <div className="text-5xl mb-4">📧</div>
                  <h3 className="text-2xl font-black text-primary mb-3">Email Us</h3>
                  <p className="text-text/80 mb-4">
                    Send us an email and we'll get back to you within 24 hours
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
                  <h3 className="text-2xl font-black text-secondary mb-3">Call Us</h3>
                  <p className="text-text/80 mb-4">
                    Available Monday to Friday, 9 AM - 6 PM PST
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
                  <h3 className="text-2xl font-black text-accent mb-3">Visit Us</h3>
                  <p className="text-text/80">
                    36 Central Avenue<br />
                    California, USA
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card cartoon-shadow border-4 border-accent-3 transform hover:scale-[1.01] transition-transform duration-300 pop-in">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">💬</div>
                  <h2 className="text-3xl md:text-4xl font-black text-accent-3 text-stroke">Send Us a Message</h2>
                  <p className="text-text/80 mt-2">Fill out the form below and we'll respond as soon as possible</p>
                </div>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-100 border-4 border-green-500 rounded-2xl text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-green-800 font-black">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-black text-text mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-text font-medium transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-black text-text mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-text font-medium transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-black text-text mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-text font-medium transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-black text-text mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-text font-medium transition-colors resize-vertical"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary text-xl jello disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-5 h-5 mr-2 inline" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-text mb-4 pop-in">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-xl text-text/80 max-w-2xl mx-auto">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card cartoon-shadow border-4 border-accent-2 transform hover:rotate-[1deg] transition-transform pop-in">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎮</div>
                  <h3 className="text-xl font-black text-accent-2 mb-3">Are all games really free?</h3>
                  <p className="text-text/80 text-sm leading-relaxed">
                    Yes! All games on GameHub Central are completely free to play. No hidden fees, subscriptions, or in-app purchases required.
                  </p>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[-1deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
                <div className="text-center">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="text-xl font-black text-accent-4 mb-3">Do games work on mobile?</h3>
                  <p className="text-text/80 text-sm leading-relaxed">
                    Absolutely! Our HTML5 games are designed to work seamlessly on smartphones, tablets, and desktop computers.
                  </p>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[1deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-xl font-black text-secondary mb-3">Why won't a game load?</h3>
                  <p className="text-text/80 text-sm leading-relaxed">
                    Try refreshing the page or clearing your browser cache. If issues persist, contact our support team for assistance.
                  </p>
                </div>
              </div>

              <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[-1deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-center">
                  <div className="text-4xl mb-3">🔒</div>
                  <h3 className="text-xl font-black text-primary mb-3">Is my data safe?</h3>
                  <p className="text-text/80 text-sm leading-relaxed">
                    Yes! We prioritize your privacy and security. We don't collect personal information unless you voluntarily provide it.
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
                <h3 className="text-2xl font-black text-text mb-4">Response Times</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-text/80">General Inquiries</span>
                    <span className="font-black text-accent-3">24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text/80">Technical Support</span>
                    <span className="font-black text-primary">12 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text/80">Bug Reports</span>
                    <span className="font-black text-secondary">6 hours</span>
                  </div>
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