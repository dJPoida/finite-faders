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
  const { values, locks, labels, colors, updateLabel, updateColor, toggleLock, removeEntity } = useSimpleStore()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleSaveLabel = (entity: { label: string; color?: string; locked: boolean }) => {
    if (editingIndex !== null) {
      updateLabel(editingIndex, entity.label)
      if (entity.color) {
        updateColor(editingIndex, entity.color)
      }
      // Update lock state if it changed
      if (locks[editingIndex] !== entity.locked) {
        toggleLock(editingIndex)
      }
      setEditingIndex(null)
    }
  }

  const handleDelete = () => {
    if (editingIndex !== null) {
      removeEntity(editingIndex)
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
                onEditLabel={() => setEditingIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <AddEditEntity
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        onSave={handleSaveLabel}
        onDelete={values.length > 2 ? handleDelete : undefined}
        initialData={editingIndex !== null ? { label: labels[editingIndex], color: colors[editingIndex], locked: locks[editingIndex] } : undefined}
      />
    </>
  )
})

FaderBank.displayName = "FaderBank"

export default FaderBank