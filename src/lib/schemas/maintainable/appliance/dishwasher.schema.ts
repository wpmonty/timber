import { z } from 'zod';
import {
  MaintainableMetadataBaseSchema,
  MaintainableRegistryEntry,
} from '../../maintainable.schema';

const schema: MaintainableRegistryEntry = {
  type: 'appliance',
  subtype: 'dishwasher',
  metadataSchema: MaintainableMetadataBaseSchema.extend({
    brand: z.string().optional(),
  }),
};

export default schema;
