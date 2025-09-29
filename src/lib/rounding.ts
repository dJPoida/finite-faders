export function hamiltonRound(values: number[], target = 100): number[] {
    if (values.length === 0) return []
    const floors = values.map(Math.floor)
    const remainders = values.map((v, i) => ({ index: i, remainder: v - Math.floor(v), original: v }))
    const sum = floors.reduce((a, b) => a + b, 0)
    const budget = target - sum
    remainders.sort((a, b) => {
      if (b.remainder !== a.remainder) return b.remainder - a.remainder
      if (b.original !== a.original) return b.original - a.original
      return a.index - b.index
    })
    for (let i = 0; i < budget; i++) floors[remainders[i % remainders.length].index] += 1
    return floors
  }
  