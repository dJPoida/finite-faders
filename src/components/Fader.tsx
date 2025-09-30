"use client"

import { useCallback } from "react"
import * as Slider from "@radix-ui/react-slider"
import { Lock } from "lucide-react"
import { useSimpleStore } from "@/lib/simple-store"

interface FaderProps {
  index: number
  label: string
  value: number
  locked: boolean
  onToggleLock: () => void
}

export default function Fader({ index, label, value, locked, onToggleLock }: FaderProps) {
  const { setValue } = useSimpleStore()

  const handleValueChange = useCallback(
    (newValues: number[]) => {
      setValue(index, newValues[0])
    },
    [index, setValue]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          setValue(index, value + 1)
          break
        case "ArrowDown":
          event.preventDefault()
          setValue(index, value - 1)
          break
        case "PageUp":
          event.preventDefault()
          setValue(index, value + 10)
          break
        case "PageDown":
          event.preventDefault()
          setValue(index, value - 10)
          break
        case "Home":
          event.preventDefault()
          setValue(index, 0)
          break
        case "End":
          event.preventDefault()
          setValue(index, 100)
          break
      }
    },
    [index, setValue, value]
  )

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 min-w-[60px] sm:min-w-[80px] h-full">
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center w-full truncate flex-shrink-0">
        {label}
      </span>

      <div className="relative flex-1 w-4 sm:w-6 flex justify-center min-h-0" style={{ touchAction: 'none' }}>
        <Slider.Root
          className="relative h-full w-full flex items-center justify-center"
          orientation="vertical"
          value={[value]}
          onValueChange={handleValueChange}
          min={0}
          max={100}
          step={1}
          aria-label={`${label} fader`}
          disabled={locked}
        >
          <Slider.Track className="relative bg-gray-200 dark:bg-gray-700 h-full w-2 rounded-full" style={{ touchAction: 'none' }}>
            <Slider.Range className="absolute bg-blue-500 w-full rounded-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-6 h-6 sm:w-5 sm:h-5 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-grab active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
            onKeyDown={handleKeyDown}
            aria-label={`${label} value: ${value}`}
            style={{ touchAction: 'none' }}
          />
        </Slider.Root>
      </div>

      <div className="flex flex-col items-center gap-1 w-full justify-center flex-shrink-0">
        <button
          onClick={onToggleLock}
          className={`p-2 rounded border flex items-center justify-center transition-colors ${
            locked
              ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
          title={locked ? "Unlock fader" : "Lock fader"}
          aria-label={locked ? "Unlock fader" : "Lock fader"}
        >
          <Lock size={16} />
        </button>
        <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-3 py-2 rounded text-lg font-bold font-mono min-w-[3rem] text-center">
          {value}
        </div>
      </div>
    </div>
  )
}