# Presales Intelligence Hub – Component Map

This document provides a single source of truth for how UI elements and supporting utilities are wired together. Use the identifiers and paths below when planning or implementing changes.

## Runtime Flow

```
src/main.tsx
└── PresalesHub (src/app/presales-hub-v1.tsx)
    ├── Sidebar navigation (local `navigation` array)
    ├── State
    │   ├── `activeSection` – decides which module renders
    │   ├── `briefData` – form payload for the generator
    │   └── `generatedBrief` – AI brief output, nullable
    └── `renderContent()` switch
        ├── Dashboard (src/app/modules/dashboard/Dashboard.tsx)
        ├── BriefGenerator (src/app/modules/briefs/components/BriefGenerator.tsx)
        ├── CaseStudies (src/app/modules/knowledge-base/CaseStudies.tsx)
        ├── KeyQuestions (src/app/modules/knowledge-base/KeyQuestions.tsx)
        ├── TalkingPoints (src/app/modules/knowledge-base/TalkingPoints.tsx)
        └── ComingSoon (src/app/modules/placeholders/ComingSoon.tsx) for inactive ids
```

## Component Registry

| ID (navigation) | Path | Purpose & Key Notes | Inputs |
| --- | --- | --- | --- |
| `dashboard` | `src/app/modules/dashboard/Dashboard.tsx` | Landing surface with CTA cards. Each card calls `onNavigate` with its destination id. | `onNavigate(sectionId: string)` from parent. |
| `brief-generator` | `src/app/modules/briefs/components/BriefGenerator.tsx` | Form-driven brief builder. Uses select lists from `constants.ts` and helper functions from `utils.ts` to produce a `GeneratedBrief`. | `briefData`, `setBriefData`, `generatedBrief`, `setGeneratedBrief`. |
| `case-studies` | `src/app/modules/knowledge-base/CaseStudies.tsx` | Static scaffold for future case study cards. Currently renders placeholder templates. | None. |
| `key-questions` | `src/app/modules/knowledge-base/KeyQuestions.tsx` | Renders default and industry-specific discovery questions using `getDiscoveryQuestions`. | None (invokes utility directly). |
| `talking-points` | `src/app/modules/knowledge-base/TalkingPoints.tsx` | Placeholder structure for messaging content. | None. |
| `concepts`, `platforms`, `team-skills`, `training` | `src/app/modules/placeholders/ComingSoon.tsx` | Generic “coming soon” panel. Title/description injected via props from the switch statement. | `title`, `description`. |

## Shared Data & Utilities

- `src/app/modules/briefs/constants.ts`: Lists valid `industries`, `meetingTypes`, and `clientRoles`. Defines `BriefData` and `GeneratedBrief` TypeScript interfaces—reuse these when extending form data or results.
- `src/app/modules/briefs/utils.ts`:
  - `getElevatorPitch`, `getDiscoveryQuestions`, `getCaseStudy`, `getIndustryInsights`, `getPositioning` produce domain text snippets keyed by industry.
  - `generateBriefData(briefData: BriefData): GeneratedBrief` composes the helpers above and is the single place to update generation logic.

## Change Navigation

Use this section as a checklist when editing features:

1. **Add a new top-level view**
   - Create the component under the appropriate folder in `src/app/modules`.
   - Register it inside the `navigation` array and `renderContent()` switch in `src/app/presales-hub-v1.tsx`.
2. **Extend the brief form**
   - Update `BriefData` / `GeneratedBrief` in `constants.ts`.
   - Adjust form controls inside `BriefGenerator.tsx`.
   - Modify `generateBriefData` to include new fields, plus any helper functions.
3. **Adjust discovery questions**
   - Update `getDiscoveryQuestions` in `utils.ts` so both `BriefGenerator` output and `KeyQuestions` reflect the change automatically.

Keep this file updated whenever component responsibilities shift so future contributors have an authoritative map.
