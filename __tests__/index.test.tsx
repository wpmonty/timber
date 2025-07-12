import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders the homepage', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Next.js + TypeScript + Tailwind');
  });

  it('renders the welcome message', () => {
    render(<Home />);

    const welcomeText = screen.getByText(/Welcome to/i);
    expect(welcomeText).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<Home />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('ESLint + Prettier')).toBeInTheDocument();
    expect(screen.getByText('Jest Testing')).toBeInTheDocument();
  });
});
