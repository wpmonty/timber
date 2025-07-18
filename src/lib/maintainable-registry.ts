import { z } from 'zod';
import {
  MaintainableSchema,
  MaintainableRegistryEntry,
  MaintainableType,
} from './schemas/maintainable.schema';
import dishwasherSchema from './schemas/maintainable/appliance/dishwasher.schema';
import refrigeratorSchema from './schemas/maintainable/appliance/refrigerator.schema';
import heatSchema from './schemas/maintainable/system/heat.schema';

const MaintainableSubtypeRegistry = new Map<string, MaintainableRegistryEntry>();
let isInitialized = false;

export function registerMaintainableSubtype(entry: MaintainableRegistryEntry) {
  if (MaintainableSubtypeRegistry.has(entry.subtype)) {
    console.warn(`Subtype '${entry.subtype}' already registered.`);
  } else {
    MaintainableSubtypeRegistry.set(entry.subtype, entry);
  }
}

export function getMaintainableSchema(subtype: string) {
  ensureInitialized();
  const entry = MaintainableSubtypeRegistry.get(subtype);
  if (!entry) throw new Error(`Unknown subtype: ${subtype}`);

  return MaintainableSchema.extend({
    type: z.literal(entry.type),
    subtype: z.literal(entry.subtype),
    metadata: entry.metadataSchema.optional(),
  });
}

export function listRegisteredSubtypes() {
  ensureInitialized();
  return Array.from(MaintainableSubtypeRegistry.values());
}

// Utility functions for schema discovery and validation
export function getAvailableSubtypes(type?: MaintainableType) {
  ensureInitialized();
  const subtypes = listRegisteredSubtypes();
  if (type) {
    return subtypes.filter(subtype => subtype.type === type);
  }
  return subtypes;
}

export function getSubtypeNames(type?: MaintainableType) {
  ensureInitialized();
  return getAvailableSubtypes(type).map(subtype => subtype.subtype);
}

export function validateMaintainableData(data: unknown, subtype: string) {
  try {
    const schema = getMaintainableSchema(subtype);
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
}

function ensureInitialized() {
  if (!isInitialized) {
    initializeRegistry();
  }
}

function initializeRegistry() {
  if (isInitialized) return;

  // Register all schema subtypes statically
  const schemas = [dishwasherSchema, refrigeratorSchema, heatSchema];

  for (const schema of schemas) {
    registerMaintainableSubtype({
      type: schema.type,
      subtype: schema.subtype,
      metadataSchema: schema.metadataSchema,
    });
    console.log('registered', schema.subtype);
  }

  isInitialized = true;
}

// Initialize the registry when this module is first imported
initializeRegistry();
