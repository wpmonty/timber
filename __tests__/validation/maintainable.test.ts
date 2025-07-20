import { z } from 'zod';
import {
  validateMaintainableData,
  isValidMaintainable,
  isValidMaintainableData,
} from '@/lib/validation/maintainable.validation';

import {
  malformedMaintainableData,
  malformedMaintainableDatabaseEntries,
  validMinimalMaintainableData,
  validMaintainableData,
  validMaintainableDatabaseEntry,
} from '../fixtures/maintainable-data';
import DishwasherMaintainableDataSchema from '@/lib/schemas/maintainable/appliance/dishwasher.schema';
import RefrigeratorMaintainableDataSchema from '@/lib/schemas/maintainable/appliance/refrigerator.schema';

type RefrigeratorData = z.infer<typeof RefrigeratorMaintainableDataSchema>;
type DishwasherData = z.infer<typeof DishwasherMaintainableDataSchema>;

describe('Maintainable Validation', () => {
  describe('isValidMaintainable (no subtype checking)', () => {
    it('returns true for valid data', () => {
      const result = isValidMaintainable(validMaintainableDatabaseEntry);
      expect(result).toEqual(true);
    });

    it('returns false for invalid data', () => {
      const result = isValidMaintainable(malformedMaintainableDatabaseEntries.invalidJson);
      const result2 = isValidMaintainable(malformedMaintainableDatabaseEntries.nullData);
      const result3 = isValidMaintainable(malformedMaintainableDatabaseEntries.missingDataField);
      const result4 = isValidMaintainable(malformedMaintainableDatabaseEntries.corruptedData);

      expect(result).toEqual(false);
      expect(result2).toEqual(false);
      expect(result3).toEqual(false);
      expect(result4).toEqual(false);
    });
  });

  describe('isValidMaintainableData (no subtype checking)', () => {
    it('returns true for untyped valid data', () => {
      const result = isValidMaintainableData(validMaintainableData);
      const result2 = isValidMaintainableData(validMinimalMaintainableData);

      expect(result).toEqual(true);
      expect(result2).toEqual(true);
    });

    it('returns false for invalid data', () => {
      const result = isValidMaintainableData(malformedMaintainableData.missingType);
      const result2 = isValidMaintainableData(malformedMaintainableData.missingSubtype); // should pass actually
      const result3 = isValidMaintainableData(malformedMaintainableData.invalidTypes);
      const result4 = isValidMaintainableData(malformedMaintainableData.invalidValues);
      const result5 = isValidMaintainableData(malformedMaintainableData.empty);
      const result6 = isValidMaintainableData(malformedMaintainableData.notAnObject);
      const result7 = isValidMaintainableData(malformedMaintainableData.arrayData);
      const result8 = isValidMaintainableData(malformedMaintainableData.extremeValues);
      const result9 = isValidMaintainableData(malformedMaintainableData.nullValues);

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
      const result = validateMaintainableData(malformedMaintainableData.missingType);
      const result2 = validateMaintainableData(malformedMaintainableData.missingSubtype);
      const result3 = validateMaintainableData(malformedMaintainableData.invalidTypes);
      const result4 = validateMaintainableData(malformedMaintainableData.invalidValues);
      const result5 = validateMaintainableData(malformedMaintainableData.empty);
      const result6 = validateMaintainableData(malformedMaintainableData.notAnObject);
      const result7 = validateMaintainableData(malformedMaintainableData.arrayData);
      const result8 = validateMaintainableData(malformedMaintainableData.extremeValues);
      const result9 = validateMaintainableData(malformedMaintainableData.nullValues);

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
