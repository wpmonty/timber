import { PropertyData } from '@/types/property.types';

// This file contains test fixtures and is not a test file itself
// jest/no-tests

// Valid property data fixtures
export const validPropertyData: PropertyData = {
  name: 'Test Property',
  address: '123 Main St, Anytown, USA',
  yearBuilt: 1995,
  squareFootage: 2500,
  homeType: 'single-family',
  bedrooms: 3,
  bathrooms: 2,
  stories: 2,
  garages: 2,
  lotSize: 8000,
};

export const validMinimalPropertyData: PropertyData = {
  name: 'Minimal Property',
  address: '456 Oak Ave',
  yearBuilt: 2000,
  squareFootage: 1200,
  homeType: 'condo',
  bedrooms: 2,
  bathrooms: 1,
  stories: 1,
  garages: 1,
  // lotSize is optional
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
  missingName: {
    address: '123 Main St',
    yearBuilt: 1995,
    squareFootage: 2500,
    homeType: 'single-family',
    bedrooms: 3,
    bathrooms: 2,
    stories: 2,
    garages: 2,
  },

  // Invalid types
  invalidTypes: {
    name: 123, // should be string
    address: '456 Oak Ave',
    yearBuilt: '1995', // should be number
    squareFootage: 'large', // should be number
    homeType: 'mansion', // invalid enum value
    bedrooms: '3', // should be number
    bathrooms: 2.5,
    stories: 1,
    garages: 1,
  },

  // Negative/invalid values
  invalidValues: {
    name: '',
    address: '',
    yearBuilt: -1995,
    squareFootage: -2500,
    homeType: 'single-family',
    bedrooms: -1,
    bathrooms: 0,
    stories: 0,
    garages: -1,
    lotSize: -1000,
  },

  // Extreme values
  extremeValues: {
    name: 'A'.repeat(1000), // extremely long name
    address: 'B'.repeat(2000), // extremely long address
    yearBuilt: 3000, // future year
    squareFootage: 999999999, // unrealistic size
    homeType: 'single-family',
    bedrooms: 999,
    bathrooms: 999,
    stories: 999,
    garages: 999,
    lotSize: 999999999,
  },

  // Null/undefined values where not allowed
  nullValues: {
    name: null,
    address: null,
    yearBuilt: null,
    squareFootage: null,
    homeType: null,
    bedrooms: null,
    bathrooms: null,
    stories: null,
    garages: null,
    lotSize: null,
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
    data: malformedPropertyData.missingName,
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
