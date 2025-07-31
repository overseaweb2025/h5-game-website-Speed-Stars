"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQProps {
  t?: any;
}

export default function FAQ({ t }: FAQProps = {}) {
  const faqs = [
    {
      question: t?.faq?.whatIsSpeedStars || "What is Speed Stars?",
      answer: t?.faq?.whatIsSpeedStarsAnswer || "Speed Stars is a physics-based sprinting game where you control a runner by tapping alternately to simulate foot movements. It combines rhythm gameplay with hilarious ragdoll physics for an entertaining and challenging experience.",
    },
    {
      question: t?.faq?.isSpeedStarsFree || "Is Speed Stars free to play?",
      answer: t?.faq?.isSpeedStarsFreeAnswer || "Yes, Speed Stars is completely free to play online. You can access it from any device with a web browser without any restrictions.",
    },
    {
      question: t?.faq?.whatDoesUnblockedMean || "What does 'unblocked' mean?",
      answer: t?.faq?.unblockedMeaningAnswer || "Unblocked means you can play the game anywhere, even in environments where gaming websites might typically be restricted. Speed Stars Unblocked is accessible from school, work, or any other location.",
    },
    {
      question: t?.faq?.speedStarsControls || "What are the controls for Speed Stars?",
      answer: t?.faq?.speedStarsControlsAnswer || "The basic controls are: Left Arrow to move the left leg, Right Arrow to move the right leg, Up Arrow to lean forward, and Down Arrow to lean backward. Mastering the rhythm of these controls is key to success.",
    },
    {
      question: t?.faq?.canPlayOnMobile || "Can I play Speed Stars on mobile devices?",
      answer: t?.faq?.mobilePlayAnswer || "Yes, Speed Stars is fully optimized for mobile play. On touchscreen devices, you can tap the left and right sides of the screen to control your runner's legs.",
    },
    {
      question: t?.faq?.howToImprove || "How do I improve my times in Speed Stars?",
      answer: t?.faq?.improvementTipsAnswer || "Practice is key! Use the replay system to analyze your performance, focus on maintaining a consistent rhythm, and learn the optimal timing for each track. Start with shorter distances before attempting the 100-meter sprint.",
    },
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
          <p className="text-gray-200 max-w-2xl mx-auto font-medium">{t?.faq?.findAnswers || "Find answers to common questions about Speed Stars"}</p>
        </div>

        <div className="max-w-3xl mx-auto" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-600/50 py-3"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                className="flex justify-between items-center w-full text-left font-bold text-lg text-white"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span itemProp="name">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-300" />
                )}
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`mt-2 text-gray-200 ${openIndex === index ? "block" : "hidden"}`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
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
