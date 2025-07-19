import {
  validateMaintainable,
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
});
