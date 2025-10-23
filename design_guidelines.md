# Design Guidelines: Interactive Africa Map

## Design Approach
**System**: Material Design + Custom Data Visualization
**Rationale**: Information-dense, utility-focused application requiring clear visual hierarchy, excellent interaction feedback, and data visualization clarity. Material Design provides robust patterns for interactive data displays while allowing customization for geographical content.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 220 15% 12% (deep slate)
- Surface: 220 15% 16% (elevated panels)
- Surface Hover: 220 15% 20%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%
- Border: 220 15% 25%

**Map Colors**
- Default Country: 220 20% 25% (neutral slate)
- Hover State: 210 75% 50% (vibrant blue)
- Selected State: 280 60% 55% (purple accent)
- Region Color Scheme: 5 distinct hues for African regions (North, West, East, Central, South) using 40-50% lightness, 45-55% saturation

**Light Mode**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 15% 15%
- Map Default: 220 15% 88%
- Map Hover: 210 75% 60%

### B. Typography
**Fonts**: Inter (primary), JetBrains Mono (data/numbers)

- Page Title: 2.5rem, 700 weight
- Country Names (on map): 0.75rem, 600 weight, uppercase, letter-spacing 0.05em
- Info Panel Heading: 1.5rem, 600 weight
- Data Labels: 0.875rem, 500 weight
- Statistics: 1.125rem, 600 weight (JetBrains Mono)

### C. Layout System
**Spacing Units**: Tailwind units 2, 4, 6, 8, 12, 16 for consistent rhythm

- Header: h-16, fixed top positioning
- Map Container: Full viewport minus header (calc(100vh - 4rem))
- Side Panel: w-96, absolute right positioning, p-6
- Card Spacing: p-4 for compact info, p-6 for detailed panels
- Gap Spacing: gap-4 for grids, gap-2 for inline elements

### D. Component Library

**Map Interface**
- SVG-based interactive map with country paths
- Stroke width: 1px for borders in default state, 2px on hover
- Drop shadow on hover: shadow-lg with purple/blue tint
- Smooth transitions: transition-all duration-300
- Pan/zoom controls: Fixed bottom-right, icon buttons with backdrop blur

**Information Panel**
- Slide-in from right with backdrop blur
- Header: Country flag icon + name
- Stats Grid: 2-column layout for key metrics (Capital, Population, Area, GDP)
- Close button: Top-right, ghost style with hover feedback
- Dividers: 1px border with 20% opacity between sections

**Header/Navigation**
- Title with Africa icon
- Search input: Full-width on mobile, w-64 on desktop, rounded-lg, bg with 10% opacity
- View toggles: Region view / Data view / Default view (button group)
- Theme toggle: Sun/moon icon button

**Legend/Controls**
- Compact card: Fixed bottom-left
- Color key for regions or data visualization
- Backdrop blur: backdrop-blur-md
- Border: 1px with subtle glow

**Interaction States**
- Country hover: Scale transform (1.02), elevated shadow, brighter color
- Country click: Persistent highlight, panel slides in
- Search results: Highlight matching countries, dim others to 50% opacity
- Loading: Skeleton loader for map, shimmer effect

### E. Data Visualization
- Color gradient scale for data metrics (population density, GDP, etc.)
- 5-step gradient from cool to warm tones: 200 70% 40% → 0 70% 50%
- Tooltip on hover: Small card with precise data, positioned near cursor
- Legend scale: Horizontal bar showing value ranges

### F. Responsive Behavior
- Desktop: Side panel + full map
- Tablet: Bottom sheet panel (slides up), map above
- Mobile: Full-screen map with floating info cards, search becomes full-width modal

### G. Interactions
- Click country: Open detailed panel, zoom to country bounds
- Hover country: Show tooltip with name + key stat, highlight borders
- Search: Filter and highlight countries, auto-zoom if single result
- Region toggle: Color-code and group countries by region
- Data mode: Apply choropleth coloring based on selected metric

### H. Accessibility
- Keyboard navigation: Tab through countries, Enter to select
- Screen reader labels for all countries and controls
- Focus indicators: 2px outline with accent color
- High contrast mode support: Increased stroke widths and color contrast

## Visual Hierarchy
1. **Primary**: Map (occupies 70%+ of viewport)
2. **Secondary**: Selected country information panel
3. **Tertiary**: Header controls and legend
4. **Supporting**: Zoom controls, theme toggle

## Key Principles
- **Clarity First**: Map must be immediately readable with clear country boundaries
- **Responsive Feedback**: Every interaction provides visual confirmation within 100ms
- **Progressive Disclosure**: Basic info on hover, detailed data on click
- **Consistent Color Language**: Use color purposefully for regions or data, not decoration
- **Performance**: Smooth 60fps interactions, optimize SVG rendering