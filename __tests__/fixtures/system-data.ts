import { Maintainable, MaintainableData } from '@/types/maintainables.types';

// This file contains test fixtures and is not a test file itself
// jest/no-tests

// Valid system data fixtures
export const validSystemData: MaintainableData = {
  name: 'Central Air Conditioning',
  category: 'hvac',
  brand: 'Carrier',
  model: 'CA13NA036',
  serialNumber: 'AC123456789',
  dateInstalled: '2020-06-15',
  datePurchased: '2020-05-01',
  purchasePrice: 4500,
  condition: 'good',
  status: 'operational',
  warrantyExpiration: '2025-05-01',
  expectedLifespan: 15,
  location: 'basement',
  notes: 'Regular maintenance scheduled',
};

export const validMinimalSystemData: MaintainableData = {
  name: 'Water Heater',
  category: 'plumbing',
  brand: null,
  model: null,
  serialNumber: null,
  dateInstalled: null,
  datePurchased: null,
  purchasePrice: null,
  condition: 'fair',
  status: 'operational',
  warrantyExpiration: null,
  expectedLifespan: 10,
  location: 'utility room',
  notes: '',
};

export const validSystemDatabaseEntry: Maintainable = {
  id: 'test-system-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  property_id: 'test-property-id',
  data: validSystemData,
};

// Malformed system data scenarios that could come from database
export const malformedSystemData = {
  // Missing required fields
  missingName: {
    category: 'hvac',
    brand: 'Carrier',
    model: 'CA13NA036',
    serialNumber: 'AC123456789',
    dateInstalled: '2020-06-15',
    datePurchased: '2020-05-01',
    purchasePrice: 4500,
    condition: 'good',
    status: 'operational',
    warrantyExpiration: '2025-05-01',
    expectedLifespan: 15,
    location: 'basement',
    notes: 'Regular maintenance scheduled',
  },

  missingCondition: {
    name: 'Central Air Conditioning',
    category: 'hvac',
    brand: 'Carrier',
    model: 'CA13NA036',
    serialNumber: 'AC123456789',
    dateInstalled: '2020-06-15',
    datePurchased: '2020-05-01',
    purchasePrice: 4500,
    status: 'operational',
    warrantyExpiration: '2025-05-01',
    expectedLifespan: 15,
    location: 'basement',
    notes: 'Regular maintenance scheduled',
  },

  // Invalid types
  invalidTypes: {
    name: 123, // should be string
    category: 'invalid-category', // invalid enum value
    brand: 123, // should be string or null
    model: [], // should be string or null
    serialNumber: {}, // should be string or null
    dateInstalled: 123, // should be string or null
    datePurchased: true, // should be string or null
    purchasePrice: 'expensive', // should be number or null
    condition: 'terrible', // invalid enum value
    status: 'broken', // invalid enum value
    warrantyExpiration: 456, // should be string or null
    expectedLifespan: 'forever', // should be number
    location: null, // should be string (can be empty)
    notes: 789, // should be string (can be empty)
  },

  // Negative/invalid values
  invalidValues: {
    name: '', // empty string
    category: 'hvac',
    brand: '',
    model: '',
    serialNumber: '',
    dateInstalled: '',
    datePurchased: '',
    purchasePrice: -1000, // negative price
    condition: 'good',
    status: 'operational',
    warrantyExpiration: '',
    expectedLifespan: -5, // negative lifespan
    location: '',
    notes: '',
  },

  // Extreme values
  extremeValues: {
    name: 'A'.repeat(1000), // extremely long name
    category: 'hvac',
    brand: 'B'.repeat(500),
    model: 'C'.repeat(500),
    serialNumber: 'D'.repeat(500),
    dateInstalled: '9999-12-31',
    datePurchased: '1800-01-01',
    purchasePrice: 999999999,
    condition: 'good',
    status: 'operational',
    warrantyExpiration: '3000-01-01',
    expectedLifespan: 999999,
    location: 'E'.repeat(1000),
    notes: 'F'.repeat(10000),
  },

  // Null values where not allowed
  nullValues: {
    name: null,
    category: null,
    brand: null,
    model: null,
    serialNumber: null,
    dateInstalled: null,
    datePurchased: null,
    purchasePrice: null,
    condition: null,
    status: null,
    warrantyExpiration: null,
    expectedLifespan: null,
    location: null,
    notes: null,
  },

  // Completely empty object
  empty: {},

  // Non-object data
  notAnObject: 'this should be an object',

  // Array instead of object
  arrayData: ['not', 'an', 'object'],
};

// Database entries with malformed data field
export const malformedSystemDatabaseEntries = {
  invalidJson: {
    id: 'malformed-system-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    data: '{"invalid": json}', // Invalid JSON string
  },

  nullData: {
    id: 'malformed-system-2',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    data: null,
  },

  missingDataField: {
    id: 'malformed-system-3',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    // data field completely missing
  },

  corruptedData: {
    id: 'malformed-system-4',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    property_id: 'test-property-id',
    data: malformedSystemData.missingName,
  },
};

// API response scenarios
export const mockApiResponses = {
  validSingleSystem: validSystemDatabaseEntry,

  validSystemsList: [
    validSystemDatabaseEntry,
    {
      ...validSystemDatabaseEntry,
      id: 'test-system-id-2',
      data: validMinimalSystemData,
    },
  ],

  emptySystemsList: [],

  malformedSingleSystem: malformedSystemDatabaseEntries.corruptedData,

  malformedSystemsList: [
    validSystemDatabaseEntry,
    malformedSystemDatabaseEntries.nullData,
    malformedSystemDatabaseEntries.corruptedData,
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
    data: validSystemData,
  },

  validUpdate: {
    data: { ...validSystemData, name: 'Updated System Name' },
  },

  missingPropertyId: {
    data: validSystemData,
  },

  missingDataField: {
    property_id: 'test-property-id',
  },

  invalidDataField: {
    property_id: 'test-property-id',
    data: malformedSystemData.invalidTypes,
  },

  emptyPayload: {},

  nullPayload: null,

  stringPayload: 'not an object',
};
