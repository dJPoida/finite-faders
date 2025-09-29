"use client"

import { useCallback } from "react"
import html2canvas from "html2canvas"

interface ExportImageButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export default function ExportImageButton({ targetRef, className = "" }: ExportImageButtonProps) {
  const handleExport = useCallback(async () => {
    if (!targetRef.current) {
      alert("Nothing to export")
      return
    }

    try {
      const canvas = await html2canvas(targetRef.current)

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
      console.error("Export failed:", error)
      alert("Failed to export image. Please try again.")
    }
  }, [targetRef])

  return (
    <button
      onClick={handleExport}
      className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${className}`}
      title="Export faders as PNG image"
    >
      Export PNG
    </button>
  )
}