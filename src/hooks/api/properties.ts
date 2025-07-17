import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property, PropertyInsert, PropertyUpdate } from '@/types/property.types';

const fetchProperties = async (): Promise<Property[]> => {
  const res = await fetch('/api/properties');
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
};

export function useProperties() {
  return useQuery({ queryKey: ['properties'], queryFn: fetchProperties });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await fetch(`/api/property/${id}`);
      if (!res.ok) throw new Error('Failed to fetch property');
      return res.json();
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
      if (!res.ok) throw new Error('Failed to create property');
      const result = await res.json();
      return Array.isArray(result) ? result[0] : result;
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
      if (!res.ok) throw new Error('Failed to delete property');
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
      if (!res.ok) throw new Error('Failed to update property');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
