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
  it('renders the main heading', () => {
    render(<Home />, { wrapper: TestWrapper });

    // Look for the main "Maintainable" heading (there are multiple h1s, so get all and check)
    const headings = screen.getAllByRole('heading', { level: 1 });
    const mainHeading = headings.find(heading => heading.textContent === 'Maintainable');
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders the home manager subtitle', () => {
    render(<Home />, { wrapper: TestWrapper });

    const subtitle = screen.getByText('Your Home Manager');
    expect(subtitle).toBeInTheDocument();
  });

  it('renders the main description', () => {
    render(<Home />, { wrapper: TestWrapper });

    const description = screen.getByText(/Track your home's maintenance, manage appliances/);
    expect(description).toBeInTheDocument();
  });

  it('renders the onboarding form', () => {
    render(<Home />, { wrapper: TestWrapper });

    expect(screen.getByText('Get started with your home')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your home address to begin managing your property')
    ).toBeInTheDocument();
  });

  it('renders the address input and submit button', () => {
    render(<Home />, { wrapper: TestWrapper });

    const addressInput = screen.getByRole('textbox', { name: /home address/i });
    expect(addressInput).toBeInTheDocument();
    expect(addressInput).toHaveAttribute('placeholder', '123 Main Street, City, State, ZIP');

    const submitButton = screen.getByRole('button', { name: /get started/i });
    expect(submitButton).toBeInTheDocument();
  });
});
