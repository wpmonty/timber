import { render, screen, fireEvent } from '@testing-library/react';
import { CardSelect } from './CardSelect';

describe('CardSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all options as cards', () => {
    render(<CardSelect value="" onChange={mockOnChange} options={mockOptions} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should show selected state for chosen option', () => {
    render(<CardSelect value="option2" onChange={mockOnChange} options={mockOptions} />);

    // Option 2 should be selected (have blue styling)
    const option2Card = screen.getByText('Option 2').closest('.ring-blue-500');
    expect(option2Card).toBeInTheDocument();
  });

  it('should call onChange when card is clicked', () => {
    render(<CardSelect value="" onChange={mockOnChange} options={mockOptions} />);

    fireEvent.click(screen.getByText('Option 1'));
    expect(mockOnChange).toHaveBeenCalledWith('option1');
  });

  it('should show placeholder text when provided', () => {
    render(
      <CardSelect
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        placeholder="Choose an option"
      />
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('should show error state when error is true', () => {
    render(<CardSelect value="" onChange={mockOnChange} options={mockOptions} error={true} />);

    // Should show error message
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should handle empty options gracefully', () => {
    render(<CardSelect value="" onChange={mockOnChange} options={[]} />);

    expect(screen.getByText('No options available')).toBeInTheDocument();
  });

  it('should handle undefined options gracefully', () => {
    render(<CardSelect value="" onChange={mockOnChange} options={undefined as any} />);

    expect(screen.getByText('No options available')).toBeInTheDocument();
  });
});
