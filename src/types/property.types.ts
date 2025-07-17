import {
  PropertySchema,
  PropertyDataSchema,
  PROPERTY_TYPES,
  COMMON_AREA_TYPES,
  PropertyTypeValue,
  AreaType,
  getPropertyTypeLabel,
  formatAreaType,
} from '@/lib/schemas/property.schema';
import { Database } from './supabase.types';
import { z } from 'zod';

export type PropertyDatabaseEntry = Database['public']['Tables']['properties']['Row'];
export type PropertyDatabaseInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyDatabaseUpdate = Database['public']['Tables']['properties']['Update'];

// hydrate the data key from basic json to our own data type from the zod schema
export type Property = z.infer<typeof PropertySchema>;
export type PropertyData = z.infer<typeof PropertyDataSchema>;
export type PropertyInsert = Omit<PropertyDatabaseInsert, 'data'> & { data: PropertyData };
export type PropertyUpdate = Omit<PropertyDatabaseUpdate, 'data' | 'updated_at'> & {
  data: PropertyData;
  updated_at: string;
};

export interface PropertyStats {
  totalMaintainables: number;
  maintainablesNeedingMaintenance: number;
  criticalIssues: number;
  upcomingMaintenance: number;
  totalMaintenanceCost: number;
  avgMaintainableAge: number;
}

// Re-export schema constants, types, and utilities for easier access
export { PROPERTY_TYPES, COMMON_AREA_TYPES, getPropertyTypeLabel, formatAreaType };
export type { PropertyTypeValue, AreaType };
