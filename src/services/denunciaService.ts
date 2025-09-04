import { apiService } from './api';

// Serviço para gerenciar denúncias reais dos usuários
export interface Denuncia {
  id: string;
  idPublico: string; // ID no formato data + sequencial
  tipoViolencia: string;
  dataOcorrido: string;
  localizacao: {
    cidade?: string;
    estado?: string;
    bairro?: string;
  };
  relato: string;
  status: 'pendente' | 'analisando' | 'resolvido' | 'arquivado';
  dataCriacao: string;
  evidencias?: Evidencia[];
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
  observacoes?: string;
}

export interface Evidencia {
  id: string;
  nome: string;
  tipo: 'image' | 'audio';
  dados: string; // base64
  tamanho: number;
}

// Interface para dados de entrada da denúncia
export interface DenunciaInput {
  relato: string;
  tipoViolencia: string;
  dataOcorrido: string;
  localizacao: {
    cidade?: string;
    estado?: string;
    bairro?: string;
  };
  evidencias?: File[];
}

class DenunciaService {


  // Salvar nova denúncia
  async criarDenuncia(denunciaData: DenunciaInput): Promise<Denuncia> {
    try {
      const response = await apiService.criarDenuncia(denunciaData);
      return response.denuncia;
    } catch (error) {
      console.error('Erro ao criar denúncia:', error);
      throw error;
    }
  }

  // Buscar todas as denúncias
  async getDenuncias(): Promise<Denuncia[]> {
    try {
      const response = await apiService.request('/denuncias');
      return response.denuncias || [];
    } catch (error) {
      console.error('Erro ao buscar denúncias:', error);
      return [];
    }
  }

  // Buscar denúncia por ID público
  async getDenunciaByIdPublico(idPublico: string): Promise<Denuncia | null> {
    try {
      const response = await apiService.consultarDenuncia(idPublico);
      return response.denuncia || null;
    } catch (error) {
      console.error('Erro ao buscar denúncia por ID público:', error);
      return null;
    }
  }

  // Buscar denúncia por ID
  async getDenunciaById(id: string): Promise<Denuncia | null> {
    try {
      const response = await apiService.request(`/denuncias/id/${id}`);
      return response.denuncia || null;
    } catch (error) {
      console.error('Erro ao buscar denúncia por ID:', error);
      return null;
    }
  }

  // Atualizar status de uma denúncia
  async atualizarStatus(id: string, novoStatus: Denuncia['status'], observacoes?: string): Promise<Denuncia> {
    try {
      const response = await apiService.request(`/denuncias/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: novoStatus, observacoes })
      });
      return response.denuncia;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  // Atualizar prioridade de uma denúncia
  async atualizarPrioridade(id: string, novaPrioridade: Denuncia['prioridade']): Promise<Denuncia> {
    try {
      const response = await apiService.request(`/denuncias/${id}/prioridade`, {
        method: 'PUT',
        body: JSON.stringify({ prioridade: novaPrioridade })
      });
      return response.denuncia;
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error);
      throw error;
    }
  }

  // Salvar apenas observações (sem mudar status)
  async salvarObservacoes(id: string, observacoes: string): Promise<Denuncia> {
    try {
      const response = await apiService.request(`/denuncias/${id}/observacoes`, {
        method: 'PUT',
        body: JSON.stringify({ observacoes })
      });
      return response.denuncia;
    } catch (error) {
      console.error('Erro ao salvar observações:', error);
      throw error;
    }
  }

  // Filtrar denúncias
  async filtrarDenuncias(filtros: {
    status?: Denuncia['status'];
    tipoViolencia?: string;
    dataInicio?: string;
    dataFim?: string;
    prioridade?: Denuncia['prioridade'];
    busca?: string;
  }): Promise<Denuncia[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filtros.status) queryParams.append('status', filtros.status);
      if (filtros.tipoViolencia) queryParams.append('tipoViolencia', filtros.tipoViolencia);
      if (filtros.prioridade) queryParams.append('prioridade', filtros.prioridade);
      if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim);
      if (filtros.busca) queryParams.append('busca', filtros.busca);

      const response = await apiService.request(`/denuncias/filter?${queryParams.toString()}`);
      return response.denuncias || [];
    } catch (error) {
      console.error('Erro ao filtrar denúncias:', error);
      return [];
    }
  }

  // Obter estatísticas
  async getEstatisticas(): Promise<{
    total: number;
    porStatus: Record<Denuncia['status'], number>;
    porTipo: Record<string, number>;
    porPrioridade: Record<Denuncia['prioridade'], number>;
    recentes: number; // últimas 24h
  }> {
    try {
      const response = await apiService.getEstatisticas();
      return response.estatisticas || {
        total: 0,
        porStatus: { pendente: 0, analisando: 0, resolvido: 0, arquivado: 0 },
        porTipo: {},
        porPrioridade: { baixa: 0, media: 0, alta: 0, urgente: 0 },
        recentes: 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total: 0,
        porStatus: { pendente: 0, analisando: 0, resolvido: 0, arquivado: 0 },
        porTipo: {},
        porPrioridade: { baixa: 0, media: 0, alta: 0, urgente: 0 },
        recentes: 0
      };
    }
  }

  // Exportar denúncias (para relatórios)
  async exportarDenuncias(formato: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const response = await apiService.request(`/denuncias/export?formato=${formato}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar denúncias:', error);
      throw error;
    }
  }
}

export const denunciaService = new DenunciaService();
