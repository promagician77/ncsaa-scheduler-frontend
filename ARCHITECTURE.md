# Frontend Code Organization

## Directory Structure

```
ncsaa-scheduler-frontend/
│
├── app/
│   ├── components/              # All React components
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── Alert.tsx       # Alert/notification component
│   │   │   ├── Badge.tsx       # Badge/label component
│   │   │   ├── Button.tsx      # Button with variants
│   │   │   ├── Card.tsx        # Card container with sections
│   │   │   ├── Spinner.tsx     # Loading spinner
│   │   │   ├── Tabs.tsx        # Tab navigation
│   │   │   └── index.ts        # Barrel export
│   │   │
│   │   ├── schedule/           # Schedule feature components
│   │   │   ├── ScheduleGenerator.tsx   # Generate schedule UI
│   │   │   ├── ScheduleDisplay.tsx     # Display games table
│   │   │   ├── ScheduleStats.tsx       # Statistics cards
│   │   │   └── index.ts                # Barrel export
│   │   │
│   │   └── data/               # Data display feature
│   │       ├── DataDisplay.tsx         # Main data viewer
│   │       └── index.ts                # Barrel export
│   │
│   ├── lib/                    # Core utilities and logic
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useScheduleGenerator.ts  # Schedule generation logic
│   │   │   ├── useSchedulingData.ts     # Data fetching with cache
│   │   │   ├── useScheduleFilters.ts    # Filtering logic
│   │   │   └── index.ts                 # Barrel export
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │   ├── date.ts        # Date parsing/formatting
│   │   │   ├── styles.ts      # Style utilities
│   │   │   ├── sorting.ts     # Sorting/grouping utilities
│   │   │   └── index.ts       # Barrel export
│   │   │
│   │   └── constants/         # Constants and config
│   │       ├── config.ts      # API config, polling intervals
│   │       ├── colors.ts      # Color schemes
│   │       └── index.ts       # Barrel export
│   │
│   ├── types/                 # TypeScript definitions
│   │   ├── schedule.ts        # Schedule-related types
│   │   ├── data.ts           # Data-related types
│   │   └── index.ts          # Barrel export
│   │
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   ├── page.tsx              # Main page component
│   └── globals.css           # Global styles and theme
│
├── public/                   # Static assets
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript config
├── next.config.ts          # Next.js config
└── README.md               # Documentation
```

## Key Improvements

### 1. **Separation of Concerns**
- UI components separated from business logic
- Feature-based component organization
- Utilities and hooks in dedicated directories

### 2. **Type Safety**
- All types defined in `types/` directory
- Proper TypeScript interfaces for all data structures
- Type inference throughout the codebase

### 3. **Reusability**
- Generic UI components in `components/ui/`
- Custom hooks for shared logic
- Utility functions for common operations

### 4. **Maintainability**
- Clear file structure
- Barrel exports (`index.ts`) for clean imports
- Consistent naming conventions
- Comprehensive documentation

### 5. **Performance**
- Custom hooks with memoization
- API response caching
- Optimized re-renders

### 6. **Developer Experience**
- Clear import paths using `@/app/*` aliases
- Well-organized code
- Easy to find and modify features
- Comprehensive README

## Import Examples

```typescript
// Clean imports from barrel exports
import { Button, Card, Badge } from '@/app/components/ui';
import { useScheduleGenerator } from '@/app/lib/hooks';
import { getDivisionColor, cn } from '@/app/lib/utils';
import type { ScheduleData, Game } from '@/app/types';
```

## Component Hierarchy

```
page.tsx (Main App)
├── Header
├── Tabs Navigation
├── Schedule View
│   ├── ScheduleGenerator
│   │   ├── Card
│   │   ├── Button
│   │   └── Alert
│   └── ScheduleDisplay
│       ├── ScheduleStats
│       │   ├── Card
│       │   └── Badge
│       ├── Filters (Card)
│       └── Games Tables
│           ├── Card
│           └── Badge
└── Info View
    └── DataDisplay
        ├── Tabs
        └── Various Tab Panels
            ├── Card
            ├── Badge
            └── Alert
```

## Best Practices Applied

1. ✅ **Component Composition**: Small, focused components
2. ✅ **Custom Hooks**: Reusable logic extraction
3. ✅ **TypeScript**: Full type coverage
4. ✅ **Consistent Styling**: Tailwind with design system
5. ✅ **Accessibility**: ARIA labels, keyboard navigation
6. ✅ **Performance**: Memoization, caching
7. ✅ **Documentation**: README and inline comments
8. ✅ **Code Organization**: Feature-based structure
