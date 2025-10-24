# PIFAH Project Management System

## Overview

A comprehensive project management application for the Programme for Investment and Financing in Africa's Health Sector (PIFAH). The system features:
- **Public Interface**: Interactive Africa map showing approved projects by PIFAH pillar (very light green highlights), customizable logo/banner, REC membership display, project statistics with pillar-specific colors, and theme toggle (dark/light mode)
- **Admin Dashboard**: Complete project management with advanced filtering, approval workflow tracking, CSV/PDF export, and detailed project view dialogs
- **Focal Person Interface**: Review interface for regional project submissions with map and table views
- **Approver Interface**: Final approval dashboard with comprehensive project oversight
- **Project Submission**: Multi-tab form for detailed project proposals aligned with 5 PIFAH pillars
- **REC Integration**: Display of 8 Regional Economic Communities (COMESA, EAC, ECCAS, ECOWAS, IGAD, SADC, UMA, CEN-SAD) with country membership and project statistics
- **Community of Practice**: Coming soon page for collaborative platform where health sector professionals can share ideas and best practices
- **FAQ Section**: Comprehensive frequently asked questions covering general information, projects, RECs, technical support, and investment financing
- **AI Chatbot Assistant**: OpenAI-powered chatbot available on all pages (public and authenticated) with contextual knowledge of PIFAH pillars, RECs, project submission process, and platform features

The application features role-based access control, pillar-based color visualization, approval workflow management, REC stats tracking, public theme toggle, AI assistance, and responsive design with light theme default and optional dark mode.

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
- Default theme: light (white background), with optional dark mode toggle

**Map Visualization**
- Custom SVG-based Africa map loaded as raw SVG asset
- D3-geo library for geographic projections and transformations
- Manual SVG path manipulation for country hover/selection states
- Region-based color coding using HSL color scheme
- Very light green (#D1FAE5) highlighting for countries with approved projects
- Gray (#CBD5E1) for countries without projects

**Key Design Decisions**
- Component-based architecture with clear separation of concerns
- Custom map implementation over libraries like react-simple-maps for better control
- Static country data stored in TypeScript (africaData.ts) rather than dynamic API calls
- Path aliases (@/, @shared/, @assets/) for clean import statements
- Public routes (/faq, /community) accessible to both authenticated and unauthenticated users
- Consistent "PIFAH" branding across all pages (replaced "Interactive Africa Map")
- AI chatbot positioned strategically: bottom-left on MapPage to avoid map controls, bottom-right on all other pages

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
- OpenAI integration for chatbot functionality via `/api/chat` endpoint

**AI Chatbot Integration**
- OpenAI GPT-4o model integration for intelligent assistance
- Comprehensive system prompt covering PIFAH's 5 strategic pillars, 8 RECs, project workflows, and platform features
- Graceful handling when OPENAI_API_KEY is not configured (shows helpful user message)
- Error handling for API failures with user-friendly error messages
- Rate limiting: 500 max tokens per response, 0.7 temperature for balanced responses

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

**Active Database Schema**
- **users**: User authentication and role management (admin, focal_person, approver, public)
- **projects**: Comprehensive project submissions with 50+ fields covering:
  - General information (title, country, implementing entity)
  - Strategic rationale (PIFAH pillar alignment, regional integration)
  - Market opportunity and impact
  - Financial information
  - Implementation readiness
  - Workflow fields (status, reviewedBy, approvedBy with timestamps)
- **sessions**: Secure session storage for Replit Auth
- **notifications**: Project workflow notifications (submission, review, approval)
- **countries**: African country master data
- **app_settings**: Logo and banner image storage

**Key Design Decisions**
- PostgreSQL database with Drizzle ORM for type-safe queries
- Workflow-based approval system (pending → under_review → approved)
- Multi-role authentication with route-level protection
- Schema uses gen_random_uuid() for primary key generation
- Drizzle-Zod integration for form validation

### PIFAH Pillars (5 Strategic Areas)

The system organizes projects across five strategic investment pillars:
1. **Diagnostics & Imaging** - Soft blue (hsl 200, 70%, 60%)
2. **Digital Health & AI** - Soft indigo (hsl 220, 70%, 60%)
3. **Health Infrastructure** - Soft purple (hsl 240, 70%, 60%)
4. **Human Capital Development** - Soft violet (hsl 260, 70%, 60%)
5. **Local Manufacturing** - Soft magenta (hsl 280, 70%, 60%)

Each pillar has primary, light, and dark color variants for consistent UI visualization. Recent approved projects display pillar names in their respective pillar colors for quick visual identification.

### Authentication & Authorization

**Active Implementation**
- Replit Auth integration for user authentication
- Role-based access control with 4 user roles: admin, focal_person, approver, public
- Session-based authentication using PostgreSQL session store
- Role-specific route protection enforced in frontend routing

**User Roles & Permissions**
- **Admin**: Full access to all projects, settings, country management, color customization
- **Focal Person**: Review and approve regional project submissions, view all projects
- **Approver**: Provide final approval for projects reviewed by focal persons
- **Public**: View approved projects on public map, submit new project proposals

**Test Accounts Available**
- Admin: admin@pifah.org
- Focal Person: focal@pifah.org
- Approver: approver@pifah.org

### Project Management Features

**My Submissions Page** (/my-submissions)
- View all projects submitted by the current user
- Displays project title, country, PIFAH pillar, status, and submission date
- Edit button available for projects with status "pending" or "under_review"
- Status badges with color coding (pending, under_review, approved, rejected)
- Info card explaining edit permissions
- Link to submit new projects

**Admin Dashboard** (/admin)
- Comprehensive projects table with all submission fields
- Advanced filtering: status, country, PIFAH pillar, search
- Approval workflow tracking (focal review, final approval)
- CSV export with complete audit trail
- Country management, color settings, app settings (logo/banner upload)

**Focal Person Dashboard** (/focal-person)
- Statistics overview: pending review, under review, reviewed counts
- Table view with projects pending focal review
- Interactive map view showing project distribution
- Filter and search capabilities

**Approver Dashboard** (/approver)
- Statistics overview: pending approval, approved, total projects
- Table view with projects pending final approval
- Interactive map view showing approved projects
- Filter and search capabilities

**Project Editing Feature**
- Project owners can edit their own submissions before approval
- Backend validates ownership and project status before allowing edits
- Edit endpoint: `/api/projects/:id/owner-update` (PATCH)
- Editable statuses: pending, under_review
- Non-editable statuses: approved, rejected
- Workflow fields (submittedBy, status, timestamps) are preserved during edits
- Form pre-populated with existing project data
- Success toast and redirect to My Submissions after update

**ProjectsTable Component**
- Multi-column sortable table with all project fields
- Status badges (pending, under review, approved, rejected)
- Approval status indicators (focal reviewed, final approved)
- Filters: status, country, pillar, search query
- CSV export with proper escaping and metadata:
  - Project details, contact information, financial data
  - Submitted by, reviewed by, approved by user IDs
  - Complete timestamp trail (submitted, reviewed, approved)

### Regional Economic Communities (RECs)

**8 RECs Implemented**
- **COMESA** (21 members): Common Market for Eastern and Southern Africa
- **EAC** (7 members): East African Community
- **ECCAS** (11 members): Economic Community of Central African States
- **ECOWAS** (15 members): Economic Community of West African States
- **IGAD** (8 members): Intergovernmental Authority on Development
- **SADC** (16 members): Southern African Development Community
- **UMA** (5 members): Arab Maghreb Union
- **CEN-SAD** (29 members): Community of Sahel-Saharan States

**REC Features**
- Country-to-REC mapping stored in `recData.ts`
- Multiple REC membership support (countries can belong to multiple RECs)
- REC display in CountryDetailsPanel when country is selected
- RECStatsBar component showing project counts per REC
- REC statistics displayed below map on public landing page

### UI Customization & Branding

**Logo & Banner Management**
- Admin-uploadable logo displayed in header (h-16 md:h-20) and footer
- Logo also appears in footer for consistent branding
- Custom banner image support for hero section
- Settings stored in app_settings database table

**Visual Design**
- Compact stat cards for general statistics (African Countries, Market, Jobs)
- Pillar-specific colors in recent projects display
- Very light green map highlighting for better aesthetics
- Light theme as default with dark mode available

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