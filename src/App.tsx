import { useRef, useEffect, useState } from "react"
import Header from "@/components/Header"
import FaderBank from "@/components/FaderBank"
import Footer from "@/components/Footer"
import Onboarding from "@/components/Modals/Onboarding"
import ClientOnlyStore from "@/components/ClientOnlyStore"
import UnitSelection from "@/components/Modals/UnitSelection"
import { useSimpleStore } from "@/lib/simple-store"

export default function App() {
  const faderBankRef = useRef<HTMLDivElement>(null)
  const { unit, setUnit } = useSimpleStore()
  const [showUnitModal, setShowUnitModal] = useState(false)

  // Fix mobile viewport height to account for browser chrome
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)

    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <Header faderBankRef={faderBankRef} />

      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 min-h-0">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-2 sm:mb-4 flex-shrink-0">
            <h2 className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
              Allocate your finite capacity across what matters most
            </h2>
          </div>

          <ClientOnlyStore>
            <FaderBank ref={faderBankRef} className="w-full" style={{ height: 'calc(var(--vh, 1vh) * 60)' }} />
          </ClientOnlyStore>

          <div className="flex-shrink-0 mt-3 sm:mt-4">
            <div className="flex flex-wrap items-center justify-center gap-1">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                How much
              </span>
              <button
                onClick={() => setShowUnitModal(true)}
                className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-bold hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer underline decoration-dotted decoration-2"
                title="Click to change unit"
              >
                {unit}
              </button>
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                you have to go around!
              </span>
            </div>
          </div>
        </div>
      </main>

      <ClientOnlyStore>
        <Footer />
      </ClientOnlyStore>
      <ClientOnlyStore>
        <Onboarding />
      </ClientOnlyStore>
      <UnitSelection
        isOpen={showUnitModal}
        onClose={() => setShowUnitModal(false)}
        onSave={setUnit}
        currentUnit={unit}
      />
    </div>
  )
}