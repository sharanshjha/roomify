# Roomify

Roomify is a modern React Router + TypeScript web app scaffolded for building a polished product experience with authentication-ready UI.

## Highlights

- React Router v7 app architecture
- TypeScript-first codebase
- Tailwind CSS v4 styling with custom design tokens
- Reusable UI primitives (for example `Button` with variant/size modifiers)
- Puter authentication integration (`signIn`, `signOut`, `getCurrentUser`)
- Dockerfile included for containerized deployment

## Tech Stack

- React 19
- React Router 7
- TypeScript 5
- Tailwind CSS 4
- Vite 7
- `@heyputer/puter.js`
- `lucide-react`

## Project Structure

```text
app/
  root.tsx              # App shell + auth context wiring
  routes/home.tsx       # Home route
  app.css               # Tailwind + component styles
components/
  Navbar.tsx            # Header + auth actions
  ui/Button.tsx         # Reusable button component (BEM-style classes)
lib/
  puter.action.ts       # Puter auth helpers
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development

```bash
npm run dev
```

App runs locally on the port shown by Vite/React Router dev server.

### 3. Type-check

```bash
npm run typecheck
```

### 4. Build for production

```bash
npm run build
```

### 5. Run production build

```bash
npm run start
```

## Authentication Notes

Roomify uses Puter SDK calls from `lib/puter.action.ts`:

- `signIn()`
- `signOut()`
- `getCurrentUser()`

`app/root.tsx` refreshes auth state on load and exposes auth actions/state via outlet context for route components.

## Docker

Build and run:

```bash
docker build -t roomify .
docker run -p 3000:3000 roomify
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build server/client output
- `npm run start` - Serve production build
- `npm run typecheck` - Generate route types and run TypeScript checks

## Status

This repo currently includes the base app shell, auth-aware navbar, and UI foundations. Extend routes/components to add your full Roomify product flow.
