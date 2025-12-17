# Presales Intelligence Hub

AI-assisted workspace for presales teams to prepare executive briefs, curate discovery questions, and surface go-to-market assets from a single React application.

## Features

- **General Meeting Prep** – Collects meeting context and instantly produces elevator pitches, discovery questions, insights, and case study scaffolding.
- **Dashboard Shortcuts** – Quick entry points into briefs, case studies, talking points, and upcoming modules.
- **Knowledge Base Modules** – Structured placeholders for industry stories, talking points, and discovery prompts, ready for content expansion.
- **Future-Ready Structure** – Codebase organized under `src/app` modules, leaving room for AI agents, RAG chatbot widgets, and shared packages described in `docs/PROJECT_STRUCTURE.md`.

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) for the frontend shell.
- [TypeScript](https://www.typescriptlang.org/) with strict compiler settings.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- [Vitest](https://vitest.dev/) + Testing Library for unit tests.
- [Lucide](https://lucide.dev/) icon set.

## Repository Layout

```
├── docs/                     # Architecture + component documentation
├── src/
│   ├── app/                  # Presales Hub application shell
│   │   ├── modules/
│   │   │   ├── briefs/       # Brief generator + domain constants/utilities
│   │   │   ├── dashboard/    # Landing surface with CTAs
│   │   │   ├── knowledge-base/ # Case studies, talking points, questions
│   │   │   └── placeholders/ # Coming soon templates
│   │   └── presales-hub-v1.tsx
│   ├── __tests__/            # Vitest suites
│   ├── index.ts              # Package exports
│   ├── main.tsx              # Vite entry point
│   └── vitest.setup.ts       # Testing-library globals
├── package.json
├── vite.config.ts
└── render.yaml               # Render.com deployment recipe
```

Consult `docs/COMPONENT_MAP.md` for an up-to-date map of component responsibilities and `docs/PROJECT_STRUCTURE.md` for the long-term architecture roadmap.

## Getting Started

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run tests
npm test
```

The app is served at `http://localhost:5173` by default.

## Deployment

### Render.com (Static Site)

The repository includes a `render.yaml` describing a static site service. Render automatically runs `npm install` and `npm run build`, then serves the contents of `dist/`.

1. Push this repo to GitHub (or another Git provider).
2. In Render:
   - Click **New** → **Blueprint**.
   - Point to the repository and branch.
   - Confirm the static site service configuration detected from `render.yaml`.
3. Deploy. Subsequent pushes to the default branch will trigger automatic rebuilds.

### Manual Deploy

```bash
npm run build     # produces dist/
```

Host the `dist/` directory on any static provider (Render, Netlify, Vercel, S3, etc.).

## Testing & Quality Gates

- `npm run lint` – ESLint with TypeScript rules.
- `npm test` – Vitest + React Testing Library.
- `npm run build` – Type check + production build (used during CI/CD and Render deploys).

## Contributing

1. Fork the repo and create a feature branch.
2. Follow the structure documented in `docs/PROJECT_STRUCTURE.md`.
3. Update or add tests for new functionality.
4. Submit a pull request detailing the change and any docs/test impact.

## License

MIT © Presales Intelligence Hub Team
