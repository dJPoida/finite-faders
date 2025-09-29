# Finite Faders

A Next.js PWA (Progressive Web App) for allocating finite capacity across priorities using a mixing desk interface. Perfect for resource allocation, time management, budget distribution, or any scenario where you need to balance competing priorities within fixed constraints.

## Purpose & Objectives

**Finite Faders** provides an intuitive, tactile interface for proportional allocation tasks:

- **Resource Allocation**: Distribute team time, budget, or effort across projects
- **Priority Management**: Balance competing priorities within constraints
- **Capacity Planning**: Allocate finite resources optimally
- **Decision Making**: Visual tool for constraint-based trade-off decisions

The app enforces a fundamental constraint: **all sliders always sum to exactly 100**, representing 100% of available capacity.

## Features

### Core Functionality
- **Mixing Desk Interface**: Vertical faders arranged horizontally like a professional mixing console
- **Constraint Enforcement**: All sliders automatically sum to 100% - adjusting one redistributes others proportionally
- **Lock System**: Lock individual faders to prevent auto-adjustment, creating hard constraints
- **Smart Redistribution**: Handles edge cases like locked entities and impossible constraints gracefully
- **Keyboard Navigation**: Full accessibility with arrow keys, Page Up/Down, Home/End

### Technical Features
- **PWA Support**: Installable, works offline, mobile-optimized
- **Export to PNG**: Screenshot sharing with Web Share API integration
- **State Persistence**: Automatic localStorage backup with save/load functionality
- **Dark Mode**: System-aware theme switching
- **Mathematical Stability**: Hamilton (Largest-Remainder) rounding prevents floating-point errors

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## How to Use

1. **Adjust Faders**: Click and drag vertical sliders or use keyboard navigation
2. **Lock Constraints**: Click the lock button (🔒) to fix a fader's value
3. **Automatic Rebalancing**: Other unlocked faders adjust proportionally to maintain 100% total
4. **Export Results**: Use the "Export PNG" button to save and share your allocation
5. **Save/Load**: Store scenarios for later use or comparison

### Keyboard Controls (per fader)
- `↑/↓` arrows: ±1 point
- `Page Up/Page Down`: ±10 points
- `Home/End`: Set to 0 or maximum possible value
- `Tab`: Navigate between faders

## Technical Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (accessible, unstyled primitives)
- **State Management**: Zustand with localStorage persistence
- **PWA**: next-pwa for offline functionality
- **Export**: html2canvas for PNG generation

### Key Files

#### Core Logic
- `src/lib/simple-store.ts` - Main state management with constraint enforcement
- `src/lib/redistribution.ts` - Mathematical redistribution algorithms
- `src/components/Fader.tsx` - Individual slider component
- `src/components/FaderBank.tsx` - Main mixing desk layout

#### Mathematical Algorithms
- **Proportional Redistribution**: Maintains relative ratios when adjusting unlocked faders
- **Constraint Satisfaction**: Prevents negative values and respects locked entities
- **Hamilton Rounding**: Eliminates floating-point display inconsistencies
- **Iterative Adjustment**: Handles edge cases where direct calculation fails

### State Management

The app uses a simplified constraint-based system where:

```typescript
// Core constraint: sum always equals 100
const total = values.reduce((sum, val) => sum + val, 0) === 100

// Lock system prevents specific entities from changing
const locks: boolean[] = [false, true, false, false] // Second entity locked

// Smart redistribution respects constraints
function setValue(index: number, newValue: number): void
```

## Development Notes

### Mathematical Edge Cases Handled
1. **Division by Zero**: When all entities have equal values during proportional redistribution
2. **Negative Values**: When locked constraints make proportional distribution impossible
3. **Floating Point Precision**: Hamilton rounding ensures display stability
4. **Impossible Constraints**: Graceful degradation when locks exceed available capacity

### PWA Configuration
- Installable on mobile devices
- Offline functionality with service worker
- Responsive design for desktop and mobile
- Web Share API integration for result sharing

### Accessibility
- Full keyboard navigation support
- Screen reader compatible with proper ARIA labels
- High contrast support with dark mode
- Focus management and visual indicators

## Contributing

### Code Style
- TypeScript strict mode enabled
- Tailwind CSS for styling (no custom CSS files)
- Radix UI for accessible components
- Zustand for state management (avoid React Context for performance)

### Testing Approach
- Manual testing with Playwright for user interactions
- Focus on mathematical edge cases and constraint validation
- PWA functionality testing across devices

### Architecture Principles
- Mathematical correctness over UI polish
- Accessibility-first design
- Performance optimization for mobile devices
- Constraint satisfaction as core requirement

## Deployment

The app is designed for deployment on Vercel with PWA capabilities:

```bash
# Build and deploy
npm run build
# Deploy to Vercel or similar platform
```

## Future Enhancements

- Multi-scenario comparison view
- Import/export scenario data
- Undo/redo functionality
- Custom entity naming
- Advanced constraint types (min/max ranges)
- Team collaboration features

---

**Finite Faders** transforms complex allocation decisions into intuitive, visual interactions while maintaining mathematical rigor and accessibility standards.
