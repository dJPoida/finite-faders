import { hamiltonRound } from "./rounding"

export type DistributionMode = "proportional" | "equal" | "largest-first"

export interface RedistributeState {
  floats: number[]   // hidden precise values
  locks: boolean[]   // true = do NOT auto-reduce / auto-fill
  pool: number       // integer points not yet assigned
  total?: number     // default 100
}

export function getDisplayInts(state: RedistributeState): number[] {
  const total = state.total ?? 100
  return hamiltonRound(state.floats, total)
}

// --- Main actions ---

export function increaseEntity(
  state: RedistributeState,
  index: number,
  deltaInt: number,
  mode: DistributionMode = "proportional"
): RedistributeState {
  let { floats, locks, pool } = cloneState(state)

  // 1) Consume pool first
  const consume = Math.min(pool, deltaInt)
  floats[index] += consume
  pool -= consume
  let remaining = deltaInt - consume

  // 2) If still needed, redistribute from others
  if (remaining > 0) {
    remaining -= reduceOthers(floats, locks, index, remaining, mode)
  }

  return { floats, locks, pool, total: state.total }
}

export function decreaseEntity(
  state: RedistributeState,
  index: number,
  deltaInt: number
): RedistributeState {
  let { floats, locks, pool } = cloneState(state)

  const release = Math.min(deltaInt, Math.floor(floats[index]))
  floats[index] -= release
  pool += release
  if (floats[index] < 0) floats[index] = 0

  return { floats, locks, pool, total: state.total }
}

export function distributePool(
  state: RedistributeState,
  mode: DistributionMode = "proportional"
): RedistributeState {
  let { floats, locks, pool } = cloneState(state)
  if (pool <= 0) return state

  const eligibles = floats.map((_, i) => i).filter((i) => !locks[i])
  if (eligibles.length === 0) return state

  const add = Math.min(pool, pool) // all of it
  fillEligibles(floats, eligibles, add, mode)
  pool -= add

  return { floats, locks, pool, total: state.total }
}

// --- Helpers ---

function reduceOthers(
  floats: number[],
  locks: boolean[],
  index: number,
  delta: number,
  mode: DistributionMode
): number {
  const eligibles = floats
    .map((v, i) => ({ i, v }))
    .filter((e) => e.i !== index && !locks[e.i] && e.v > 0)
    .map((e) => e.i)

  if (eligibles.length === 0) return 0

  switch (mode) {
    case "proportional": return reduceProportional(floats, eligibles, index, delta)
    case "equal": return reduceEqual(floats, eligibles, index, delta)
    case "largest-first": return reduceLargestFirst(floats, eligibles, index, delta)
  }
}

function reduceProportional(floats: number[], eligibles: number[], index: number, delta: number) {
  const available = eligibles.reduce((s, i) => s + floats[i], 0)
  if (available <= 1e-10) return 0 // Protect against very small numbers due to float precision
  let removed = 0
  for (const i of eligibles) {
    const proportion = floats[i] / available
    const take = Math.min(proportion * delta, floats[i])
    floats[i] = Math.max(0, floats[i] - take) // Ensure never negative
    removed += take
  }
  floats[index] += removed
  return removed
}

function reduceEqual(floats: number[], eligibles: number[], index: number, delta: number) {
  const share = Math.floor(delta / eligibles.length)
  let removed = 0
  for (const i of eligibles) {
    const take = Math.min(share, floats[i])
    floats[i] -= take
    removed += take
  }
  floats[index] += removed
  return removed
}

function reduceLargestFirst(floats: number[], eligibles: number[], index: number, delta: number) {
  let removed = 0
  let remaining = delta
  while (remaining > 0 && eligibles.length > 0) {
    eligibles.sort((a, b) => floats[b] - floats[a] || a - b)
    const i = eligibles[0]
    if (floats[i] <= 0) break
    floats[i] -= 1
    floats[index] += 1
    removed += 1
    remaining -= 1
  }
  return removed
}

function fillEligibles(floats: number[], eligibles: number[], pool: number, mode: DistributionMode) {
  switch (mode) {
    case "equal": {
      const share = Math.floor(pool / eligibles.length)
      for (const i of eligibles) floats[i] += share
      const remainder = pool % eligibles.length
      for (let r = 0; r < remainder; r++) floats[eligibles[r]] += 1
      return pool
    }
    case "largest-first": {
      let remaining = pool
      while (remaining > 0) {
        eligibles.sort((a, b) => floats[b] - floats[a] || a - b)
        floats[eligibles[0]] += 1
        remaining--
      }
      return pool
    }
    case "proportional":
    default: {
      const total = eligibles.reduce((s, i) => s + floats[i], 0)
      if (total <= 1e-10) {
        // If all values are effectively zero, distribute equally
        const share = pool / eligibles.length
        for (const i of eligibles) floats[i] += share
      } else {
        // Normal proportional distribution
        for (const i of eligibles) floats[i] += (floats[i] / total) * pool
      }
      return pool
    }
  }
}

function cloneState(s: RedistributeState): RedistributeState {
  return {
    floats: [...s.floats],
    locks: [...s.locks],
    pool: s.pool,
    total: s.total ?? 100,
  }
}
