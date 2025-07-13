export interface PropertyData {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyOwner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface PropertyStats {
  totalMaintainables: number;
  maintainablesNeedingMaintenance: number;
  criticalIssues: number;
  upcomingMaintenance: number;
  totalMaintenanceCost: number;
  avgMaintainableAge: number;
}

export type PropertyLocationData = {
  city: string;
  state: string;
  zipCode: string;
  climate: 'hot' | 'temperate' | 'cold' | 'humid' | 'dry';
};
