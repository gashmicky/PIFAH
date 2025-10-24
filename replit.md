# PIFAH Project Management System

## Overview

The PIFAH Project Management System is a comprehensive web application designed to manage projects for the Programme for Investment and Financing in Africa's Health Sector. It features a public interface with an interactive Africa map showcasing approved projects, an administrative dashboard for full project lifecycle management, and dedicated interfaces for Focal Persons and Approvers to manage the approval workflow. The system also includes a multi-tab project submission form aligned with PIFAH's five strategic pillars, integration with 8 Regional Economic Communities (RECs), a forthcoming Community of Practice, an FAQ section, and an AI Chatbot Assistant. The application emphasizes role-based access control, pillar-based color visualization, and a responsive design with a default light theme and optional dark mode.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18+ and TypeScript, utilizing Vite for fast development. UI components are developed using Shadcn/ui (New York variant) and Radix UI primitives, styled with Tailwind CSS, and incorporate Material Design principles. State management relies on TanStack Query for server state and local React state for UI interactions. The system features a custom SVG-based interactive Africa map using D3-geo for projections, with dynamic color coding based on project status for privileged users and pillar colors for public users. Key design decisions include a component-based architecture, custom map implementation for granular control, static country data, consistent branding, and a strategically placed AI chatbot.

### Backend Architecture

The backend is an Express.js application with TypeScript, designed minimally for current static data visualization needs but prepared for future expansion. It features a RESTful API structure with role-based access control. An in-memory storage implementation (MemStorage) is currently used, with an interface-based design allowing for future PostgreSQL integration via Drizzle ORM. The backend also integrates with OpenAI GPT-4o for the AI Chatbot Assistant, featuring a comprehensive system prompt and error handling.

### Data Storage Solutions

The system currently uses static TypeScript data for African countries and in-memory storage for user data. A PostgreSQL database schema is prepared with Drizzle ORM for type-safe queries, including tables for `users`, `projects`, `sessions`, `notifications`, `countries`, and `app_settings`. This schema supports a workflow-based approval system, multi-role authentication, and uses `gen_random_uuid()` for primary keys.

### PIFAH Pillars (5 Strategic Areas)

Projects are categorized and visualized across five strategic investment pillars, each associated with a distinct soft color for consistent UI representation:
1.  **Diagnostics & Imaging** (Soft blue)
2.  **Digital Health & AI** (Soft indigo)
3.  **Health Infrastructure** (Soft purple)
4.  **Human Capital Development** (Soft violet)
5.  **Local Manufacturing** (Soft magenta)

### Authentication & Authorization

Replit Auth is integrated for user authentication, supporting four roles: `admin`, `focal_person`, `approver`, and `public`. Role-based access control is enforced at the frontend routing level.
-   **Admin**: Full system access, combining Focal Person and Approver permissions.
-   **Focal Person**: Reviews and approves regional project submissions.
-   **Approver**: Provides final approval for projects.
-   **Public**: Views approved projects and submits new proposals.

### Project Management Features

The system includes a "My Submissions" page for users to view and edit their projects (if status is pending or under review), an "Admin Dashboard" with comprehensive project management tools (filtering, export, settings), "Focal Person Dashboard" for reviewing projects, and an "Approver Dashboard" for final approvals. Project editing is enabled for owners on "pending" or "under_review" projects. A `ProjectsTable` component offers multi-column sorting, filtering, and CSV export functionality.

### Regional Economic Communities (RECs)

The system integrates data for 8 RECs (COMESA, EAC, ECCAS, ECOWAS, IGAD, SADC, UMA, CEN-SAD), including country-to-REC mapping and support for multiple REC memberships. REC statistics are displayed in the UI.

### UI Customization & Branding

Admin users can upload custom logos and banner images, which are stored in the `app_settings` database table. The visual design emphasizes a clean aesthetic with pillar-specific colors, light green map highlighting, and a default light theme with an optional dark mode.

## External Dependencies

### Core Framework Dependencies
-   **React 18**: UI component framework
-   **Vite**: Build tool and development server
-   **Express.js**: Backend web server
-   **TypeScript**: Type safety

### UI Component Libraries
-   **Radix UI**: Accessible component primitives
-   **Shadcn/ui**: Pre-styled component library
-   **Tailwind CSS**: Utility-first CSS framework
-   **Lucide React**: Icon library

### Data & State Management
-   **TanStack Query v5**: Server state management
-   **React Hook Form**: Form handling
-   **Wouter**: Lightweight routing

### Map Visualization
-   **D3-geo**: Geographic projections

### Database & ORM (Configured but Inactive)
-   **Drizzle ORM**: TypeScript ORM for PostgreSQL
-   **@neondatabase/serverless**: Serverless PostgreSQL driver
-   **Drizzle-Zod**: Schema validation integration

### Session Management
-   **connect-pg-simple**: PostgreSQL session store for Express