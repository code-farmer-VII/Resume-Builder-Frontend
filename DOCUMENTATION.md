# Resume Builder — Frontend

A React-based frontend for building, previewing and exporting professional resumes. This repository contains the UI, components, templates and tooling used to create and export resumes that are persisted to a backend API.

The files below are a recommended README and companion documentation to help contributors and maintainers get started quickly.

---

## Table of contents

- [Features](#features)  
- [Tech stack](#tech-stack)  
- [Repository layout](#repository-layout)  
- [Getting started (local)](#getting-started-local)  
- [Common scripts](#common-scripts)  
- [Environment variables](#environment-variables)  
- [Data model & templates](#data-model--templates)  
- [Adding a new template](#adding-a-new-template)  
- [API contract (example)](#api-contract-example)  
- [Testing](#testing)  
- [Development tips](#development-tips)  
- [Contributing](#contributing)  
- [License & contact](#license--contact)

---

## Features

- Create, edit and preview resumes using reusable templates
- Autosave drafts to local storage and optional server sync
- Export to print-friendly HTML and PDF
- Responsive templates and accessible form controls

## Tech stack

- Framework: React (Create React App, Vite, or Next.js — replace CLI commands as needed)
- State management: React Context / useReducer (or Redux / Zustand for larger scale)
- Styling: CSS Modules / SASS / Tailwind (project-specific)
- Build tools: Node.js, npm or yarn
- Optional: html-to-pdf or Puppeteer for server-side PDF generation

## Repository layout (recommended)

- public/ — static assets (index.html, favicons, template thumbnails)
- src/
  - components/ — reusable UI primitives (Button, Input, Modal, Icon)
  - layout/ — app shell components (Header, Footer, Sidebar)
  - pages/ — page-level views (EditorPage, TemplatesPage, DashboardPage)
  - templates/ — resume template components with metadata
  - services/ — API client and persistence logic (services/api.ts)
  - store/ — context providers or Redux slices
  - hooks/ — custom hooks (useAutosave, useDebouncedSave, useLocalStorage)
  - styles/ — global styles, theme tokens
  - utils/ — helpers (validators, formatters, export helpers)
  - App.{js,tsx} — application root and routing
- .env.example — example env vars
- package.json — scripts and dependencies
- README.md — this file
- DOCUMENTATION.md — in-depth documentation (this repo)

## Getting started (local)

Prerequisites:
- Node.js 16+ (or the version your project requires)
- npm or yarn

Steps:

1. Clone the repository
```bash
git clone https://github.com/code-farmer-VII/Resume-Builder-Frontend.git
cd Resume-Builder-Frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create environment file
```bash
cp .env.example .env
# Edit .env to add API base URL and any keys required
```

4. Run the development server
```bash
npm run dev      # or `npm start` depending on project setup
# or
yarn dev
```

5. Build for production
```bash
npm run build
```

6. Run tests
```bash
npm test
```

Notes:
- If the project uses Create React App, use `npm start`; if Vite, use `npm run dev`; if Next.js, use `npm run dev`. Check package.json for exact script names.

## Common scripts (examples)

- `dev` or `start` — start development server with hot reloading  
- `build` — build production bundle  
- `test` — run unit/integration tests  
- `lint` — run linters (ESLint, stylelint)  
- `format` — run Prettier

Check package.json for the exact script names used in this repo.

## Environment variables (example)

Add these to `.env` or `.env.local` (do not commit secrets):

- REACT_APP_API_URL — Base URL for backend API (e.g., https://api.example.com)
- REACT_APP_AUTH_ENABLED — "true" or "false"
- REACT_APP_GOOGLE_ANALYTICS — GA tracking ID (optional)

## Data model & templates

The frontend expects a canonical resume model. Example:

```json
{
  "id": "string",
  "meta": { "title": "string", "template": "clean" },
  "contact": { "name": "", "email": "", "phone": "", "location": "" },
  "summary": "",
  "sections": [
    {
      "type": "experience",
      "items": [
        { "company": "", "role": "", "start": "", "end": "", "description": "" }
      ]
    },
    { "type": "education", "items": [] },
    { "type": "skills", "items": ["JavaScript", "React"] }
  ],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-02T00:00:00Z"
}
```

Templates:
- Each template is a React component that accepts the canonical resume object as props and renders markup suitable for screen and print.
- Templates export metadata (id, name, thumbnail path, description, requiredFields).

## Adding a new template

1. Create a folder `src/templates/<template-id>/`.
2. Add the template component `Template.tsx` and styles `Template.module.css` (or preferred system).
3. Export metadata and the component from `src/templates/index.ts`.
4. Add a thumbnail under `public/templates/` and metadata entry to the templates registry.

Example template metadata:
```ts
export default {
  id: "clean",
  name: "Clean",
  thumbnail: "/templates/clean.png",
  component: CleanTemplate
};
```

## API contract (example)

The frontend expects the backend to support basic resume operations. Adjust endpoints to the real backend.

- GET /templates — list templates and their metadata  
- GET /resumes — list resumes for the user  
- GET /resumes/:id — get one resume  
- POST /resumes — create a resume (body: resume JSON)  
- PUT /resumes/:id — update resume  
- DELETE /resumes/:id — delete resume

Always centralize API calls in `src/services/api.*` so authorization and base URL are configured in one place.

## Testing

- Unit tests: Jest + React Testing Library
- Visual/Regression: Storyshots, Percy, or Chromatic for templates
- Mock network requests with msw or jest mocks

Run:
```bash
npm test
# or
yarn test
```

## Development tips

- Use `useAutosave` hook to debounce saves and store working drafts in localStorage.
- Keep template styles isolated (CSS Modules or Styled Components) to avoid cross-template leakage.
- Provide `@media print` styles to make exports clean.
- For PDF exports client-side, use libraries like `html2pdf.js` or render server-side with Puppeteer for high-fidelity results.

## Contributing

- Fork the repo and create a feature branch.
- Run tests and linters locally.
- Open a PR describing the change, linking any design decisions.
- Update DOCUMENTATION.md for large changes.

## License & contact

Add an appropriate LICENSE file (MIT, Apache 2.0, etc.). Update package.json author and repository information.

---

If you want, I can:
- Create these files in the repository and push them to a branch (I can prepare the exact commit message and file contents).  
- Or tailor the README and DOCUMENTATION to match exact tooling in package.json (e.g., swap `dev`/`start`) if you paste package.json or tell me which starter (CRA, Vite, Next) this project uses.