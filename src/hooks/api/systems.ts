import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Maintainable } from '@/types/maintainables.types';

const fetchSystems = async (pId: string): Promise<Maintainable[]> => {
  const res = await fetch(`/api/systems/${pId}`);
  if (!res.ok) throw new Error('Failed to fetch systems');
  return res.json();
};

export function useSystems(pId: string) {
  return useQuery({ queryKey: ['systems', pId], queryFn: () => fetchSystems(pId) });
}

export function useSystem(id: string) {
  return useQuery({
    queryKey: ['systems', id],
    queryFn: async () => {
      const res = await fetch(`/api/system/${id}`);
      if (!res.ok) throw new Error('Failed to fetch system');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Maintainable>) => {
      const res = await fetch('/api/systems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create system');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
    },
  });
}

export function useUpdateSystem() {
  const queryClient = useQueryClient();
  return useMutation<Maintainable, Error, { id: string; data: Partial<Maintainable> }>({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Maintainable> }) => {
      const res = await fetch(`/api/systems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update system');
      return res.json();
    },
    onSuccess: (_data: Maintainable, variables: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
      queryClient.invalidateQueries({ queryKey: ['systems', variables.id] });
    },
  });
}

export function useDeleteSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/systems/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete system');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
    },
  });
}
