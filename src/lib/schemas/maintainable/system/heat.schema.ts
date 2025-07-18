import { z } from 'zod';
import {
  MaintainableMetadataBaseSchema,
  MaintainableRegistryEntry,
} from '../../maintainable.schema';

const schema: MaintainableRegistryEntry = {
  type: 'system',
  subtype: 'heat',
  metadataSchema: MaintainableMetadataBaseSchema.extend({
    brand: z.string().optional(),
    btu: z.number().optional(),
    fuel: z.enum(['electric', 'gas', 'oil', 'wood']).optional(),
    efficiency: z.number().optional(),
  }),
};

export default schema;
