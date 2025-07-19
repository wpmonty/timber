import { applianceDataSchemas, applianceSubtypes, ApplianceSubtypeType } from './appliance/index';
import { systemDataSchemas, systemSubtypes, SystemSubtypeType } from './system/index';
import { structureDataSchemas, structureSubtypes, StructureSubtypeType } from './structure/index';

export const maintainableDataSchemas = [
  ...applianceDataSchemas,
  ...systemDataSchemas,
  ...structureDataSchemas,
];

export const maintainableSubtypes = [...applianceSubtypes, ...systemSubtypes, ...structureSubtypes];

export type MaintainableSubtypeType =
  | ApplianceSubtypeType
  | SystemSubtypeType
  | StructureSubtypeType;
