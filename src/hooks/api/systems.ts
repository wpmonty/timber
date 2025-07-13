import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaintainableData } from '@/types/maintainables.types';

const fetchSystems = async (): Promise<MaintainableData[]> => {
  const res = await fetch('/api/systems');
  if (!res.ok) throw new Error('Failed to fetch systems');
  return res.json();
};

export function useSystems() {
  return useQuery({ queryKey: ['systems'], queryFn: fetchSystems });
}

export function useSystem(id: string | undefined) {
  return useQuery({
    queryKey: ['systems', id],
    queryFn: async () => {
      const res = await fetch(`/api/systems/${id}`);
      if (!res.ok) throw new Error('Failed to fetch system');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<MaintainableData>) => {
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
  return useMutation<MaintainableData, Error, { id: string; data: Partial<MaintainableData> }>({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MaintainableData> }) => {
      const res = await fetch(`/api/systems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update system');
      return res.json();
    },
    onSuccess: (_data: MaintainableData, variables: { id: string }) => {
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
