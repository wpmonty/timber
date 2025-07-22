import { z } from 'zod';
import {
  MaintainableDataSchema,
  MaintainableMetadataBaseSchema,
  withOnboarding,
  OnboardingMetadata,
} from '../../maintainable.schema';

const HeatMaintainableDataSchema = MaintainableDataSchema.extend({
  type: withOnboarding(z.literal('system'), {
    order: 1,
    required: true,
    question: 'What type of heating system is this?',
    options: [
      { value: 'furnace', label: 'Furnace' },
      { value: 'heat-pump', label: 'Heat Pump' },
      { value: 'boiler', label: 'Boiler' },
      { value: 'radiant', label: 'Radiant Heat' },
      { value: 'mini-split', label: 'Mini-Split' },
      { value: 'other', label: 'Other' },
    ],
  }),
  subtype: withOnboarding(z.literal('heat'), {
    order: 0, // Hidden field, set automatically
    required: true,
    skip: true,
    question: 'System type', // Required field, but not shown
  }),
  condition: withOnboarding(z.enum(['good', 'fair', 'poor', 'critical']), {
    order: 3,
    required: true,
    question: "How would you rate this system's condition?",
    options: [
      { value: 'good', label: 'Good', description: 'Works well' },
      { value: 'fair', label: 'Fair', description: 'Some issues' },
      { value: 'poor', label: 'Poor', description: 'Needs attention' },
      { value: 'critical', label: 'Critical', description: 'Broken' },
    ],
    defaultValue: 'good',
  }),
  location: withOnboarding(
    z.string().max(100, 'Location must be less than 100 characters').optional(),
    {
      order: 4,
      required: false,
      skipable: true,
      question: 'Where is this system located?',
      placeholder: 'e.g., Basement, Utility Room, Garage',
      helpText: 'This helps with maintenance scheduling and cost estimates',
    }
  ),
  metadata: MaintainableMetadataBaseSchema.extend({
    fuel: withOnboarding(
      z.enum(['natural-gas', 'propane', 'oil', 'electric', 'wood', 'heat-pump']).optional(),
      {
        order: 2,
        required: true,
        question: 'What fuel does this system use?',
        options: [
          { value: 'natural-gas', label: 'Natural Gas' },
          { value: 'propane', label: 'Propane' },
          { value: 'oil', label: 'Oil' },
          { value: 'electric', label: 'Electric' },
          { value: 'wood', label: 'Wood' },
          { value: 'heat-pump', label: 'Heat Pump (no fuel)' },
        ],
        conditional: (answers: any) => answers.type !== 'heat-pump', // Skip for heat pumps
      }
    ),
    age: withOnboarding(z.enum(['new', 'recent', 'older', 'very-old', 'unknown']).optional(), {
      order: 5,
      required: false,
      skipable: true,
      question: 'How old is this system?',
      options: [
        { value: 'new', label: 'New (0-2 years)' },
        { value: 'recent', label: 'Recent (3-7 years)' },
        { value: 'older', label: 'Older (8-15 years)' },
        { value: 'very-old', label: 'Very old (15+ years)' },
        { value: 'unknown', label: "Don't know" },
      ],
      helpText: 'This helps determine maintenance needs and replacement timeline',
    }),
    maintenanceFrequency: withOnboarding(
      z.enum(['annually', 'biannually', 'as-needed', 'unknown']).optional(),
      {
        order: 6,
        required: true,
        question: 'How often should this be maintained?',
        options: [
          { value: 'annually', label: 'Annually' },
          { value: 'biannually', label: 'Every 2 years' },
          { value: 'as-needed', label: 'As needed' },
          { value: 'unknown', label: "Don't know" },
        ],
        defaultValue: 'annually',
        helpText: 'Most heating systems need annual maintenance',
      }
    ),
    estimatedCost: withOnboarding(
      z.enum(['3k-5k', '5k-8k', '8k-12k', '12k-plus', 'unknown']).optional(),
      {
        order: 7,
        required: false,
        skipable: true,
        question: "What's the estimated replacement cost?",
        options: [
          { value: '3k-5k', label: '$3,000 - $5,000' },
          { value: '5k-8k', label: '$5,000 - $8,000' },
          { value: '8k-12k', label: '$8,000 - $12,000' },
          { value: '12k-plus', label: '$12,000+' },
          { value: 'unknown', label: "Don't know" },
        ],
        helpText: 'This helps with budgeting and insurance purposes',
      }
    ),
    // Fields NOT included in onboarding (too complex/unknown)
    brand: z
      .string()
      .optional()
      .meta({ onboarding: { skip: true } }),
    btu: z
      .number()
      .optional()
      .meta({ onboarding: { skip: true } }),
    efficiency: z
      .number()
      .optional()
      .meta({ onboarding: { skip: true } }),
    manufacturer: z
      .string()
      .optional()
      .meta({ onboarding: { skip: true } }),
    model: z
      .string()
      .optional()
      .meta({ onboarding: { skip: true } }),
    serialNumber: z
      .string()
      .optional()
      .meta({ onboarding: { skip: true } }),
    installDate: z
      .string()
      .optional()
      .meta({ onboarding: { skip: true } }),
  }),
});

export default HeatMaintainableDataSchema;
