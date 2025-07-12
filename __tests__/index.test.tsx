import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/app/page';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Wrapper component with providers for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('Home', () => {
  it('renders the homepage title', () => {
    render(<Home />, { wrapper: TestWrapper });

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Timber - House Manager');
  });

  it('renders the framework description', () => {
    render(<Home />, { wrapper: TestWrapper });

    const description = screen.getByText(/Framework Setup Complete/);
    expect(description).toBeInTheDocument();
  });

  it('renders all technology cards', () => {
    render(<Home />, { wrapper: TestWrapper });

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
    expect(screen.getByText('React Query')).toBeInTheDocument();
  });

  it('renders the form example', () => {
    render(<Home />, { wrapper: TestWrapper });

    expect(screen.getByText('React Hook Form Example')).toBeInTheDocument();
  });

  it('renders the query example component', () => {
    render(<Home />, { wrapper: TestWrapper });

    // The React Query example shows a loading skeleton, so we check for that
    const { container } = render(<Home />, { wrapper: TestWrapper });
    const loadingElement = container.querySelector('.animate-pulse');
    expect(loadingElement).toBeTruthy();
  });
});
