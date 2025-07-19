import RoofMaintainableDataSchema from './roof.schema';

// Collect all the structure zod schemas
export const structureDataSchemas = [RoofMaintainableDataSchema];

// Using the schemas, we can get the subtypes as a list of strings
export const structureSubtypes = structureDataSchemas.map(schema => schema.shape.subtype.value);

// Using the string subtypes, we can get the type interface of the subtypes
export type StructureSubtypeType = (typeof structureSubtypes)[number];
