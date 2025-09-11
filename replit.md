# FRA Atlas & Decision Support System

## Overview

This is a full-stack web application prototype built for SIH Problem Statement PS-25018: "FRA Atlas and Decision Support System for Tribal Development". The system digitizes Forest Rights Act (FRA) documents, provides interactive GIS mapping capabilities, and offers AI-driven decision support for tribal development initiatives.

The application serves as a comprehensive platform for managing FRA claims, mapping tribal assets, and generating data-driven recommendations for government schemes like Jal Jeevan Mission, PM-Kisan, and MGNREGA.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom tribal-themed color scheme (earthy greens and earth tones)
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Maps**: Leaflet.js integration for interactive GIS mapping capabilities

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful APIs with structured error handling
- **File Processing**: Multer for file uploads with Tesseract.js for OCR simulation
- **Authentication**: bcrypt for password hashing with role-based access control

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Design**: Structured tables for FRA claims, assets, recommendations, villages, and users
- **Data Validation**: Zod schemas for runtime type checking and validation

### Key Features Architecture

#### FRA Document Digitization
- File upload system supporting PDF and image formats
- OCR text extraction with structured data parsing
- Automated data validation and storage in PostgreSQL
- Preview and edit capabilities before final submission

#### Interactive Atlas (WebGIS)
- Leaflet-based mapping with multiple layer support
- Village boundaries, FRA claims (color-coded by status), and asset visualization
- Real-time filtering by district, village, and claim status
- Export capabilities for map data and visualizations

#### Decision Support System (DSS)
- Rule-based recommendation engine analyzing water index, farmland presence, and forest conditions
- Automated scheme matching (Jal Jeevan, PM-Kisan, MGNREGA)
- Priority-based recommendation system with beneficiary estimation
- Dashboard with metrics, charts, and actionable insights

#### Asset Mapping System
- GPS coordinate-based asset tracking for ponds, farms, forests, and settlements
- Integration with mapping system for visual representation
- Asset type categorization with metadata storage

### Data Flow Architecture
1. **Document Upload**: Files processed through OCR, data extracted and validated
2. **Database Storage**: Structured data stored with relationships between claims, assets, and villages
3. **API Layer**: Express endpoints serve data to React frontend
4. **Map Rendering**: Leaflet consumes API data to render interactive layers
5. **Decision Engine**: Analyzes stored data to generate scheme recommendations
6. **Dashboard**: Aggregates data for visual insights and reporting

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, ESBuild for production builds
- **UI Framework**: Radix UI primitives, Tailwind CSS, class-variance-authority

### Database and Backend Services
- **Database**: Neon PostgreSQL serverless database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: bcrypt for password hashing
- **File Processing**: Multer for uploads, Tesseract.js for OCR

### Mapping and Visualization
- **Maps**: Leaflet.js for interactive mapping
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography

### Development and Deployment
- **Replit Integration**: Vite plugins for Replit development environment
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Environment**: Node.js runtime with WebSocket support for Neon

### Data Validation and Type Safety
- **Schema Validation**: Zod for runtime type checking
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Type Safety**: TypeScript throughout the entire stack

The architecture emphasizes type safety, scalability, and developer experience while maintaining simplicity for the demo prototype requirements.