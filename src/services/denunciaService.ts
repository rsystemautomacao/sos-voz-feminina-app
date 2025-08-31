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
  private readonly STORAGE_KEY = 'denuncias_usuarios';
  private readonly SEQUENTIAL_KEY = 'denuncia_sequential';

  // Converter arquivo para base64
  private async fileToBase64(file: File): Promise<Evidencia> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const evidencia: Evidencia = {
          id: this.generateId(),
          nome: file.name,
          tipo: file.type.startsWith('image/') ? 'image' : 'audio',
          dados: reader.result as string,
          tamanho: file.size
        };
        resolve(evidencia);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Gerar ID público no formato data + sequencial
  private generatePublicId(): string {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear().toString().slice(-2); // Últimos 2 dígitos do ano
    
    // Obter próximo número sequencial
    const nextSequential = this.getNextSequential();
    
    return `${dia}${mes}${ano}${nextSequential}`;
  }

  // Obter próximo número sequencial
  private getNextSequential(): string {
    const currentSequential = localStorage.getItem(this.SEQUENTIAL_KEY);
    const nextNumber = currentSequential ? parseInt(currentSequential) + 1 : 1000;
    localStorage.setItem(this.SEQUENTIAL_KEY, nextNumber.toString());
    return nextNumber.toString();
  }

  // Salvar nova denúncia
  async criarDenuncia(denunciaData: DenunciaInput): Promise<Denuncia> {
    // Converter arquivos para base64
    const evidencias: Evidencia[] = [];
    if (denunciaData.evidencias && denunciaData.evidencias.length > 0) {
      for (const file of denunciaData.evidencias) {
        const evidencia = await this.fileToBase64(file);
        evidencias.push(evidencia);
      }
    }

    const novaDenuncia: Denuncia = {
      ...denunciaData,
      id: this.generateId(),
      idPublico: this.generatePublicId(),
      dataCriacao: new Date().toISOString(),
      status: 'pendente',
      prioridade: this.calcularPrioridade(denunciaData.tipoViolencia),
      evidencias
    };

    const denuncias = this.getDenunciasFromStorage();
    denuncias.push(novaDenuncia);
    this.saveDenuncias(denuncias);

    return novaDenuncia;
  }

  // Buscar todas as denúncias
  async getDenuncias(): Promise<Denuncia[]> {
    return this.getDenunciasFromStorage();
  }

  // Buscar denúncia por ID público
  async getDenunciaByIdPublico(idPublico: string): Promise<Denuncia | null> {
    const denuncias = this.getDenunciasFromStorage();
    return denuncias.find(d => d.idPublico === idPublico) || null;
  }

  // Buscar denúncia por ID
  async getDenunciaById(id: string): Promise<Denuncia | null> {
    const denuncias = this.getDenunciasFromStorage();
    return denuncias.find(d => d.id === id) || null;
  }

  // Atualizar status de uma denúncia
  async atualizarStatus(id: string, novoStatus: Denuncia['status'], observacoes?: string): Promise<Denuncia> {
    const denuncias = this.getDenunciasFromStorage();
    const index = denuncias.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Denúncia não encontrada');
    }

    denuncias[index] = {
      ...denuncias[index],
      status: novoStatus,
      observacoes: observacoes || denuncias[index].observacoes
    };

    this.saveDenuncias(denuncias);
    return denuncias[index];
  }

  // Atualizar prioridade de uma denúncia
  async atualizarPrioridade(id: string, novaPrioridade: Denuncia['prioridade']): Promise<Denuncia> {
    const denuncias = this.getDenunciasFromStorage();
    const index = denuncias.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Denúncia não encontrada');
    }

    denuncias[index] = {
      ...denuncias[index],
      prioridade: novaPrioridade
    };

    this.saveDenuncias(denuncias);
    return denuncias[index];
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
    let denuncias = this.getDenunciasFromStorage();

    if (filtros.status) {
      denuncias = denuncias.filter(d => d.status === filtros.status);
    }

    if (filtros.tipoViolencia) {
      denuncias = denuncias.filter(d => d.tipoViolencia === filtros.tipoViolencia);
    }

    if (filtros.prioridade) {
      denuncias = denuncias.filter(d => d.prioridade === filtros.prioridade);
    }

    if (filtros.dataInicio) {
      denuncias = denuncias.filter(d => d.dataCriacao >= filtros.dataInicio!);
    }

    if (filtros.dataFim) {
      denuncias = denuncias.filter(d => d.dataCriacao <= filtros.dataFim!);
    }

    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase();
      denuncias = denuncias.filter(d => 
        d.relato.toLowerCase().includes(termo) ||
        d.tipoViolencia.toLowerCase().includes(termo) ||
        d.localizacao.cidade?.toLowerCase().includes(termo) ||
        d.localizacao.estado?.toLowerCase().includes(termo) ||
        d.idPublico.includes(termo)
      );
    }

    return denuncias;
  }

  // Obter estatísticas
  async getEstatisticas(): Promise<{
    total: number;
    porStatus: Record<Denuncia['status'], number>;
    porTipo: Record<string, number>;
    porPrioridade: Record<Denuncia['prioridade'], number>;
    recentes: number; // últimas 24h
  }> {
    const denuncias = this.getDenunciasFromStorage();
    const agora = new Date();
    const vinteQuatroHorasAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

    const estatisticas = {
      total: denuncias.length,
      porStatus: {
        pendente: 0,
        analisando: 0,
        resolvido: 0,
        arquivado: 0
      },
      porTipo: {} as Record<string, number>,
      porPrioridade: {
        baixa: 0,
        media: 0,
        alta: 0,
        urgente: 0
      },
      recentes: 0
    };

    denuncias.forEach(denuncia => {
      // Contar por status
      estatisticas.porStatus[denuncia.status]++;

      // Contar por tipo
      estatisticas.porTipo[denuncia.tipoViolencia] = 
        (estatisticas.porTipo[denuncia.tipoViolencia] || 0) + 1;

      // Contar por prioridade
      if (denuncia.prioridade) {
        estatisticas.porPrioridade[denuncia.prioridade]++;
      }

      // Contar recentes (últimas 24h)
      const dataCriacao = new Date(denuncia.dataCriacao);
      if (dataCriacao >= vinteQuatroHorasAtras) {
        estatisticas.recentes++;
      }
    });

    return estatisticas;
  }

  // Exportar denúncias (para relatórios)
  async exportarDenuncias(formato: 'json' | 'csv' = 'json'): Promise<string> {
    const denuncias = this.getDenunciasFromStorage();
    
    if (formato === 'json') {
      return JSON.stringify(denuncias, null, 2);
    } else {
      // CSV básico
      const headers = ['ID Público', 'Tipo', 'Data Ocorrido', 'Cidade', 'Estado', 'Status', 'Prioridade', 'Data Criação'];
      const rows = denuncias.map(d => [
        d.idPublico,
        d.tipoViolencia,
        d.dataOcorrido,
        d.localizacao.cidade || '',
        d.localizacao.estado || '',
        d.status,
        d.prioridade || '',
        d.dataCriacao
      ]);
      
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
  }

  // Métodos privados
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private calcularPrioridade(tipoViolencia: string): Denuncia['prioridade'] {
    const prioridades: Record<string, Denuncia['prioridade']> = {
      'fisica': 'urgente',
      'sexual': 'urgente',
      'psicologica': 'alta',
      'economica': 'media',
      'moral': 'media',
      'patrimonial': 'baixa',
      'outros': 'baixa'
    };

    return prioridades[tipoViolencia] || 'media';
  }

  private getDenunciasFromStorage(): Denuncia[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar denúncias:', error);
      return [];
    }
  }

  private saveDenuncias(denuncias: Denuncia[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(denuncias));
    } catch (error) {
      console.error('Erro ao salvar denúncias:', error);
    }
  }
}

export const denunciaService = new DenunciaService();
