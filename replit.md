# Overview

This is a full-stack web application built with a React frontend and Express.js backend. The project appears to be a dashboard application for "ACME Corp" featuring data visualization components, charts, and a modern UI built with shadcn/ui components. The application uses TypeScript throughout and includes a PostgreSQL database with Drizzle ORM for data management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts library for data visualization components

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: Hot reload with tsx for TypeScript execution

## Database Schema
- **Users Table**: Basic user management with id, username, and password fields
- **Primary Key**: UUID generation using PostgreSQL's gen_random_uuid()
- **Validation**: Zod schemas for runtime type validation integrated with Drizzle

## Storage Layer
- **Interface**: IStorage interface defining CRUD operations for users
- **Implementation**: In-memory storage (MemStorage) for development/testing
- **Database Ready**: Drizzle configuration prepared for PostgreSQL connection

## Authentication & Security
- **Session Management**: Express sessions with PostgreSQL storage
- **Password Handling**: Basic password storage (ready for hashing implementation)
- **Type Safety**: Shared TypeScript types between frontend and backend

## Development Environment
- **Monorepo Structure**: Shared types and schemas between client and server
- **Path Aliases**: Configured for clean imports (@/, @shared/, etc.)
- **Development Server**: Vite dev server with Express API proxy
- **Build Process**: Separate client and server build processes with esbuild

# External Dependencies

## Database
- **PostgreSQL**: Primary database using Neon serverless driver
- **Connection**: Environment variable DATABASE_URL for database connection
- **Migrations**: Drizzle Kit for database schema migrations

## UI & Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

## Development Tools
- **Replit Integration**: Cartographer plugin for Replit development environment
- **Error Handling**: Runtime error overlay for development debugging
- **TypeScript**: Strict type checking with path mapping support

## Chart Libraries
- **Recharts**: React charting library for data visualization
- **Chart Components**: Line charts, bar charts, area charts for dashboard analytics

## Validation & Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with validation resolvers
- **Drizzle Zod**: Integration between Drizzle ORM and Zod schemas