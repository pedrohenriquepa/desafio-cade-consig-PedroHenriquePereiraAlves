// Tipos de autenticação
export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
}

// Tipos de contratos
export type TipoPlano = 'Basico' | 'Pro' | 'Enterprise';
export type StatusContrato = 'Ativo' | 'Inativo';

export interface Contrato {
  id_contrato: string;
  nome_cliente: string;
  email_cliente: string;
  tipo_plano: 'BASICO' | 'PRO' | 'ENTERPRISE';
  valor_mensal: string;
  status: 'ATIVO' | 'INATIVO';
  data_inicio: string;
  created_at: string;
  updated_at: string;
}

export interface ContratosFilters {
  id_contrato?: string;
  nome_cliente?: string;
  email_cliente?: string;
  tipo_plano?: string;
  status?: string;
  valor_mensal?: string;
  data_inicio?: string;
  page?: number;
  limit?: number;
}

export interface ContratosResponse {
  items: Contrato[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadResponse {
  inserted: number;
  updated: number;
  ignored: number;
  total: number;
}

export interface UploadPreviewItem {
  nome: string;
  email: string;
  motivo?: string;
}

export interface UploadPreviewResponse {
  total: number;
  novos: number;
  existentes: number;
  atualizacoes: number;
  detalhes: {
    novos: UploadPreviewItem[];
    existentes: UploadPreviewItem[];
    atualizacoes: UploadPreviewItem[];
  };
}

// Tipos de erro da API
export interface ApiError {
  message: string;
  errors?: string[];
  statusCode?: number;
}

// Tipos de estatísticas
export interface Estatisticas {
  totalClientes: number;
  contratosAtivos: number;
  contratosInativos: number;
  porPlano: {
    basico: number;
    pro: number;
    enterprise: number;
  };
  valorMensalAtivos: number;
  valorMensalInativos: number;
  valorPorPlano: {
    basico: number;
    pro: number;
    enterprise: number;
  };
}
