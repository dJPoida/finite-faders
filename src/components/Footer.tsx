"use client"

import { useSimpleStore } from "@/lib/simple-store"

const presetUnits = ["Time", "Effort", "Care", "F-given", "Love"]

export default function Footer() {
  const { unit, editMode } = useSimpleStore()

  return (
    <footer className="w-full p-2 sm:p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Unit:
            </span>
            {editMode ? (
              <>
                <select
                  id="unit-select"
                  value={unit}
                  onChange={(e) => useSimpleStore.setState({ unit: e.target.value })}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {presetUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>

                {unit === "Custom" && (
                  <input
                    type="text"
                    placeholder="Enter custom unit"
                    onChange={(e) => useSimpleStore.setState({ unit: e.target.value || "Custom" })}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </>
            ) : (
              <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
          Priorities that add up. Always.
        </div>
      </div>
    </footer>
  )
}