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
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Express sessions with bcrypt password hashing
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **API Design**: RESTful endpoints with role-based middleware protection

## Database Schema
The application uses PostgreSQL with two main entities:
- **Users**: Stores customer and team member information with role-based access (customer, dev, admin, owner)
- **Orders**: Tracks bot development requests with status management and user relationships

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
- Database: Drizzle handles schema migrations via `db:push`

## Environment Configuration
- **Development**: Uses NODE_ENV=development with tsx for hot reloading
- **Production**: Runs compiled JavaScript with NODE_ENV=production
- **Database**: Requires DATABASE_URL environment variable
- **Sessions**: Uses SESSION_SECRET for secure session management

## Deployment Target
- Configured for Replit's autoscale deployment
- Port 5000 mapped to external port 80
- PostgreSQL 16 module enabled for database support
- Node.js 20 runtime environment

# Changelog

- June 25, 2025. Initial setup
- June 25, 2025. Migrated from PostgreSQL database to JSON file storage system
- June 25, 2025. Added Team Dashboard for team members (dev, admin, owner roles)
- June 25, 2025. Enhanced navigation with role-based menu items

# User Preferences

Preferred communication style: Simple, everyday language.