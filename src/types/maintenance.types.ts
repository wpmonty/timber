import { Database } from './supabase.types';

type MaintenanceLogEntryDatabaseEntry = Database['public']['Tables']['logs']['Row'];
// hydrate the data key from basic json to our own data type
export type MaintenanceLogEntry = Omit<MaintenanceLogEntryDatabaseEntry, 'data'> & {
  data: MaintenanceLogEntryData;
};

export type MaintenanceStatusType = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export type MaintenanceFrequencyType =
  | 'monthly'
  | 'quarterly'
  | 'biannually'
  | 'annually'
  | 'as-needed';

export type MaintenanceServiceType =
  | 'routine-maintenance'
  | 'repair'
  | 'replacement'
  | 'inspection'
  | 'cleaning'
  | 'emergency';

export interface MaintenanceLogEntryData {
  name: string;
  category: string;
  serviceType: MaintenanceServiceType;
  description: string;
  cost: number;
  dateCompleted: string;
  serviceProvider: string;
  notes: string;
}
