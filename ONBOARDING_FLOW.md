# Property Onboarding Flow

## Overview

The property onboarding flow has been implemented as a 4-step wizard that collects property information incrementally, with each step saving data via PATCH requests to maintain partial progress.

## Flow Description

### Step 1: Address Confirmation
- **URL**: `/onboarding`
- **Purpose**: Collect and confirm the property address
- **Action**: Creates initial property record with UUID
- **API**: `POST /api/properties`
- **Required**: Yes (address field)
- **Skip Option**: Redirects to `/dashboard`

### Step 2: Property Type Selection
- **Purpose**: Select the type of property (SFH, Townhouse, Condo, Apartment, Other)
- **Action**: PATCH request to update property data
- **API**: `PATCH /api/property/[propertyId]`
- **Required**: No (can be skipped)
- **Skip Option**: Moves to next step

### Step 3: Basic Details
- **Purpose**: Collect square footage and year built
- **Action**: PATCH request to update property data
- **API**: `PATCH /api/property/[propertyId]`
- **Required**: No (can be skipped)
- **Fields**: 
  - Square footage (optional, validated as positive number)
  - Year built (optional, validated between 800 and current year)

### Step 4: Additional Details
- **Purpose**: Collect number of stories and lot size
- **Action**: PATCH request to update property data, then redirect to `/properties`
- **API**: `PATCH /api/property/[propertyId]`
- **Required**: No (can be skipped)
- **Fields**: 
  - Number of stories (optional, validated between 1-10)
  - Lot size in sq ft (optional, validated as positive number)
- **Final Action**: Redirects to `/properties` page

## Technical Implementation

### State Management
- Uses React Hook Form for each step with separate form instances
- Maintains `currentStep` state to control flow
- Stores `propertyId` from initial creation for subsequent PATCH requests

### Data Validation
- Each step has its own Zod schema for validation
- Uses `PartialPropertyDataSchema` for PATCH operations
- Client-side validation with server-side backup validation
- Empty string inputs are filtered out before API calls

### API Integration
- **Property Creation**: `POST /api/properties` with initial address data
- **Property Updates**: `PATCH /api/property/[propertyId]` with partial data merging
- Merges new data with existing property data to avoid overwriting

### Error Handling
- Try-catch blocks around all API calls
- Console logging for debugging
- Loading states during API operations
- Graceful handling of validation errors

### UI/UX Features
- Progress bar showing completion percentage
- Step indicators with titles and descriptions
- Skip buttons on each step (except address)
- Consistent loading states with disabled buttons
- Responsive design with proper spacing

## Data Structure

### Property Schema
```typescript
interface PropertyData {
  address: {
    line1: string;
    city: string;
    state: string;
    zip: string;
    latitude?: number;
    longitude?: number;
  };
  property_type?: 'SFH' | 'TH' | 'CONDO' | 'APARTMENT' | 'OTHER';
  sqft?: number;
  year_built?: number;
  stories?: number;
  lot_size_sqft?: number;
  // ... other optional fields
}
```

### Database Storage
- Main `properties` table with `address` (string) and `data` (JSON) columns
- Address stored both as string and parsed object in data JSON
- All additional fields stored in the `data` JSON column
- Uses Supabase with Row Level Security

## API Endpoints Used

### POST /api/properties
- Creates new property with initial address
- Returns property with generated UUID
- Required fields: `address`, `data.address`

### PATCH /api/property/[propertyId]
- Updates existing property with partial data
- Merges new data with existing data
- Returns updated property
- Uses incremental updates for each onboarding step

## Navigation Flow

```
/onboarding (Step 1: Address) 
    → Step 2: Property Type 
    → Step 3: Basic Details 
    → Step 4: Additional Details 
    → /properties (Complete)

Skip options:
- Step 1 skip → /dashboard
- Steps 2-4 skip → Next step or /properties (final step)
```

## Future Enhancements

1. **Address Parsing**: Integrate with address validation service (Google Places, etc.)
2. **Property Images**: Add image upload capability
3. **Room/Area Management**: Implement area/room configuration
4. **Progress Persistence**: Save progress in localStorage for incomplete flows
5. **Validation Enhancement**: Add more sophisticated field validation
6. **Error UI**: Implement toast notifications for better error feedback
7. **Mobile Optimization**: Enhance mobile responsiveness

## Testing

The onboarding flow can be tested by:
1. Visiting `/onboarding`
2. Entering an address and proceeding through each step
3. Verifying data persistence by checking the database
4. Testing skip functionality at each step
5. Confirming final redirect to `/properties`

## Dependencies

- React Hook Form + Zod for form management and validation
- Next.js App Router for navigation
- Supabase for data persistence
- Tailwind CSS for styling
- TypeScript for type safety