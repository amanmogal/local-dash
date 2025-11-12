# Project Brief: LocalDev Experiment Dashboard

## Overview

The LocalDev Experiment Dashboard is a Next.js (App Router) application designed to coordinate experiments, capture learnings, and surface program health indicators as the team builds a fail-fast operating rhythm.

## Core Requirements

### Primary Goals

1. **Experiment Tracking**: Capture and manage experiments throughout their lifecycle
2. **Scoring Framework**: Implement ICE (Impact, Confidence, Ease) and RICE (Reach, Impact, Confidence, Effort) scoring models
3. **Analytics & Insights**: Provide visualizations and metrics to track experiment success rates, velocity, and ROI
4. **Integration**: Connect with external tools (Notion, Google Drive) for documentation and workflow automation
5. **Fail-Fast Philosophy**: Support rapid experimentation with clear success criteria and learning capture

### Key Features

- Experiment CRUD operations with validation
- ICE and RICE scoring calculators
- Real-time metrics and analytics dashboards
- Notion integration for two-way sync
- Google Drive integration for document storage
- Automated scorecard generation
- Ranking tables for prioritization

## Project Scope

### In Scope

- Experiment lifecycle management (draft → active → completed)
- ICE and RICE scoring calculations
- Analytics visualizations (success rate trends, category distribution, time to learning, ROI)
- Notion database sync (export and import)
- Google Drive document export
- Supabase backend integration
- TypeScript type safety throughout

### Out of Scope (Current Phase)

- User authentication and authorization
- Multi-tenant support
- Real-time collaboration features
- Advanced reporting and exports
- Mobile application

## Success Criteria

1. Team can create, update, and track experiments with ICE/RICE scores
2. Analytics dashboard provides actionable insights on experiment performance
3. Experiments sync seamlessly with Notion and Google Drive
4. Dashboard builds and runs without errors
5. All integrations are properly configured and tested

## Constraints

- Must use Next.js App Router
- Must use TypeScript
- Must use Supabase as backend database
- Write operations must be gated by `ENABLE_SUPABASE_WRITES` flag
- No database deletion or destructive operations via MCP servers
- All code must follow project coding conventions (no emojis, professional language)

