import { z } from 'zod';
import {
  validateMaintainableData,
  isValidMaintainable,
  isValidMaintainableData,
} from '@/lib/validation/maintainable.validation';

import {
  malformedSystemData,
  malformedSystemDatabaseEntries,
  validMinimalSystemData,
  validSystemData,
  validSystemDatabaseEntry,
} from '../fixtures/system-data';
import DishwasherMaintainableDataSchema from '@/lib/schemas/maintainable/appliance/dishwasher.schema';
import RefrigeratorMaintainableDataSchema from '@/lib/schemas/maintainable/appliance/refrigerator.schema';

type RefrigeratorData = z.infer<typeof RefrigeratorMaintainableDataSchema>;
type DishwasherData = z.infer<typeof DishwasherMaintainableDataSchema>;

describe('Maintainable Validation', () => {
  describe('isValidMaintainable (no subtype checking)', () => {
    it('returns true for valid data', () => {
      const result = isValidMaintainable(validSystemDatabaseEntry);
      expect(result).toEqual(true);
    });

    it('returns false for invalid data', () => {
      const result = isValidMaintainable(malformedSystemDatabaseEntries.invalidJson);
      const result2 = isValidMaintainable(malformedSystemDatabaseEntries.nullData);
      const result3 = isValidMaintainable(malformedSystemDatabaseEntries.missingDataField);
      const result4 = isValidMaintainable(malformedSystemDatabaseEntries.corruptedData);

      expect(result).toEqual(false);
      expect(result2).toEqual(false);
      expect(result3).toEqual(false);
      expect(result4).toEqual(false);
    });
  });

  describe('isValidMaintainableData (no subtype checking)', () => {
    it('returns true for untyped valid data', () => {
      const result = isValidMaintainableData(validSystemData);
      const result2 = isValidMaintainableData(validMinimalSystemData);

      expect(result).toEqual(true);
      expect(result2).toEqual(true);
    });

    it('returns false for invalid data', () => {
      const result = isValidMaintainableData(malformedSystemData.missingType);
      const result2 = isValidMaintainableData(malformedSystemData.missingSubtype); // should pass actually
      const result3 = isValidMaintainableData(malformedSystemData.invalidTypes);
      const result4 = isValidMaintainableData(malformedSystemData.invalidValues);
      const result5 = isValidMaintainableData(malformedSystemData.empty);
      const result6 = isValidMaintainableData(malformedSystemData.notAnObject);
      const result7 = isValidMaintainableData(malformedSystemData.arrayData);
      const result8 = isValidMaintainableData(malformedSystemData.extremeValues);
      const result9 = isValidMaintainableData(malformedSystemData.nullValues);

      expect(result).toEqual(false);
      expect(result2).toEqual(false);
      expect(result3).toEqual(false);
      expect(result4).toEqual(false);
      expect(result5).toEqual(false);
      expect(result6).toEqual(false);
      expect(result7).toEqual(false);
      expect(result8).toEqual(false);
      expect(result9).toEqual(false);
    });
  });

  describe('validateMaintainableData', () => {
    it('returns true for valid data', () => {
      const dishwasherData: DishwasherData = {
        label: 'Dishwasher',
        type: 'appliance',
        subtype: 'dishwasher',
        condition: 'good',
        location: 'kitchen',
        metadata: {
          brand: 'Samsung',
        },
      };
      const refrigeratorData: RefrigeratorData = {
        label: 'Refrigerator',
        type: 'appliance',
        subtype: 'refrigerator',
        condition: 'good',
        location: 'kitchen',
        metadata: {
          capacity: 100,
          style: 'top-freezer',
          hasIceMaker: true,
          energyRating: 'A+',
        },
      };
      const result = validateMaintainableData(dishwasherData);
      const result2 = validateMaintainableData(refrigeratorData);
      expect(result).toEqual({
        success: true,
        data: dishwasherData,
      });
      expect(result2).toEqual({
        success: true,
        data: refrigeratorData,
      });
    });

    it('returns false for invalid data', () => {
      const result = validateMaintainableData(malformedSystemData.missingType);
      const result2 = validateMaintainableData(malformedSystemData.missingSubtype);
      const result3 = validateMaintainableData(malformedSystemData.invalidTypes);
      const result4 = validateMaintainableData(malformedSystemData.invalidValues);
      const result5 = validateMaintainableData(malformedSystemData.empty);
      const result6 = validateMaintainableData(malformedSystemData.notAnObject);
      const result7 = validateMaintainableData(malformedSystemData.arrayData);
      const result8 = validateMaintainableData(malformedSystemData.extremeValues);
      const result9 = validateMaintainableData(malformedSystemData.nullValues);

      expect(result.success).toEqual(false);
      expect(result2.success).toEqual(false);
      expect(result3.success).toEqual(false);
      expect(result4.success).toEqual(false);
      expect(result5.success).toEqual(false);
      expect(result6.success).toEqual(false);
      expect(result7.success).toEqual(false);
      expect(result8.success).toEqual(false);
      expect(result9.success).toEqual(false);
    });
  });
});
