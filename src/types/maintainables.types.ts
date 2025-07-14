import { ConditionType } from './general.types';
import { Database } from './supabase.types';

export type MaintainableDatabaseEntry = Database['public']['Tables']['systems']['Row'];
// hydrate the data key from basic json to our own data type
export type Maintainable = Omit<MaintainableDatabaseEntry, 'data'> & { data: MaintainableData };

const test: Maintainable = {
  id: '1',
  created_at: '2021-01-01',
  updated_at: '2021-01-01',
  property_id: '1',
  data: {
    name: 'test',
    category: 'hvac',
    brand: 'test',
    model: 'test',
    serialNumber: 'test',
    dateInstalled: 'test',
    datePurchased: 'test',
    purchasePrice: 100,
    condition: 'good',
    status: 'operational',
    warrantyExpiration: 'test',
    expectedLifespan: 10,
    location: 'test',
    notes: 'test',
  },
};

export type MaintainableCategoryType =
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'roofing'
  | 'flooring'
  | 'kitchen'
  | 'exterior'
  | 'safety';

export type MaintainableConditionType = ConditionType;

export type MaintainableStatusType =
  | 'operational'
  | 'needs-maintenance'
  | 'needs-repair'
  | 'needs-replacement'
  | 'under-warranty';

export interface MaintainableData {
  name: string;
  category: MaintainableCategoryType;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  dateInstalled: string | null;
  datePurchased: string | null;
  purchasePrice: number | null;
  condition: MaintainableConditionType;
  status: MaintainableStatusType;
  warrantyExpiration: string | null;
  expectedLifespan: number; // in years
  location: string; // room or area in home; can be empty string
  notes: string; // can be empty string
}

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

export interface MaintainableWarning {
  id: string;
  mId: string;
  type: 'maintenance-due' | 'warranty-expiring' | 'replacement-needed' | 'repair-needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timeframe: string; // e.g., "in 3 months", "within 1 year"
  estimatedCost?: {
    min: number;
    max: number;
  };
  actionRequired: boolean;
  createdAt: Date;
}

export type MaintainableCardProps = {
  appliance: MaintainableData;
  lifecycleData: MaintainableLifecycleData;
  warnings: MaintainableWarning[];
};

export type MaintainablesByCategory = {
  [K in MaintainableCategoryType]: MaintainableData[];
};
