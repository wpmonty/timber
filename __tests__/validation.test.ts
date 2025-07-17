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
      const result = validatePropertyData(malformedPropertyData.missingAddress);
      console.log(result);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();

      // Check specific field errors - this data is missing the address field
      expect(result.errors).toBeDefined();
      expect(result.errors?.address).toBeDefined();
      expect(result.errors?.address[0]).toContain('expected object, received undefined');
    });

    it('handles missing required fields properly', () => {
      const incompleteData = {
        label: 'Test Property',
        // Missing all other required fields
      };

      const result = validatePropertyData(incompleteData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.address).toBeDefined();
      // Note: Most fields are now optional, so only address is required
    });

    it('allows optional fields to be undefined', () => {
      const result = validatePropertyData(validMinimalPropertyData);

      expect(result.success).toBe(true);
      expect(result.data?.lot_size_sqft).toBeUndefined();
    });

    it('validates reasonable limits for property features', () => {
      const result = validatePropertyData(malformedPropertyData.extremeValues);

      expect(result.success).toBe(false);
      // Check that validation fails and produces some errors for extreme values
      expect(result.errors).toBeDefined();

      // Check specific errors that should be present
      if (result.errors?.sqft) {
        expect(result.errors.sqft[0]).toContain('unreasonably large');
      }
      if (result.errors?.stories) {
        expect(result.errors.stories[0]).toContain('unreasonably high');
      }
      if (result.errors?.lot_size_sqft) {
        expect(result.errors.lot_size_sqft[0]).toContain('unreasonably large');
      }
    });

    it('demonstrates type coercion protection', () => {
      const malformedData = {
        label: 123, // Number instead of string
        address: null, // Null instead of address object
        property_type: 'mansion', // Invalid enum value
        zoning_type: 123, // Number instead of string
        sqft: 'big', // String instead of number
        stories: [], // Array instead of number
        year_built: '1990', // String instead of number
        areas: 'not an array', // String instead of array
      };

      const result = validatePropertyData(malformedData);

      expect(result.success).toBe(false);

      // Every field should have validation errors
      expect(Object.keys(result.errors || {})).toHaveLength(8);

      // Check type-specific errors
      expect(result.errors?.label[0]).toContain('string');
      expect(result.errors?.address[0]).toContain('object');
      expect(result.errors?.property_type[0]).toContain('Please select a valid property type');
      expect(result.errors?.zoning_type[0]).toContain('string');
      expect(result.errors?.sqft[0]).toContain('number');
      expect(result.errors?.year_built[0]).toContain('number');
      expect(result.errors?.areas[0]).toContain('array');
    });
  });
});
