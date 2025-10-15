// Detectar se está rodando no mobile (Capacitor)
const isMobile = typeof window !== 'undefined' && window.location.protocol === 'https:';

// Mobile usa backend de produção, Web usa localhost
const API_BASE_URL = isMobile 
  ? 'https://sos-voz-feminina-backend.onrender.com/api'  // Mobile - backend de produção
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api'); // Web

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obter token do localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Obter token de autenticação
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    // Só adicionar Content-Type se não for FormData
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Adicionar token de autenticação se disponível
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Denúncias
  async criarDenuncia(denunciaData) {
    const formData = new FormData();
    
    // Adicionar dados básicos
    formData.append('relato', denunciaData.relato);
    formData.append('tipoViolencia', denunciaData.tipoViolencia);
    formData.append('dataOcorrido', denunciaData.dataOcorrido);
    
    if (denunciaData.localizacao) {
      if (denunciaData.localizacao?.cidade) {
        formData.append('localizacao[cidade]', denunciaData.localizacao.cidade);
      }
      if (denunciaData.localizacao?.estado) {
        formData.append('localizacao[estado]', denunciaData.localizacao.estado);
      }
      if (denunciaData.localizacao?.bairro) {
        formData.append('localizacao[bairro]', denunciaData.localizacao.bairro);
      }
    }
    
    // Adicionar arquivos
    if (denunciaData.evidencias) {
      denunciaData.evidencias.forEach((arquivo, index) => {
        formData.append('evidencias', arquivo);
      });
    }

    return this.request('/denuncias', {
      method: 'POST',
      body: formData,
      headers: {}, // Remover Content-Type para FormData
    });
  }

  async consultarDenuncia(hash) {
    return this.request(`/denuncias/public/${hash}`);
  }

  async atualizarDenuncia(hash, dados) {
    return this.request(`/denuncias/${hash}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  }

  async getEstatisticas() {
    return this.request('/denuncias/stats/estatisticas');
  }

  // Contatos
  async getContatos() {
    return this.request('/contatos');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
