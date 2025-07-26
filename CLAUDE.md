# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 15.4.4 + Convex** real estate viewer application that scrapes apartment listings from Otodom.pl for Poznan, Poland. It's a no-authentication public app allowing users to view, like, and track apartment interactions.

## Development Commands

```bash
# Start development server (requires two terminals)
npm run dev              # Next.js frontend with Turbopack
npx convex dev          # Convex backend development

# Production build
npm run build
npm run start

# Linting
npm run lint

# Convex operations
npx convex deploy       # Deploy backend
npx convex dashboard    # Open Convex dashboard
```

## Architecture

### Stack
- **Frontend**: Next.js 15.4.4 (App Router), React 19.1.0, TypeScript
- **Backend**: Convex (serverless BaaS with real-time database)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Build**: Turbopack for development

### Key Directories
```
src/app/           # Next.js App Router pages and layouts
src/components/    # Reusable React components
src/lib/          # Utility functions and Convex client
src/types/        # TypeScript type definitions
convex/           # Backend functions and schema
```

### Database Schema (Convex)
- `apartments`: Scraped apartment data with fields like title, price, location, imageUrl
- `userInteractions`: Tracks user views and likes (no authentication required)

## Core Patterns

### Data Flow
1. App loads → triggers `scrapeApartments` action
2. Convex scrapes Otodom.pl using fetch + regex (Cheerio not available)
3. Data cached in Convex database with automatic deduplication
4. UI queries `getFilteredApartments` (excludes viewed/liked)
5. User interactions update via `likeApartment`/`markAsViewed` mutations

### Component Structure
- `ApartmentCard`: Main listing display with image, details, and interaction buttons
- `TabNavigation`: Bottom navigation (All, Liked, Viewed tabs)
- `Header`: Top navigation with scrape trigger
- `LoadingSpinner`: Reusable loading state

### Convex Functions
- `apartments.ts`: CRUD operations and scraping logic
- `interactions.ts`: User interaction tracking
- `schema.ts`: Database table definitions

## Styling Approach

Uses Tailwind CSS v4 with custom CSS variables defined in `globals.css`. Responsive design with mobile-first approach and bottom tab navigation pattern.

## Data Scraping

The scraping logic in `convex/apartments.ts` uses regex patterns to parse Otodom.pl HTML since Cheerio isn't available in Convex runtime. Key patterns extract apartment titles, prices, locations, and image URLs.

## Development Notes

- **No Authentication**: App tracks interactions without user accounts
- **Real-time Updates**: Convex provides automatic UI synchronization
- **Optimistic UI**: User interactions show immediate feedback
- **Error Handling**: Graceful fallbacks for scraping failures
- **TypeScript**: Strict type safety throughout with Convex's generated types

## Recent Migration

Project was migrated from PostgreSQL + Google Drive to Convex for improved developer experience, real-time capabilities, and simplified deployment. See MIGRATION.md for details.

## Deployment

Both frontend (Vercel) and backend (Convex) can be deployed independently. Convex deployment updates the database schema and functions automatically.