import { PropertyDatabaseEntry } from '@/types/property.types';
import { z } from 'zod';

// Zod schema with proper validation rules
export const PropertyDataSchema = z.object({
  name: z
    .string()
    .min(1, 'Property name is required')
    .max(100, 'Property name must be less than 100 characters'),

  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),

  yearBuilt: z.number().int('Year must be a whole number').min(800, 'Year built must be after 800'),

  squareFootage: z
    .number()
    .positive('Square footage must be greater than 0')
    .max(1000000, 'Square footage seems unreasonably large'),

  homeType: z.enum(['single-family', 'townhouse', 'condo', 'apartment', 'other'], {
    message: 'Please select a valid home type',
  }),

  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(20, 'Bedrooms seems unreasonably high'),

  bathrooms: z
    .number()
    .multipleOf(0.5, 'Bathrooms must be a multiple of 0.5')
    .min(0, 'Bathrooms cannot be negative')
    .max(20, 'Bathrooms seems unreasonably high'),

  stories: z
    .number()
    .int('Stories must be a whole number')
    .min(1, 'Must have at least 1 story')
    .max(10, 'Stories seems unreasonably high'),

  garages: z
    .number()
    .int('Garages must be a whole number')
    .min(0, 'Garages cannot be negative')
    .max(10, 'Garages seems unreasonably high'),

  // Optional field with proper handling
  lotSize: z
    .number()
    .positive('Lot size must be greater than 0')
    .max(1000000, 'Lot size seems unreasonably large')
    .optional(),
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
