import { Denuncia } from './denunciaService';
import { apiService } from './api';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface AdminInvite {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  createdBy: string;
  isUsed: boolean;
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
  denunciaId?: string;
  ipAddress?: string;
}

export interface AdminAction {
  type: 'CREATE_DENUNCIA' | 'UPDATE_STATUS' | 'UPDATE_PRIORITY' | 'ADD_OBSERVATION' | 'EXPORT_DATA' | 'INVITE_USER' | 'LOGIN' | 'LOGOUT';
  details: string;
  denunciaId?: string;
}

export interface PasswordReset {
  id: string;
  userEmail: string;
  token: string;
  expiresAt: string;
  createdBy: string;
  isUsed: boolean;
}

class AdminService {
  private readonly SUPER_ADMIN_EMAIL = 'sosvozfeminina@administrador.com';

  constructor() {
    // O super admin será inicializado no backend
  }

  // Gestão de Usuários
  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await apiService.request('/admin/users');
      return response.users || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }

  async getUserByEmail(email: string): Promise<AdminUser | null> {
    try {
      const response = await apiService.request(`/admin/users/${encodeURIComponent(email)}`);
      return response.user || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  async updateLastLogin(email: string): Promise<void> {
    try {
      await apiService.request(`/admin/users/${encodeURIComponent(email)}/last-login`, {
        method: 'PUT',
        body: JSON.stringify({ lastLogin: new Date().toISOString() })
      });
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
    }
  }

  // Sistema de Convites
  async createInvite(email: string, createdBy: string): Promise<AdminInvite> {
    try {
      const response = await apiService.request('/admin/invites', {
        method: 'POST',
        body: JSON.stringify({
          email,
          createdBy,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        })
      });
      
      return response.invite;
    } catch (error) {
      console.error('Erro ao criar convite:', error);
      throw error;
    }
  }

  async getInvites(): Promise<AdminInvite[]> {
    try {
      const response = await apiService.request('/admin/invites');
      return response.invites || [];
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      return [];
    }
  }

  async validateInvite(token: string): Promise<AdminInvite | null> {
    try {
      const response = await apiService.request(`/admin/invites/validate/${token}`);
      return response.invite || null;
    } catch (error) {
      console.error('Erro ao validar convite:', error);
      return null;
    }
  }

  async useInvite(token: string, password: string): Promise<AdminUser> {
    try {
      const response = await apiService.request(`/admin/invites/${token}/use`, {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      
      return response.user;
    } catch (error) {
      console.error('Erro ao usar convite:', error);
      throw error;
    }
  }

  // Autenticação
  async authenticate(email: string, password: string): Promise<AdminUser | null> {
    try {
      const response = await apiService.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response.user) {
        await this.updateLastLogin(email);
        await this.logAction(email, 'LOGIN', 'Login realizado com sucesso');
        return response.user;
      }
      
      return null;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null;
    }
  }

  // Logs de Auditoria
  async logAction(adminEmail: string, action: string, details: string, denunciaId?: string): Promise<void> {
    try {
      // Os logs são criados automaticamente pelo backend
      // Este método é mantido para compatibilidade
      console.log('Log action:', { adminEmail, action, details, denunciaId });
    } catch (error) {
      console.error('Erro ao salvar log:', error);
    }
  }

  async getLogs(): Promise<AdminLog[]> {
    try {
      const response = await apiService.request('/admin/logs');
      return response.logs || [];
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return [];
    }
  }

  async getLogsByAdmin(email: string): Promise<AdminLog[]> {
    try {
      const response = await apiService.request(`/admin/logs/admin/${encodeURIComponent(email)}`);
      return response.logs || [];
    } catch (error) {
      console.error('Erro ao buscar logs do admin:', error);
      return [];
    }
  }

  async getLogsByDateRange(startDate: string, endDate: string): Promise<AdminLog[]> {
    try {
      const response = await apiService.request(`/admin/logs/range?start=${startDate}&end=${endDate}`);
      return response.logs || [];
    } catch (error) {
      console.error('Erro ao buscar logs por período:', error);
      return [];
    }
  }

  // Verificações de Permissão
  async isSuperAdmin(email: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(email);
      return user?.role === 'super_admin';
    } catch (error) {
      console.error('Erro ao verificar se é super admin:', error);
      return false;
    }
  }

  async canViewLogs(email: string): Promise<boolean> {
    return await this.isSuperAdmin(email);
  }

  async canInviteUsers(email: string): Promise<boolean> {
    return await this.isSuperAdmin(email);
  }

  // Utilitários
  private getClientIP(): string {
    // Em produção, obter IP real do servidor
    return '127.0.0.1';
  }

  // Métodos para integração com denunciaService
  logDenunciaAction(adminEmail: string, action: AdminAction) {
    this.logAction(
      adminEmail, 
      action.type, 
      action.details, 
      action.denunciaId
    );
  }

  // Excluir usuário
  async deleteUser(userEmail: string, adminEmail: string): Promise<void> {
    try {
      await apiService.request(`/admin/users/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
        body: JSON.stringify({ adminEmail })
      });
      
      // Log da ação
      await this.logAction(adminEmail, 'DELETE_USER', `Usuário ${userEmail} excluído do sistema`);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  }



  // Excluir convite
  async deleteInvite(inviteId: string, adminEmail: string): Promise<void> {
    try {
      await apiService.request(`/admin/invites/${inviteId}`, {
        method: 'DELETE',
        body: JSON.stringify({ adminEmail })
      });
      
      // Log da ação será feito pelo backend
    } catch (error) {
      console.error('Erro ao excluir convite:', error);
      throw error;
    }
  }

  // Criar reset de senha
  async createPasswordReset(userEmail: string, adminEmail: string): Promise<string> {
    try {
      const response = await apiService.request('/admin/password-reset', {
        method: 'POST',
        body: JSON.stringify({
          userEmail,
          adminEmail,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        })
      });
      
      // Log da ação
      await this.logAction(adminEmail, 'PASSWORD_RESET', `Reset de senha criado para ${userEmail}`);
      
      return `${window.location.origin}/admin/reset-password?token=${response.token}`;
    } catch (error) {
      console.error('Erro ao criar reset de senha:', error);
      throw error;
    }
  }

  // Validar token de reset
  async validatePasswordReset(token: string): Promise<{ userEmail: string; expiresAt: string } | null> {
    try {
      const response = await apiService.request(`/admin/password-reset/validate/${token}`);
      return response.reset || null;
    } catch (error) {
      console.error('Erro ao validar token de reset:', error);
      return null;
    }
  }

  // Aplicar nova senha via reset
  async applyPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.request(`/admin/password-reset/${token}/apply`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });
      
      // Log da ação será feito pelo backend
    } catch (error) {
      console.error('Erro ao aplicar reset de senha:', error);
      throw error;
    }
  }



  // Estatísticas de Administradores
  async getAdminStats() {
    try {
      const response = await apiService.request('/admin/stats');
      return response.stats || {
        totalAdmins: 0,
        activeAdmins: 0,
        superAdmins: 0,
        totalActions: 0,
        actionsLast30Days: 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalAdmins: 0,
        activeAdmins: 0,
        superAdmins: 0,
        totalActions: 0,
        actionsLast30Days: 0
      };
    }
  }


}

export const adminService = new AdminService();
