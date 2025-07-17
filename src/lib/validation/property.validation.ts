import { Property, PropertyData } from '@/types/property.types';
import {
  PartialPropertyDataSchema,
  PropertyDataSchema,
  PropertySchema,
} from '@/lib/schemas/property.schema';

// Validation result type with structured errors
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

// Validate property data
export function validatePropertyData(data: unknown): ValidationResult<PropertyData> {
  const result = PropertyDataSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Transform Zod errors into structured format
  const errors: Record<string, string[]> = {};

  result.error.issues.forEach(error => {
    const field = error.path.join('.');
    const message = error.message;

    // All errors per field for detailed reporting
    if (!errors[field]) {
      errors[field] = [];
    }
    errors[field].push(message);
  });

  return {
    success: false,
    errors,
  };
}
export function isValidPropertyData(data: unknown): data is PropertyData {
  return validatePropertyData(data).success;
}

// Validate partial property data
export function validatePartialPropertyData(
  data: unknown
): ValidationResult<Partial<PropertyData>> {
  const result = PartialPropertyDataSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors: Record<string, string[]> = {};

  result.error.issues.forEach(error => {
    const field = error.path.join('.');
    const message = error.message;

    if (!errors[field]) {
      errors[field] = [];
    }
    errors[field].push(message);
  });

  return {
    success: false,
    errors,
  };
}
export function isValidPartialPropertyData(data: unknown): data is Partial<PropertyData> {
  return validatePartialPropertyData(data).success;
}

// Validate entire property object
// Good for quick validation of entire property object
// Use validatePropertyData for more detailed validation of property data
export function validateProperty(data: unknown): ValidationResult<Property> {
  const result = PropertySchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: { api: ['Invalid property data received from server'] },
  };
}
export function isValidProperty(data: unknown): data is Property {
  return validateProperty(data).success;
}
