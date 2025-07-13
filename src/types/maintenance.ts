import { SeverityType } from './general.types';

type MaintenancePriorityType = SeverityType;

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

export interface MaintenanceRecord {
  id: string;
  mId: string;
  maintainableName: string;
  serviceType: MaintenanceServiceType;
  description: string;
  priority: MaintenancePriorityType;
  status: MaintenanceStatusType;
  scheduledDate: Date;
  completedDate: Date | null;
  cost: number | null;
  laborCost: number | null;
  partsCost: number | null;
  serviceProvider: string;
  contactInfo: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceScheduleItem {
  id: string;
  mId: string;
  maintainableName: string;
  serviceType: MaintenanceServiceType;
  description: string;
  priority: MaintenancePriorityType;
  dueDate: Date;
  estimatedCost: {
    min: number;
    max: number;
  };
  frequency: MaintenanceFrequencyType;
  isOverdue: boolean;
  daysPastDue?: number;
  createdAt: Date;
}

export interface MaintenanceAlert {
  id: string;
  mId: string;
  type: 'overdue' | 'due-soon' | 'warranty-expiring' | 'no-maintenance-history';
  severity: SeverityType;
  title: string;
  message: string;
  actionRequired: boolean;
  dueDate?: Date;
  estimatedCost?: {
    min: number;
    max: number;
  };
  createdAt: Date;
}

export interface MaintenanceLogEntry {
  id: string;
  mId: string;
  maintainableName: string;
  category: string;
  serviceType: MaintenanceServiceType;
  description: string;
  cost: number;
  dateCompleted: Date;
  serviceProvider: string;
  notes?: string;
}

export type MaintenanceCalendarEvent = {
  id: string;
  mId: string;
  maintainableName: string;
  title: string;
  date: Date;
  type: MaintenanceServiceType;
  priority: MaintenancePriorityType;
  estimatedCost: number;
};

export type MaintenanceRecordProps = {
  record: MaintenanceRecord;
  onEdit?: (record: MaintenanceRecord) => void;
  onDelete?: (recordId: string) => void;
};

export type MaintenanceLogProps = {
  records: MaintenanceLogEntry[];
  isLoading?: boolean;
  error?: string;
};
