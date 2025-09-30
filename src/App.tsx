import { useRef, useEffect } from "react"
import Header from "@/components/Header"
import FaderBank from "@/components/FaderBank"
import Footer from "@/components/Footer"
import Onboarding from "@/components/Modals/Onboarding"
import ClientOnlyStore from "@/components/ClientOnlyStore"

export default function App() {
  const faderBankRef = useRef<HTMLDivElement>(null)

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
        <div className="w-full h-full max-w-6xl mx-auto flex flex-col">
          <div className="text-center mb-2 sm:mb-4 flex-shrink-0">
            <h2 className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
              Allocate your finite capacity across what matters most
            </h2>
          </div>

          <ClientOnlyStore>
            <FaderBank ref={faderBankRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex-1 min-h-0" />
          </ClientOnlyStore>
        </div>
      </main>

      <ClientOnlyStore>
        <Footer />
      </ClientOnlyStore>
      <ClientOnlyStore>
        <Onboarding />
      </ClientOnlyStore>
    </div>
  )
}