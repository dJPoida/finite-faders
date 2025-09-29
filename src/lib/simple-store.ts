import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SimpleAppState {
  values: number[] // Integer values that always sum to 100
  locks: boolean[] // Locked faders won't auto-adjust
  unit: string
  _hasHydrated: boolean
  setValue: (index: number, newValue: number) => void
  toggleLock: (index: number) => void
  addEntity: () => void
  removeEntity: (index: number) => void
  reset: () => void
  setHasHydrated: (state: boolean) => void
}

const initialState = {
  values: [25, 25, 25, 25], // Start with equal distribution
  locks: [false, false, false, false],
  unit: "Time",
  _hasHydrated: false,
}

// Redistribute remaining points among unlocked entities
function redistributeToSum100(values: number[], locks: boolean[], changedIndex: number, newValue: number): number[] {
  const result = [...values]

  // Calculate the maximum possible value for the changed entity
  const lockedSum = result
    .map((val, i) => i !== changedIndex && locks[i] ? val : 0)
    .reduce((sum, val) => sum + val, 0)
  const maxPossible = 100 - lockedSum

  // Clamp the new value to valid range considering locked entities
  result[changedIndex] = Math.max(0, Math.min(maxPossible, Math.round(newValue)))

  const currentSum = result.reduce((sum, val) => sum + val, 0)
  const diff = currentSum - 100

  if (diff === 0) return result

  // Find unlocked entities (excluding the one we just changed)
  const unlockedIndices = result
    .map((_, i) => i)
    .filter(i => i !== changedIndex && !locks[i])

  if (unlockedIndices.length === 0) {
    // If all other entities are locked, we need to adjust the changed value to make sum = 100
    const maxPossible = 100 - result.filter((_, i) => i !== changedIndex).reduce((sum, val) => sum + val, 0)
    result[changedIndex] = Math.max(0, Math.min(100, maxPossible))
    return result
  }

  // Distribute the difference among unlocked entities, preventing negatives
  let remaining = -diff
  const unlockedSum = unlockedIndices.reduce((sum, i) => sum + result[i], 0)

  if (unlockedSum === 0) {
    // If unlocked entities are all zero, distribute equally
    const perEntity = Math.max(0, Math.floor(remaining / unlockedIndices.length))
    const remainder = Math.max(0, remaining % unlockedIndices.length)

    for (let i = 0; i < unlockedIndices.length; i++) {
      const idx = unlockedIndices[i]
      result[idx] = perEntity + (i < remainder ? 1 : 0)
    }
  } else {
    // Distribute proportionally, but ensure no entity goes negative
    const changes: { idx: number; change: number }[] = []
    let totalChangeNeeded = remaining

    for (const idx of unlockedIndices) {
      const proportion = result[idx] / unlockedSum
      const idealChange = Math.round(proportion * remaining)
      const maxPossibleChange = remaining > 0 ? 100 - result[idx] : result[idx]
      const actualChange = Math.max(-maxPossibleChange, Math.min(maxPossibleChange, idealChange))

      changes.push({ idx, change: actualChange })
      totalChangeNeeded -= actualChange
    }

    // Apply the changes
    for (const { idx, change } of changes) {
      result[idx] = Math.max(0, Math.min(100, result[idx] + change))
    }

    // If we still have remaining change to distribute, do it iteratively
    let iterations = 0
    while (Math.abs(totalChangeNeeded) > 0 && iterations < 100) {
      const finalSum = result.reduce((sum, val) => sum + val, 0)
      const diff = 100 - finalSum

      if (diff === 0) break

      // Find entities that can still accept change
      const canAdjust = unlockedIndices.filter(idx => {
        if (diff > 0) return result[idx] < 100
        else return result[idx] > 0
      })

      if (canAdjust.length === 0) break

      // Distribute 1 point at a time to avoid overshooting
      const step = diff > 0 ? 1 : -1
      result[canAdjust[iterations % canAdjust.length]] += step
      totalChangeNeeded -= step
      iterations++
    }
  }

  return result
}

// Distribute total among entities when adding/removing
function redistributeEqually(count: number, locks: boolean[] = []): number[] {
  const values = new Array(count).fill(0)
  const unlocked = values.map((_, i) => !locks[i])
  const unlockedCount = unlocked.filter(Boolean).length

  if (unlockedCount === 0) {
    // If all locked, distribute equally anyway
    const perEntity = Math.floor(100 / count)
    const remainder = 100 % count
    for (let i = 0; i < count; i++) {
      values[i] = perEntity + (i < remainder ? 1 : 0)
    }
  } else {
    // Distribute among unlocked entities
    const perEntity = Math.floor(100 / unlockedCount)
    const remainder = 100 % unlockedCount
    let remainderCount = 0

    for (let i = 0; i < count; i++) {
      if (unlocked[i]) {
        values[i] = perEntity + (remainderCount < remainder ? 1 : 0)
        remainderCount++
      }
    }
  }

  return values
}

export const useSimpleStore = create<SimpleAppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setValue: (index, newValue) => set((state) => ({
        values: redistributeToSum100(state.values, state.locks, index, newValue)
      })),
      toggleLock: (index) => set((state) => ({
        locks: state.locks.map((locked, i) => i === index ? !locked : locked)
      })),
      addEntity: () => set((state) => {
        if (state.values.length >= 8) return state
        const newCount = state.values.length + 1
        const newLocks = [...state.locks, false]
        return {
          values: redistributeEqually(newCount, newLocks),
          locks: newLocks
        }
      }),
      removeEntity: (index) => set((state) => {
        if (state.values.length <= 1) return state
        const newValues = state.values.filter((_, i) => i !== index)
        const newLocks = state.locks.filter((_, i) => i !== index)
        return {
          values: redistributeEqually(newValues.length, newLocks),
          locks: newLocks
        }
      }),
      reset: () => set({ ...initialState, _hasHydrated: true }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "finite-faders-simple:v1",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)