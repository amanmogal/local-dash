# Technical Context: LocalDev Experiment Dashboard

## Technologies Used

### Core Framework

- **Next.js 16.0.1**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5**: Type-safe JavaScript

### Backend & Database

- **Supabase**: PostgreSQL database with TypeScript client
- **@supabase/supabase-js 2.80.0**: Supabase client library

### Data Validation

- **Zod 4.1.12**: Schema validation library

### Integrations

- **@notionhq/client 5.3.0**: Notion API client
- **googleapis 165.0.0**: Google APIs client library

### Visualization

- **recharts 3.3.0**: React charting library

### Development Tools

- **ESLint 9**: Code linting
- **eslint-config-next**: Next.js ESLint configuration
- **@types/node, @types/react, @types/react-dom**: TypeScript type definitions
- **babel-plugin-react-compiler**: React compiler plugin

## Development Setup

### Prerequisites

- Node.js (version compatible with Next.js 16)
- npm or yarn package manager
- Supabase project (for database)
- Notion integration (optional, for Notion sync)
- Google Cloud service account (optional, for Google Drive sync)

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` file with:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<public-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

# Write Protection (Required)
ENABLE_SUPABASE_WRITES="false"

# Notion Integration (Optional)
NOTION_API_TOKEN="<notion-integration-token>"
NOTION_DATABASE_ID="<notion-database-id>"

# Google Drive Integration (Optional)
GOOGLE_CLIENT_EMAIL="<service-account-email>"
GOOGLE_PRIVATE_KEY="<service-account-private-key>"
GOOGLE_DRIVE_FOLDER_ID="<google-drive-folder-id>"
```

### Running the Application

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Technical Constraints

### 1. Database Security

- **Never delete databases** via MCP servers
- **Never truncate tables** without explicit approval
- **Always ask for confirmation** before executing SQL
- **Write operations gated** by `ENABLE_SUPABASE_WRITES` flag

### 2. Type Safety

- **No `any` types** - use proper TypeScript types
- **Strict mode enabled** in TypeScript configuration
- **All API responses typed** with interfaces

### 3. Code Quality

- **No emojis** in code or documentation
- **Professional language** only
- **ESLint rules enforced** via Next.js config
- **Consistent formatting** (consider Prettier in future)

### 4. Performance

- **Server Components by default** - use client components only when needed
- **Lazy loading** for chart components (client-side only)
- **Efficient data fetching** - minimize database queries

## Dependencies

### Production Dependencies

- `next`: Next.js framework
- `react`, `react-dom`: React library
- `@supabase/supabase-js`: Supabase client
- `zod`: Schema validation
- `@notionhq/client`: Notion API client
- `googleapis`: Google APIs client
- `recharts`: Charting library

### Development Dependencies

- `typescript`: TypeScript compiler
- `@types/*`: TypeScript type definitions
- `eslint`: Code linting
- `eslint-config-next`: Next.js ESLint config
- `babel-plugin-react-compiler`: React compiler

## Project Structure

```
localdev-dash/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Dashboard pages
│   │   ├── api/                 # API routes
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── analytics/           # Chart components
│   │   ├── experiments/         # Experiment UI
│   │   ├── ice/                 # ICE calculator
│   │   ├── rice/                # RICE calculator
│   │   ├── notion/              # Notion integration UI
│   │   └── google/              # Google Drive UI
│   ├── lib/                     # Business logic
│   │   ├── analytics/           # Analytics calculations
│   │   ├── experiments/         # Experiment queries & schemas
│   │   ├── notion/              # Notion integration
│   │   ├── google/               # Google Drive integration
│   │   └── supabase/            # Supabase clients
│   └── types/                   # TypeScript types
├── memory-bank/                 # Project documentation
├── public/                      # Static assets
├── .cursor/                     # Cursor IDE rules
└── package.json                 # Dependencies
```

## Build & Deployment

### Build Process

1. TypeScript compilation
2. Next.js optimization
3. Static page generation (where applicable)
4. Bundle optimization

### Build Output

- `.next/` directory contains optimized build
- Static assets in `public/` are served as-is
- API routes compiled to serverless functions

### Deployment Considerations

- **Environment Variables**: Must be set in deployment environment
- **Supabase**: Database must be accessible from deployment environment
- **External APIs**: Notion and Google Drive APIs must be accessible
- **Write Protection**: `ENABLE_SUPABASE_WRITES` should be `false` in production until explicitly enabled

## Known Technical Debt

1. **Error Handling**: Some error messages could be more user-friendly
2. **Loading States**: Some components lack loading indicators
3. **Testing**: No unit or integration tests yet
4. **Prettier**: No code formatter configured
5. **Type Assertions**: Some `as any` type assertions in integration code (Notion, Google Drive)

