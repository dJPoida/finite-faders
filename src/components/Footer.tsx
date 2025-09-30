"use client"

import { useState } from "react"
import { useSimpleStore } from "@/lib/simple-store"
import UnitSelection from "@/components/Modals/UnitSelection"

export default function Footer() {
  const { unit, setUnit } = useSimpleStore()
  const [showUnitModal, setShowUnitModal] = useState(false)

  return (
    <>
      <footer className="w-full p-2 sm:p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              How much
            </span>
            <button
              onClick={() => setShowUnitModal(true)}
              className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-bold hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer underline decoration-dotted decoration-2"
              title="Click to change unit"
            >
              {unit}
            </button>
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              you have to go around!
            </span>
          </div>

          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
            Priorities that add up. Always.
          </div>
        </div>
      </footer>

      <UnitSelection
        isOpen={showUnitModal}
        onClose={() => setShowUnitModal(false)}
        onSave={setUnit}
        currentUnit={unit}
      />
    </>
  )
}