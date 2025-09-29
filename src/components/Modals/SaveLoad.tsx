"use client"

import { useState, useEffect } from "react"

interface Scenario {
  id: string
  name: string
  data: unknown
  savedAt: number
}

interface SaveLoadProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
  onLoad: (scenario: Scenario) => void
}

export default function SaveLoad({ isOpen, onClose, onSave, onLoad }: SaveLoadProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [saveName, setSaveName] = useState("")
  const [mode, setMode] = useState<"save" | "load">("save")

  useEffect(() => {
    if (isOpen) {
      loadScenarios()
    }
  }, [isOpen])

  const loadScenarios = () => {
    try {
      const saved = localStorage.getItem("finite-faders-scenarios")
      if (saved) {
        setScenarios(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load scenarios:", error)
    }
  }

  const handleSave = () => {
    if (!saveName.trim()) {
      alert("Please enter a name for this scenario")
      return
    }

    onSave(saveName.trim())
    setSaveName("")
    onClose()
  }

  const handleLoad = (scenario: Scenario) => {
    onLoad(scenario)
    onClose()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this scenario?")) {
      const updated = scenarios.filter((s) => s.id !== id)
      setScenarios(updated)
      localStorage.setItem("finite-faders-scenarios", JSON.stringify(updated))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Scenarios
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("save")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  mode === "save"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Save
              </button>
              <button
                onClick={() => setMode("load")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  mode === "load"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {mode === "save" ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="scenario-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scenario Name
                </label>
                <input
                  id="scenario-name"
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Enter a name for this scenario"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {scenarios.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No saved scenarios yet. Save your current configuration to create one.
                </p>
              ) : (
                scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {scenario.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Saved {new Date(scenario.savedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoad(scenario)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(scenario.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            {mode === "save" && (
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Save Scenario
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}