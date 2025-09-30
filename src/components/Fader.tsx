"use client"

import { useCallback } from "react"
import * as Slider from "@radix-ui/react-slider"
import { Lock } from "lucide-react"
import { useSimpleStore } from "@/lib/simple-store"

interface FaderProps {
  index: number
  label: string
  color: string
  value: number
  locked: boolean
  onEditLabel?: () => void
}

export default function Fader({ index, label, color, value, locked, onEditLabel }: FaderProps) {
  const { setValue, startDrag, endDrag } = useSimpleStore()

  const handleValueChange = useCallback(
    (newValues: number[]) => {
      setValue(index, newValues[0])
    },
    [index, setValue]
  )

  const handlePointerDown = useCallback(() => {
    startDrag()
  }, [startDrag])

  const handlePointerUp = useCallback(() => {
    endDrag()
  }, [endDrag])

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
    <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-gray-900 rounded-lg border-2 w-[70px] sm:w-[90px] h-full" style={{ borderColor: color }}>
      <button
        onClick={onEditLabel}
        className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center w-full flex-shrink-0 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer underline decoration-dotted decoration-2 leading-tight overflow-hidden"
        style={{
          height: '2.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
          alignItems: 'flex-start'
        }}
        title="Click to edit label"
      >
        {label}
      </button>

      <div className="relative flex-1 w-4 sm:w-6 flex justify-center min-h-0" style={{ touchAction: 'none' }}>
        <Slider.Root
          className="relative h-full w-full flex items-center justify-center"
          orientation="vertical"
          value={[value]}
          onValueChange={handleValueChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          min={0}
          max={100}
          step={1}
          aria-label={`${label} fader`}
          disabled={locked}
        >
          <Slider.Track className="relative bg-gray-200 dark:bg-gray-700 h-full w-2 rounded-full" style={{ touchAction: 'none' }}>
            <Slider.Range className="absolute w-full rounded-full" style={{ backgroundColor: color }} />
          </Slider.Track>
          <Slider.Thumb
            className={`block w-6 h-6 sm:w-5 sm:h-5 bg-white dark:bg-gray-800 border-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center ${
              locked ? 'rounded cursor-not-allowed' : 'rounded-full cursor-grab active:cursor-grabbing'
            }`}
            onKeyDown={handleKeyDown}
            aria-label={`${label} value: ${value}`}
            style={{ touchAction: 'none', borderColor: color, boxShadow: `0 0 0 2px ${color}` }}
          >
            {locked && <Lock size={12} className="text-gray-700 dark:text-gray-300" />}
          </Slider.Thumb>
        </Slider.Root>
      </div>

      <div className="flex flex-col items-center gap-1 w-full justify-center flex-shrink-0">
        <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-3 py-2 rounded text-lg font-bold font-mono min-w-[3rem] text-center">
          {value}
        </div>
      </div>
    </div>
  )
}