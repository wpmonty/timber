import { PropertyDatabaseEntry } from '@/types/property.types';
import { z } from 'zod';

// Property type constants for better type safety and reusability
export const PROPERTY_TYPES = [
  { value: 'SFH', label: 'Single Family Home' },
  { value: 'TH', label: 'Townhouse' },
  { value: 'CONDO', label: 'Condominium' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'OTHER', label: 'Other' },
];
// Extract the property type values
export const PROPERTY_TYPE_VALUES = PROPERTY_TYPES.map(type => type.value);
// Extract the property type
export type PropertyTypeValue = (typeof PROPERTY_TYPE_VALUES)[number];
// Utility function to get the label for a property type
export const getPropertyTypeLabel = (value: PropertyTypeValue): string => {
  const type = PROPERTY_TYPES.find(type => type.value === value);
  return type?.label || value;
};

// Common area types for property areas/rooms
export const COMMON_AREA_TYPES = ['bedroom', 'bathroom', 'basement', 'garage', 'attic', 'other'];
// Extract the property type values for the enum
export type AreaType = (typeof COMMON_AREA_TYPES)[number];
// Utility functions for working with property constants
export const formatAreaType = (areaType: AreaType): string => {
  return areaType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Address schema for nested address object
const AddressSchema = z.object({
  line1: z
    .string()
    .min(1, 'Street address is required')
    .max(200, 'Street address must be less than 200 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  state: z.string().min(2, 'State is required').max(50, 'State must be less than 50 characters'),
  zip: z
    .string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code must be less than 10 characters'),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),

  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
});

// Area schema for rooms/spaces
const AreaSchema = z.object({
  type: z.enum(COMMON_AREA_TYPES as [string, ...string[]], {
    message: 'Please select a valid area type',
  }),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative')
    .max(50, 'Quantity seems unreasonably high'),
});

// Updated Zod schema to match the new structure
export const PropertyDataSchema = z.object({
  label: z.string().max(100, 'Property name must be less than 100 characters').optional(),

  address: AddressSchema,

  property_type: z
    .enum(PROPERTY_TYPE_VALUES, {
      message: 'Please select a valid property type',
    })
    .optional(),

  zoning_type: z
    .string()
    .min(1, 'Zoning type is required')
    .max(50, 'Zoning type must be less than 50 characters')
    .optional(),

  sqft: z
    .number()
    .positive('Square footage must be greater than 0')
    .max(1000000, 'Square footage seems unreasonably large')
    .optional(),

  lot_size_sqft: z
    .number()
    .positive('Lot size must be greater than 0')
    .max(10000000, 'Lot size seems unreasonably large')
    .optional(),

  stories: z
    .number()
    .int('Stories must be a whole number')
    .min(1, 'Must have at least 1 story')
    .max(10, 'Stories seems unreasonably high')
    .optional(),

  year_built: z
    .number()
    .int('Year must be a whole number')
    .min(800, 'Year built must be after 800')
    .max(new Date().getFullYear(), 'Year built cannot be in the future')
    .optional(),

  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),

  areas: z.array(AreaSchema).max(50, 'Too many areas specified').optional(),
});

export const PartialPropertyDataSchema = PropertyDataSchema.partial();

// API response validation - matches Supabase types exactly
export const PropertySchema = z.object({
  id: z.string(),
  owner_id: z.string().nullable(),
  address: z.string(),
  data: PropertyDataSchema.nullable(),
  created_at: z.string(),
  updated_at: z.string(),
}) satisfies z.ZodType<PropertyDatabaseEntry>;
