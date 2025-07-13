import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyData } from '@/types/property.types';

const fetchProperties = async (): Promise<PropertyData[]> => {
  const res = await fetch('/api/properties');
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
};

export function useProperties() {
  return useQuery({ queryKey: ['properties'], queryFn: fetchProperties });
}

export function useProperty(id: string | undefined) {
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

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation<PropertyData, Error, { id: string; data: Partial<PropertyData> }>({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyData> }) => {
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