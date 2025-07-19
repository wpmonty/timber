import { Maintainable, MaintainableData } from '@/types/maintainable.types';
import { MaintainableSchema, MaintainableDataSchema } from '@/lib/schemas/maintainable.schema';
import { getMaintainableDataSchema, listMaintainableTypeNames } from '@/lib/maintainable-registry';
import { ValidationResult } from '@/types/general.types';

// Validate maintainable data with subtype-specific validation
export function validateMaintainableDataWithSubtype(
  data: unknown,
  subtype: string
): ValidationResult<MaintainableData> {
  try {
    const maintainableDataSchema = getMaintainableDataSchema(subtype);
    if (!maintainableDataSchema) {
      return {
        success: false,
        errors: {
          subtype: [`Unknown subtype: ${subtype}`],
        },
      };
    }

    const result = maintainableDataSchema.safeParse(data);

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

      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(message);
    });

    return {
      success: false,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        subtype: [`Unknown subtype: ${subtype}`],
      },
    };
  }
}

// Validate maintainable data without subtype (basic validation)
export function validateMaintainableData(data: unknown): ValidationResult<MaintainableData> {
  const result = MaintainableDataSchema.safeParse(data);

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

export function isValidMaintainableData(data: unknown): data is MaintainableData {
  return validateMaintainableData(data).success;
}

// Validate entire maintainable object
export function validateMaintainable(data: unknown): ValidationResult<Maintainable> {
  const result = MaintainableSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: { message: ['Invalid maintainable data - validateMaintainable'] },
  };
}

export function isValidMaintainable(data: unknown): data is Maintainable {
  return validateMaintainable(data).success;
}

export function isValidMaintainableType(type: string): boolean {
  return listMaintainableTypeNames().includes(type as any);
}
export function isValidMaintainableSubtype(subtype: string): boolean {
  return getMaintainableDataSchema(subtype) !== undefined;
}
