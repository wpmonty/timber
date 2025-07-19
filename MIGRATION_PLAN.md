# Systems to Maintainables Migration Plan

## Overview
This document outlines the complete migration from "systems" to "maintainables" terminology and database structure.

## Current State
- ✅ New `maintainable` table exists
- ✅ New API routes exist (`/api/maintainables/`, `/api/maintainable/`)
- ✅ New React hooks exist (`useMaintainables`)
- ❌ Legacy `systems` table still exists
- ❌ Legacy API routes still exist
- ❌ Frontend still uses "systems" terminology
- ❌ Logs table still references `system_id`

## Phase 1: Database Schema Updates

### 1.1 Update Logs Table
**File**: Database schema (Supabase)
**Action**: 
- Rename column `system_id` to `maintainable_id`
- Update foreign key constraint to reference `maintainable.id`

### 1.2 Remove Legacy Systems Table
**File**: Database schema (Supabase)
**Action**: Drop the `systems` table after confirming data migration

### 1.3 Regenerate Types
**Command**: `npm run db:typegen`
**Files**: `src/types/supabase.types.ts` (auto-generated)

## Phase 2: API Route Cleanup

### 2.1 Remove Legacy API Routes
**Files to delete**:
- `src/app/api/systems/route.ts`
- `src/app/api/systems/[propertyId]/route.ts`
- `src/app/api/system/[systemId]/route.ts`

### 2.2 Update Seed Script
**File**: `src/scripts/seed.ts`
**Changes**:
- Line 101: Change `.from('systems')` to `.from('maintainable')`
- Line 82: Change `system_id: systemId` to `maintainable_id: maintainableId`
- Update variable names: `systemData` → `maintainableData`, `systemError` → `maintainableError`

## Phase 3: Frontend Route Updates

### 3.1 Rename Route Directory
**Action**: Rename `src/app/(dashboard)/property/[id]/systems/` to `src/app/(dashboard)/property/[id]/maintainables/`

### 3.2 Update Navigation
**File**: `src/components/layout/LeftNavigation.tsx`
**Changes**:
- Line 26: Change title from 'Systems & Appliances' to 'Maintainables'
- Line 27: Change href from `/property/${slug}/systems` to `/property/${slug}/maintainables`

### 3.3 Update Page References
**Files**:
- `src/app/(dashboard)/property/[id]/page.tsx`
  - Line 53: Update Link href
  - Line 54: Update button text
- `src/app/(dashboard)/maintainable/[id]/page.tsx`
  - Line 63: Update Link href
  - Line 64: Update button text
  - Line 77: Update Link href
  - Line 80: Update button text

## Phase 4: Component Updates

### 4.1 Update Property Overview
**File**: `src/components/dashboard/PropertyOverview.tsx`
**Changes**:
- Update prop names: `systems` → `maintainables`
- Update variable names: `systemsLoading` → `maintainablesLoading`
- Update UI text: "Systems & Appliances" → "Maintainables"

### 4.2 Update Warning Alerts
**File**: `src/components/dashboard/WarningAlerts.tsx`
**Changes**:
- Update prop names: `systems` → `maintainables`
- Update variable names: `systemsLoading` → `maintainablesLoading`
- Update UI text: "System Alerts" → "Maintainable Alerts"

### 4.3 Update Maintainables Grid
**File**: `src/components/dashboard/MaintainablesGrid.tsx`
**Changes**:
- Update UI text: "Appliances & Systems" → "Maintainables"
- Update error messages: "Unable to Load Systems" → "Unable to Load Maintainables"
- Update empty state: "No Systems Found" → "No Maintainables Found"

### 4.4 Update Property Form
**File**: `src/components/forms/PropertyForm.tsx`
**Changes**:
- Line 114: Update text from "maintenance and systems" to "maintenance and maintainables"

## Phase 5: Schema and Type Updates

### 5.1 Update Schema Comments
**File**: `src/lib/schemas/maintainable.schema.ts`
**Changes**:
- Update comments to reflect "maintainables" terminology
- Line 4: Update comment about maintainable items
- Line 11: Update comment about system schemas

### 5.2 Update Schema Directory Structure
**Action**: Consider renaming `src/lib/schemas/maintainable/system/` to `src/lib/schemas/maintainable/maintainable/` for consistency

## Phase 6: Test Updates

### 6.1 Update Test Fixtures
**File**: `__tests__/fixtures/system-data.ts`
**Action**: Rename file to `maintainable-data.ts` and update content

### 6.2 Update Test Files
**Files**: All test files referencing "systems"
**Action**: Update test descriptions and variable names

## Phase 7: Documentation Updates

### 7.1 Update README
**File**: `README.md`
**Action**: Update any references to "systems" in documentation

### 7.2 Update Cursor Rules
**File**: `.cursorrules`
**Action**: Update any "systems" references in project rules

## Implementation Order

1. **Database changes first** (Phase 1)
2. **API route cleanup** (Phase 2)
3. **Frontend route updates** (Phase 3)
4. **Component updates** (Phase 4)
5. **Schema updates** (Phase 5)
6. **Test updates** (Phase 6)
7. **Documentation updates** (Phase 7)

## Rollback Plan

If issues arise during migration:
1. Keep legacy `systems` table as backup
2. Maintain both API routes temporarily
3. Use feature flags to switch between old/new implementations
4. Have database migration scripts ready for rollback

## Testing Checklist

- [ ] Database queries work with new table structure
- [ ] API endpoints return correct data
- [ ] Frontend components display correctly
- [ ] Navigation works properly
- [ ] Forms submit to correct endpoints
- [ ] Error handling works as expected
- [ ] All tests pass
- [ ] No console errors in browser
- [ ] No TypeScript compilation errors 