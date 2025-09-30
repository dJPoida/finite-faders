"use client"

import { useState, useRef } from "react"
import { useSimpleStore } from "@/lib/simple-store"
import { Save, FolderOpen, RotateCcw, Share2 } from "lucide-react"
import html2canvas from "html2canvas"

interface HeaderProps {
  faderBankRef?: React.RefObject<HTMLDivElement | null>
}

export default function Header({ faderBankRef }: HeaderProps) {
  const { reset } = useSimpleStore()
  const [showSaveLoad, setShowSaveLoad] = useState(false)

  const handleSave = () => {
    setShowSaveLoad(true)
  }

  const handleLoad = () => {
    setShowSaveLoad(true)
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all faders?")) {
      reset()
    }
  }

  const handleShare = async () => {
    if (!faderBankRef?.current) {
      alert("Nothing to share")
      return
    }

    try {
      const canvas = await html2canvas(faderBankRef.current)

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Failed to create image")
          return
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const filename = `finite-faders-${timestamp}.png`

        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], filename, { type: "image/png" })
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: "Finite Faders Export",
                text: "My finite capacity allocation",
                files: [file],
              })
              return
            }
          } catch (shareError) {
            console.warn("Web Share failed, falling back to download:", shareError)
          }
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, "image/png")
    } catch (error) {
      console.error("Share failed:", error)
      alert("Failed to share image. Please try again.")
    }
  }

  return (
    <>
      <header className="w-full p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Finite Faders
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-1"
              title="Save current scenario"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={handleLoad}
              className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-1"
              title="Load saved scenario"
            >
              <FolderOpen size={16} />
              <span className="hidden sm:inline">Load</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center gap-1"
              title="Share faders as PNG image"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-1"
              title="Reset all faders"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {showSaveLoad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Save/Load Scenarios
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Save/Load functionality coming soon...
            </p>
            <button
              onClick={() => setShowSaveLoad(false)}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}