import 'dotenv/config';

import { Database } from '../types/supabase.types';
import { PropertyData } from '../types/property.types';
import { MaintainableData } from '../types/maintainables.types';
import { MaintenanceLogEntryData } from '@/types/maintenance.types';
import { createClient } from '@supabase/supabase-js';

// PROPERTY
const ownerId = 'ad7f1699-b0b3-4882-b210-d2fd92fb62b2';

type NewProperty = Database['public']['Tables']['properties']['Insert'];
type PropertyDataPayload = Omit<PropertyData, 'address'>;

const propertyData: PropertyDataPayload = {
  name: 'Main Residence',
  yearBuilt: 2009,
  squareFootage: 2400,
  homeType: 'single-family',
  bedrooms: 4,
  bathrooms: 3,
  stories: 2,
  garages: 2,
  lotSize: 0.25,
};

const newProperty: NewProperty = {
  address: '3124 Maple Street, Toronto, ON',
  owner_id: ownerId,
  data: propertyData,
};

// MAINTAINABLE

type NewSystem = Database['public']['Tables']['systems']['Insert'];
type SystemDataPayload = Omit<MaintainableData, 'id'>;

const systemData: SystemDataPayload = {
  name: 'Furnace',
  category: 'hvac',
  brand: 'LG',
  model: 'AC-1234567890',
  serialNumber: '1234567890',
  dateInstalled: null,
  datePurchased: null,
  purchasePrice: 1000,
  condition: 'good',
  status: 'operational',
  warrantyExpiration: null,
  expectedLifespan: 10,
  location: 'basement',
  notes: 'This is a note',
};

const newSystem = (uuid: string): NewSystem => {
  return {
    data: systemData,
    property_id: uuid,
  };
};

// MAINTENANCE LOG

type NewLog = Database['public']['Tables']['logs']['Insert'];
type LogDataPayload = Omit<MaintenanceLogEntryData, 'id'>;

const logData: LogDataPayload = {
  name: 'Furnace',
  cost: 100,
  notes: 'This is a note',
  category: 'maintenance',
  serviceType: 'repair',
  dateCompleted: new Date().toISOString(),
  description: 'This is a note',
  serviceProvider: 'John Doe',
};

const newLog = (propertyId: string, systemId: string): NewLog => {
  return {
    property_id: propertyId,
    system_id: systemId,
    data: logData,
  };
};

// SEED FUNCTION

const seed = async () => {
  console.log('SUPABASE_URL', process.env.SUPABASE_URL);
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: propertyData, error: propertyError } = await supabase
    .from('properties')
    .insert([newProperty])
    .select();

  if (!propertyError && propertyData && propertyData.length > 0) {
    console.log('Property created successfully', propertyData[0].id);

    const { data: systemData, error: systemError } = await supabase
      .from('systems')
      .insert(newSystem(propertyData[0].id))
      .select();

    if (!systemError && systemData && systemData.length > 0) {
      console.log('System created successfully', systemData[0].id);

      const { data: logData, error: logError } = await supabase
        .from('logs')
        .insert(newLog(propertyData[0].id, systemData[0].id))
        .select();

      if (!logError && logData && logData.length > 0) {
        console.log('Log created successfully', logData[0].id);
      } else {
        console.error('Error creating log');
      }
    } else {
      console.error('Error creating system');
    }
  } else {
    console.error('Error creating property', propertyError);
  }
};

seed();
