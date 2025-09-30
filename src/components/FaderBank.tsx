"use client"

import { forwardRef, useState } from "react"
import { useSimpleStore } from "@/lib/simple-store"
import Fader from "./Fader"
import AddEditEntity from "./Modals/AddEditEntity"

interface FaderBankProps {
  className?: string
  style?: React.CSSProperties
}

const FaderBank = forwardRef<HTMLDivElement, FaderBankProps>(({ className = "", style }, ref) => {
  const { values, locks, labels, colors, editMode, toggleLock, updateLabel, updateColor, addEntity, removeEntity } = useSimpleStore()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleSaveLabel = (entity: { label: string; color?: string; locked: boolean }) => {
    if (editingIndex !== null) {
      updateLabel(editingIndex, entity.label)
      if (entity.color) {
        updateColor(editingIndex, entity.color)
      }
      setEditingIndex(null)
    }
  }

  return (
    <>
      <div ref={ref} className={`w-full h-full flex flex-col ${className}`} style={style}>
        <div className="flex-1 flex flex-row gap-1 sm:gap-2 p-2 sm:p-4 overflow-x-auto items-stretch justify-center min-h-0">
          {values.map((value, index) => (
            <div key={index} className="relative group flex-shrink-0 h-full">
              <Fader
                index={index}
                label={labels[index]}
                color={colors[index]}
                value={value}
                locked={locks[index]}
                onToggleLock={() => toggleLock(index)}
                onEditLabel={() => setEditingIndex(index)}
              />
              {editMode && values.length > 2 && (
                <button
                  onClick={() => removeEntity(index)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 hover:bg-red-500 text-white rounded-full text-xs leading-none group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10"
                  title="Remove entity"
                  aria-label={`Remove ${labels[index]}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {editMode && values.length < 6 && (
            <button
              onClick={() => addEntity()}
              className="flex-shrink-0 h-full w-12 sm:w-16 md:w-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Add new entity"
            >
              <span className="text-lg sm:text-2xl">+</span>
              <span className="text-xs">Add</span>
            </button>
          )}
        </div>
      </div>

      <AddEditEntity
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        onSave={handleSaveLabel}
        initialData={editingIndex !== null ? { label: labels[editingIndex], color: colors[editingIndex], locked: locks[editingIndex] } : undefined}
      />
    </>
  )
})

FaderBank.displayName = "FaderBank"

export default FaderBank