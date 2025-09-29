"use client"

import { useSimpleStore } from "@/lib/simple-store"

const presetUnits = ["Time", "Effort", "Care", "F-given", "Love"]

export default function Header() {
  const { unit } = useSimpleStore()

  return (
    <header className="w-full p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Finite Faders
        </h1>

        <div className="flex items-center gap-2">
          <label htmlFor="unit-select" className="text-sm text-gray-600 dark:text-gray-400">
            Unit:
          </label>
          <select
            id="unit-select"
            value={unit}
            onChange={(e) => useSimpleStore.setState({ unit: e.target.value })}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>
    </header>
  )
}