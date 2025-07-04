# Overview

This is a modern full-stack web application for Novarix Studio, a Discord bot development service. The application serves as a customer management platform where users can place orders for custom Discord bots, while team members can manage these orders and customer relationships.

The system is built as a monorepo with a React frontend and Express backend, using PostgreSQL for data persistence and featuring role-based access control for different user types (customers, developers, admins, owners).

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Novarix brand colors
- **Build Tool**: Vite for development and production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Data Storage**: JSON file-based persistence with atomic operations
- **Authentication**: Express sessions with bcrypt password hashing
- **Session Storage**: Memory-based session store with automatic cleanup
- **API Design**: RESTful endpoints with role-based middleware protection

## Data Storage
The application uses JSON file storage with three main entities:
- **Users**: Stores customer and team member information with role-based access (customer, dev, admin, owner)
- **Orders**: Tracks bot development requests with status management and user relationships
- **Partners**: Manages business partnerships with contact information and active status
- **Storage**: All data is persisted in JSON files with automatic backup and atomic writes

# Key Components

## Authentication System
- Session-based authentication with secure cookie management
- Role-based access control with four levels: customer, dev, admin, owner
- Password hashing using bcrypt for security
- Middleware functions for route protection and role validation

## Order Management
- Customers can submit new bot development requests
- Team members can view, update status, and add notes to orders
- Order status tracking (pending, in_progress, completed, cancelled)
- Monthly order limits and statistics tracking

## User Interface
- Responsive design with mobile-first approach
- Dark theme optimized for Novarix branding
- Component-based architecture using shadcn/ui
- Form validation and error handling with toast notifications

## Team Management
- Admin and owner roles can add new team members
- User role management and permission system
- Team member notes and activity tracking
- Hierarchical permissions (owner > admin > dev > customer)

## Partner Management
- Public Partners page displays active partnerships
- Owner-only management interface for partner CRUD operations
- Partner information includes name, description, website, logo, contact details
- Active/inactive status control for partnership visibility

# Data Flow

1. **User Registration/Login**: Users authenticate through session-based auth
2. **Order Creation**: Customers submit orders through validated forms
3. **Order Processing**: Team members manage orders through status updates
4. **Real-time Updates**: React Query provides optimistic updates and cache invalidation
5. **Role-based Access**: Middleware enforces permissions at API and UI levels

# External Dependencies

## Core Technologies
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Store**: PostgreSQL-backed sessions
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography

## Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast production bundling for server code
- **Drizzle Kit**: Database migrations and schema management
- **Vite**: Development server with HMR and optimized builds

# Deployment Strategy

## Build Process
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Data: JSON files are automatically created and managed

## Environment Configuration
- **Development**: Uses NODE_ENV=development with tsx for hot reloading
- **Production**: Runs compiled JavaScript with NODE_ENV=production
- **Sessions**: Uses SESSION_SECRET for secure session management
- **Storage**: Data directory automatically created for JSON files

## Deployment Target
- Configured for multiple deployment platforms (Render, Vercel, Railway, Fly.io)
- Port 5000 for application server
- JSON file persistence with data directory mounting
- Node.js 20 runtime environment
- GitHub Actions CI/CD pipeline included

# Changelog

- June 25, 2025. Initial setup
- June 25, 2025. Migrated from PostgreSQL database to JSON file storage system
- June 25, 2025. Made code GitHub compatible with deployment configurations for multiple platforms (Render, Vercel, Railway, Fly.io)
- June 25, 2025. Enhanced mobile responsiveness with touch-friendly interfaces and mobile-optimized layouts
- June 25, 2025. Added comprehensive deployment configurations including Docker, GitHub Actions CI/CD
- June 25, 2025. Removed all database dependencies, using pure JSON file storage with memory-based sessions
- June 25, 2025. Added Team Dashboard for team members (dev, admin, owner roles)
- June 25, 2025. Enhanced navigation with role-based menu items
- June 25, 2025. Added Partner Management System:
  - Public Partners page showing active partnerships
  - Owner-only Partner Management page for CRUD operations
  - Partner schema with name, description, website, logo, contact info
  - Role-based access control for partner management
- June 25, 2025. Enhanced Team Member Experience:
  - Team members now see both personal and team dashboards
  - Added landing page header with navigation to legal pages
  - Improved dashboard navigation for team members
  - Clear separation between personal and team management views
- June 25, 2025. Public Access to Legal Pages:
  - Partners, AGB, Datenschutz, and Impressum accessible without login
  - Created dedicated Terms and Privacy pages with detailed content
  - Updated navigation bar with all legal links
  - Improved user experience for non-authenticated visitors
- June 25, 2025. Enhanced Partner System:
  - Added verified badge system for special partners (like TikTok blue checkmark)
  - Improved text contrast for partner descriptions (now using gray-300)
  - Enhanced loading animation with dual spinning circles and loading text
  - Updated partner schema to include isVerified field

# User Preferences

Preferred communication style: Simple, everyday language.
Data storage: JSON file-based storage only, no database dependencies.
Mobile compatibility: Touch-friendly interfaces with responsive design required.