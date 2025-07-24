"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from "lucide-react"

export default function DiagnosticTool() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{
    status: "success" | "warning" | "error" | null
    message: string
    solution: string
  } | null>(null)

  const questions = [
    {
      id: "browser",
      question: "Which browser are you using?",
      options: ["Chrome 90+", "Firefox 89+", "Edge 90+", "Safari 14+", "Other/Older browser"],
    },
    {
      id: "device",
      question: "What device are you using?",
      options: ["Desktop/Laptop", "Tablet", "Mobile Phone", "Other"],
    },
    {
      id: "connection",
      question: "What type of internet connection are you using?",
      options: ["Home WiFi", "School/Work WiFi", "Mobile Data (4G/5G)", "Public WiFi", "Other"],
    },
    {
      id: "error",
      question: "What type of error are you experiencing?",
      options: [
        "Game won't load at all",
        "Game loads but crashes",
        "Game is very slow/laggy",
        "Game loads but has missing elements",
        "Other",
      ],
    },
    {
      id: "webgl",
      question: "Have you checked if WebGL is enabled in your browser?",
      options: ["Yes, it's enabled", "No, it's disabled", "I don't know how to check"],
    },
  ]

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[step]
    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    setAnswers(newAnswers)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      // Analyze answers and provide a diagnosis
      analyzeDiagnosis(newAnswers)
    }
  }

  const analyzeDiagnosis = (userAnswers: Record<string, string>) => {
    // Simple diagnostic logic based on answers
    if (
      userAnswers.browser === "Other/Older browser" ||
      userAnswers.webgl === "No, it's disabled" ||
      userAnswers.webgl === "I don't know how to check"
    ) {
      setResult({
        status: "error",
        message: "Browser Compatibility Issue Detected",
        solution:
          "Your browser may not support modern H5 games. Try updating to Chrome 90+, Firefox 89+, or Edge 90+ and ensure WebGL is enabled (visit chrome://gpu or about:support).",
      })
    } else if (
      userAnswers.connection === "School/Work WiFi" ||
      userAnswers.connection === "Public WiFi" ||
      userAnswers.error === "Game loads but has missing elements"
    ) {
      setResult({
        status: "warning",
        message: "Network Restriction Detected",
        solution:
          "Your network may be blocking game resources. Try using mobile data (4G/5G) instead, or use Speed Stars Proxy service to bypass restrictions.",
      })
    } else if (userAnswers.error === "Game is very slow/laggy") {
      setResult({
        status: "warning",
        message: "Performance Issue Detected",
        solution:
          "Your device may be struggling with the game. Try closing other tabs/apps, clearing browser cache, or enabling hardware acceleration in browser settings.",
      })
    } else if (userAnswers.error === "Game loads but crashes") {
      setResult({
        status: "warning",
        message: "Memory or Resource Issue Detected",
        solution:
          "The game may be using too much memory. Try restarting your browser, updating your graphics drivers, or using a device with more resources.",
      })
    } else {
      setResult({
        status: "success",
        message: "Your setup should be compatible with Speed Stars games",
        solution:
          "If you're still experiencing issues, try clearing your browser cache, restarting your device, or contacting our support team with details about your specific problem.",
      })
    }
  }

  const resetDiagnostic = () => {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="card p-6 shadow-cartoon-lg mt-8">
      <h3 className="text-2xl font-black mb-4 text-center">
        <span className="gradient-text">Speed Stars Game Diagnostic Tool</span>
      </h3>

      {result ? (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl ${
              result.status === "success"
                ? "bg-green-100 border-2 border-green-500"
                : result.status === "warning"
                  ? "bg-yellow-100 border-2 border-yellow-500"
                  : "bg-red-100 border-2 border-red-500"
            }`}
          >
            <div className="flex items-center mb-2">
              {result.status === "success" ? (
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              ) : result.status === "warning" ? (
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500 mr-2" />
              )}
              <h4 className="text-xl font-bold">{result.message}</h4>
            </div>
            <p className="text-text/80">{result.solution}</p>
          </div>

          <div className="text-center">
            <button
              onClick={resetDiagnostic}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Run Another Diagnostic
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between mb-4">
            <span className="text-sm text-text/60">
              Question {step + 1} of {questions.length}
            </span>
            <span className="text-sm text-text/60">{Math.round(((step + 1) / questions.length) * 100)}% Complete</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-4 bg-accent/10 rounded-xl">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 text-primary mr-2" />
              {questions[step].question}
            </h4>

            <div className="space-y-2">
              {questions[step].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-3 bg-white hover:bg-primary/10 rounded-lg border-2 border-gray-200 hover:border-primary transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
