import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Maintainable } from '@/types/maintainable.types';
import { handleApiResponse } from '@/lib/api-client-helpers';

// Fetch all maintainables for a given property id
const fetchMaintainables = async (propertyId: string): Promise<Maintainable[]> => {
  const res = await fetch(`/api/maintainables/${propertyId}`);
  return handleApiResponse<Maintainable[]>(res);
};

// React-Query hook for list of maintainables for a property
export function useMaintainables(propertyId: string) {
  return useQuery({
    queryKey: ['maintainables', propertyId],
    queryFn: () => fetchMaintainables(propertyId),
  });
}

// React-Query hook for a single maintainable by id
export function useMaintainable(id: string) {
  return useQuery({
    queryKey: ['maintainables', id],
    queryFn: async () => {
      const res = await fetch(`/api/maintainable/${id}`);
      return handleApiResponse<Maintainable>(res);
    },
    enabled: !!id,
  });
}

// --- Mutations -------------------------------------------------------------

export function useCreateMaintainable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Maintainable>) => {
      const res = await fetch('/api/maintainables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse<Maintainable>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintainables'] });
    },
  });
}

export function useUpdateMaintainable() {
  const queryClient = useQueryClient();
  return useMutation<Maintainable, Error, { id: string; data: Partial<Maintainable> }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/maintainable/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse<Maintainable>(res);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['maintainables'] });
      queryClient.invalidateQueries({ queryKey: ['maintainables', variables.id] });
    },
  });
}

export function useDeleteMaintainable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/maintainable/${id}`, { method: 'DELETE' });
      return handleApiResponse(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintainables'] });
    },
  });
}
