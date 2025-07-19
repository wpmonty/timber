import { z } from 'zod';
import { MaintainableDataSchema, MaintainableMetadataBaseSchema } from '../../maintainable.schema';

const HeatMaintainableDataSchema = MaintainableDataSchema.extend({
  type: z.literal('system'),
  subtype: z.literal('heat'),
  metadata: MaintainableMetadataBaseSchema.extend({
    brand: z.string().optional(),
    btu: z.number().optional(),
    fuel: z.enum(['electric', 'gas', 'oil', 'wood']).optional(),
    efficiency: z.number().optional(),
  }),
});

export default HeatMaintainableDataSchema;
