import { z } from 'zod';
import { MaintainableDataSchema, MaintainableMetadataBaseSchema } from '../../maintainable.schema';

const RoofMaintainableDataSchema = MaintainableDataSchema.extend({
  type: z.literal('structure'),
  subtype: z.literal('roof'),
  metadataSchema: MaintainableMetadataBaseSchema.extend({
    material: z.string().optional(),
  }),
});

export default RoofMaintainableDataSchema;
