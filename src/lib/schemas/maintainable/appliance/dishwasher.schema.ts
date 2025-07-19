import { z } from 'zod';
import { MaintainableDataSchema, MaintainableMetadataBaseSchema } from '../../maintainable.schema';

const DishwasherMaintainableDataSchema = MaintainableDataSchema.extend({
  type: z.literal('appliance'),
  subtype: z.literal('dishwasher'),
  metadata: MaintainableMetadataBaseSchema.extend({
    brand: z.string().optional(),
  }),
});

export default DishwasherMaintainableDataSchema;
