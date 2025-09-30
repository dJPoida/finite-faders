// Preset scenarios with predefined entity configurations
// These provide starting points for common allocation scenarios

export interface PresetEntity {
  label: string
  value: number
  locked: boolean
  color: string
}

export interface Preset {
  id: string
  name: string
  description: string
  unit: string
  entities: PresetEntity[]
}

const defaultColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#F97316", "#06B6D4", "#84CC16"]

export const presets: Preset[] = [
  {
    id: "family-work-balance",
    name: "Family vs Work (Three Kids)",
    description: "Balance time between children, work, and essential rest",
    unit: "Time",
    entities: [
      { label: "Kid A", value: 25, locked: false, color: defaultColors[0] },
      { label: "Kid B", value: 20, locked: false, color: defaultColors[1] },
      { label: "Kid C", value: 15, locked: false, color: defaultColors[2] },
      { label: "Work", value: 25, locked: false, color: defaultColors[3] },
      { label: "Sleep", value: 15, locked: true, color: defaultColors[4] }
    ]
  },
  {
    id: "screen-time-split",
    name: "2-Hour Screen Time Split",
    description: "Allocate screen time across entertainment and learning",
    unit: "Screen Time",
    entities: [
      { label: "Movie", value: 50, locked: false, color: defaultColors[0] },
      { label: "Minecraft", value: 30, locked: false, color: defaultColors[1] },
      { label: "YouTube", value: 15, locked: false, color: defaultColors[2] },
      { label: "Reading", value: 5, locked: false, color: defaultColors[3] }
    ]
  },
  {
    id: "work-life-juggle",
    name: "Work-Life Juggle",
    description: "Balance full-time job, side projects, and personal life",
    unit: "Time",
    entities: [
      { label: "Full-time Job", value: 45, locked: false, color: defaultColors[0] },
      { label: "Side Hustle", value: 15, locked: false, color: defaultColors[1] },
      { label: "Family", value: 20, locked: false, color: defaultColors[2] },
      { label: "Sleep", value: 20, locked: false, color: defaultColors[3] }
    ]
  },
  {
    id: "health-social-study",
    name: "Health • Social • Study",
    description: "Distribute energy across fitness, relationships, and learning",
    unit: "Energy",
    entities: [
      { label: "Fitness", value: 30, locked: false, color: defaultColors[0] },
      { label: "Meal Prep", value: 15, locked: false, color: defaultColors[1] },
      { label: "Social Life", value: 20, locked: false, color: defaultColors[2] },
      { label: "Study", value: 35, locked: false, color: defaultColors[3] }
    ]
  },
  {
    id: "creative-sprint",
    name: "Creative Sprint",
    description: "Allocate focus across creative projects and admin tasks",
    unit: "Focus",
    entities: [
      { label: "Writing", value: 35, locked: false, color: defaultColors[0] },
      { label: "Music", value: 25, locked: false, color: defaultColors[1] },
      { label: "Visual Design", value: 25, locked: false, color: defaultColors[2] },
      { label: "Admin", value: 15, locked: false, color: defaultColors[3] }
    ]
  },
  {
    id: "care-factor-meter",
    name: "Care Factor Meter",
    description: "Measure how much you care about different aspects of life",
    unit: "Care",
    entities: [
      { label: "News", value: 10, locked: false, color: defaultColors[0] },
      { label: "Social Media", value: 10, locked: false, color: defaultColors[1] },
      { label: "Office Politics", value: 5, locked: false, color: defaultColors[2] },
      { label: "Family", value: 40, locked: false, color: defaultColors[3] },
      { label: "Self", value: 35, locked: false, color: defaultColors[4] }
    ]
  }
]