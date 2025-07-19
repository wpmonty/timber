import DishwasherMaintainableDataSchema from './dishwasher.schema';
import RefrigeratorMaintainableDataSchema from './refrigerator.schema';

// Collect all the appliance zod schemas
export const applianceDataSchemas = [
  DishwasherMaintainableDataSchema,
  RefrigeratorMaintainableDataSchema,
];

// Using the schemas, we can get the subtypes as a list of strings
export const applianceSubtypes = applianceDataSchemas.map(schema => schema.shape.subtype.value);

// Using the string subtypes, we can get the type interface of the subtypes
export type ApplianceSubtypeType = (typeof applianceSubtypes)[number];
