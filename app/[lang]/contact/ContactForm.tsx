"use client"

import { useState } from "react"
import { SendIcon } from "lucide-react"

interface ContactFormProps {
  t: any
}

export default function ContactForm({ t }: ContactFormProps) {
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
    <div className="card cartoon-shadow border-4 border-accent-3 transform hover:scale-[1.01] transition-transform duration-300 pop-in">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">💬</div>
        <h2 className="text-3xl md:text-4xl font-black text-accent-3 text-stroke">Send Us a Message</h2>
        <p className="text-gray-200 mt-2">Fill out the form below and we'll respond as soon as possible</p>
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
            <label htmlFor="name" className="block text-sm font-black text-white mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-white font-medium transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-black text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-white font-medium transition-colors"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-black text-white mb-2">
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-white font-medium transition-colors"
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
          <label htmlFor="message" className="block text-sm font-black text-white mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl border-4 border-primary/30 focus:border-primary focus:outline-none text-white font-medium transition-colors resize-vertical"
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
  )
}