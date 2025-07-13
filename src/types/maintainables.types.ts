import { ConditionType } from './general.types';

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
  id: string;
  name: string;
  category: MaintainableCategoryType;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  dateInstalled: Date | null;
  datePurchased: Date | null;
  purchasePrice: number | null;
  condition: MaintainableConditionType;
  statuses: MaintainableStatusType[];
  warrantyExpiration: Date | null;
  expectedLifespan: number; // in years
  location: string; // room or area in home; can be empty string
  notes: string; // can be empty string
  createdAt: Date;
  updatedAt: Date;
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
