# claude-design-wedding-gift-list-fe

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Drizzle** - TypeScript-first ORM
- **SQLite/Turso** - Database engine

## Getting Started

First, install the dependencies:

```bash
npm install
```

## Database Setup

This project uses SQLite with Drizzle ORM.

1. Start the local SQLite database (optional):

```bash
npm run db:local
```

2. Update your `.env` file in the `apps/web` directory with the appropriate connection details if needed.

3. Apply the schema to your database:

```bash
npm run db:push
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@claude-design-wedding-gift-list-fe/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Project Structure

```
claude-design-wedding-gift-list-fe/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   └── db/          # Database schema & queries
```

## Available Scripts

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications
- `npm run dev:web`: Start only the web application
- `npm run check-types`: Check TypeScript types across all apps
- `npm run db:push`: Push schema changes to database
- `npm run db:generate`: Generate database client/types
- `npm run db:migrate`: Run database migrations
- `npm run db:studio`: Open database studio UI
- `npm run db:local`: Start the local SQLite database
