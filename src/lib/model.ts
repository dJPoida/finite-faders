export type Unit = string
export type DistributionMode = 'proportional' | 'equal' | 'largest-first'

export interface Entity {
  id: string
  label: string
  valueInt: number
  valueFloat: number
  locked: boolean
  color?: string
}

export interface Scenario {
  id: string
  name: string
  unit: Unit
  entities: Entity[]
  distributionMode: DistributionMode
  step: 1
  totalBudget: 100
  updatedAt: number
}
