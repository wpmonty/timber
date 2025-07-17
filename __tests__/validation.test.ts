import { validatePropertyData } from '@/lib/validation/property.validation';
import {
  malformedPropertyData,
  validMinimalPropertyData,
  validPropertyData,
} from './fixtures/property-data';

describe('Better Validation Pattern - Zod with Structured Errors', () => {
  describe('validatePropertyData', () => {
    it('returns structured success response for valid data', () => {
      const result = validatePropertyData(validPropertyData);

      expect(result).toEqual({
        success: true,
        data: validPropertyData,
      });
    });

    it('returns structured error response with field-specific errors', () => {
      const result = validatePropertyData(malformedPropertyData.missingName);
      console.log(result);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();

      // Check specific field errors
      expect(result.errors).toBeDefined();
      expect(result.errors?.name).toBeDefined();
      expect(result.errors?.name[0]).toContain('expected string, received undefined');
    });

    it('handles missing required fields properly', () => {
      const incompleteData = {
        name: 'Test Property',
        // Missing all other required fields
      };

      const result = validatePropertyData(incompleteData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.address).toBeDefined();
      expect(result.errors?.yearBuilt).toBeDefined();
      expect(result.errors?.squareFootage).toBeDefined();
      expect(result.errors?.homeType).toBeDefined();
      expect(result.errors?.bedrooms).toBeDefined();
    });

    it('allows optional fields to be undefined', () => {
      const result = validatePropertyData(validMinimalPropertyData);

      expect(result.success).toBe(true);
      expect(result.data?.lotSize).toBeUndefined();
    });

    it('validates reasonable limits for property features', () => {
      const result = validatePropertyData(malformedPropertyData.extremeValues);

      expect(result.success).toBe(false);
      expect(result.errors?.squareFootage[0]).toContain('unreasonably large');
      expect(result.errors?.bedrooms[0]).toContain('unreasonably high');
      expect(result.errors?.bathrooms[0]).toContain('unreasonably high');
      expect(result.errors?.stories[0]).toContain('unreasonably high');
      expect(result.errors?.garages[0]).toContain('unreasonably high');
      expect(result.errors?.lotSize[0]).toContain('unreasonably large');
    });

    it('demonstrates type coercion protection', () => {
      const malformedData = {
        name: 123, // Number instead of string
        address: null, // Null instead of string
        yearBuilt: '1990', // String instead of number
        squareFootage: 'big', // String instead of number
        homeType: 'mansion', // Invalid enum value
        bedrooms: '3', // String instead of number
        bathrooms: true, // Boolean instead of number
        stories: [], // Array instead of number
        garages: {}, // Object instead of number
        lotSize: 'huge', // String instead of number
      };

      const result = validatePropertyData(malformedData);

      expect(result.success).toBe(false);

      // Every field should have validation errors
      expect(Object.keys(result.errors || {})).toHaveLength(10);

      // Check type-specific errors
      expect(result.errors?.name[0]).toContain('string');
      expect(result.errors?.yearBuilt[0]).toContain('number');
      expect(result.errors?.squareFootage[0]).toContain('number');
    });
  });
});
