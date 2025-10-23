# Interactive Africa Map

## Overview

An interactive web application for exploring African countries through a visual map interface. Users can search for countries, view detailed information (capital, population, area, GDP), and explore data organized by geographic regions (North, West, East, Central, South Africa). The application features a modern, data-dense interface with Material Design principles, dark mode support, and responsive SVG-based map visualizations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (single-page application)

**UI Component System**
- Shadcn/ui component library (New York variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theme customization (dark/light mode)
- Material Design principles with custom data visualization patterns

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- Local React state (useState) for UI interactions (search, zoom, selected country)
- Theme context provider for dark/light mode persistence via localStorage

**Map Visualization**
- Custom SVG-based Africa map loaded as raw SVG asset
- D3-geo library for geographic projections and transformations
- Manual SVG path manipulation for country hover/selection states
- Region-based color coding using HSL color scheme

**Key Design Decisions**
- Component-based architecture with clear separation of concerns
- Custom map implementation over libraries like react-simple-maps for better control
- Static country data stored in TypeScript (africaData.ts) rather than dynamic API calls
- Path aliases (@/, @shared/, @assets/) for clean import statements

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- Development mode uses Vite middleware for SSR template serving
- Production mode serves static built assets

**Storage Layer**
- In-memory storage implementation (MemStorage class)
- Interface-based design (IStorage) allowing future database integration
- Basic user CRUD operations scaffolded but not currently utilized
- Drizzle ORM configured for PostgreSQL but not actively used in current implementation

**API Design**
- RESTful API structure with `/api` prefix routing
- Express middleware for JSON parsing and request logging
- Session support infrastructure present but not implemented

**Key Design Decisions**
- Minimal backend for current static data visualization needs
- Storage abstraction layer prepared for future database migration
- Logging middleware tracks API response times and payloads
- Raw body capture for webhook/payment processing scenarios

### Data Storage Solutions

**Current Implementation**
- Static TypeScript data (africaData.ts) containing 54+ African countries
- In-memory Map storage for user data (not persisted)
- No active database connection in production

**Database Schema (Prepared but Inactive)**
- PostgreSQL configured via Drizzle ORM
- Users table with UUID primary keys, username, and password fields
- Neon serverless database driver ready for cloud deployment
- Migration files generated in `/migrations` directory

**Key Design Decisions**
- Static data approach chosen for performance and simplicity
- Database infrastructure prepared for future user authentication features
- Schema uses gen_random_uuid() for primary key generation
- Drizzle-Zod integration for type-safe schema validation

### Authentication & Authorization

**Current State**
- No active authentication system implemented
- User schema and storage interfaces prepared for future implementation
- Session middleware (connect-pg-simple) installed but not configured

**Prepared Infrastructure**
- User table with username/password fields
- Password hashing would need to be implemented before production use
- Session store ready for PostgreSQL-backed sessions

## External Dependencies

### Core Framework Dependencies
- **React 18**: UI component framework
- **Vite**: Build tool and development server with HMR
- **Express.js**: Backend web server
- **TypeScript**: Type safety across full stack

### UI Component Libraries
- **Radix UI**: Unstyled accessible component primitives (accordion, dialog, dropdown, popover, select, toast, etc.)
- **Shadcn/ui**: Pre-styled component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for UI elements

### Data & State Management
- **TanStack Query v5**: Server state management and data fetching
- **React Hook Form**: Form handling with Zod validation
- **Wouter**: Lightweight routing library

### Map Visualization
- **D3-geo**: Geographic projections and path generation
- **Custom SVG**: Manual SVG manipulation for interactive maps

### Database & ORM (Configured but Inactive)
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Drizzle-Zod**: Schema validation integration

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for Node.js

### Styling & Theming
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Utility class composition
- **PostCSS & Autoprefixer**: CSS processing

### Session Management (Prepared)
- **connect-pg-simple**: PostgreSQL session store for Express