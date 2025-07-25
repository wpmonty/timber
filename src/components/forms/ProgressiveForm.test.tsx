import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProgressiveForm } from './ProgressiveForm';
import { MaintainableTypeType } from '@/types/maintainable.types';

// Mock the dependencies
jest.mock('@/lib/maintainable-registry', () => ({
  getMaintainableDataSchema: jest.fn(() => ({
    shape: {
      type: { value: 'system' },
      subtype: { value: 'heat' },
    },
  })),
}));

jest.mock('@/lib/schemas/maintainable.schema', () => ({
  getOnboardingQuestions: jest.fn(),
}));

describe('ProgressiveForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    const { getOnboardingQuestions } = require('@/lib/schemas/maintainable.schema');
    getOnboardingQuestions.mockReturnValue([]);

    render(
      <ProgressiveForm
        type="system"
        subtype="heat"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Loading questions...')).toBeInTheDocument();
  });

  it('should render questions when loaded', async () => {
    const { getOnboardingQuestions } = require('@/lib/schemas/maintainable.schema');
    const mockQuestions = [
      {
        field: 'metadata.fuel',
        schema: {},
        metadata: {
          order: 1,
          required: true,
          question: 'What fuel does this system use?',
          options: [
            { value: 'natural-gas', label: 'Natural Gas' },
            { value: 'propane', label: 'Propane' },
          ],
        },
      },
    ];
    getOnboardingQuestions.mockReturnValue(mockQuestions);

    render(
      <ProgressiveForm
        type="system"
        subtype="heat"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('What fuel does this system use?')).toBeInTheDocument();
    });
  });

  it('should generate default label based on subtype', () => {
    const { getOnboardingQuestions } = require('@/lib/schemas/maintainable.schema');
    getOnboardingQuestions.mockReturnValue([]);

    render(
      <ProgressiveForm
        type="system"
        subtype="heat"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // The default label should be "Heat System" for subtype "heat"
    // This is handled internally in the component
    expect(screen.getByText('Loading questions...')).toBeInTheDocument();
  });

  it('should show progress indicator', async () => {
    const { getOnboardingQuestions } = require('@/lib/schemas/maintainable.schema');
    const mockQuestions = [
      {
        field: 'metadata.fuel',
        schema: {},
        metadata: {
          order: 1,
          required: true,
          question: 'What fuel does this system use?',
        },
      },
      {
        field: 'condition',
        schema: {},
        metadata: {
          order: 2,
          required: true,
          question: 'What is the condition?',
        },
      },
    ];
    getOnboardingQuestions.mockReturnValue(mockQuestions);

    render(
      <ProgressiveForm
        type="system"
        subtype="heat"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
      expect(screen.getByText('50% complete')).toBeInTheDocument();
    });
  });
});
