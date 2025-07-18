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
import { MaintainableDatabaseEntry } from '@/types/maintainables.types';
import { Json } from '@/types/supabase.types';

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

// JSON-compatible schema that matches Supabase's Json type
// TODO move this to a shared file
const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), JsonSchema.optional()),
    z.array(JsonSchema),
  ])
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

  // JSON-compatible metadata for typed subschemas
  metadata: JsonSchema.optional(),
});

export const MaintainableMetadataBaseSchema = z.object({
  installDate: z.coerce.date().optional(),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
});

export type MaintainableRegistryEntry = {
  type: MaintainableType;
  subtype: string;
  metadataSchema: z.ZodTypeAny;
};

export const MaintainableSchema = z.object({
  id: z.string(),
  property_id: z.string(),
  data: MaintainableDataSchema.nullable(),
  created_at: z.string(),
  updated_at: z.string(),
}) satisfies z.ZodType<MaintainableDatabaseEntry>;
