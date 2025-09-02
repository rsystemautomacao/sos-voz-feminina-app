import { useState, useEffect } from "react";
import { 
  Users, 
  Mail, 
  Shield, 
  Eye, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Activity,
  Settings,
  UserPlus,
  FileText,
  Calendar,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { adminService, AdminUser, AdminLog } from "@/services/adminService";
import AdminNavigation from "@/components/AdminNavigation";

const AdminConfiguracoes = () => {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<AdminUser | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const adminData = JSON.parse(atob(adminToken));
      setCurrentAdminEmail(adminData.email);
    }
  }, []);

  const loadData = async () => {
    try {
      const [usersData, logsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getLogs()
      ]);
      setUsers(usersData);
      setLogs(logsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleCreateInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite o email do usuário.",
        variant: "destructive",
      });
      return;
    }

    const canInvite = await adminService.canInviteUsers(currentAdminEmail);
    if (!canInvite) {
      toast({
        title: "Permissão negada",
        description: "Apenas super administradores podem convidar usuários.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    
         try {
       const invite = await adminService.createInvite(inviteEmail, currentAdminEmail);
      
      // Gerar link de convite
      const inviteLink = `${window.location.origin}/admin/register?token=${invite.token}`;
      
      // Copiar para clipboard
      await navigator.clipboard.writeText(inviteLink);
      
      toast({
        title: "Convite criado!",
        description: "Link copiado para a área de transferência. Envie para o usuário.",
      });
      
      setInviteEmail("");
      loadData();
      
    } catch (error) {
      toast({
        title: "Erro ao criar convite",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const canInvite = await adminService.canInviteUsers(currentAdminEmail);
    if (!canInvite) {
      toast({
        title: "Permissão negada",
        description: "Apenas super administradores podem excluir usuários.",
        variant: "destructive",
      });
      return;
    }

    if (user.email === currentAdminEmail) {
      toast({
        title: "Operação inválida",
        description: "Você não pode excluir sua própria conta.",
        variant: "destructive",
      });
      return;
    }

         try {
       await adminService.deleteUser(user.email, currentAdminEmail);
      
      toast({
        title: "Usuário excluído",
        description: `${user.email} foi removido do sistema.`,
      });
      
      loadData();
      setUserToDelete(null);
      
    } catch (error) {
      toast({
        title: "Erro ao excluir usuário",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const copyInviteLink = async (token: string) => {
    const inviteLink = `${window.location.origin}/admin/register?token=${token}`;
    await navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copiado!",
      description: "Link do convite copiado para a área de transferência.",
    });
  };

  const handleDeleteInvite = async (invite: any) => {
    const canInvite = await adminService.canInviteUsers(currentAdminEmail);
    if (!canInvite) {
      toast({
        title: "Permissão negada",
        description: "Apenas super administradores podem excluir convites.",
        variant: "destructive",
      });
      return;
    }

         try {
       await adminService.deleteInvite(invite.id, currentAdminEmail);
      
      toast({
        title: "Convite excluído",
        description: `Convite para ${invite.email} foi removido.`,
      });
      
      loadData();
      
    } catch (error) {
      toast({
        title: "Erro ao excluir convite",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (user: AdminUser) => {
    const canInvite = await adminService.canInviteUsers(currentAdminEmail);
    if (!canInvite) {
      toast({
        title: "Permissão negada",
        description: "Apenas super administradores podem resetar senhas.",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);
    
    try {
      console.log('Criando reset de senha para:', user.email);
      const resetLink = await adminService.createPasswordReset(user.email, currentAdminEmail);
      
      console.log('Link criado:', resetLink);
      
      // Copiar para clipboard
      await navigator.clipboard.writeText(resetLink);
      
      toast({
        title: "Link de reset criado!",
        description: "Link copiado para a área de transferência. Envie para o usuário.",
      });
      
      setUserToResetPassword(null);
      loadData();
      
    } catch (error) {
      console.error('Erro ao criar reset:', error);
      toast({
        title: "Erro ao criar reset de senha",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return <Activity size={16} />;
      case 'LOGOUT': return <Activity size={16} />;
      case 'UPDATE_STATUS': return <FileText size={16} />;
      case 'UPDATE_PRIORITY': return <AlertTriangle size={16} />;
      case 'EXPORT_DATA': return <FileText size={16} />;
      case 'INVITE_USER': return <UserPlus size={16} />;
      default: return <Settings size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'bg-green-100 text-green-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'UPDATE_STATUS': return 'bg-blue-100 text-blue-800';
      case 'UPDATE_PRIORITY': return 'bg-orange-100 text-orange-800';
      case 'EXPORT_DATA': return 'bg-purple-100 text-purple-800';
      case 'INVITE_USER': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (startDate && endDate) {
      const logDate = new Date(log.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return logDate >= start && logDate <= end;
    }
    return true;
  });

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [canViewLogs, setCanViewLogs] = useState(false);
  const [invites, setInvites] = useState<any[]>([]);

  // Verificar permissões e carregar convites quando o componente carrega
  useEffect(() => {
    const checkPermissionsAndLoadInvites = async () => {
      try {
        const [superAdmin, viewLogs, invitesData] = await Promise.all([
          adminService.isSuperAdmin(currentAdminEmail),
          adminService.canViewLogs(currentAdminEmail),
          adminService.getInvites()
        ]);
        setIsSuperAdmin(superAdmin);
        setCanViewLogs(viewLogs);
        setInvites(invitesData);
      } catch (error) {
        console.error('Erro ao verificar permissões ou carregar convites:', error);
      }
    };

    if (currentAdminEmail) {
      checkPermissionsAndLoadInvites();
    }
  }, [currentAdminEmail]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <AdminNavigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <Settings className="text-primary-foreground" size={48} />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Configurações
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Gerencie usuários administrativos e visualize logs do sistema
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="usuarios" className="flex items-center space-x-2">
                <Users size={16} />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center space-x-2">
                <Eye size={16} />
                <span>Logs</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Usuários */}
            <TabsContent value="usuarios" className="space-y-8">
              {/* Criar Convite */}
              {isSuperAdmin && (
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserPlus className="text-primary" size={24} />
                      <span>Convidar Novo Administrador</span>
                    </CardTitle>
                    <CardDescription>
                      Envie um convite por email para adicionar um novo administrador ao sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="inviteEmail">Email do usuário</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          placeholder="usuario@exemplo.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                                             <div className="flex items-end space-x-2">
                         <Button
                           onClick={handleCreateInvite}
                           disabled={isInviting}
                           className="flex items-center space-x-2"
                         >
                           {isInviting ? (
                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                           ) : (
                             <Mail size={16} />
                           )}
                           <span>{isInviting ? "Enviando..." : "Enviar Convite"}</span>
                         </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de Usuários */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="text-primary" size={24} />
                    <span>Administradores ({users.length})</span>
                  </CardTitle>
                  <CardDescription>
                    Lista de todos os usuários com acesso administrativo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                            <Shield className="text-primary-foreground" size={20} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{user.email}</span>
                              <Badge className={user.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                              </Badge>
                              <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {user.isActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-x-4">
                              <span>Criado em: {formatDate(user.createdAt)}</span>
                              {user.lastLogin && (
                                <span>Último login: {formatDate(user.lastLogin)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isSuperAdmin && user.email !== currentAdminEmail && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUserToResetPassword(user)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Lock size={16} />
                                <span className="hidden sm:inline">Reset Senha</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUserToDelete(user)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">Excluir</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

                             {/* Convites Ativos - Apenas Super Admin */}
               {isSuperAdmin && (
                 <Card className="shadow-soft">
                   <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                       <Mail className="text-primary" size={24} />
                       <span>Convites Ativos</span>
                     </CardTitle>
                     <CardDescription>
                       Convites pendentes que ainda não foram utilizados
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
                                               {invites
                          .filter(invite => !invite.isUsed && new Date(invite.expiresAt) > new Date())
                          .map((invite) => (
                           <div
                             key={invite.id}
                             className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                           >
                             <div>
                               <div className="flex items-center space-x-2">
                                 <span className="font-semibold">{invite.email}</span>
                                 <Badge className="bg-yellow-100 text-yellow-800">
                                   Pendente
                                 </Badge>
                               </div>
                               <div className="text-sm text-muted-foreground">
                                 Expira em: {formatDate(invite.expiresAt)}
                               </div>
                             </div>
                             <div className="flex items-center space-x-2">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => copyInviteLink(invite.token)}
                                 className="flex items-center space-x-2"
                               >
                                 <Copy size={16} />
                                 <span>Copiar</span>
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleDeleteInvite(invite)}
                                 className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                               >
                                 <Trash2 size={16} />
                                 <span>Excluir</span>
                               </Button>
                             </div>
                           </div>
                         ))}
                                               {invites.filter(invite => !invite.isUsed && new Date(invite.expiresAt) > new Date()).length === 0 && (
                         <p className="text-center text-muted-foreground py-8">
                           Nenhum convite ativo no momento
                         </p>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               )}

               {/* Convites Expirados - Apenas Super Admin */}
               {isSuperAdmin && (
                 <Card className="shadow-soft">
                   <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                       <Clock className="text-primary" size={24} />
                       <span>Convites Expirados</span>
                     </CardTitle>
                     <CardDescription>
                       Convites que expiraram ou foram cancelados
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
                                               {invites
                          .filter(invite => !invite.isUsed && new Date(invite.expiresAt) <= new Date())
                          .map((invite) => (
                           <div
                             key={invite.id}
                             className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                           >
                             <div>
                               <div className="flex items-center space-x-2">
                                 <span className="font-semibold">{invite.email}</span>
                                 <Badge className="bg-gray-100 text-gray-800">
                                   Expirado
                                 </Badge>
                               </div>
                               <div className="text-sm text-muted-foreground">
                                 Expirou em: {formatDate(invite.expiresAt)}
                               </div>
                             </div>
                             <div className="flex items-center space-x-2">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleDeleteInvite(invite)}
                                 className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                               >
                                 <Trash2 size={16} />
                                 <span>Excluir</span>
                               </Button>
                             </div>
                           </div>
                         ))}
                       {adminService.getInvites().filter(invite => !invite.isUsed && new Date(invite.expiresAt) <= new Date()).length === 0 && (
                         <p className="text-center text-muted-foreground py-8">
                           Nenhum convite expirado
                         </p>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               )}
            </TabsContent>

            {/* Tab Logs */}
            <TabsContent value="logs" className="space-y-8">
              {!canViewLogs ? (
                <Card className="shadow-soft border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Acesso Negado</h3>
                      <p className="text-red-600">
                        Apenas super administradores podem visualizar os logs do sistema.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Filtros */}
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="text-primary" size={24} />
                        <span>Filtrar Logs</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="startDate">Data Inicial</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">Data Final</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setStartDate("");
                              setEndDate("");
                            }}
                          >
                            Limpar Filtros
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lista de Logs */}
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="text-primary" size={24} />
                        <span>Logs de Auditoria ({filteredLogs.length})</span>
                      </CardTitle>
                      <CardDescription>
                        Registro de todas as ações realizadas no sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {filteredLogs.map((log) => (
                          <div
                            key={log.id}
                            className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg"
                          >
                            <div className="flex-shrink-0">
                              {getActionIcon(log.action)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold">{log.adminEmail}</span>
                                <Badge className={getActionColor(log.action)}>
                                  {log.action}
                                </Badge>
                                {log.denunciaId && (
                                  <Badge variant="outline">
                                    Denúncia #{log.denunciaId}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {log.details}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Clock size={12} />
                                  <span>{formatDate(log.timestamp)}</span>
                                </span>
                                {log.ipAddress && (
                                  <span>IP: {log.ipAddress}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredLogs.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            Nenhum log encontrado para o período selecionado
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

             {/* Modal de Confirmação de Exclusão */}
       {userToDelete && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <Card className="w-full max-w-md shadow-strong border-0 bg-white/95 backdrop-blur-sm">
             <CardHeader className="text-center pb-4">
               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Trash2 className="text-red-600" size={24} />
               </div>
               <CardTitle className="text-xl text-red-600">Confirmar Exclusão</CardTitle>
               <CardDescription className="text-sm">
                 Tem certeza que deseja excluir este usuário?
               </CardDescription>
             </CardHeader>
             <CardContent className="px-6 pb-6 space-y-4">
               <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                 <div className="flex items-start space-x-2">
                   <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
                   <div className="text-sm">
                     <h4 className="font-semibold text-red-800 mb-1">Atenção!</h4>
                     <p className="text-red-700">
                       Esta ação é irreversível. O usuário <strong>{userToDelete.email}</strong> será removido permanentemente do sistema.
                     </p>
                   </div>
                 </div>
               </div>

               <div className="flex space-x-3 pt-3">
                 <Button
                   onClick={() => setUserToDelete(null)}
                   variant="outline"
                   className="flex-1"
                 >
                   Cancelar
                 </Button>
                 <Button
                   onClick={() => handleDeleteUser(userToDelete)}
                   className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                 >
                   <Trash2 size={16} className="mr-2" />
                   Excluir Usuário
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       )}

       {/* Modal de Confirmação de Reset de Senha */}
       {userToResetPassword && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <Card className="w-full max-w-md shadow-strong border-0 bg-white/95 backdrop-blur-sm">
             <CardHeader className="text-center pb-4">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Lock className="text-blue-600" size={24} />
               </div>
               <CardTitle className="text-xl text-blue-600">Reset de Senha</CardTitle>
               <CardDescription className="text-sm">
                 Gerar link para reset de senha?
               </CardDescription>
             </CardHeader>
             <CardContent className="px-6 pb-6 space-y-4">
               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                 <div className="flex items-start space-x-2">
                   <AlertTriangle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                   <div className="text-sm">
                     <h4 className="font-semibold text-blue-800 mb-1">Informação</h4>
                     <p className="text-blue-700">
                       Será gerado um link seguro para <strong>{userToResetPassword.email}</strong> criar uma nova senha. O link será copiado para a área de transferência.
                     </p>
                   </div>
                 </div>
               </div>

               <div className="flex space-x-3 pt-3">
                 <Button
                   onClick={() => setUserToResetPassword(null)}
                   variant="outline"
                   className="flex-1"
                 >
                   Cancelar
                 </Button>
                 <Button
                   onClick={() => handleResetPassword(userToResetPassword)}
                   disabled={isResettingPassword}
                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                 >
                   {isResettingPassword ? (
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                   ) : (
                     <Lock size={16} className="mr-2" />
                   )}
                   {isResettingPassword ? "Gerando..." : "Gerar Link"}
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       )}
    </div>
  );
};

export default AdminConfiguracoes;
