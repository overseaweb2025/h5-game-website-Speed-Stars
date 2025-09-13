"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQProps {
  t?: any;
}

export default function FAQ({ t }: FAQProps = {}) {
  const faqs = [
    {}
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-white mb-2 font-black text-shadow-lg">
            {t?.faq?.frequentlyAskedQuestions || "Frequently Asked Questions"}
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto font-medium">{t?.faq?.findAnswers || "Find answers to common questions about "}</p>
        </div>

        <div className="max-w-3xl mx-auto" itemScope >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-600/50 py-3"
              itemScope
              itemProp="mainEntity"
            >
              <button
                className="flex justify-between items-center w-full text-left font-bold text-lg text-white"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span itemProp="name">{faq.question}</span>
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`mt-2 text-gray-200 `}
                itemScope
                itemProp="acceptedAnswer"
              >
                <p itemProp="text">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
