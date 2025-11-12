## LocalDev Experiment Dashboard

This repository contains the first iteration of the LocalDev experimentation dashboard. It is a Next.js (App Router) application designed to coordinate experiments, capture learnings, and surface programme health indicators as the team builds a fail-fast operating rhythm.

## Project structure

- `src/app` – App Router pages and layouts. Dashboard routes live under `(dashboard)`.
- `src/components` – Reusable UI components (metrics, tables, placeholders).
- `src/lib` – Supabase client setup, environment helpers, experiment domain types, validation, and mock data.
- `src/app/api/experiments` – Route handlers for experiment CRUD operations (Supabase-backed with write gating).

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an `.env.local` file at the repository root with the following variables:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<public-anon-key>"
   SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
   # Optional: leave "false" during development unless you have explicit approval.
   ENABLE_SUPABASE_WRITES="false"
   
   # Optional: Notion integration
   NOTION_API_TOKEN="<notion-integration-token>"
   NOTION_DATABASE_ID="<notion-database-id>"
   ```

   > The service role key must never be exposed to browser bundles or committed to source control. Route handlers load it server-side only.
   
   > **Notion Integration Setup:**
   > 1. Create a Notion integration at https://www.notion.so/my-integrations
   > 2. Copy your integration token and add it as `NOTION_API_TOKEN`
   > 3. Create or select a Notion database for experiments
   > 4. Share the database with your integration (Settings → Connections → Add connections)
   > 5. Copy the database ID from the database URL (the 32-character hex string between the workspace name and the `?`)
   > 6. Add it as `NOTION_DATABASE_ID`

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Navigate to [http://localhost:3000/overview](http://localhost:3000/overview) to explore the dashboard.

If Supabase credentials are missing or the database is unreachable, the UI gracefully falls back to curated mock data so the workflow can be demonstrated without live access.

## Supabase usage and safety rails

- The Supabase client is initialised through `src/lib/supabase/serverClient.ts` and `client.ts`. All write operations are gated by `ENABLE_SUPABASE_WRITES`. Keep this flag set to `false` unless the team explicitly approves a mutation.
- Do **not** delete databases, truncate tables, or run destructive migrations via the MCP servers. Always ask for confirmation before executing any SQL statements, even read operations against production data.
- Mutating API routes (`POST /api/experiments`, `PATCH /api/experiments/:id`) throw a `403` if writes are disabled, preventing accidental data changes.
- Validation is enforced with Zod schemas under `src/lib/experiments/schema.ts` to guarantee that experiment records respect the ICE scoring model and associated metadata.

## API surface

- `GET /api/experiments` – Returns experiments along with an overview summary. Uses Supabase when credentials are available, otherwise mock data.
- `POST /api/experiments` – Creates an experiment after validation. Requires `ENABLE_SUPABASE_WRITES=true`. Optionally syncs to Notion if `syncToNotion` is true.
- `PATCH /api/experiments/:id` – Updates status, outcome, and other fields. Also gated by the write flag.
- `POST /api/notion/sync` – Syncs experiments to Notion. Supports single experiment or bulk sync.
- `GET /api/notion/import` – Imports experiments from Notion database for preview and potential import.

## Dashboard views

- **Overview** – Highlights key metrics (velocity, success rate, pipeline size) and lifecycle distribution.
- **Experiments** – Table with ICE scoring, owner visibility, and forms for creating/updating experiments. Forms are wired to the API but respect the write gate. Includes ICE ranking table and Notion sync button.
- **ICE Calculator** – Standalone calculator for scoring experiments with Impact, Confidence, and Ease sliders.
- **Sprint Planning** – Summaries for current sprint commitments and backlog candidates.
- **Analytics & Insights** – Aggregated metrics, high-ICE opportunities, high-learning failures, and chart placeholders for upcoming visualisations.
- **Notion** – Integration page for syncing experiments to Notion and importing changes back. Shows preview of Notion experiments and sync status.
- **Pre-Mortem** – Risk register informed by the failure scenarios outlined in the experimentation playbook.

## Next steps and integrations

- Add the Memory Bank markdown files (`projectbrief.md`, `productContext.md`, etc.) under `memory-bank/` once the dashboard requirements are frozen.
- Expand `.cursor/rules` with project-specific guidelines (Notion, Google Drive, Motion automation, MCP server usage) after validating the current workflow.
- Integrate live Notion databases, Google Drive automation, and Motion task scheduling using the provided experimentation framework.
- When ready to run migrations, coordinate with the team and document each change before executing anything through Supabase or Neon MCP servers.

## Development guidelines

- Adhere to the coding conventions in `eslint.config.mjs`. Add a Prettier configuration if formatting automation is required.
- Avoid informal language or emojis in both code and documentation.
- Capture experiment learnings and architectural decisions in repository docs to support the Memory Bank once it is created.
