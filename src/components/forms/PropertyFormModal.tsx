'use client';

import { PropertyForm } from './PropertyForm';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { PropertyData, PropertyInsert } from '@/types/property.types';
import { useCreateProperty, useUpdateProperty } from '@/hooks/api/properties';
import { useAuth } from '@/hooks/useAuth';

const composeAddress = (data: PropertyData) => {
  return `${data.address.line1}, ${data.address.city}, ${data.address.state} ${data.address.zip}`;
};

export interface PropertyFormModalProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<PropertyData>;
  propertyId?: string; // Required for edit mode
}

export function PropertyFormModal({
  mode,
  open,
  onOpenChange,
  initialData,
  propertyId,
}: PropertyFormModalProps) {
  const { user } = useAuth();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  const handleSubmit = async (data: PropertyData) => {
    try {
      if (mode === 'create') {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        const propertyToCreate: PropertyInsert = {
          owner_id: user.id,
          address: composeAddress(data),
          data,
        };

        await createProperty.mutateAsync(propertyToCreate);
      } else if (mode === 'edit' && propertyId) {
        await updateProperty.mutateAsync({
          id: propertyId,
          data: {
            address: composeAddress(data),
            data,
            updated_at: new Date().toISOString(),
          },
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting property:', error);
      // TODO: Show user-friendly error message
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-4xl">
        <PropertyForm
          mode={mode}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createProperty.isPending || updateProperty.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
