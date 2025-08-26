# Todo List App

A simple, fast todo app built with React and TypeScript.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Storage**: IndexedDB (local browser storage)
- **Deployment**: Vercel

## Features

- Add, complete, and delete tasks
- Priority levels (low, medium, high)
- Dark/light mode toggle
- Task statistics
- Persistent local storage
- Responsive design

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## Deployment

The app is deployed on Vercel. Push to main branch for automatic deployment.

## Local Development

The app uses IndexedDB for data persistence, so your todos will be saved locally in your browser. No backend required.
