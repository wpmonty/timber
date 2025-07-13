import 'dotenv/config';
import { supabaseServer } from '../lib/supabase';
import { Database } from '../types/supabase.types';

type NewProperty = Database['public']['Tables']['properties']['Insert'];

const newProperty: NewProperty = {
  address: '123 Main St',
  owner_id: 'acab4aad-36d2-49da-8087-aa62ad0b394c',
  data: {
    name: 'Property 1',
  },
};

type NewSystem = Database['public']['Tables']['systems']['Insert'];

const newSystem = (uuid: string): NewSystem => {
  return {
    data: {
      name: 'System 1',
    },
    property_id: uuid,
  };
};

type NewLog = Database['public']['Tables']['logs']['Insert'];

const newLog = (uuid: string): NewLog => {
  return {
    system_id: uuid,
    data: {
      name: 'Log 1',
    },
  };
};

const seed = async () => {
  const { data: propertyData, error: propertyError } = await supabaseServer
    .from('properties')
    .insert(newProperty)
    .select();

  if (!propertyError && propertyData && propertyData.length > 0) {
    console.log('Property created successfully', propertyData[0].id);

    const { data: systemData, error: systemError } = await supabaseServer
      .from('systems')
      .insert(newSystem(propertyData[0].id))
      .select();

    if (!systemError && systemData && systemData.length > 0) {
      console.log('System created successfully', systemData[0].id);

      const { data: logData, error: logError } = await supabaseServer
        .from('logs')
        .insert(newLog(systemData[0].id))
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
    console.error('Error creating property');
  }
};

seed();
