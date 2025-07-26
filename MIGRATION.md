# Migration to Convex

This document outlines the changes made to migrate from PostgreSQL + Google Drive to Convex.

## Changes Made

### ✅ Removed Dependencies
- Removed PostgreSQL dependencies (drizzle-orm, pg, @types/pg)
- Removed NextAuth dependencies (@auth/drizzle-adapter, next-auth)
- Removed Google Drive API dependencies (googleapis)

### ✅ Added Dependencies
- Added Convex (`convex`)

### ✅ Database Layer
- **Before:** PostgreSQL with Drizzle ORM
- **After:** Convex database with real-time updates

### ✅ Data Storage
- **Before:** Google Drive JSON files
- **After:** Convex database tables

### ✅ Schema
- Created Convex schema with `apartments` and `userInteractions` tables
- Defined proper indexes for efficient querying

### ✅ Functions
- Created Convex mutations and queries in `convex/apartments.ts` and `convex/interactions.ts`
- Replaced Google Drive operations with Convex database operations

### ✅ API Layer
- Updated all API routes to use Convex client instead of Google Drive API
- Maintained the same API interface for frontend compatibility

### ✅ Configuration
- Updated environment variables to use `NEXT_PUBLIC_CONVEX_URL`
- Updated README with Convex setup instructions

## Benefits of Convex

1. **Real-time Updates:** Convex provides real-time data synchronization
2. **Type Safety:** Full TypeScript support with generated types
3. **Serverless:** No database management required
4. **Optimistic UI:** Built-in support for optimistic updates
5. **Caching:** Automatic query caching and invalidation
6. **Developer Experience:** Hot reloading and excellent debugging tools

## Next Steps

1. Set up a Convex account at https://www.convex.dev/
2. Run `npx convex dev` to initialize the project
3. Copy the deployment URL to your `.env.local` file
4. Start the development server with `npm run dev`

The application functionality remains the same - users can view, like, and interact with apartment listings without authentication.