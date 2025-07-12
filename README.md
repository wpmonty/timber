# Timber - House Manager

A comprehensive house manager web app for tracking major appliances and home maintenance items. Users can log their home assets, view maintenance timelines, cost projections, and receive proactive warnings about upcoming maintenance needs.

## 🏠 Features

- Track home appliances and maintenance items
- View maintenance timelines and cost projections
- Receive proactive warnings for upcoming maintenance
- Example: "Your roof is 23 years old, expect to replace it in 7 years for about $32,500"

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack React Query for server state
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd timber
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   ├── examples/       # Framework examples
│   └── providers/      # Context providers
├── lib/                # Utility functions
├── types/              # TypeScript definitions
└── hooks/              # Custom React hooks
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
- **Styling**: Tailwind CSS utility classes
- **Testing**: Jest with React Testing Library

## 🎯 Framework Examples

The homepage includes working examples of:

- **React Hook Form**: Form validation with Zod schemas
- **React Query**: Data fetching with loading and error states
- **TypeScript**: Full type safety throughout
- **Tailwind CSS**: Responsive design patterns

## 📚 Documentation

- See `.cursorrules` for detailed development guidelines
- Component patterns and architecture decisions
- Domain-specific naming conventions
- Testing strategies and best practices

## 🤝 Contributing

1. Follow the coding standards defined in `.cursorrules`
2. Write tests for new features
3. Run `npm run lint` and `npm run type-check` before committing
4. Use conventional commit messages

## 📄 License

ISC 