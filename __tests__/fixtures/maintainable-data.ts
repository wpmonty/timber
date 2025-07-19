import { Maintainable, MaintainableData } from '@/types/maintainable.types';

// This file contains test fixtures and is not a test file itself
// jest/no-tests

// Valid maintainable data fixtures
export const validMaintainableData: MaintainableData = {
  label: 'Central Air Conditioning',
  type: 'system',
  subtype: 'heat',
  condition: 'good',
  tags: ['basement', 'Carrier', 'smart'],
  location: 'basement',
  metadata: {
    brand: 'Carrier',
    model: 'CA13NA036',
    serialNumber: 'AC123456789',
    installDate: '2020-06-15',
    manufacturer: 'Carrier',
    purchasePrice: 4500,
    warrantyExpiration: '2025-05-01',
    expectedLifespan: 15,
    notes: 'Regular maintenance scheduled',
  },
};

export const validMinimalMaintainableData: MaintainableData = {
  label: 'Water Heater',
  type: 'system',
  subtype: 'heat',
  condition: 'fair',
  location: 'utility room',
  metadata: {
    expectedLifespan: 10,
  },
};

export const validMaintainableDatabaseEntry: Maintainable = {
  id: 'test-maintainable-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  property_id: 'test-property-id',
  data: validMaintainableData,
};

// Malformed maintainable data scenarios that could come from database
export const malformedMaintainableData = {
  // Missing required fields
  missingType: {
    label: 'Central Air Conditioning',
    subtype: 'hvac',
    condition: 'good',
    tags: ['basement', 'Carrier', 'smart'],
    location: 'basement',
    metadata: {
      brand: 'Carrier',
      model: 'CA13NA036',
      serialNumber: 'AC123456789',
      installDate: '2020-06-15',
      manufacturer: 'Carrier',
      purchasePrice: 4500,
      warrantyExpiration: '2025-05-01',
      expectedLifespan: 15,
      notes: 'Regular maintenance scheduled',
    },
  },

  missingSubtype: {
    label: 'Central Air Conditioning',
    type: 'system',
    condition: 'good',
    tags: ['basement', 'Carrier', 'smart'],
    location: 'basement',
    metadata: {
      brand: 'Carrier',
      model: 'CA13NA036',
      serialNumber: 'AC123456789',
      installDate: '2020-06-15',
      manufacturer: 'Carrier',
      purchasePrice: 4500,
      warrantyExpiration: '2025-05-01',
      expectedLifespan: 15,
      notes: 'Regular maintenance scheduled',
    },
  },

  // Invalid types
  invalidTypes: {
    label: 123, // should be string
    type: 'invalid-type', // invalid enum value
    subtype: 123, // should be string
    condition: 'terrible', // invalid enum value
    tags: 'not-an-array', // should be array
    location: 456, // should be string
    metadata: 'not-an-object', // should be object
  },

  // Negative/invalid values
  invalidValues: {
    label: '', // empty string
    type: 'not a type',
    subtype: 'not a subtype',
    condition: 'not a condition',
    tags: [''],
    location: '',
    metadata: {
      purchasePrice: -1000, // negative price
      expectedLifespan: -5, // negative lifespan
    },
  },

  // Extreme values
  extremeValues: {
    label: 'A'.repeat(1000), // extremely long name
    type: 'system',
    subtype: 'hvac',
    condition: 'good',
    tags: ['B'.repeat(500)],
    location: 'C'.repeat(1000),
    metadata: {
      brand: 'D'.repeat(500),
      model: 'E'.repeat(500),
      serialNumber: 'F'.repeat(500),
      installDate: '9999-12-31',
      purchasePrice: 999999999,
      warrantyExpiration: '3000-01-01',
      expectedLifespan: 999999,
      notes: 'G'.repeat(10000),
    },
  },

  // Null values where not allowed
  nullValues: {
    label: null,
    type: null,
    subtype: null,
    condition: null,
    tags: null,
    location: null,
    metadata: null,
  },

  // Completely empty object
  empty: {},

  // Non-object data
  notAnObject: 'this should be an object',

  // Array instead of object
  arrayData: ['not', 'an', 'object'],
};

// Database entries with malformed data field
export const malformedMaintainableDatabaseEntries = {
  invalidJson: {
    id: 'malformed-maintainable-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    data: '{"invalid": json}', // Invalid JSON string
  },

  nullData: {
    id: 'malformed-maintainable-2',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    data: null,
  },

  missingDataField: {
    id: 'malformed-maintainable-3',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    // data field completely missing
  },

  corruptedData: {
    id: 'malformed-maintainable-4',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    data: malformedMaintainableData.missingType,
  },
};

// API response scenarios
export const mockApiResponses = {
  validSingleMaintainable: validMaintainableDatabaseEntry,

  validMaintainablesList: [
    validMaintainableDatabaseEntry,
    {
      ...validMaintainableDatabaseEntry,
      id: 'test-maintainable-id-2',
      data: validMinimalMaintainableData,
    },
  ],

  emptyMaintainablesList: [],

  malformedSingleMaintainable: malformedMaintainableDatabaseEntries.corruptedData,

  malformedMaintainablesList: [
    validMaintainableDatabaseEntry,
    malformedMaintainableDatabaseEntries.nullData,
    malformedMaintainableDatabaseEntries.corruptedData,
  ],

  networkError: new Error('Failed to fetch'),

  serverError: {
    error: 'Internal server error',
    message: 'Database connection failed',
  },

  invalidJsonResponse: 'not valid json {{{',
};

// API request payloads for testing
export const apiRequestPayloads = {
  validCreate: {
    property_id: 'test-property-id',
    data: validMaintainableData,
  },

  validUpdate: {
    data: { ...validMaintainableData, label: 'Updated Maintainable Name' },
  },

  missingPropertyId: {
    data: validMaintainableData,
  },

  missingDataField: {
    property_id: 'test-property-id',
  },

  invalidDataField: {
    property_id: 'test-property-id',
    data: malformedMaintainableData.invalidTypes,
  },

  emptyPayload: {},

  nullPayload: null,

  stringPayload: 'not an object',
};
