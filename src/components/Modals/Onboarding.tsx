"use client"

import { useState, useEffect } from "react"

const scenarios = [
  "You have 100 units of attention to distribute across your current projects. How would you allocate them?",
  "You have 100 units of emotional energy for your relationships this week. Where do they go?",
  "You have 100 units of care to give today. What deserves your focus?",
  "You have 100 units of effort for personal growth this month. What areas matter most?",
]

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)
  const [currentScenario, setCurrentScenario] = useState(0)

  useEffect(() => {
    const consent = localStorage.getItem("finite-faders-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleConsent = (accepted: boolean) => {
    if (accepted) {
      setHasConsented(true)
    } else {
      setIsVisible(false)
      localStorage.setItem("finite-faders-consent", "false")
    }
  }

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
    } else {
      setIsVisible(false)
      localStorage.setItem("finite-faders-consent", "true")
    }
  }

  const handleSkip = () => {
    setIsVisible(false)
    localStorage.setItem("finite-faders-consent", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 shadow-xl">
        {!hasConsented ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Welcome to Finite Faders
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This tool helps you visualize and manage your finite capacity across different areas of life.
              Your attention, energy, and care are limited resources - use them wisely.
            </p>
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="consent"
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => handleConsent(e.target.checked)}
              />
              <label htmlFor="consent" className="text-sm text-gray-700 dark:text-gray-300">
                I accept that my capacity is finite and I want to manage it thoughtfully.
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleConsent(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={handleNext}
                disabled={!hasConsented}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Scenario {currentScenario + 1} of {scenarios.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {scenarios[currentScenario]}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Skip Examples
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {currentScenario < scenarios.length - 1 ? "Next" : "Start Using"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}