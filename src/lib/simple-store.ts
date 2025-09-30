import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SimpleAppState {
  values: number[] // Integer values that always sum to 100
  locks: boolean[] // Locked faders won't auto-adjust
  labels: string[] // Custom labels for each entity
  colors: string[] // Custom colors for each entity
  unit: string
  _dragInitialValues: number[] | null // Captured values at start of drag for weighted distribution
  _hasHydrated: boolean
  setValue: (index: number, newValue: number) => void
  toggleLock: (index: number) => void
  updateLabel: (index: number, label: string) => void
  updateColor: (index: number, color: string) => void
  setUnit: (unit: string) => void
  addEntity: () => void
  removeEntity: (index: number) => void
  loadPreset: (preset: { values: number[], locks: boolean[], labels: string[], colors: string[], unit: string }) => void
  startDrag: () => void
  endDrag: () => void
  reset: () => void
  setHasHydrated: (state: boolean) => void
}

const defaultColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#F97316", "#06B6D4", "#84CC16"]

const initialState = {
  values: [25, 25, 25, 25], // Start with equal distribution
  locks: [false, false, false, false],
  labels: ["Entity 1", "Entity 2", "Entity 3", "Entity 4"],
  colors: [defaultColors[0], defaultColors[1], defaultColors[2], defaultColors[3]],
  unit: "Time",
  _dragInitialValues: null,
  _hasHydrated: false,
}

// Redistribute remaining points among unlocked entities using weighted distribution
function redistributeToSum100(
  values: number[],
  locks: boolean[],
  changedIndex: number,
  newValue: number,
  initialValues: number[] | null
): number[] {
  const result = [...values]

  // Calculate the sum of locked entities (excluding the one being changed)
  const lockedSum = result
    .map((val, i) => i !== changedIndex && locks[i] ? val : 0)
    .reduce((sum, val) => sum + val, 0)
  const maxPossible = 100 - lockedSum

  // Clamp the new value to valid range considering locked entities
  result[changedIndex] = Math.max(0, Math.min(maxPossible, Math.round(newValue)))

  // Find unlocked entities (excluding the one we just changed)
  const unlockedIndices = result
    .map((_, i) => i)
    .filter(i => i !== changedIndex && !locks[i])

  if (unlockedIndices.length === 0) {
    // If all other entities are locked, adjust the changed value to make sum = 100
    const maxPossible = 100 - result.filter((_, i) => i !== changedIndex).reduce((sum, val) => sum + val, 0)
    result[changedIndex] = Math.max(0, Math.min(100, maxPossible))
    return result
  }

  // Calculate how much remains for the other unlocked entities
  const remaining = 100 - result[changedIndex] - lockedSum

  // Use initial values as weights if available (during drag), otherwise use current values
  const weights = initialValues || result
  const weightSum = unlockedIndices.reduce((sum, idx) => sum + weights[idx], 0)

  if (weightSum === 0) {
    // If all weights are zero, distribute equally
    const perEntity = Math.floor(remaining / unlockedIndices.length)
    const remainder = remaining % unlockedIndices.length

    for (let i = 0; i < unlockedIndices.length; i++) {
      const idx = unlockedIndices[i]
      result[idx] = perEntity + (i < remainder ? 1 : 0)
    }
  } else {
    // Distribute proportionally based on initial weights using Hamilton method
    const allocations: { idx: number; base: number; fraction: number }[] = []

    for (const idx of unlockedIndices) {
      const proportion = weights[idx] / weightSum
      const ideal = remaining * proportion
      const base = Math.floor(ideal)
      const fraction = ideal - base

      allocations.push({ idx, base, fraction })
    }

    // Sort by fractional part (largest first) for Hamilton method
    allocations.sort((a, b) => b.fraction - a.fraction)

    // Calculate how many remainder points to distribute
    const baseSum = allocations.reduce((sum, a) => sum + a.base, 0)
    const remainderPoints = remaining - baseSum

    // Assign values
    for (let i = 0; i < allocations.length; i++) {
      const allocation = allocations[i]
      result[allocation.idx] = allocation.base + (i < remainderPoints ? 1 : 0)
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
        values: redistributeToSum100(state.values, state.locks, index, newValue, state._dragInitialValues)
      })),
      startDrag: () => set((state) => ({
        _dragInitialValues: [...state.values]
      })),
      endDrag: () => set({
        _dragInitialValues: null
      }),
      toggleLock: (index) => set((state) => ({
        locks: state.locks.map((locked, i) => i === index ? !locked : locked)
      })),
      updateLabel: (index, label) => set((state) => ({
        labels: state.labels.map((l, i) => i === index ? label : l)
      })),
      updateColor: (index, color) => set((state) => ({
        colors: state.colors.map((c, i) => i === index ? color : c)
      })),
      setUnit: (unit) => set({ unit }),
      addEntity: () => set((state) => {
        if (state.values.length >= 8) return state
        const newCount = state.values.length + 1
        const newLocks = [...state.locks, false]
        const newLabel = `Entity ${newCount}`
        const newColor = defaultColors[newCount % defaultColors.length]
        return {
          values: redistributeEqually(newCount, newLocks),
          locks: newLocks,
          labels: [...state.labels, newLabel],
          colors: [...state.colors, newColor]
        }
      }),
      removeEntity: (index) => set((state) => {
        if (state.values.length <= 1) return state
        const newValues = state.values.filter((_, i) => i !== index)
        const newLocks = state.locks.filter((_, i) => i !== index)
        const newLabels = state.labels.filter((_, i) => i !== index)
        const newColors = state.colors.filter((_, i) => i !== index)
        return {
          values: redistributeEqually(newValues.length, newLocks),
          locks: newLocks,
          labels: newLabels,
          colors: newColors
        }
      }),
      loadPreset: (preset) => set({
        values: preset.values,
        locks: preset.locks,
        labels: preset.labels,
        colors: preset.colors,
        unit: preset.unit
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