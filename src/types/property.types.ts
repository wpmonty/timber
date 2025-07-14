import { Database } from './supabase.types';

type PropertyDatabaseEntry = Database['public']['Tables']['properties']['Row'];
// hydrate the data key from basic json to our own data type
export type Property = Omit<PropertyDatabaseEntry, 'data'> & { data: PropertyData };

export interface PropertyData {
  name: string;
  address: string;
  yearBuilt: number;
  squareFootage: number;
  homeType: 'single-family' | 'townhouse' | 'condo' | 'apartment' | 'other';
  bedrooms: number;
  bathrooms: number;
  stories: number;
  garages: number;
  lotSize?: number;
}

export interface PropertyStats {
  totalMaintainables: number;
  maintainablesNeedingMaintenance: number;
  criticalIssues: number;
  upcomingMaintenance: number;
  totalMaintenanceCost: number;
  avgMaintainableAge: number;
}
