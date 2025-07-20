# Maintainable.app - Personal Inventory Manager

A comprehensive inventory manager web app for tracking major appliances, systems, and other maintenance items. Users can log their assets, view maintenance tasks & schedules, cost projections, and receive proactive warnings about upcoming maintenance needs.

## 🏠 Features

- Track home appliances, systems, assets, and any other maintainable items
- View maintenance timelines and cost projections
- Receive proactive warnings for upcoming maintenance
- Example: "Your roof is 23 years old, expect to replace it in 7 years for about $32,500"

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack React Query for server state
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm
- Supabase account and project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd maintainable
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_PROJECT_ID=your_supabase_project_id
SUPABASE_ACCESS_TOKEN=your_account_access_token
```

4. Set up the database
```bash
# Generate TypeScript types from Supabase schema
npm run db:typegen

# Seed the database with sample data
npm run db:seed
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:seed` - Seed database with sample data
- `npm run db:typegen` - Generate TypeScript types from Supabase schema

## 🗄️ Database Setup

This project uses Supabase as the database backend. The database configuration is handled through environment variables:

### Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations)
- `SUPABASE_PROJECT_ID`: Your Supabase project ID (for type generation)
- `SUPABASE_ACCESS_TOKEN`: You Supabase account level access token (for type generation)

### Database Commands

- **Type Generation**: `npm run db:typegen` - Generates TypeScript types from your Supabase schema
- **Seeding**: `npm run db:seed` - Populates the database with sample data for development

### Schema Management

The database schema is managed directly in Supabase. TypeScript types are automatically generated from the schema using the `db:typegen` script.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   └── property/       # Property management pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   └── providers/      # Context providers
├── lib/                # Utility functions
│   └── supabase.ts     # Supabase client configuration
├── types/              # TypeScript definitions
│   └── supabase.types.ts # Auto-generated Supabase types
├── hooks/              # Custom React hooks
│   └── api/            # API-specific hooks
├── data/               # Static data and mock data
└── scripts/            # Database scripts
    └── seed.ts         # Database seeding script
```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📋 Development Guidelines

This project follows strict development guidelines defined in `.cursorrules`:

- **Component Architecture**: Consistent structure with TypeScript
- **Form Management**: React Hook Form with Zod validation
- **Data Fetching**: TanStack React Query patterns
- **Database Operations**: Supabase client with TypeScript types
- **Styling**: Tailwind CSS utility classes
- **Testing**: Jest with React Testing Library

## 🎯 Framework Examples

The homepage includes working examples of:

- **React Hook Form**: Form validation with Zod schemas
- **React Query**: Data fetching with loading and error states
- **Supabase Integration**: Database operations with TypeScript types
- **TypeScript**: Full type safety throughout
- **Tailwind CSS**: Responsive design patterns

## 📚 Documentation

- See `.cursorrules` for detailed development guidelines
- Component patterns and architecture decisions
- Domain-specific naming conventions
- Database schema and API design
- Testing strategies and best practices

## 🤝 Contributing

1. Follow the coding standards defined in `.cursorrules`
2. Write tests for new features
3. Run `npm run lint` and `npm run type-check` before committing
4. Run `npm run db:typegen` after schema changes
5. Use conventional commit messages

## 📄 License

ISC 