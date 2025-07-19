import { z } from 'zod';
import { MaintainableDataSchema, MaintainableMetadataBaseSchema } from '../../maintainable.schema';

const RefrigeratorMaintainableDataSchema = MaintainableDataSchema.extend({
  type: z.literal('appliance'),
  subtype: z.literal('refrigerator'),
  metadataSchema: MaintainableMetadataBaseSchema.extend({
    brand: z.string().optional(),
    capacity: z.number().optional(), // in cubic feet
    style: z.enum(['top-freezer', 'bottom-freezer', 'side-by-side', 'french-door']).optional(),
    hasIceMaker: z.boolean().optional(),
    energyRating: z.string().optional(), // e.g., "Energy Star"
  }),
});

export default RefrigeratorMaintainableDataSchema;
