# Finite Faders

A Vite + React PWA (Progressive Web App) for allocating finite capacity across priorities using a mixing desk interface. Perfect for resource allocation, time management, budget distribution, or any scenario where you need to balance competing priorities within fixed constraints.

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
- **Inline Editing**: Click any entity label to edit name, color, lock status, or delete
- **Custom Labels**: Name each entity for quick visual identification of your decisions
- **Color Coding**: Assign colors to entities - applied to borders, sliders, and controls for visual distinction
- **Dynamic Entities**: Add up to 8 entities (click + button in header) or remove down to minimum of 2 entities
- **Customizable Units**: Click the unit text in footer to choose from 8 preset units (Time, Effort, Care, Energy, Love, Focus, Attention, Money) or define custom units
- **Lock System**: Lock individual faders to prevent auto-adjustment, creating hard constraints
- **Smart Redistribution**: Handles edge cases like locked entities and impossible constraints gracefully
- **Keyboard Navigation**: Full accessibility with arrow keys, Page Up/Down, Home/End
- **Mobile Optimized**: Calculator-style layout that never requires scrolling, touch-optimized controls

### Technical Features
- **PWA Support**: Installable, works offline, mobile-optimized
- **Share Functionality**: Export and share allocation screenshots via Web Share API
- **State Persistence**: Automatic localStorage backup with save/load functionality
- **Dark Mode**: System-aware theme switching
- **Mathematical Stability**: Hamilton (Largest-Remainder) rounding prevents floating-point errors
- **Responsive Layout**: Dynamic viewport height calculation for mobile browsers, no scrollbars required
- **Touch-Optimized**: Enhanced touch controls with proper touch-action handling for mobile devices

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

1. **Edit Entities**: Click any entity label (shown with dotted underline) to open edit dialog
   - Change the entity name for easy identification
   - Select a color (applied to borders, sliders, and controls)
   - Toggle lock status
   - Delete entity (if more than 2 entities exist)
2. **Add Entities**: Click the "+" button in the header to add new entities (up to 8 total)
3. **Adjust Faders**: Click and drag vertical sliders or use keyboard navigation
4. **Lock Constraints**: Click the lock button below each fader to fix that entity's allocation
5. **Change Unit**: Click the unit text in the footer (e.g., "Time") to choose from presets or enter custom
6. **Automatic Rebalancing**: Other unlocked faders adjust proportionally to maintain 100% total
7. **Menu Functions**: Click the hamburger menu in the header to:
   - **Save**: Store scenarios for later use (coming soon)
   - **Load**: Retrieve previously saved scenarios (coming soon)
   - **Share**: Export and share your allocation as an image
   - **Reset**: Return to default values
   - **About**: Learn more about the app

### Keyboard Controls (per fader)
- `↑/↓` arrows: ±1 point
- `Page Up/Page Down`: ±10 points
- `Home/End`: Set to 0 or maximum possible value
- `Tab`: Navigate between faders

## Technical Architecture

### Tech Stack
- **Framework**: Vite + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React (consistent icon library)
- **UI Components**: Radix UI (accessible, unstyled primitives)
- **State Management**: Zustand with localStorage persistence
- **PWA**: vite-plugin-pwa for offline functionality
- **Export**: html2canvas for PNG generation and Web Share API

### Key Files

#### Core Logic
- `src/lib/simple-store.ts` - Main state management with constraint enforcement, labels, and colors
- `src/components/Fader.tsx` - Individual slider component with clickable labels and lock functionality
- `src/components/FaderBank.tsx` - Main mixing desk layout managing entity editing
- `src/components/Header.tsx` - Header with + add button and hamburger menu
- `src/components/Footer.tsx` - Footer with clickable unit text
- `src/components/Modals/AddEditEntity.tsx` - Entity editing dialog for name, color, lock, and delete
- `src/components/Modals/UnitSelection.tsx` - Unit selection dialog with presets and custom input
- `src/App.tsx` - Main application component with dynamic viewport height handling
- `src/main.tsx` - Application entry point

#### Mathematical Algorithms
- **Proportional Redistribution**: Maintains relative ratios when adjusting unlocked faders
- **Constraint Satisfaction**: Prevents negative values and respects locked entities
- **Hamilton Rounding**: Eliminates floating-point display inconsistencies
- **Iterative Adjustment**: Handles edge cases where direct calculation fails

### State Management

The app uses a constraint-based system with inline editing:

```typescript
// Core constraint: sum always equals 100
const total = values.reduce((sum, val) => sum + val, 0) === 100

// Lock system prevents specific entities from changing
const locks: boolean[] = [false, true, false, false] // Second entity locked

// Entity customization
const labels: string[] = ["Work", "Family", "Health", "Hobbies"]
const colors: string[] = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"]

// Unit customization
const unit: string = "Time" // or any custom string

// Smart redistribution respects constraints
function setValue(index: number, newValue: number): void
function updateLabel(index: number, label: string): void
function updateColor(index: number, color: string): void
function setUnit(unit: string): void

// Entity management (2-8 entities allowed)
function addEntity(): void
function removeEntity(index: number): void
```

## Development Notes

### Mathematical Edge Cases Handled
1. **Division by Zero**: When all entities have equal values during proportional redistribution
2. **Negative Values**: When locked constraints make proportional distribution impossible
3. **Floating Point Precision**: Hamilton rounding ensures display stability
4. **Impossible Constraints**: Graceful degradation when locks exceed available capacity

### PWA Configuration
- Installable on mobile devices
- Offline functionality with Workbox service worker
- Calculator-style responsive design that never requires scrolling
- Dynamic viewport height handling for mobile browsers (using CSS custom properties)
- Touch-optimized controls with touch-action:none for smooth mobile interaction
- Web Share API integration for result sharing
- Auto-updating service worker for seamless updates
- Network access enabled for local development testing on mobile devices

### Accessibility
- Full keyboard navigation support
- Screen reader compatible with proper ARIA labels
- High contrast support with dark mode
- Focus management and visual indicators

## Contributing

### Code Style
- TypeScript strict mode enabled
- Tailwind CSS for styling with minimal custom CSS (only for viewport height handling)
- Lucide React for consistent iconography
- Radix UI for accessible components
- Zustand for state management (avoid React Context for performance)
- Vite for fast development and optimized builds

### Testing Approach
- Manual testing with Playwright for user interactions
- Focus on mathematical edge cases and constraint validation
- PWA functionality testing across devices

### Architecture Principles
- Mathematical correctness over UI polish
- Accessibility-first design
- Performance optimization for mobile devices
- Calculator-style UI that never requires scrolling
- Constraint satisfaction as core requirement
- Inline editing for intuitive, mode-free user experience
- Visual consistency with dotted underlines for interactive elements

## Deployment

The app is designed for deployment on any static hosting platform with PWA capabilities:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to any static hosting (Vercel, Netlify, GitHub Pages, etc.)
```

## Future Enhancements

- Multi-scenario comparison view
- Import/export scenario data (JSON format) - Save/Load functionality
- Undo/redo functionality
- Advanced constraint types (min/max ranges)
- Team collaboration features
- History tracking for allocation changes
- Data visualization and analytics
- Drag-and-drop entity reordering

---

**Finite Faders** transforms complex allocation decisions into intuitive, visual interactions while maintaining mathematical rigor and accessibility standards.
