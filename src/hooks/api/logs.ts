// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaintenanceLogEntry } from '@/types/maintenance';

const fetchLogs = async (): Promise<MaintenanceLogEntry[]> => {
  const res = await fetch('/api/logs');
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
};

export function useLogs() {
  return useQuery({ queryKey: ['logs'], queryFn: fetchLogs });
}

export function useLog(id: string | undefined) {
  return useQuery({
    queryKey: ['logs', id],
    queryFn: async () => {
      const res = await fetch(`/api/log/${id}`);
      if (!res.ok) throw new Error('Failed to fetch log');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation<MaintenanceLogEntry, Error, { id: string; data: Partial<MaintenanceLogEntry> | undefined }>({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MaintenanceLogEntry> | undefined }) => {
      const res = await fetch(`/api/log/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data ?? {}),
      });
      if (!res.ok) throw new Error('Failed to create log');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useUpdateLog() {
  const queryClient = useQueryClient();
  return useMutation<MaintenanceLogEntry, Error, { id: string; data: Partial<MaintenanceLogEntry> }>({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MaintenanceLogEntry> }) => {
      const res = await fetch(`/api/log/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update log');
      return res.json();
    },
    onSuccess: (_data: MaintenanceLogEntry, variables: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['logs', variables.id] });
    },
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/log/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete log');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}