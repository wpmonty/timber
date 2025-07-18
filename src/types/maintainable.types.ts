import { Database } from './supabase.types';
import { z } from 'zod';
import { MaintainableSchema, MaintainableDataSchema } from '@/lib/schemas/maintainable.schema';

export type MaintainableDatabaseEntry = Database['public']['Tables']['systems']['Row'];
export type MaintainableDatabaseInsert = Database['public']['Tables']['systems']['Insert'];
export type MaintainableDatabaseUpdate = Database['public']['Tables']['systems']['Update'];

// hydrate the data key from basic json to our own data type
export type Maintainable = z.infer<typeof MaintainableSchema>;
export type MaintainableData = z.infer<typeof MaintainableDataSchema>;
export type MaintainableInsert = Omit<MaintainableDatabaseInsert, 'data'> & {
  data: MaintainableData;
};
export type MaintainableUpdate = Omit<MaintainableDatabaseUpdate, 'data' | 'updated_at'> & {
  data: MaintainableData;
  updated_at: string;
};

export interface MaintainableLifecycleData {
  mId: string;
  currentAge: number; // in years
  remainingLifespan: number; // in years
  replacementCostEstimate: {
    min: number;
    max: number;
  };
  nextMaintenanceDate: Date | null;
  maintenanceFrequency: 'monthly' | 'quarterly' | 'biannually' | 'annually' | 'as-needed';
  isUnderWarranty: boolean | null; // null if unknown
}
