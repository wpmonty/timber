'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/fields/Input';
import { Select } from '@/components/forms/fields/Select';
import { Textarea } from '@/components/forms/fields/Textarea';
import { FormField } from '@/components/forms/fields/FormField';
import { getMaintainableDataSchema } from '@/lib/maintainable-registry';
import { MaintainableData, MaintainableTypeType } from '@/types/maintainable.types';

interface MaintainableFormProps {
  type: MaintainableTypeType;
  subtype: string;
  onSubmit: (data: MaintainableData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Base schema for all maintainables
const baseSchema = z.object({
  label: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  location: z.string().optional(),
  condition: z.enum(['good', 'fair', 'poor', 'critical']).optional(),
  tags: z.string().optional(), // Will be converted to array
  installDate: z.string().optional(),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof baseSchema>;

export function MaintainableForm({
  type,
  subtype,
  onSubmit,
  onCancel,
  isLoading = false,
}: MaintainableFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      condition: 'good',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Convert tags string to array
      const tags = data.tags
        ? data.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        : [];

      // Build the maintainable data object
      const maintainableData: MaintainableData = {
        type,
        subtype,
        label: data.label,
        location: data.location,
        condition: data.condition,
        tags,
        metadata: {
          installDate: data.installDate,
          serialNumber: data.serialNumber,
          model: data.model,
          manufacturer: data.manufacturer,
          notes: data.notes,
        },
      };

      await onSubmit(maintainableData);
    } catch (error) {
      console.error('Error creating maintainable:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionOptions = [
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide the essential details about your {subtype.replace(/-/g, ' ')}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Name" error={errors.label?.message} required>
            <Input
              placeholder="e.g., Kitchen Refrigerator, Living Room TV"
              {...register('label')}
            />
          </FormField>

          <FormField label="Location" error={errors.location?.message}>
            <Input placeholder="e.g., Kitchen, Basement, Garage" {...register('location')} />
          </FormField>

          <FormField label="Condition" error={errors.condition?.message}>
            <Select {...register('condition')}>
              {conditionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Tags" error={errors.tags?.message}>
            <Input
              placeholder="e.g., kitchen, smart, energy-efficient (comma separated)"
              {...register('tags')}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manufacturer Details</CardTitle>
          <CardDescription>
            Help us provide better maintenance recommendations with manufacturer information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Manufacturer" error={errors.manufacturer?.message}>
            <Input placeholder="e.g., Samsung, LG, Whirlpool" {...register('manufacturer')} />
          </FormField>

          <FormField label="Model" error={errors.model?.message}>
            <Input placeholder="e.g., WF45R6100AW, LFXS28566S" {...register('model')} />
          </FormField>

          <FormField label="Serial Number" error={errors.serialNumber?.message}>
            <Input
              placeholder="Enter the serial number if available"
              {...register('serialNumber')}
            />
          </FormField>

          <FormField label="Installation Date" error={errors.installDate?.message}>
            <Input type="date" {...register('installDate')} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>
            Any additional information that might be helpful for maintenance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField label="Notes" error={errors.notes?.message}>
            <Textarea
              placeholder="e.g., Previous repairs, warranty information, special instructions..."
              {...register('notes')}
              rows={4}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? 'Creating...' : 'Create Maintainable'}
        </Button>
      </div>
    </form>
  );
}
