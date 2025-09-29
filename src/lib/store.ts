import { create } from "zustand"
import { persist } from "zustand/middleware"
import { increaseEntity, decreaseEntity, distributePool, getDisplayInts, type RedistributeState } from "@/lib/redistribution"

interface AppState extends RedistributeState {
  unit: string
  _hasHydrated: boolean
  increase: (index: number, delta: number) => void
  decrease: (index: number, delta: number) => void
  distribute: () => void
  ints: () => number[]
  toggleLock: (index: number) => void
  addEntity: (label?: string) => void
  removeEntity: (index: number) => void
  reset: () => void
  setHasHydrated: (state: boolean) => void
}

const initialState = {
  floats: [0, 0, 0, 0],
  locks: [false, false, false, false],
  pool: 100,
  total: 100,
  unit: "Time",
  _hasHydrated: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      increase: (index, delta) => set((s) => increaseEntity(s, index, delta)),
      decrease: (index, delta) => set((s) => decreaseEntity(s, index, delta)),
      distribute: () => set((s) => distributePool(s)),
      ints: () => {
        const state = get()
        if (!state._hasHydrated) {
          return initialState.floats.map(() => 0)
        }
        // Only use Hamilton rounding if we have actually assigned some values
        const totalAssigned = state.floats.reduce((sum, val) => sum + val, 0)
        if (totalAssigned === 0) {
          return state.floats.map(() => 0)
        }
        return getDisplayInts(state)
      },
      toggleLock: (index) => set((s) => ({ ...s, locks: s.locks.map((v, i) => (i === index ? !v : v)) })),
      addEntity: (_label = `Entity ${get().floats.length + 1}`) =>
        set((s) => {
          if (s.floats.length >= 8) return s
          return { ...s, floats: [...s.floats, 0], locks: [...s.locks, false] }
        }),
      removeEntity: (index) =>
        set((s) => {
          if (s.floats.length <= 1) return s
          const floats = s.floats.slice()
          const removed = Math.floor(floats[index])
          floats.splice(index, 1)
          const locks = s.locks.slice()
          locks.splice(index, 1)
          return { ...s, floats, locks, pool: s.pool + removed }
        }),
      reset: () => set({ ...initialState, _hasHydrated: true }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "finite-faders:v1",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)