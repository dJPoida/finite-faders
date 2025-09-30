"use client"

import { useState, useRef, useEffect } from "react"
import { useSimpleStore } from "@/lib/simple-store"
import { Save, FolderOpen, RotateCcw, Share2, Menu, X, Edit3, Info } from "lucide-react"
import html2canvas from "html2canvas"
import About from "@/components/Modals/About"

interface HeaderProps {
  faderBankRef?: React.RefObject<HTMLDivElement | null>
}

export default function Header({ faderBankRef }: HeaderProps) {
  const { reset, editMode, setEditMode } = useSimpleStore()
  const [showSaveLoad, setShowSaveLoad] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.menu-container')) {
        setMenuOpen(false)
      }
    }

    // Delay adding the listener to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  const handleMenuAction = (action: () => void) => {
    action()
    setMenuOpen(false)
  }

  return (
    <>
      <header className="w-full p-2 sm:p-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Finite Faders
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editMode
                  ? "text-gray-700 dark:text-gray-300 bg-blue-100 dark:bg-blue-900"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={editMode ? "Exit edit mode" : "Edit mode"}
              aria-label={editMode ? "Exit edit mode" : "Edit mode"}
            >
              <Edit3 size={24} />
            </button>

            <div className="relative menu-container">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Menu"
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <button
                  onClick={() => handleMenuAction(handleSave)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <Save size={18} className="text-green-500" />
                  <span>Save</span>
                </button>

                <button
                  onClick={() => handleMenuAction(handleLoad)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <FolderOpen size={18} className="text-purple-500" />
                  <span>Load</span>
                </button>

                <button
                  onClick={() => handleMenuAction(handleShare)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <Share2 size={18} className="text-orange-500" />
                  <span>Share</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                <button
                  onClick={() => handleMenuAction(handleReset)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <RotateCcw size={18} className="text-red-500" />
                  <span>Reset</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                <button
                  onClick={() => handleMenuAction(() => setShowAbout(true))}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <Info size={18} className="text-blue-500" />
                  <span>About</span>
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />

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