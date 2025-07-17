import { PropertySchema, PropertyDataSchema } from '@/lib/schemas/property.schema';
import { Database } from './supabase.types';
import { z } from 'zod';

export type PropertyDatabaseEntry = Database['public']['Tables']['properties']['Row'];
export type PropertyDatabaseInsert = Database['public']['Tables']['properties']['Insert'];

// hydrate the data key from basic json to our own data type from the zod schema
export type Property = z.infer<typeof PropertySchema>;
export type PropertyData = z.infer<typeof PropertyDataSchema>;
export type PropertyInsert = Omit<PropertyDatabaseInsert, 'data'> & { data: PropertyData };

export interface PropertyStats {
  totalMaintainables: number;
  maintainablesNeedingMaintenance: number;
  criticalIssues: number;
  upcomingMaintenance: number;
  totalMaintenanceCost: number;
  avgMaintainableAge: number;
}
