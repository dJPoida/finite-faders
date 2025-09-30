"use client"

import { presets, type Preset } from "@/data/presets"

interface PresetSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectPreset: (preset: Preset) => void
}

export default function PresetSelector({ isOpen, onClose, onSelectPreset }: PresetSelectorProps) {
  if (!isOpen) return null

  const handleSelectPreset = (preset: Preset) => {
    onSelectPreset(preset)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Load Preset Scenario
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose a starting point for your allocation
          </p>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {preset.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {preset.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {preset.entities.map((entity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entity.color }}
                          />
                          {entity.label} ({entity.value}%)
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 rounded">
                      {preset.unit}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}