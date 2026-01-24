# Data Display Feature Guide

## Overview

The Data Display feature provides a comprehensive view of all scheduling information loaded from Google Sheets, organized in an easy-to-understand interface.

## Features

### 📊 Summary Tab
- Quick overview with key statistics
- Total teams, schools, facilities, divisions, and estimated games
- Season information display

### 📋 Scheduling Rules Tab
Displays all scheduling constraints and rules:
- **Season Period**: Start/end dates, Sunday restriction
- **Game Timing**: Duration, weeknight/Saturday time windows
- **Game Frequency**: Games per team, max games in time periods, doubleheader limits
- **Holidays**: Dates with no scheduled games

### 🏀 Divisions Tab
Shows all basketball divisions with:
- Division name with color coding
- Number of teams in division
- Estimated total games for the season

### 👥 Teams Tab
Interactive table of all teams featuring:
- Search functionality (by school or coach name)
- Filter by division
- Displays: School, Division, Coach, Geographic Cluster, Competitive Tier
- Real-time filtering and search results count

### 🏫 Schools Tab
Card-based display of schools showing:
- School name
- Geographic cluster
- Competitive tier
- List of all teams from that school with divisions and coaches

### 🏟️ Facilities Tab
Detailed facility information:
- Facility name and address
- Number of courts available
- Count of available and blocked dates
- 8-foot rim availability (for ES K-1 REC)
- Special notes and restrictions

### 📍 Geographic Clusters Tab
Visual display of geographic groupings:
- Cluster name (East, West, North, Henderson)
- Number of schools in cluster
- Number of teams in cluster

### 🏆 Competitive Tiers Tab
Competitive tier breakdown:
- Tier level (Tier 1-4)
- Number of schools in tier
- Number of teams in tier

## UI/UX Design

### Navigation
- **Tab-based interface** for easy switching between data categories
- **Icon indicators** for visual identification
- **Active tab highlighting** for clear navigation state

### Visual Design
- **Color-coded badges** for divisions and categories
- **Card layouts** for easy scanning of information
- **Tables with hover effects** for detailed data
- **Responsive grid layouts** that adapt to screen size
- **Dark mode support** throughout

### Data Organization
- **Grouped information** by logical categories
- **Search and filter capabilities** for large datasets
- **Statistical summaries** for quick insights
- **Clean typography** with clear hierarchies

### User Experience
- **Loading states** with spinner animation
- **Error handling** with retry functionality
- **Real-time filtering** with result counts
- **Accessible color contrasts** for readability

## API Integration

The data is fetched from the backend API endpoint:

```
GET /api/data
```

Returns comprehensive scheduling data including:
- Rules and constraints
- Teams with complete information
- Facilities with availability
- Schools with associated teams
- Division summaries
- Cluster and tier breakdowns
- Overall statistics

## How to Use

1. **Access the Information View**
   - Click the "ℹ️ Information" toggle in the main navigation

2. **Browse Different Categories**
   - Use the tab bar to switch between different data views

3. **Search and Filter**
   - In the Teams tab, use the search box and division filter
   - Results update in real-time

4. **View Details**
   - Hover over table rows for highlighting
   - Scroll horizontally on mobile for wide tables
   - Cards display related information grouped together

## Technical Details

### Component Structure
```
DataDisplay.tsx
├── Main component with tab state management
├── SummaryTab - Overview statistics
├── RulesTab - Scheduling rules display
├── DivisionsTab - Division cards
├── TeamsTab - Searchable team table
├── SchoolsTab - School information cards
├── FacilitiesTab - Facility details
├── ClustersTab - Geographic cluster cards
└── TiersTab - Competitive tier cards
```

### Styling
- Tailwind CSS utility classes
- Dark mode variants
- Responsive breakpoints
- Consistent spacing and padding

### State Management
- React useState for tab navigation
- Search and filter state in Teams tab
- Loading and error states for API calls

## Benefits

1. **Transparency**: Users can see all data used for scheduling
2. **Verification**: Easy to verify data accuracy before schedule generation
3. **Understanding**: Clear presentation of rules and constraints
4. **Navigation**: Quick access to specific information categories
5. **Responsiveness**: Works on desktop, tablet, and mobile devices
