import { PropertyData } from '@/types/property.types';

// This file contains test fixtures and is not a test file itself
// jest/no-tests

// Valid property data fixtures
export const validPropertyData: PropertyData = {
  label: 'Test Property',
  address: {
    line1: '123 Main St',
    city: 'Anytown',
    state: 'USA',
    zip: '12345',
    latitude: 40.7128,
    longitude: -74.006,
  },
  property_type: 'SFH',
  zoning_type: 'Residential',
  sqft: 2500,
  lot_size_sqft: 8000,
  stories: 2,
  year_built: 1995,
  areas: [
    { type: 'Bedroom', quantity: 3 },
    { type: 'Bathroom', quantity: 2 },
    { type: 'Garage', quantity: 2 },
  ],
};

export const validMinimalPropertyData: PropertyData = {
  address: {
    line1: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
  },
};

export const validPropertyDatabaseEntry = {
  id: 'test-property-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  data: validPropertyData,
};

// Malformed data scenarios that could come from database
export const malformedPropertyData = {
  // Missing required fields
  missingAddress: {
    property_type: 'SFH',
    zoning_type: 'Residential',
    sqft: 2500,
    stories: 2,
    year_built: 1995,
    areas: [
      { type: 'Bedroom', quantity: 3 },
      { type: 'Bathroom', quantity: 2 },
    ],
  },

  // Invalid types
  invalidTypes: {
    label: 123, // should be string
    address: {
      line1: 123,
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
    },
    property_type: 'MANSION', // invalid enum value
    zoning_type: 'Residential',
    sqft: 'large', // should be number
    stories: 1,
    year_built: '1995', // should be number
    areas: [
      { type: 'Bedroom', quantity: '3' }, // should be number
    ],
  },

  // Negative/invalid values
  invalidValues: {
    label: '',
    address: {
      line1: '',
      city: '',
      state: '',
      zip: '',
    },
    property_type: 'SFH',
    zoning_type: '',
    sqft: -2500,
    stories: 0,
    year_built: -1995,
    lot_size_sqft: -1000,
    areas: [{ type: '', quantity: -1 }],
  },

  // Extreme values
  extremeValues: {
    label: 'A'.repeat(1000), // extremely long name
    address: {
      line1: 'B'.repeat(2000), // extremely long address
      city: 'C'.repeat(1000),
      state: 'D'.repeat(1000),
      zip: 'E'.repeat(1000),
    },
    property_type: 'SFH',
    zoning_type: 'F'.repeat(1000),
    sqft: 999999999, // unrealistic size
    stories: 999,
    year_built: 3000, // future year
    lot_size_sqft: 999999999,
    areas: [{ type: 'G'.repeat(1000), quantity: 999 }],
  },

  // Null/undefined values where not allowed
  nullValues: {
    label: null,
    address: null,
    property_type: null,
    zoning_type: null,
    sqft: null,
    stories: null,
    year_built: null,
    areas: null,
  },

  // Completely empty object
  empty: {},

  // Non-object data
  notAnObject: 'this should be an object',

  // Array instead of object
  arrayData: ['not', 'an', 'object'],
};

// Database entries with malformed data field
export const malformedDatabaseEntries = {
  invalidJson: {
    id: 'malformed-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    data: '{"invalid": json}', // Invalid JSON string
  },

  nullData: {
    id: 'malformed-2',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    data: null,
  },

  missingDataField: {
    id: 'malformed-3',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    // data field completely missing
  },

  corruptedData: {
    id: 'malformed-4',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    data: malformedPropertyData.missingAddress,
  },
};

// API request payloads for testing
export const apiRequestPayloads = {
  valid: {
    data: validPropertyData,
  },

  missingDataField: {
    // no data field
    someOtherField: 'value',
  },

  invalidDataField: {
    data: malformedPropertyData.invalidTypes,
  },

  emptyPayload: {},

  nullPayload: null,

  stringPayload: 'not an object',
};
