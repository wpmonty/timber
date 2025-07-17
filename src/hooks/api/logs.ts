import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaintenanceLogEntry } from '@/types/maintenance.types';
import { handleApiResponse, handleApiResponseWithData } from '@/lib/api-client-helpers';

const fetchLogs = async (pId: string): Promise<MaintenanceLogEntry[]> => {
  const res = await fetch(`/api/logs/${pId}`);
  return handleApiResponseWithData<MaintenanceLogEntry[]>(res);
};

export function useLogs(id: string) {
  return useQuery({ queryKey: ['logs', id], queryFn: () => fetchLogs(id) });
}

export function useLog(id: string | undefined) {
  return useQuery({
    queryKey: ['logs', id],
    queryFn: async () => {
      const res = await fetch(`/api/log/${id}`);
      return handleApiResponseWithData<MaintenanceLogEntry>(res);
    },
    enabled: !!id,
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation<
    MaintenanceLogEntry,
    Error,
    { id: string; data: Partial<MaintenanceLogEntry> | undefined }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MaintenanceLogEntry> | undefined;
    }) => {
      const res = await fetch(`/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data ?? {}),
      });
      return handleApiResponseWithData<MaintenanceLogEntry>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useUpdateLog() {
  const queryClient = useQueryClient();
  return useMutation<
    MaintenanceLogEntry,
    Error,
    { id: string; data: Partial<MaintenanceLogEntry> }
  >({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MaintenanceLogEntry> }) => {
      const res = await fetch(`/api/log/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponseWithData<MaintenanceLogEntry>(res);
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
      return handleApiResponse(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}
