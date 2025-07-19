import HeatMaintainableDataSchema from './heat.schema';

// Collect all the system zod schemas
export const systemDataSchemas = [HeatMaintainableDataSchema];

// Using the schemas, we can get the subtypes as a list of strings
export const systemSubtypes = systemDataSchemas.map(schema => schema.shape.subtype.value);

// Using the string subtypes, we can get the type interface of the subtypes
export type SystemSubtypeType = (typeof systemSubtypes)[number];
