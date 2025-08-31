import { Denuncia } from './denunciaService';

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

class AdminService {
  private readonly USERS_KEY = 'admin_users';
  private readonly INVITES_KEY = 'admin_invites';
  private readonly LOGS_KEY = 'admin_logs';
  private readonly SUPER_ADMIN_EMAIL = 'sosvozfeminina@administrador.com';

  constructor() {
    this.initializeSuperAdmin();
  }

  private initializeSuperAdmin() {
    const users = this.getUsers();
    const superAdminExists = users.find(user => user.email === this.SUPER_ADMIN_EMAIL);
    
    if (!superAdminExists) {
      const superAdmin: AdminUser = {
        id: this.generateId(),
        email: this.SUPER_ADMIN_EMAIL,
        role: 'super_admin',
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      users.push(superAdmin);
      this.saveUsers(users);
      
      // Criar credenciais iniciais para o super admin
      const credentials = this.getCredentials();
      credentials[this.SUPER_ADMIN_EMAIL] = {
        password: this.hashPassword('@VozAdministrador!25'),
        createdAt: new Date().toISOString()
      };
      this.saveCredentials(credentials);
      
      this.logAction(superAdmin.email, 'SYSTEM_INIT', 'Sistema inicializado com super admin');
    }
  }

  // Gestão de Usuários
  getUsers(): AdminUser[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: AdminUser[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getUserByEmail(email: string): AdminUser | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  updateLastLogin(email: string) {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString();
      this.saveUsers(users);
    }
  }

  // Sistema de Convites
  createInvite(email: string, createdBy: string): AdminInvite {
    const invites = this.getInvites();
    
    // Verificar se já existe um convite ativo para este email
    const existingInvite = invites.find(invite => 
      invite.email === email && 
      !invite.isUsed && 
      new Date(invite.expiresAt) > new Date()
    );
    
    if (existingInvite) {
      throw new Error('Já existe um convite ativo para este email. Exclua o convite anterior primeiro.');
    }

    // Remover convites expirados para este email (para permitir novo convite)
    const filteredInvites = invites.filter(invite => 
      !(invite.email === email && !invite.isUsed && new Date(invite.expiresAt) <= new Date())
    );
    
    const invite: AdminInvite = {
      id: this.generateId(),
      email,
      token: this.generateSecureToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      createdBy,
      isUsed: false
    };

    filteredInvites.push(invite);
    this.saveInvites(filteredInvites);
    
    this.logAction(createdBy, 'INVITE_USER', `Convite criado para ${email}`);
    
    return invite;
  }

  getInvites(): AdminInvite[] {
    const invites = localStorage.getItem(this.INVITES_KEY);
    return invites ? JSON.parse(invites) : [];
  }

  private saveInvites(invites: AdminInvite[]) {
    localStorage.setItem(this.INVITES_KEY, JSON.stringify(invites));
  }

  validateInvite(token: string): AdminInvite | null {
    const invites = this.getInvites();
    const invite = invites.find(inv => 
      inv.token === token && 
      !inv.isUsed && 
      new Date(inv.expiresAt) > new Date()
    );
    
    return invite || null;
  }

  useInvite(token: string, password: string): AdminUser {
    const invites = this.getInvites();
    const inviteIndex = invites.findIndex(inv => inv.token === token);
    
    if (inviteIndex === -1) {
      throw new Error('Convite inválido ou expirado');
    }

    const invite = invites[inviteIndex];
    
    // Marcar convite como usado
    invites[inviteIndex].isUsed = true;
    this.saveInvites(invites);

    // Criar novo usuário
    const users = this.getUsers();
    const newUser: AdminUser = {
      id: this.generateId(),
      email: invite.email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);
    this.saveUsers(users);

    // Salvar credenciais (em produção, usar hash)
    const credentials = this.getCredentials();
    credentials[invite.email] = {
      password: this.hashPassword(password),
      createdAt: new Date().toISOString()
    };
    this.saveCredentials(credentials);

    this.logAction(invite.email, 'USER_CREATED', 'Usuário criado via convite');
    
    return newUser;
  }

  // Autenticação
  private getCredentials(): Record<string, { password: string; createdAt: string }> {
    const credentials = localStorage.getItem('admin_credentials');
    return credentials ? JSON.parse(credentials) : {};
  }

  private saveCredentials(credentials: Record<string, { password: string; createdAt: string }>) {
    localStorage.setItem('admin_credentials', JSON.stringify(credentials));
  }

  authenticate(email: string, password: string): AdminUser | null {
    const user = this.getUserByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const credentials = this.getCredentials();
    const userCredentials = credentials[email];
    
    if (!userCredentials || userCredentials.password !== this.hashPassword(password)) {
      return null;
    }

    this.updateLastLogin(email);
    this.logAction(email, 'LOGIN', 'Login realizado com sucesso');
    
    return user;
  }

  // Logs de Auditoria
  logAction(adminEmail: string, action: string, details: string, denunciaId?: string) {
    const logs = this.getLogs();
    const log: AdminLog = {
      id: this.generateId(),
      adminEmail,
      action,
      details,
      timestamp: new Date().toISOString(),
      denunciaId,
      ipAddress: this.getClientIP()
    };

    logs.push(log);
    this.saveLogs(logs);
  }

  getLogs(): AdminLog[] {
    const logs = localStorage.getItem(this.LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  }

  private saveLogs(logs: AdminLog[]) {
    localStorage.setItem(this.LOGS_KEY, JSON.stringify(logs));
  }

  getLogsByAdmin(email: string): AdminLog[] {
    const logs = this.getLogs();
    return logs.filter(log => log.adminEmail === email);
  }

  getLogsByDateRange(startDate: string, endDate: string): AdminLog[] {
    const logs = this.getLogs();
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return logDate >= start && logDate <= end;
    });
  }

  // Verificações de Permissão
  isSuperAdmin(email: string): boolean {
    const user = this.getUserByEmail(email);
    return user?.role === 'super_admin';
  }

  canViewLogs(email: string): boolean {
    return this.isSuperAdmin(email);
  }

  canInviteUsers(email: string): boolean {
    return this.isSuperAdmin(email);
  }

  // Utilitários
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private hashPassword(password: string): string {
    // Em produção, usar bcrypt ou similar
    return btoa(password + 'salt');
  }

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
  deleteUser(userEmail: string, adminEmail: string): void {
    if (!this.isSuperAdmin(adminEmail)) {
      throw new Error('Apenas super administradores podem excluir usuários');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.email === userEmail);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const user = users[userIndex];
    if (user.role === 'super_admin') {
      throw new Error('Não é possível excluir super administradores');
    }

    // Remover usuário
    users.splice(userIndex, 1);
    this.saveUsers(users);

    // Remover credenciais
    const credentials = this.getCredentials();
    delete credentials[userEmail];
    this.saveCredentials(credentials);

    // Log da ação
    this.logAction(adminEmail, 'DELETE_USER', `Usuário ${userEmail} excluído do sistema`);
  }

  // Criar usuário a partir de convite
  createUserFromInvite(token: string, password: string): void {
    const invites = this.getInvites();
    const invite = invites.find(inv => inv.token === token);
    
    if (!invite) {
      throw new Error('Convite não encontrado');
    }

    if (invite.isUsed) {
      throw new Error('Este convite já foi usado');
    }

    if (new Date(invite.expiresAt) < new Date()) {
      throw new Error('Este convite expirou');
    }

    // Criar usuário
    const newUser: AdminUser = {
      id: this.generateId(),
      email: invite.email,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    // Criar credenciais
    const credentials = this.getCredentials();
    credentials[invite.email] = {
      password: this.hashPassword(password),
      createdAt: new Date().toISOString()
    };
    this.saveCredentials(credentials);

    // Marcar convite como usado
    const inviteIndex = invites.findIndex(inv => inv.token === token);
    if (inviteIndex !== -1) {
      invites[inviteIndex].isUsed = true;
      invites[inviteIndex].usedAt = new Date().toISOString();
      this.saveInvites(invites);
    }

    // Log da ação
    this.logAction(invite.email, 'USER_CREATED', `Usuário criado a partir de convite`);
  }

  // Excluir convite
  deleteInvite(inviteId: string, adminEmail: string): void {
    if (!this.isSuperAdmin(adminEmail)) {
      throw new Error('Apenas super administradores podem excluir convites');
    }

    const invites = this.getInvites();
    const inviteIndex = invites.findIndex(inv => inv.id === inviteId);
    
    if (inviteIndex === -1) {
      throw new Error('Convite não encontrado');
    }

    const invite = invites[inviteIndex];
    
    // Remover convite
    invites.splice(inviteIndex, 1);
    this.saveInvites(invites);

    // Log da ação
    this.logAction(adminEmail, 'DELETE_INVITE', `Convite para ${invite.email} excluído`);
  }

  // Criar reset de senha
  createPasswordReset(userEmail: string, adminEmail: string): string {
    if (!this.isSuperAdmin(adminEmail)) {
      throw new Error('Apenas super administradores podem resetar senhas');
    }

    const user = this.getUserByEmail(userEmail);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Gerar token de reset
    const resetToken = this.generateSecureToken();
    const now = new Date();
    const resetExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas

    console.log('Criando reset de senha:', {
      userEmail,
      token: resetToken.substring(0, 10) + '...',
      now: now.toISOString(),
      expiresAt: resetExpiresAt,
      timeDiff: 24 * 60 * 60 * 1000
    });

    // Salvar reset no localStorage com múltiplas estratégias
    const resets = this.getPasswordResets();
    resets[resetToken] = {
      userEmail,
      expiresAt: resetExpiresAt,
      createdBy: adminEmail
    };
    this.savePasswordResets(resets);

    // Também salvar em sessionStorage como backup
    try {
      const sessionResets = this.getSessionPasswordResets();
      sessionResets[resetToken] = {
        userEmail,
        expiresAt: resetExpiresAt,
        createdBy: adminEmail
      };
      this.saveSessionPasswordResets(sessionResets);
    } catch (error) {
      console.warn('Não foi possível salvar no sessionStorage:', error);
    }

    // Log da ação
    this.logAction(adminEmail, 'PASSWORD_RESET', `Reset de senha criado para ${userEmail}`);

    // Retornar link de reset com informações adicionais para debug
    const resetData = {
      token: resetToken,
      userEmail: userEmail,
      expiresAt: resetExpiresAt,
      timestamp: now.toISOString()
    };
    
    // Codificar os dados como base64 para passar na URL (apenas para debug)
    const encodedData = btoa(JSON.stringify(resetData));
    
    return `${window.location.origin}/admin/reset-password?token=${resetToken}&debug=${encodedData}`;
  }

  // Validar token de reset
  validatePasswordReset(token: string): { userEmail: string; expiresAt: string } | null {
    console.log('=== VALIDATING PASSWORD RESET ===');
    console.log('Token to validate:', token.substring(0, 10) + '...');
    
    // Tentar encontrar o token no localStorage
    let resets = this.getPasswordResets();
    let reset = resets[token];
    let source = 'localStorage';
    
    // Se não encontrou no localStorage, tentar no sessionStorage
    if (!reset) {
      console.log('Token não encontrado no localStorage, tentando sessionStorage...');
      try {
        const sessionResets = this.getSessionPasswordResets();
        reset = sessionResets[token];
        if (reset) {
          source = 'sessionStorage';
          console.log('Token encontrado no sessionStorage');
        }
      } catch (error) {
        console.warn('Erro ao acessar sessionStorage:', error);
      }
    }
    
    if (!reset) {
      console.log('Token não encontrado em nenhum storage:', token);
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(reset.expiresAt);
    
    console.log('Validando token:', {
      token: token.substring(0, 10) + '...',
      source,
      now: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      timeDiff: expiresAt.getTime() - now.getTime(),
      isValid: expiresAt.getTime() > now.getTime()
    });
    
    // Verificar se o token expirou
    if (expiresAt.getTime() <= now.getTime()) {
      console.log('Token expirado, removendo...');
      // Remover reset expirado de ambos os storages
      delete resets[token];
      this.savePasswordResets(resets);
      
      try {
        const sessionResets = this.getSessionPasswordResets();
        delete sessionResets[token];
        this.saveSessionPasswordResets(sessionResets);
      } catch (error) {
        console.warn('Erro ao remover do sessionStorage:', error);
      }
      
      return null;
    }

    console.log('Token válido');
    return reset;
  }

  // Aplicar nova senha via reset
  applyPasswordReset(token: string, newPassword: string): void {
    console.log('=== APPLYING PASSWORD RESET ===');
    console.log('Token to apply:', token.substring(0, 10) + '...');
    
    // Tentar encontrar o token em ambos os storages
    let resets = this.getPasswordResets();
    let reset = resets[token];
    let source = 'localStorage';
    
    if (!reset) {
      console.log('Token não encontrado no localStorage, tentando sessionStorage...');
      try {
        const sessionResets = this.getSessionPasswordResets();
        reset = sessionResets[token];
        if (reset) {
          source = 'sessionStorage';
          console.log('Token encontrado no sessionStorage');
        }
      } catch (error) {
        console.warn('Erro ao acessar sessionStorage:', error);
      }
    }
    
    if (!reset) {
      throw new Error('Token de reset inválido ou expirado');
    }

    console.log('Aplicando reset de senha para:', reset.userEmail, 'fonte:', source);

    // Atualizar senha
    const credentials = this.getCredentials();
    credentials[reset.userEmail] = {
      password: this.hashPassword(newPassword),
      createdAt: new Date().toISOString()
    };
    this.saveCredentials(credentials);

    // Remover token usado de ambos os storages
    delete resets[token];
    this.savePasswordResets(resets);
    
    try {
      const sessionResets = this.getSessionPasswordResets();
      delete sessionResets[token];
      this.saveSessionPasswordResets(sessionResets);
    } catch (error) {
      console.warn('Erro ao remover do sessionStorage:', error);
    }

    // Log da ação
    this.logAction(reset.userEmail, 'PASSWORD_CHANGED', 'Senha alterada via reset');
    
    console.log('=== END APPLYING PASSWORD RESET ===');
  }

  // Métodos privados para gerenciar resets
  private getPasswordResets(): Record<string, { userEmail: string; expiresAt: string; createdBy: string }> {
    const resets = localStorage.getItem('admin_password_resets');
    console.log('=== GET PASSWORD RESETS ===');
    console.log('Raw localStorage value:', resets);
    const parsedResets = resets ? JSON.parse(resets) : {};
    console.log('Parsed resets:', parsedResets);
    console.log('Total resets found:', Object.keys(parsedResets).length);
    console.log('=== END GET PASSWORD RESETS ===');
    return parsedResets;
  }

  private savePasswordResets(resets: Record<string, { userEmail: string; expiresAt: string; createdBy: string }>): void {
    console.log('=== SAVE PASSWORD RESETS ===');
    console.log('Saving resets:', resets);
    console.log('Total resets to save:', Object.keys(resets).length);
    
    const jsonString = JSON.stringify(resets);
    console.log('JSON string to save:', jsonString);
    
    localStorage.setItem('admin_password_resets', jsonString);
    
    // Verificar se foi salvo corretamente
    const saved = localStorage.getItem('admin_password_resets');
    console.log('Verification - saved value:', saved);
    console.log('Verification - parsed saved value:', saved ? JSON.parse(saved) : {});
    console.log('=== END SAVE PASSWORD RESETS ===');
  }

  // Função para testar persistência do localStorage
  testLocalStoragePersistence() {
    console.log('=== TESTING LOCALSTORAGE PERSISTENCE ===');
    
    // Teste 1: Salvar um valor de teste
    const testKey = 'test_persistence_' + Date.now();
    const testValue = { test: 'data', timestamp: new Date().toISOString() };
    
    console.log('Saving test value:', testValue);
    localStorage.setItem(testKey, JSON.stringify(testValue));
    
    // Teste 2: Verificar se foi salvo
    const saved = localStorage.getItem(testKey);
    console.log('Immediately after save:', saved);
    
    // Teste 3: Simular um pequeno delay e verificar novamente
    setTimeout(() => {
      const afterDelay = localStorage.getItem(testKey);
      console.log('After delay:', afterDelay);
      
      // Limpar o teste
      localStorage.removeItem(testKey);
      console.log('Test value removed');
    }, 1000);
    
    console.log('=== END PERSISTENCE TEST ===');
  }

  // Métodos para gerenciar sessionStorage
  private getSessionPasswordResets(): Record<string, { userEmail: string; expiresAt: string; createdBy: string }> {
    try {
      const resets = sessionStorage.getItem('admin_password_resets');
      console.log('=== GET SESSION PASSWORD RESETS ===');
      console.log('Raw sessionStorage value:', resets);
      const parsedResets = resets ? JSON.parse(resets) : {};
      console.log('Parsed session resets:', parsedResets);
      console.log('Total session resets found:', Object.keys(parsedResets).length);
      console.log('=== END GET SESSION PASSWORD RESETS ===');
      return parsedResets;
    } catch (error) {
      console.warn('Erro ao acessar sessionStorage:', error);
      return {};
    }
  }

  private saveSessionPasswordResets(resets: Record<string, { userEmail: string; expiresAt: string; createdBy: string }>): void {
    try {
      console.log('=== SAVE SESSION PASSWORD RESETS ===');
      console.log('Saving session resets:', resets);
      console.log('Total session resets to save:', Object.keys(resets).length);
      
      const jsonString = JSON.stringify(resets);
      console.log('Session JSON string to save:', jsonString);
      
      sessionStorage.setItem('admin_password_resets', jsonString);
      
      // Verificar se foi salvo corretamente
      const saved = sessionStorage.getItem('admin_password_resets');
      console.log('Session verification - saved value:', saved);
      console.log('Session verification - parsed saved value:', saved ? JSON.parse(saved) : {});
      console.log('=== END SAVE SESSION PASSWORD RESETS ===');
    } catch (error) {
      console.warn('Erro ao salvar no sessionStorage:', error);
    }
  }

  // Estatísticas de Administradores
  getAdminStats() {
    const users = this.getUsers();
    const logs = this.getLogs();
    
    return {
      totalAdmins: users.length,
      activeAdmins: users.filter(u => u.isActive).length,
      superAdmins: users.filter(u => u.role === 'super_admin').length,
      totalActions: logs.length,
      actionsLast30Days: logs.filter(log => {
        const logDate = new Date(log.timestamp);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return logDate >= thirtyDaysAgo;
      }).length
    };
  }

  // Função de debug temporária
  debugPasswordResets() {
    console.log('=== DEBUG PASSWORD RESETS ===');
    
    // Debug localStorage
    const resets = this.getPasswordResets();
    console.log('LOCALSTORAGE - Total resets:', Object.keys(resets).length);
    Object.entries(resets).forEach(([token, reset]) => {
      const now = new Date();
      const expiresAt = new Date(reset.expiresAt);
      console.log(`LOCALSTORAGE - Token: ${token.substring(0, 10)}...`);
      console.log(`  User: ${reset.userEmail}`);
      console.log(`  Created by: ${reset.createdBy}`);
      console.log(`  Expires at: ${reset.expiresAt}`);
      console.log(`  Now: ${now.toISOString()}`);
      console.log(`  Is expired: ${expiresAt.getTime() <= now.getTime()}`);
      console.log(`  Time diff: ${expiresAt.getTime() - now.getTime()}ms`);
    });
    
    // Debug sessionStorage
    try {
      const sessionResets = this.getSessionPasswordResets();
      console.log('SESSIONSTORAGE - Total resets:', Object.keys(sessionResets).length);
      Object.entries(sessionResets).forEach(([token, reset]) => {
        const now = new Date();
        const expiresAt = new Date(reset.expiresAt);
        console.log(`SESSIONSTORAGE - Token: ${token.substring(0, 10)}...`);
        console.log(`  User: ${reset.userEmail}`);
        console.log(`  Created by: ${reset.createdBy}`);
        console.log(`  Expires at: ${reset.expiresAt}`);
        console.log(`  Now: ${now.toISOString()}`);
        console.log(`  Is expired: ${expiresAt.getTime() <= now.getTime()}`);
        console.log(`  Time diff: ${expiresAt.getTime() - now.getTime()}ms`);
      });
    } catch (error) {
      console.log('SESSIONSTORAGE - Erro ao acessar:', error);
    }
    
    console.log('=== END DEBUG ===');
  }

  // Função para limpar todos os resets (temporária para debug)
  clearAllPasswordResets() {
    console.log('Limpando todos os resets de senha...');
    localStorage.removeItem('admin_password_resets');
    try {
      sessionStorage.removeItem('admin_password_resets');
    } catch (error) {
      console.warn('Erro ao limpar sessionStorage:', error);
    }
    console.log('Todos os resets foram removidos de ambos os storages');
  }
}

export const adminService = new AdminService();
