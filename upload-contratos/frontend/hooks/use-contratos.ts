import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ContratosFilters, ContratosResponse, UploadResponse, UploadPreviewResponse, Contrato, Estatisticas } from '@/lib/types';

// Hook para listar contratos
export function useContratos(filters: ContratosFilters) {
  return useQuery<ContratosResponse>({
    queryKey: ['contratos', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get<ContratosResponse>(`/contratos?${params.toString()}`);
      return response.data;
    },
  });
}

// Hook para estatísticas
export function useEstatisticas() {
  return useQuery<Estatisticas>({
    queryKey: ['estatisticas'],
    queryFn: async () => {
      const response = await api.get<Estatisticas>('/contratos/estatisticas');
      return response.data;
    },
  });
}

// Hook para preview de CSV
export function usePreviewCsv() {
  return useMutation<UploadPreviewResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<UploadPreviewResponse>('/contratos/upload/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
}

// Hook para upload de CSV
export function useUploadCsv() {
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<UploadResponse>('/contratos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
    },
  });
}

// Hook para atualizar status do contrato
export function useUpdateContratoStatus() {
  const queryClient = useQueryClient();

  return useMutation<Contrato, Error, { id: string; status: string }>({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch<Contrato>(`/contratos/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
    },
  });
}

// Hook para excluir contrato
export function useDeleteContrato() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(`/contratos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
    },
  });
}
