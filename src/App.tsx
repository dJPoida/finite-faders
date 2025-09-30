import { useRef } from "react"
import Header from "@/components/Header"
import FaderBank from "@/components/FaderBank"
import Footer from "@/components/Footer"
import Onboarding from "@/components/Modals/Onboarding"
import ClientOnlyStore from "@/components/ClientOnlyStore"

export default function App() {
  const faderBankRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header faderBankRef={faderBankRef} />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg text-gray-600 dark:text-gray-400">
              Allocate your finite capacity across what matters most
            </h2>
          </div>

          <ClientOnlyStore>
            <FaderBank ref={faderBankRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700" />
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