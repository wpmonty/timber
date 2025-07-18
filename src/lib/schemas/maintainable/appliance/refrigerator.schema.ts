import { z } from 'zod';
import {
  MaintainableMetadataBaseSchema,
  MaintainableRegistryEntry,
} from '../../maintainable.schema';

const schema: MaintainableRegistryEntry = {
  type: 'appliance',
  subtype: 'refrigerator',
  metadataSchema: MaintainableMetadataBaseSchema.extend({
    brand: z.string().optional(),
    capacity: z.number().optional(), // in cubic feet
    style: z.enum(['top-freezer', 'bottom-freezer', 'side-by-side', 'french-door']).optional(),
    hasIceMaker: z.boolean().optional(),
    energyRating: z.string().optional(), // e.g., "Energy Star"
  }),
};

export default schema;
