"use client"

import { useState } from "react"

interface UnitSelectionProps {
  isOpen: boolean
  onClose: () => void
  onSave: (unit: string) => void
  currentUnit: string
}

const presetUnits = ["Time", "Effort", "Care", "Energy", "Love", "Focus", "Attention", "Money"]

export default function UnitSelection({ isOpen, onClose, onSave, currentUnit }: UnitSelectionProps) {
  const [selectedUnit, setSelectedUnit] = useState(currentUnit)
  const [customUnit, setCustomUnit] = useState("")
  const [isCustom, setIsCustom] = useState(!presetUnits.includes(currentUnit))

  if (!isOpen) return null

  const handleSave = () => {
    const unitToSave = isCustom ? (customUnit.trim() || "Custom") : selectedUnit
    onSave(unitToSave)
    onClose()
  }

  const handleCancel = () => {
    setSelectedUnit(currentUnit)
    setCustomUnit("")
    setIsCustom(!presetUnits.includes(currentUnit))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          Select Unit
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preset Units
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetUnits.map((unit) => (
                <button
                  key={unit}
                  onClick={() => {
                    setSelectedUnit(unit)
                    setIsCustom(false)
                  }}
                  className={`px-4 py-2 rounded-md border-2 transition-colors ${
                    !isCustom && selectedUnit === unit
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Unit
            </label>
            <input
              type="text"
              value={customUnit}
              onChange={(e) => {
                setCustomUnit(e.target.value)
                setIsCustom(true)
              }}
              onFocus={() => setIsCustom(true)}
              placeholder="Enter your own unit"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}