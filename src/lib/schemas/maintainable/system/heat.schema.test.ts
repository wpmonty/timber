import {
  getOnboardingQuestions,
  getSchemaMetadata,
  withOnboarding,
  OnboardingMetadataSchema,
  onboardingRegistry,
} from '../../maintainable.schema';
import HeatMaintainableDataSchema from './heat.schema';
import { z } from 'zod';

describe('Heat System Schema with Onboarding Metadata', () => {
  it('should work with withOnboarding function', () => {
    // Test the withOnboarding function directly
    const testSchema = withOnboarding(z.string(), {
      order: 1,
      required: true,
      question: 'Test question',
    });

    const metadata = getSchemaMetadata(testSchema);
    console.log('Test schema metadata:', metadata);

    expect(metadata).toBeDefined();
    expect(metadata?.question).toBe('Test question');
  });

  it('should extract onboarding questions in correct order', () => {
    // Debug: Log the schema shape
    console.log('Schema shape keys:', Object.keys(HeatMaintainableDataSchema.shape));

    // Debug: Check if metadata is attached
    const typeField = HeatMaintainableDataSchema.shape.type;
    console.log('Type field:', typeField);
    console.log('Type field metadata:', getSchemaMetadata(typeField));

    const questions = getOnboardingQuestions(HeatMaintainableDataSchema);
    console.log('Extracted questions:', questions);

    // Should have 7 onboarding questions (excluding skipped fields like subtype)
    expect(questions).toHaveLength(7);

    // Check order (subtype is skipped, so type comes first)
    expect(questions[0].field).toBe('type'); // order: 1
    expect(questions[1].field).toBe('metadata.fuel'); // order: 2
    expect(questions[2].field).toBe('condition'); // order: 3
    expect(questions[3].field).toBe('location'); // order: 4
    expect(questions[4].field).toBe('metadata.age'); // order: 5
    expect(questions[5].field).toBe('metadata.maintenanceFrequency'); // order: 6
    expect(questions[6].field).toBe('metadata.estimatedCost'); // order: 7
  });

  it('should have correct metadata for system type question', () => {
    const questions = getOnboardingQuestions(HeatMaintainableDataSchema);
    const typeQuestion = questions.find(q => q.field === 'type');

    expect(typeQuestion).toBeDefined();
    expect(typeQuestion?.metadata.question).toBe('What type of heating system is this?');
    expect(typeQuestion?.metadata.required).toBe(true);
    expect(typeQuestion?.metadata.options).toHaveLength(6);
    expect(typeQuestion?.metadata.options?.[0]).toEqual({ value: 'furnace', label: 'Furnace' });
  });

  it('should have correct metadata for fuel question', () => {
    const questions = getOnboardingQuestions(HeatMaintainableDataSchema);
    const fuelQuestion = questions.find(q => q.field === 'metadata.fuel');

    expect(fuelQuestion).toBeDefined();
    expect(fuelQuestion?.metadata.question).toBe('What fuel does this system use?');
    expect(fuelQuestion?.metadata.required).toBe(true);
    expect(fuelQuestion?.metadata.options).toHaveLength(6);
    expect(fuelQuestion?.metadata.conditional).toBeDefined();
  });

  it('should have correct metadata for condition question', () => {
    const questions = getOnboardingQuestions(HeatMaintainableDataSchema);
    const conditionQuestion = questions.find(q => q.field === 'condition');

    expect(conditionQuestion).toBeDefined();
    expect(conditionQuestion?.metadata.question).toBe(
      "How would you rate this system's condition?"
    );
    expect(conditionQuestion?.metadata.required).toBe(true);
    expect(conditionQuestion?.metadata.defaultValue).toBe('good');
    expect(conditionQuestion?.metadata.options).toHaveLength(4);
  });

  it('should have skipable questions marked correctly', () => {
    const questions = getOnboardingQuestions(HeatMaintainableDataSchema);
    const locationQuestion = questions.find(q => q.field === 'location');
    const ageQuestion = questions.find(q => q.field === 'metadata.age');
    const costQuestion = questions.find(q => q.field === 'metadata.estimatedCost');

    expect(locationQuestion?.metadata.skipable).toBe(true);
    expect(ageQuestion?.metadata.skipable).toBe(true);
    expect(costQuestion?.metadata.skipable).toBe(true);
  });

  it('should have help text for appropriate questions', () => {
    const questions = getOnboardingQuestions(HeatMaintainableDataSchema);
    const locationQuestion = questions.find(q => q.field === 'location');
    const ageQuestion = questions.find(q => q.field === 'metadata.age');

    expect(locationQuestion?.metadata.helpText).toBe(
      'This helps with maintenance scheduling and cost estimates'
    );
    expect(ageQuestion?.metadata.helpText).toBe(
      'This helps determine maintenance needs and replacement timeline'
    );
  });

  test('should validate onboarding metadata structure', () => {
    // Valid metadata
    const validMetadata = {
      order: 1,
      required: true,
      question: 'What type of heating system is this?',
      options: [
        { value: 'furnace', label: 'Furnace' },
        { value: 'heat-pump', label: 'Heat Pump' },
      ],
    };

    const result = OnboardingMetadataSchema.safeParse(validMetadata);
    expect(result.success).toBe(true);

    // Invalid metadata - missing required fields
    const invalidMetadata = {
      order: 1,
      // missing required: true
      // missing question
    };

    const invalidResult = OnboardingMetadataSchema.safeParse(invalidMetadata);
    expect(invalidResult.success).toBe(false);
    if (!invalidResult.success) {
      expect(invalidResult.error.issues).toHaveLength(2); // missing required and question
    }
  });

  test('should handle invalid metadata gracefully', () => {
    const testSchema = z.string();

    // Invalid metadata - missing required fields
    const invalidMetadata = {
      order: 1,
      // missing required: true
      // missing question
    };

    // The registry doesn't validate metadata automatically
    onboardingRegistry.add(testSchema, invalidMetadata as any);

    // But when we retrieve it, we get the invalid metadata
    const retrieved = onboardingRegistry.get(testSchema);
    expect(retrieved).toEqual(invalidMetadata);

    // We can manually validate it if needed
    const validationResult = OnboardingMetadataSchema.safeParse(retrieved);
    expect(validationResult.success).toBe(false);
  });

  test('should validate metadata in withOnboarding function', () => {
    const testSchema = z.string();

    // Invalid metadata
    const invalidMetadata = {
      order: 1,
      // missing required: true
      // missing question
    };

    // withOnboarding should now throw an error for invalid metadata
    expect(() => {
      withOnboarding(testSchema, invalidMetadata as any);
    }).toThrow('Invalid onboarding metadata');

    // Valid metadata should work
    const validMetadata = {
      order: 1,
      required: true,
      question: 'Test question',
    };

    const result = withOnboarding(testSchema, validMetadata);
    expect(result).toBe(testSchema);

    const retrieved = getSchemaMetadata(testSchema);
    expect(retrieved).toEqual(validMetadata);
  });
});
