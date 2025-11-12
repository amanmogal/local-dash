# System Patterns: LocalDev Experiment Dashboard

## Architecture Overview

The application follows a Next.js App Router architecture with clear separation of concerns:

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React UI components
├── lib/             # Business logic, utilities, and integrations
└── types/           # TypeScript type definitions
```

## Key Technical Decisions

### 1. Next.js App Router

- **Decision**: Use App Router instead of Pages Router
- **Rationale**: Modern React Server Components, better performance, improved developer experience
- **Impact**: All pages are server components by default, with client components marked with `'use client'`

### 2. TypeScript Throughout

- **Decision**: Strict TypeScript with no `any` types
- **Rationale**: Type safety prevents bugs and improves developer experience
- **Impact**: All data structures are typed, including Supabase rows, API responses, and component props

### 3. Zod Schema Validation

- **Decision**: Use Zod for runtime validation
- **Rationale**: Type-safe validation that works with TypeScript
- **Impact**: All experiment data is validated before database operations

### 4. Supabase as Backend

- **Decision**: Use Supabase for database and backend services
- **Rationale**: PostgreSQL database with built-in auth, real-time, and API generation
- **Impact**: Database schema defined in Supabase, accessed via TypeScript client

### 5. Write Gating

- **Decision**: Gate all write operations with `ENABLE_SUPABASE_WRITES` flag
- **Rationale**: Prevent accidental data mutations during development
- **Impact**: All POST/PATCH operations check this flag before executing

## Design Patterns

### 1. Data Mappers

**Pattern**: Separate mappers for converting between application types and database types

**Location**: `src/lib/experiments/mappers.ts`

**Example**:
```typescript
fromSupabaseRow(row: SupabaseExperimentRow): Experiment
toSupabaseInsert(experiment: ExperimentInsert): SupabaseExperimentInsert
toSupabaseUpdate(experiment: ExperimentUpdate): SupabaseExperimentUpdate
```

**Rationale**: Decouples application logic from database schema

### 2. Schema Validation

**Pattern**: Zod schemas for validation and transformation

**Location**: `src/lib/experiments/schema.ts`

**Example**:
```typescript
experimentInsertSchema.parse(payload) // Validates and transforms
```

**Rationale**: Single source of truth for data validation rules

### 3. Client/Server Separation

**Pattern**: Separate Supabase clients for browser and server

**Location**: 
- `src/lib/supabase/browser-client.ts` (public env vars)
- `src/lib/supabase/server-client.ts` (service role key)

**Rationale**: Security - service role key never exposed to browser

### 4. Environment Variable Management

**Pattern**: Centralized env variable reading with validation

**Location**: `src/lib/env.ts`

**Example**:
```typescript
getPublicEnv() // Public env vars (browser-safe)
getServerEnv() // Server-only env vars (API keys)
```

**Rationale**: Type-safe env access with clear separation of concerns

### 5. Retry Logic

**Pattern**: Retry operations for external API calls

**Location**: `src/lib/notion/sync.ts`, `src/lib/google/sync.ts`

**Example**:
```typescript
const retryOperation = async <T>(operation: () => Promise<T>, maxRetries = 3)
```

**Rationale**: Handle transient failures in external services

### 6. Fallback to Mock Data

**Pattern**: Graceful degradation when Supabase is unavailable

**Location**: `src/lib/experiments/queries.ts`

**Example**:
```typescript
try {
  const records = await listExperiments();
  if (records.length > 0) return records;
} catch (error) {
  return buildMockExperiments(); // Fallback
}
```

**Rationale**: Application works even without database connection

## Component Relationships

### Experiment Flow

```
ExperimentTable (UI)
  ↓
API Route (/api/experiments)
  ↓
queries.ts (createExperiment, updateExperiment)
  ↓
schema.ts (validation)
  ↓
mappers.ts (type conversion)
  ↓
Supabase Client
  ↓
Database
```

### Integration Flow

```
NotionSyncButton (UI)
  ↓
API Route (/api/notion/sync)
  ↓
sync.ts (syncExperimentToNotion)
  ↓
mappers.ts (experimentToNotionProperties)
  ↓
Notion Client
  ↓
Notion API
```

### Analytics Flow

```
AnalyticsPage (Server Component)
  ↓
metrics.ts (calculateSuccessRateTrend, etc.)
  ↓
Chart Components (Client Components)
  ↓
Recharts Library
```

## Integration Patterns

### 1. Notion Integration

- **Authentication**: API token via environment variable
- **Sync Direction**: One-way (dashboard → Notion) for now, two-way import preview available
- **Data Mapping**: Experiment properties mapped to Notion page properties
- **Error Handling**: Non-blocking - sync failures logged but don't break experiment creation

### 2. Google Drive Integration

- **Authentication**: JWT service account via environment variables
- **Sync Direction**: One-way (dashboard → Google Drive)
- **Document Format**: Markdown scorecards organized by category folders
- **Error Handling**: Retry logic with exponential backoff

### 3. Supabase Integration

- **Authentication**: Service role key for server operations, anon key for browser
- **Data Access**: Type-safe queries via Supabase client
- **Write Protection**: All writes gated by `ENABLE_SUPABASE_WRITES` flag
- **Error Handling**: Graceful fallback to mock data

## Security Patterns

1. **Environment Variables**: Sensitive keys only in server-side code
2. **Write Gating**: Explicit flag required for database mutations
3. **Type Safety**: TypeScript prevents many runtime errors
4. **Validation**: Zod schemas validate all user input
5. **Error Messages**: Generic error messages to avoid information leakage

