"use client"

import { X, ExternalLink } from "lucide-react";

interface AboutProps {
  isOpen: boolean
  onClose: () => void
}

export default function About({ isOpen, onClose }: AboutProps) {
  if (!isOpen) return null

  const handleShareTool = async () => {
    const shareText = "You should check out Finite Faders - it makes balancing priorities so much easier!"
    const shareUrl = window.location.href

    // Debug: Check secure context
    const isSecureContext = window.isSecureContext
    console.log('Secure context:', isSecureContext)
    console.log('navigator.share available:', !!navigator.share)

    // Check if Web Share API is available and we're in a secure context
    if (navigator.share && isSecureContext) {
      try {
        await navigator.share({
          title: "Finite Faders",
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (error) {
        // User cancelled or share failed
        const errorName = (error as Error).name
        if (errorName === "AbortError") {
          return // User cancelled, do nothing
        }
        console.error("Share failed:", error)
        // Fall through to clipboard fallback
      }
    }

    // Fallback: Copy to clipboard
    try {
      if (!isSecureContext) {
        // In non-secure context, show a helpful message
        alert(`Web Share requires HTTPS. Share this link:\n\n${shareText}\n\n${shareUrl}`)
        return
      }

      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      alert("Share link copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      // Last resort: show in alert
      alert(`Share this link:\n\n${shareText}\n\n${shareUrl}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            About Finite Faders
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              What is Finite Faders?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Finite Faders is a tactile tool for balancing competing priorities in your life.
              It helps you visualize and allocate your finite capacity—whether that's time,
              effort, care, or any other resource that matters to you.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              How it works
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              All faders always sum to <strong>100%</strong>—representing your total available capacity.
              When you adjust one priority, others automatically rebalance proportionally. Lock specific
              faders to create constraints, and the tool handles the rest.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Perfect for resource allocation, priority management, capacity planning, or any scenario
              where you need to make constraint-based trade-off decisions.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleShareTool}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              Share this tool with others
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Priorities that add up. Always.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}