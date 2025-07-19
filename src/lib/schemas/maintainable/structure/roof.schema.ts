import { z } from 'zod';
import { MaintainableDataSchema, MaintainableMetadataBaseSchema } from '../../maintainable.schema';

const RoofMaintainableDataSchema = MaintainableDataSchema.extend({
  type: z.literal('structure'),
  subtype: z.literal('roof'),
  metadata: MaintainableMetadataBaseSchema.extend({
    material: z.string().optional(),
  }),
});

export default RoofMaintainableDataSchema;
