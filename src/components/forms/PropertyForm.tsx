'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useEffect } from 'react';

import {
  PropertyDataSchema,
  PROPERTY_TYPES,
  COMMON_AREA_TYPES,
  formatAreaType,
} from '@/lib/schemas/property.schema';
import { PropertyData } from '@/types/property.types';

import { Input } from '@/components/forms/fields/Input';
import { Select } from '@/components/forms/fields/Select';
import { Textarea } from '@/components/forms/fields/Textarea';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/fields/FormField';

export interface PropertyFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<PropertyData>;
  onSubmit: (data: PropertyData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Helper function to safely get error message
const getErrorMessage = (error: any): string | undefined => {
  return error?.message || undefined;
};

export function PropertyForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PropertyData>({
    resolver: zodResolver(PropertyDataSchema),
    defaultValues: {
      label: '',
      address: {
        line1: '',
        city: '',
        state: '',
        zip: '',
      },
      property_type: 'SFH',
      areas: [{ type: 'bedroom', quantity: 1 }],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'areas',
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        label: '',
        address: {
          line1: '',
          city: '',
          state: '',
          zip: '',
        },
        property_type: 'SFH',
        areas: [{ type: 'bedroom', quantity: 1 }],
        ...initialData,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: PropertyData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addArea = () => {
    append({ type: 'bedroom', quantity: 1 });
  };

  const removeArea = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Property' : 'Edit Property'}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === 'create'
              ? 'Add a new property to start tracking maintenance and systems.'
              : 'Update your property information.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Property Name"
                error={getErrorMessage(errors.label)}
                htmlFor="label"
                description="A friendly name for this property"
              >
                <Input
                  id="label"
                  {...register('label')}
                  placeholder="e.g., Main Residence, Rental Property"
                  error={!!errors.label}
                />
              </FormField>

              <FormField
                label="Property Type"
                error={getErrorMessage(errors.property_type)}
                htmlFor="property_type"
                required
              >
                <Select
                  id="property_type"
                  {...register('property_type')}
                  error={!!errors.property_type}
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </section>

          {/* Address Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
            <div className="space-y-4">
              <FormField
                label="Street Address"
                error={getErrorMessage(errors.address?.line1)}
                htmlFor="address.line1"
                required
              >
                <Input
                  id="address.line1"
                  {...register('address.line1')}
                  placeholder="123 Main Street"
                  error={!!errors.address?.line1}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="City"
                  error={getErrorMessage(errors.address?.city)}
                  htmlFor="address.city"
                  required
                >
                  <Input
                    id="address.city"
                    {...register('address.city')}
                    placeholder="City"
                    error={!!errors.address?.city}
                  />
                </FormField>

                <FormField
                  label="State"
                  error={getErrorMessage(errors.address?.state)}
                  htmlFor="address.state"
                  required
                >
                  <Input
                    id="address.state"
                    {...register('address.state')}
                    placeholder="State"
                    error={!!errors.address?.state}
                  />
                </FormField>

                <FormField
                  label="ZIP Code"
                  error={getErrorMessage(errors.address?.zip)}
                  htmlFor="address.zip"
                  required
                >
                  <Input
                    id="address.zip"
                    {...register('address.zip')}
                    placeholder="12345"
                    error={!!errors.address?.zip}
                  />
                </FormField>
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField label="Square Footage" error={getErrorMessage(errors.sqft)} htmlFor="sqft">
                <Input
                  id="sqft"
                  type="number"
                  {...register('sqft', { valueAsNumber: true })}
                  placeholder="2000"
                  error={!!errors.sqft}
                />
              </FormField>

              <FormField
                label="Lot Size (sq ft)"
                error={getErrorMessage(errors.lot_size_sqft)}
                htmlFor="lot_size_sqft"
              >
                <Input
                  id="lot_size_sqft"
                  type="number"
                  {...register('lot_size_sqft', { valueAsNumber: true })}
                  placeholder="8000"
                  error={!!errors.lot_size_sqft}
                />
              </FormField>

              <FormField label="Stories" error={getErrorMessage(errors.stories)} htmlFor="stories">
                <Input
                  id="stories"
                  type="number"
                  {...register('stories', { valueAsNumber: true })}
                  placeholder="2"
                  error={!!errors.stories}
                />
              </FormField>

              <FormField
                label="Year Built"
                error={getErrorMessage(errors.year_built)}
                htmlFor="year_built"
              >
                <Input
                  id="year_built"
                  type="number"
                  {...register('year_built', { valueAsNumber: true })}
                  placeholder="2005"
                  error={!!errors.year_built}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField
                label="Zoning Type"
                error={getErrorMessage(errors.zoning_type)}
                htmlFor="zoning_type"
              >
                <Input
                  id="zoning_type"
                  {...register('zoning_type')}
                  placeholder="e.g., R-1, Commercial, etc."
                  error={!!errors.zoning_type}
                />
              </FormField>
            </div>
          </section>

          {/* Areas/Rooms */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Areas & Rooms</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addArea}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Area
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4">
                  <div className="flex-1">
                    <FormField
                      label={index === 0 ? 'Area Type' : ''}
                      error={getErrorMessage(errors.areas?.[index]?.type)}
                    >
                      <Select
                        {...register(`areas.${index}.type` as const)}
                        error={!!errors.areas?.[index]?.type}
                      >
                        {COMMON_AREA_TYPES.map(type => (
                          <option key={type} value={type}>
                            {formatAreaType(type)}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  </div>

                  <div className="w-24">
                    <FormField
                      label={index === 0 ? 'Quantity' : ''}
                      error={getErrorMessage(errors.areas?.[index]?.quantity)}
                    >
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        {...register(`areas.${index}.quantity` as const, {
                          valueAsNumber: true,
                        })}
                        error={!!errors.areas?.[index]?.quantity}
                      />
                    </FormField>
                  </div>

                  <div className="pb-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArea(index)}
                      disabled={fields.length === 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section>
            <FormField
              label="Notes"
              error={getErrorMessage(errors.notes)}
              htmlFor="notes"
              description="Any additional information about this property"
            >
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes about the property..."
                rows={4}
                error={!!errors.notes}
              />
            </FormField>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              isLoading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            >
              {mode === 'create' ? 'Create Property' : 'Update Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
