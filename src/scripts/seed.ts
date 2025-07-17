import 'dotenv/config';

import { Database } from '../types/supabase.types';
import { MaintainableData } from '../types/maintainables.types';
import { MaintenanceLogEntryData } from '@/types/maintenance.types';
import { createClient } from '@supabase/supabase-js';
import { PropertyData, PropertyInsert } from '@/types/property.types';

// PROPERTY
const ownerId = 'ad7f1699-b0b3-4882-b210-d2fd92fb62b2';

const propertyData: PropertyData = {
  label: 'Main Residence',
  address: {
    line1: '548 W Fullerton Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60614',
  },
  property_type: 'APARTMENT',
  zoning_type: 'Residential',
  sqft: 2400,
  lot_size_sqft: 10890, // 0.25 acres = 10,890 sq ft
  stories: 2,
  year_built: 2009,
  areas: [
    { type: 'Bedroom', quantity: 4 },
    { type: 'Bathroom', quantity: 3 },
    { type: 'Garage', quantity: 2 },
  ],
};

const newProperty: PropertyInsert = {
  owner_id: ownerId,
  data: propertyData,
  address: '548 W Fullerton Ave, Chicago, IL 60614',
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
