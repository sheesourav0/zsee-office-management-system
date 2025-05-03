
# ZSEE Management System

A comprehensive management system for projects, payments, transportation, and vendor management, built using React and following the Screaming Architecture pattern.

## Architecture

This project follows the **Screaming Architecture** pattern, which organizes code by business domains rather than technical concerns. 

### Key features of our architecture:

- **Feature-First Organization**: Code is organized by business domains (features) rather than technical types.
- **Self-Contained Features**: Each feature contains its own components, hooks, utils, and pages.
- **Clear Boundaries**: Features have clear boundaries and focused responsibilities.
- **Intuitive Navigation**: The codebase structure makes it easy to find where specific features are implemented.

### Directory Structure

```
src/
├── components/         # Shared UI components (shadcn/ui)
├── features/          # Business domains
│   ├── auth/          # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── dashboard/     # Dashboard feature
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── layout/        # Application layout
│   │   └── components/
│   ├── payments/      # Payments feature
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── projects/      # Projects feature
│   │   └── components/
│   ├── reports/       # Reports feature
│   │   └── pages/
│   ├── transportation/# Transportation feature
│   │   └── components/
│   └── users/         # User management feature
│       ├── components/
│       └── pages/
├── hooks/             # Shared hooks
├── lib/               # Shared utilities
└── pages/             # Root pages (being migrated to feature folders)
```

## Benefits of this Architecture

- **Maintainability**: Easier to understand and maintain as the application grows
- **Scalability**: New features can be added without affecting existing ones
- **Team Collaboration**: Multiple teams can work on different features simultaneously
- **Domain Focus**: Code organization reflects business requirements rather than technical concerns
- **Clear Responsibility**: Each feature folder has a clear purpose and responsibility

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router for navigation
- React Query for data fetching
- Zod for form validation
