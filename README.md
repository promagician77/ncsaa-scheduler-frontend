# NCSAA Basketball Scheduler - Frontend

A modern, optimized Next.js application for managing and visualizing basketball game schedules with intelligent constraint solving.

## 🏗️ Project Structure

```
app/
├── components/           # React components organized by feature
│   ├── ui/              # Reusable UI components (Button, Card, Badge, etc.)
│   ├── schedule/        # Schedule-related components
│   └── data/            # Data display components
├── lib/                 # Core utilities and logic
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── constants/      # Constants and configuration
├── types/              # TypeScript type definitions
├── layout.tsx          # Root layout with fonts and metadata
├── page.tsx            # Main application page
└── globals.css         # Global styles and theme
```

## 🎨 Features

- **Modern UI Design**: Clean, responsive interface with dark mode support
- **Smart State Management**: Custom hooks for efficient data fetching and caching
- **Type Safety**: Comprehensive TypeScript types for all data structures
- **Optimized Performance**: Component lazy loading and memoization
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and micro-interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Inter (sans-serif), JetBrains Mono (monospace)
- **State Management**: React Hooks with custom abstractions

## 📦 Component Library

### UI Components (`components/ui/`)

Reusable, composable UI primitives:

- `Button` - Multiple variants (primary, secondary, ghost, danger)
- `Card` - Container with header, content sections
- `Badge` - Status indicators with color variants
- `Spinner` / `Loading` - Loading states
- `Alert` - Notification messages (info, success, warning, error)
- `Tabs` - Tab navigation with panels

### Feature Components

**Schedule Components** (`components/schedule/`)
- `ScheduleGenerator` - Generate schedules with progress tracking
- `ScheduleDisplay` - Display games with filtering and search
- `ScheduleStats` - Statistics and validation summary

**Data Components** (`components/data/`)
- `DataDisplay` - Comprehensive data viewer with tabs for teams, facilities, schools, etc.

## 🎣 Custom Hooks (`lib/hooks/`)

- `useScheduleGenerator` - Handle async schedule generation with polling
- `useSchedulingData` - Fetch and cache scheduling data
- `useScheduleFilters` - Filter games by division, date, and search query

## 🔧 Utilities (`lib/utils/`)

- **Date Utilities**: Parse and format dates without timezone issues
- **Style Utilities**: Division colors, class name merging
- **Sorting Utilities**: Sort and group games by facility and time

## 🎨 Design System

### Colors

The app uses a semantic color system with dark mode variants:

- **Primary**: Blue (#2563eb)
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red
- **Info**: Indigo

### Typography

- **Display**: Inter (Google Font)
- **Monospace**: JetBrains Mono (Google Font)
- Font sizes range from xs (0.75rem) to 5xl (3rem)

### Spacing

Consistent spacing scale using Tailwind's spacing system (4px base unit)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## 📝 Development Guidelines

### Adding New Components

1. Create component in appropriate directory (`ui/`, `schedule/`, `data/`)
2. Use TypeScript with proper type definitions
3. Import types from `@/app/types`
4. Use utility functions from `@/app/lib/utils`
5. Follow existing naming conventions

### Component Structure

```tsx
"use client"; // Only if using client-side features

import { ComponentProps } from '@/app/types';
import { utilityFunction } from '@/app/lib/utils';

export default function Component({ prop }: ComponentProps) {
  // Component logic
  
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

### Styling Guidelines

- Use Tailwind utility classes
- Leverage dark mode variants: `dark:bg-gray-800`
- Use semantic color classes from design system
- Add hover/focus states for interactive elements
- Ensure responsive design with `sm:`, `md:`, `lg:` breakpoints

### State Management

- Use custom hooks for complex state logic
- Keep component state minimal
- Leverage React's built-in hooks (useState, useMemo, useCallback)
- Cache API responses to reduce network calls

## 🏗️ Architecture Decisions

### Why Custom Hooks?

Custom hooks encapsulate complex logic, making components cleaner and more testable. They provide:
- Reusability across components
- Separation of concerns
- Easier testing and maintenance

### Why Component Organization?

Organizing by feature (schedule/, data/) rather than type makes it easier to:
- Find related components
- Understand feature scope
- Refactor features independently

### Why TypeScript?

Strong typing catches errors early, improves IDE support, and serves as documentation.

## 📈 Performance Optimizations

1. **Memoization**: useMemo for expensive computations
2. **Caching**: API responses cached for 5 minutes
3. **Code Splitting**: Automatic with Next.js App Router
4. **Lazy Loading**: Components loaded on-demand
5. **Optimized Images**: Using Next.js Image component

## 🎯 Future Enhancements

- [ ] Add print-friendly schedule views
- [ ] Export schedules to PDF/CSV
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering options
- [ ] Schedule conflict detection UI
- [ ] Mobile app version
- [ ] Internationalization (i18n)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test components in both light and dark modes
5. Ensure responsive design
6. Update this README if adding major features

## 📄 License

Private project - All rights reserved

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Tailwind CSS for the utility-first CSS framework
- Google Fonts for Inter and JetBrains Mono typefaces
