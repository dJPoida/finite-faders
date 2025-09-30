"use client"

import { useState } from "react"

interface AddEditEntityProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entity: { label: string; color?: string; locked: boolean }) => void
  onDelete?: () => void
  initialData?: {
    label: string
    color?: string
    locked: boolean
  }
}

const presetColors = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // yellow
  "#8B5CF6", // purple
  "#F97316", // orange
  "#06B6D4", // cyan
  "#84CC16", // lime
]

export default function AddEditEntity({ isOpen, onClose, onSave, onDelete, initialData }: AddEditEntityProps) {
  const [label, setLabel] = useState(initialData?.label || "")
  const [color, setColor] = useState(initialData?.color || presetColors[0])
  const [locked, setLocked] = useState(initialData?.locked || false)

  if (!isOpen) return null

  const handleSave = () => {
    if (!label.trim()) {
      alert("Please enter a label")
      return
    }

    onSave({
      label: label.trim(),
      color,
      locked,
    })

    setLabel("")
    setColor(presetColors[0])
    setLocked(false)
    onClose()
  }

  const handleCancel = () => {
    setLabel(initialData?.label || "")
    setColor(initialData?.color || presetColors[0])
    setLocked(initialData?.locked || false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          {initialData ? "Edit Entity" : "Add New Entity"}
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="entity-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Label
            </label>
            <input
              id="entity-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter entity name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  className={`w-12 h-8 rounded border-2 transition-colors ${
                    color === presetColor ? "border-gray-800 dark:border-gray-200" : "border-gray-300 dark:border-gray-600"
                  }`}
                  style={{ backgroundColor: presetColor }}
                  title={`Select ${presetColor}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="entity-locked"
              type="checkbox"
              checked={locked}
              onChange={(e) => setLocked(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="entity-locked" className="text-sm text-gray-700 dark:text-gray-300">
              Lock this entity (prevent auto-adjustment)
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {initialData && onDelete && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this entity?")) {
                  onDelete()
                  onClose()
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Delete entity"
            >
              Delete
            </button>
          )}
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
            {initialData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}