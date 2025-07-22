/**
 * Maintainable Schema System
 *
 * This system provides a type-safe way to define and validate different types of maintainable items
 * (appliances, systems, structures, etc.) with their specific metadata requirements.
 *
 * ## Usage
 *
 * ### Adding a new maintainable type:
 * 1. Create a new schema file in the appropriate directory:
 *    - `src/lib/schemas/maintainable/appliance/` for appliances
 *    - `src/lib/schemas/maintainable/system/` for systems
 *    - `src/lib/schemas/maintainable/structure/` for structures
 *
 * 2. Define your schema following the pattern:
 *    ```typescript
 *    import { z } from 'zod';
 *    import { MaintainableMetadataBaseSchema, MaintainableRegistryEntry } from '../../maintainable.schema';
 *
 *    const schema: MaintainableRegistryEntry = {
 *      type: 'appliance', // or 'system', 'structure'
 *      subtype: 'your-subtype-name',
 *      metadataSchema: MaintainableMetadataBaseSchema.extend({
 *        // Add your specific fields here
 *        brand: z.string().optional(),
 *        capacity: z.number().optional(),
 *      }),
 *    };
 *
 *    export default schema;
 *    ```
 *
 * 3. Import and register the schema in this file:
 *    ```typescript
 *    import yourSchema from './maintainable/appliance/your-schema.schema';
 *    // Add to the schemas array in maintainable-registry.ts
 *    ```
 *
 * ### Using schemas for validation:
 * ```typescript
 * import { getMaintainableSchema, validateMaintainableData } from './maintainable.schema';
 *
 * // Get a specific schema
 * const dishwasherSchema = getMaintainableSchema('dishwasher');
 *
 * // Validate data
 * const result = validateMaintainableData(data, 'dishwasher');
 * if (result.success) {
 *   // data is valid
 * } else {
 *   // handle validation error
 * }
 * ```
 *
 * ### Discovering available types:
 * ```typescript
 * import { getAvailableSubtypes, getSubtypeNames } from './maintainable.schema';
 *
 * // Get all appliance subtypes
 * const applianceSubtypes = getAvailableSubtypes('appliance');
 *
 * // Get just the names
 * const applianceNames = getSubtypeNames('appliance');
 * ```
 */

import { z } from 'zod';
import { MaintainableDatabaseEntry } from '@/types/maintainable.types';

// Top-level categories
export const MaintainableTypeOptions = z.enum([
  'appliance',
  'structure',
  'utility',
  'system',
  'vehicle',
  'instrument',
  'landscape',
  'other',
]);

export type MaintainableType = (typeof MaintainableTypeOptions.options)[number];

// Onboarding metadata as a Zod schema
export const OnboardingMetadataSchema = z
  .object({
    order: z.number(),
    required: z.boolean(),
    skipable: z.boolean().optional(),
    skip: z.boolean().optional(), // Skip this field entirely in onboarding
    priority: z.enum(['high', 'medium', 'low']).optional(),
    question: z.string(),
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
    options: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
          description: z.string().optional(),
        })
      )
      .optional(),
    conditional: z.any().optional(), // Function type - will be validated at runtime
    defaultValue: z.any().optional(),
  })
  .passthrough(); // Allow additional properties

export type OnboardingMetadata = z.infer<typeof OnboardingMetadataSchema>;

// Create a registry for onboarding metadata
export const onboardingRegistry = z.registry<OnboardingMetadata>();

// Helper function to add onboarding metadata to a Zod schema
export function withOnboarding<T extends z.ZodTypeAny>(schema: T, metadata: OnboardingMetadata): T {
  // Validate metadata before adding to registry
  const validationResult = OnboardingMetadataSchema.safeParse(metadata);
  if (!validationResult.success) {
    throw new Error(`Invalid onboarding metadata: ${validationResult.error.message}`);
  }

  onboardingRegistry.add(schema, validationResult.data);
  return schema;
}

// Helper function to get metadata from a Zod schema
export function getSchemaMetadata(schema: z.ZodTypeAny): OnboardingMetadata | undefined {
  return onboardingRegistry.get(schema);
}

// Simple metadata schema for maintainable items
const MetadataSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional()
);

// Optional subtype string or constrained enum per type later
export const MaintainableDataSchema = z.object({
  label: z.string().max(100, 'Label must be less than 100 characters').optional(), // user-facing name (e.g., "Upstairs Fridge")
  type: MaintainableTypeOptions, // broad category
  subtype: z.string(), // more specific (e.g., "refrigerator")
  condition: z.enum(['good', 'fair', 'poor', 'critical']).optional(),
  tags: z.array(z.string().max(100, 'Tag must be less than 100 characters')).optional(), // e.g., ["kitchen", "LG", "smart"]

  // General optional shared fields
  location: z.string().max(100, 'Location must be less than 100 characters').optional(), // e.g., "basement", "garage left wall"

  // Simple metadata object for maintainable items
  metadata: MetadataSchema.optional(),
});

export const MaintainableMetadataBaseSchema = z.object({
  installDate: z.string().optional(), // Store as ISO string instead of Date object
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
});

export type MaintainableRegistryEntry = {
  type: MaintainableType;
  subtype: string;
  metadataSchema: typeof MaintainableMetadataBaseSchema;
};

export const MaintainableSchema = z.object({
  id: z.string(),
  property_id: z.string(),
  data: MaintainableDataSchema,
  created_at: z.string(),
  updated_at: z.string(),
}) satisfies z.ZodType<MaintainableDatabaseEntry>;

// Helper function to extract onboarding questions from a schema
export function getOnboardingQuestions(schema: z.ZodObject<any>) {
  const shape = schema.shape;
  const questions: Array<{
    field: string;
    schema: z.ZodTypeAny;
    metadata: OnboardingMetadata;
  }> = [];

  Object.entries(shape).forEach(([fieldName, fieldSchema]) => {
    const zodField = fieldSchema as z.ZodTypeAny;
    const metadata = getSchemaMetadata(zodField);

    // Handle top-level fields
    if (metadata && !metadata.skip) {
      questions.push({
        field: fieldName,
        schema: zodField,
        metadata,
      });
    }

    // Handle nested metadata fields
    if (fieldName === 'metadata' && zodField._def?.type === 'object') {
      const metadataShape = (zodField as z.ZodObject<any>).shape;
      Object.entries(metadataShape).forEach(([nestedFieldName, nestedFieldSchema]) => {
        const nestedZodField = nestedFieldSchema as z.ZodTypeAny;
        const nestedMetadata = getSchemaMetadata(nestedZodField);
        if (nestedMetadata && !nestedMetadata.skip && Object.keys(nestedMetadata).length > 0) {
          questions.push({
            field: `metadata.${nestedFieldName}`,
            schema: nestedZodField,
            metadata: nestedMetadata,
          });
        }
      });
    }
  });

  // Sort by order
  return questions.sort((a, b) => a.metadata.order - b.metadata.order);
}
