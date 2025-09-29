"use client"

import { forwardRef } from "react"
import { useSimpleStore } from "@/lib/simple-store"
import Fader from "./Fader"

interface FaderBankProps {
  className?: string
}

const FaderBank = forwardRef<HTMLDivElement, FaderBankProps>(({ className = "" }, ref) => {
  const { values, locks, toggleLock, addEntity, removeEntity } = useSimpleStore()

  const faderLabels = values.map((_, i) => `Entity ${i + 1}`)

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="flex flex-row gap-2 p-4 overflow-x-auto min-h-[350px] items-end justify-center">
        {values.map((value, index) => (
          <div key={index} className="relative group">
            <Fader
              index={index}
              label={faderLabels[index]}
              value={value}
              locked={locks[index]}
              onToggleLock={() => toggleLock(index)}
            />
            {values.length > 1 && (
              <button
                onClick={() => removeEntity(index)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 hover:bg-red-500 text-white rounded-full text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                title="Remove entity"
                aria-label={`Remove ${faderLabels[index]}`}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {values.length < 8 && (
          <button
            onClick={() => addEntity()}
            className="min-h-[300px] w-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Add new entity"
          >
            <span className="text-2xl">+</span>
            <span className="text-xs">Add</span>
          </button>
        )}
      </div>
    </div>
  )
})

FaderBank.displayName = "FaderBank"

export default FaderBank