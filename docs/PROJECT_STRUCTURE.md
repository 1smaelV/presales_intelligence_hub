# Presales Intelligence Hub – Proposed Project Organization

This document outlines a future-ready structure for the Presales Intelligence Hub as it evolves from a single-page React experience into a multi-surface platform featuring AI agents and a Retrieval-Augmented Generation (RAG) chatbot. The goal is to keep the codebase modular, observable, and collaboration-friendly while enabling experimentation with emerging AI workflows.

## High-Level Architecture

```
Presales Intelligence Hub
├── src/
│   ├── app/              # Current React/Vite front-end (rooted at src/app)
│   ├── agent-console/    # Admin UI for configuring AI agents and playbooks
│   └── api/              # Edge handlers or BFF when needed for auth/rate limiting
├── services/
│   ├── orchestrator/     # Coordinates AI agents, task queues, telemetry
│   ├── rag-bot/          # Retrieval pipeline + chat endpoints
│   └── automation/       # Long-running jobs (dataset refresh, embedding updates)
├── packages/
│   ├── ui/               # Shared React UI primitives (cards, panels, charts)
│   ├── agents/           # Reusable agent behaviors, tools, prompt templates
│   ├── knowledge/        # Schema + validation for knowledge items and briefs
│   └── config/           # Typed configuration, feature flags, environment helpers
├── data/
│   ├── sources/          # Raw docs, transcripts, collateral
│   ├── processed/        # Cleaned tables ready for embeddings
│   └── embeddings/       # Vector DB snapshots or export scripts
└── docs/
    ├── COMPONENT_MAP.md
    ├── PROJECT_STRUCTURE.md
    └── ...architecture, runbooks, ADRs
```

## Front-End (src/app)

- `src/app/presales-hub-v1.tsx` remains the entry point until features are factored into route-based modules.
- Proposed sub-structure:
  - `src/app/modules/briefs` (existing generator, constants, utils)
  - `src/app/modules/knowledge-base` (case studies, talking points)
  - `src/app/modules/chat` (RAG chatbot widget + conversation log)
  - `src/app/modules/agents` (UI to monitor background AI agents)
  - `src/app/lib` (API hooks, analytics, feature toggles)
  - `src/app/types` (shared TypeScript interfaces imported by multiple modules)
- Adopt a design system inside `packages/ui` to share tokens/components between the `src/app` experience and the future `agent-console`.

## AI Agents Layer (services/orchestrator + packages/agents)

- **services/orchestrator**: Node/TypeScript or Python service running the task router and agent lifecycle. Responsibilities include:
  - Handling scheduled or event-driven triggers (e.g., new meeting scheduled → generate brief).
  - Coordinating access to toolkits (CRM, calendar, knowledge graph).
  - Persisting agent runs, state snapshots, and audit trails.
- **packages/agents**: Holds agent definitions, prompt templates, and shared tools (e.g., `BriefCompilerAgent`, `ResearchAgent`, `FollowUpEmailAgent`). Export them so the orchestrator and potential serverless functions can reuse the same building blocks.
- Observability: add structured logging, OpenTelemetry traces, and evaluation hooks (automatic regression checks on agent outputs).

## RAG Chatbot Service (services/rag-bot)

- Components:
  - `ingest/` jobs that parse documents from `data/sources`, normalize them, then store clean outputs in `data/processed`.
  - `embeddings/` logic to generate/update vectors and sync them with the chosen vector store (e.g., Pinecone, Weaviate, pgvector).
  - `api/` exposing chat endpoints with guardrails (rate limits, identity, moderation).
  - `evaluation/` scripts for retrieval quality and response grading.
- Front-end integration: expose a typed SDK in `packages/config` (for environment metadata) plus React hooks under `src/app/modules/chat`.

## Data & Knowledge Management

- Keep raw collateral under `data/sources` with catalog metadata (owner, freshness, sensitivity).
- Build transformation scripts (TypeScript, Python, or dbt) under `data/pipelines`.
- Track embedding versions (e.g., `embeddings/v1/…`) plus manifest files describing model, chunk size, filters.
- If using third-party vector DBs, add IaC files (Terraform) or CLI scripts to provision collections.

## Cross-Cutting Concerns

- **Testing**: dedicate `tests/` per service with shared fixtures; add simulated agent conversations and RAG retrieval tests.
- **Configuration**: centralize environment variables in `packages/config` with schema validation (zod or TypeScript + dotenv-safe).
- **Security & Compliance**: document data classification and access controls inside `docs/security/`.
- **CI/CD**: use pipeline templates (GitHub Actions) at repo root for lint/test/deploy per app/service.
- **Documentation**: continue expanding `docs/` with:
  - Architecture Decision Records (ADRs)
  - Runbooks for agent failures/RAG drift
  - Product specs for each module

## Adoption Path

1. **Short term**: reorganize the current React app into `apps/web`, move shared types/utils into `packages/knowledge`, and add lint/test workflows.
2. **Mid term**: Stand up `services/rag-bot` with ingestion + chat API and integrate the widget into the dashboard.
3. **Long term**: Introduce orchestrated AI agents for proactive brief generation, ensuring they log outputs and can be monitored from the agent console.

This structure keeps experimentation agile while laying the groundwork for enterprise-scale AI features. Use it as a reference when creating new modules or planning roadmap milestones.


--n8n start
--npm run dev
--npm run build
--npm test