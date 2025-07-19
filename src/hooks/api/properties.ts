import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property, PropertyInsert, PropertyUpdate } from '@/types/property.types';
import { handleApiResponse } from '@/lib/api-client-helpers';

const fetchProperties = async (): Promise<Property[]> => {
  const res = await fetch('/api/properties');
  return handleApiResponse<Property[]>(res);
};

export function useProperties() {
  return useQuery({ queryKey: ['properties'], queryFn: fetchProperties });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await fetch(`/api/property/${id}`);
      return handleApiResponse<Property>(res);
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, PropertyInsert>({
    mutationFn: async (data: PropertyInsert) => {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse<Property>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/property/${id}`, {
        method: 'DELETE',
      });
      await handleApiResponse<void>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, { id: string; data: PropertyUpdate }>({
    mutationFn: async ({ id, data }: { id: string; data: PropertyUpdate }) => {
      const res = await fetch(`/api/property/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse<Property>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
