import { maintainableDataSchemas } from './schemas/maintainable';
import { MaintainableTypeOptions } from './schemas/maintainable.schema';
import { MaintainableTypeType } from '@/types/maintainable.types';

export function getMaintainableDataSchema(subtype: string) {
  return maintainableDataSchemas.find(schema => schema.shape.subtype.value === subtype);
}

export function getMaintainableSubtypeNames(type: MaintainableTypeType): string[] {
  return maintainableDataSchemas
    .filter(schema => schema.shape.type.value === type)
    .map(schema => schema.shape.subtype.value);
}

export function listMaintainableTypeNames(): MaintainableTypeType[] {
  return MaintainableTypeOptions.options;
}
