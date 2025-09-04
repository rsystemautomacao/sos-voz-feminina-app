import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  LogOut, 
  FileText, 
  Eye, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  TrendingUp,
  MessageSquare,
  Play,
  Pause,
  Image,
  Volume2,
  Upload,
  Archive,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { denunciaService, Denuncia, Evidencia } from "@/services/denunciaService";
import AdminNavigation from "@/components/AdminNavigation";

const Admin = () => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [filteredDenuncias, setFilteredDenuncias] = useState<Denuncia[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("todos");
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [observacoes, setObservacoes] = useState("");
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{id: string, status: Denuncia['status']} | null>(null);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Carregar denúncias ao montar o componente
  useEffect(() => {
    loadDenuncias();
    loadEstatisticas();
    
    // Obter email do admin do localStorage
    const storedEmail = localStorage.getItem("adminEmail");
    if (storedEmail && storedEmail.includes('@')) {
      setCurrentAdminEmail(storedEmail);
    }
    
    // Mostrar mensagem de boas-vindas apenas no primeiro login da sessão
    const loginTime = localStorage.getItem("adminLoginTime");
    const hasShownWelcome = localStorage.getItem("hasShownWelcome");
    const lastWelcomeTime = localStorage.getItem("lastWelcomeTime");
    
    // Verificar se é um novo login (não apenas navegação)
    if (loginTime && (!hasShownWelcome || !lastWelcomeTime || 
        new Date(loginTime).getTime() > parseInt(lastWelcomeTime))) {
      
      toast({
        title: "🎉 Login realizado com sucesso!",
        description: "Bem-vindo(a) ao painel administrativo!",
        duration: 4000, // 4 segundos
        className: "bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 text-white border-0 shadow-2xl rounded-xl",
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '16px',
          fontSize: '16px',
          fontWeight: '600',
        },
      });
      
      // Marcar que já mostrou a mensagem de boas-vindas para esta sessão
      localStorage.setItem("hasShownWelcome", "true");
      localStorage.setItem("lastWelcomeTime", Date.now().toString());
    }
  }, []);

  const loadDenuncias = async () => {
    setIsLoading(true);
    
    try {
      const denunciasData = await denunciaService.getDenuncias();
      setDenuncias(denunciasData);
      setFilteredDenuncias(denunciasData);
    } catch (error) {
      console.error('Erro ao carregar denúncias:', error);
      toast({
        title: "Erro ao carregar denúncias",
        description: "Não foi possível carregar as denúncias.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEstatisticas = async () => {
    try {
      const stats = await denunciaService.getEstatisticas();
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // Filtrar denúncias
  useEffect(() => {
    let filtered = denuncias;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(denuncia =>
        denuncia.relato.toLowerCase().includes(searchTerm.toLowerCase()) ||
        denuncia.tipoViolencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        denuncia.localizacao?.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        denuncia.idPublico.includes(searchTerm)
      );
    }

    // Filtro por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(denuncia => denuncia.status === statusFilter);
    }

    // Filtro por prioridade
    if (prioridadeFilter !== "todos") {
      filtered = filtered.filter(denuncia => denuncia.prioridade === prioridadeFilter);
    }

    setFilteredDenuncias(filtered);
  }, [denuncias, searchTerm, statusFilter, prioridadeFilter]);

  const updateDenunciaStatus = async (id: string, newStatus: Denuncia['status']) => {
    setPendingStatusChange({ id, status: newStatus });
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    try {
      await denunciaService.atualizarStatus(pendingStatusChange.id, pendingStatusChange.status, observacoes);
      
      // Recarregar dados
      await loadDenuncias();
      await loadEstatisticas();
      
      const statusText = {
        'pendente': 'Pendente',
        'analisando': 'Em Análise',
        'resolvido': 'Resolvida',
        'arquivado': 'Arquivada'
      }[pendingStatusChange.status];
      
      toast({
        title: "✅ Status atualizado com sucesso!",
        description: `A denúncia foi marcada como "${statusText}". Esta alteração foi registrada no histórico de auditoria.`,
      });
      
      setSelectedDenuncia(null);
      setObservacoes("");
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "❌ Erro ao atualizar status",
        description: "Não foi possível atualizar o status da denúncia. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setShowStatusConfirm(false);
      setPendingStatusChange(null);
    }
  };

  const updateDenunciaPrioridade = async (id: string, novaPrioridade: Denuncia['prioridade']) => {
    try {
      await denunciaService.atualizarPrioridade(id, novaPrioridade);
      
      // Recarregar dados
      await loadDenuncias();
      await loadEstatisticas();
      
      toast({
        title: "Prioridade atualizada",
        description: `Denúncia ${id} marcada como prioridade ${novaPrioridade}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a prioridade da denúncia.",
        variant: "destructive",
      });
    }
  };

  const salvarObservacoes = async (id: string) => {
    if (!observacoes.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, digite uma observação antes de salvar.",
        variant: "destructive",
      });
      return;
    }


    try {
      console.log('Salvando observações:', { id, observacoes });
      await denunciaService.salvarObservacoes(id, observacoes);
      
      // Recarregar dados
      await loadDenuncias();
      
      toast({
        title: "✅ Observações salvas com sucesso!",
        description: "As observações foram salvas e registradas no histórico de auditoria.",
        duration: 2000,
      });
      
      // Limpar campo de observações
      setObservacoes("");
      
    } catch (error) {
      console.error('Erro ao salvar observações:', error);
      toast({
        title: "❌ Erro ao salvar observações",
        description: "Não foi possível salvar as observações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Funções para reproduzir áudio
  const playAudio = (evidencia: Evidencia) => {
    if (audioRef) {
      audioRef.pause();
    }

    const audioUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${evidencia.dados}`;
    const audio = new Audio(audioUrl);
    setAudioRef(audio);
    
    audio.onended = () => setPlayingAudio(null);
    audio.play();
    setPlayingAudio(evidencia.id);
  };

  const pauseAudio = () => {
    if (audioRef) {
      audioRef.pause();
      setPlayingAudio(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'analisando': return 'bg-blue-100 text-blue-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock size={14} />;
      case 'analisando': return <AlertTriangle size={14} />;
      case 'resolvido': return <CheckCircle size={14} />;
      case 'arquivado': return <X size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getPrioridadeColor = (prioridade?: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  return (
    <div className="min-h-screen bg-gradient-soft">
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.porStatus.pendente}</p>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.porStatus.analisando}</p>
                    <p className="text-sm text-muted-foreground">Em Análise</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.porStatus.resolvido}</p>
                    <p className="text-sm text-muted-foreground">Resolvidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.recentes}</p>
                    <p className="text-sm text-muted-foreground">Últimas 24h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FileText className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card className="shadow-soft mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Buscar denúncias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="analisando">Em Análise</SelectItem>
                    <SelectItem value="resolvido">Resolvidas</SelectItem>
                    <SelectItem value="arquivado">Arquivadas</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>

                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Denúncias */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando denúncias...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDenuncias.map((denuncia) => (
              <Card key={denuncia._id || denuncia.id} className="shadow-soft hover:shadow-strong transition-shadow cursor-pointer" onClick={() => setSelectedDenuncia(denuncia)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={getStatusColor(denuncia.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(denuncia.status)}
                            <span className="capitalize">{denuncia.status}</span>
                          </div>
                        </Badge>
                        {denuncia.prioridade && (
                          <Badge className={getPrioridadeColor(denuncia.prioridade)}>
                            <span className="capitalize">{denuncia.prioridade}</span>
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">ID: #{denuncia.idPublico}</span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 capitalize">
                        {denuncia.tipoViolencia.replace('_', ' ')}
                      </h3>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {denuncia.relato}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(denuncia.dataCriacao)}</span>
                        </div>
                        {denuncia.localizacao?.cidade && (
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{denuncia.localizacao.cidade}, {denuncia.localizacao.estado}</span>
                          </div>
                        )}
                        {denuncia.evidencias && denuncia.evidencias.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <FileText size={14} />
                            <span>{denuncia.evidencias.length} evidência(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredDenuncias.length === 0 && (
              <Card className="shadow-soft">
                <CardContent className="p-12 text-center">
                  <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma denúncia encontrada</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "todos" || prioridadeFilter !== "todos"
                      ? "Tente ajustar os filtros de busca." 
                      : "Não há denúncias registradas no momento."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedDenuncia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Detalhes da Denúncia</CardTitle>
                    <p className="text-purple-100 text-sm font-medium">#{selectedDenuncia.idPublico}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    setSelectedDenuncia(null);
                    setObservacoes("");
                  }}
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Grid de informações principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Shield size={20} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-900">Tipo de Violência</h4>
                  </div>
                  <p className="text-blue-800 capitalize font-medium">{selectedDenuncia.tipoViolencia.replace('_', ' ')}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-green-900">Data do Ocorrido</h4>
                  </div>
                  <p className="text-green-800 font-medium">{selectedDenuncia.dataOcorrido}</p>
                </div>
              </div>
              
              {selectedDenuncia.localizacao?.cidade && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-orange-900">Localização</h4>
                  </div>
                  <p className="text-orange-800 font-medium">{selectedDenuncia.localizacao.cidade}, {selectedDenuncia.localizacao.estado}</p>
                  {selectedDenuncia.localizacao.bairro && (
                    <p className="text-orange-700 text-sm mt-1">Bairro: {selectedDenuncia.localizacao.bairro}</p>
                  )}
                </div>
              )}
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gray-500 rounded-lg">
                    <FileText size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Relato</h4>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{selectedDenuncia.relato}</p>
                </div>
              </div>
              
              {/* Status e Prioridade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Activity size={20} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-purple-900">Status</h4>
                  </div>
                  <Badge className={`${getStatusColor(selectedDenuncia.status)} text-sm px-3 py-1`}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedDenuncia.status)}
                      <span className="capitalize font-medium">{selectedDenuncia.status}</span>
                    </div>
                  </Badge>
                </div>

                {selectedDenuncia.prioridade && (
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-red-500 rounded-lg">
                        <AlertTriangle size={20} className="text-white" />
                      </div>
                      <h4 className="font-semibold text-red-900">Prioridade</h4>
                    </div>
                    <Badge className={`${getPrioridadeColor(selectedDenuncia.prioridade)} text-sm px-3 py-1`}>
                      <span className="capitalize font-medium">{selectedDenuncia.prioridade}</span>
                    </Badge>
                  </div>
                )}
              </div>

              {selectedDenuncia.evidencias && selectedDenuncia.evidencias.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <Upload size={20} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-indigo-900 text-lg">Evidências</h4>
                    <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">
                      {selectedDenuncia.evidencias.length} arquivo(s)
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedDenuncia.evidencias.map((evidencia, index) => (
                      <div key={evidencia.id || `evidencia-${index}`} className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${evidencia.tipo === 'image' ? 'bg-blue-100' : 'bg-green-100'}`}>
                              {evidencia.tipo === 'image' ? (
                                <Image className="text-blue-600" size={18} />
                              ) : (
                                <Volume2 className="text-green-600" size={18} />
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 text-sm">{evidencia.nome}</span>
                              <p className="text-xs text-gray-500">{formatFileSize(evidencia.tamanho)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {evidencia.tipo === 'image' ? (
                          <div className="space-y-3">
                            <div className="relative group">
                              <img 
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${evidencia.dados}`} 
                                alt={evidencia.nome}
                                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-300 transition-colors"
                                onError={(e) => {
                                  console.error('Erro ao carregar imagem:', evidencia.dados);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-white/90 rounded-full p-2">
                                    <Image size={20} className="text-indigo-600" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Button
                              onClick={() => playingAudio === evidencia.id ? pauseAudio() : playAudio(evidencia)}
                              variant="outline"
                              size="sm"
                              className={`w-full transition-all duration-200 ${
                                playingAudio === evidencia.id 
                                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' 
                                  : 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100'
                              }`}
                            >
                              {playingAudio === evidencia.id ? (
                                <>
                                  <Pause size={16} className="mr-2" />
                                  Pausar Áudio
                                </>
                              ) : (
                                <>
                                  <Play size={16} className="mr-2" />
                                  Reproduzir Áudio
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDenuncia.observacoes && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                      <FileText size={20} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-yellow-900">Observações Existentes</h4>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 whitespace-pre-wrap leading-relaxed">
                      {selectedDenuncia.observacoes}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FileText size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-900">Adicionar Observações</h4>
                </div>
                <Textarea
                  placeholder="Adicione observações sobre esta denúncia..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="min-h-[100px] border-blue-200 focus:border-blue-400"
                />
                <div className="mt-4">
                  <Button
                    onClick={() => salvarObservacoes(selectedDenuncia._id || selectedDenuncia.id)}
                    disabled={!observacoes.trim()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText size={16} className="mr-2" />
                    Salvar Observações
                  </Button>
                </div>
              </div>
              
              {/* Ações de Status */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Activity size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-900">Alterar Status</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => updateDenunciaStatus(selectedDenuncia._id || selectedDenuncia.id, 'analisando')}
                    disabled={selectedDenuncia.status === 'analisando'}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Activity size={16} className="mr-2" />
                    Em Análise
                  </Button>
                  <Button
                    onClick={() => updateDenunciaStatus(selectedDenuncia._id || selectedDenuncia.id, 'resolvido')}
                    disabled={selectedDenuncia.status === 'resolvido'}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Resolvida
                  </Button>
                  <Button
                    onClick={() => updateDenunciaStatus(selectedDenuncia._id || selectedDenuncia.id, 'arquivado')}
                    disabled={selectedDenuncia.status === 'arquivado'}
                    size="sm"
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <Archive size={16} className="mr-2" />
                    Arquivar
                  </Button>
                </div>
              </div>

              {/* Ações de Prioridade */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <AlertTriangle size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-red-900">Alterar Prioridade</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => updateDenunciaPrioridade(selectedDenuncia._id || selectedDenuncia.id, 'urgente')}
                    disabled={selectedDenuncia.prioridade === 'urgente'}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Urgente
                  </Button>
                  <Button
                    onClick={() => updateDenunciaPrioridade(selectedDenuncia._id || selectedDenuncia.id, 'alta')}
                    disabled={selectedDenuncia.prioridade === 'alta'}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Alta
                  </Button>
                  <Button
                    onClick={() => updateDenunciaPrioridade(selectedDenuncia._id || selectedDenuncia.id, 'media')}
                    disabled={selectedDenuncia.prioridade === 'media'}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Média
                  </Button>
                  <Button
                    onClick={() => updateDenunciaPrioridade(selectedDenuncia._id || selectedDenuncia.id, 'baixa')}
                    disabled={selectedDenuncia.prioridade === 'baixa'}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Baixa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Confirmação de Mudança de Status */}
      {showStatusConfirm && pendingStatusChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-strong border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-blue-600" size={24} />
              </div>
              <CardTitle className="text-xl text-blue-600">Confirmar Mudança de Status</CardTitle>
              <CardDescription className="text-sm">
                Tem certeza que deseja alterar o status desta denúncia?
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                  <div className="text-sm">
                    <h4 className="font-semibold text-blue-800 mb-1">Atenção!</h4>
                    <p className="text-blue-700">
                      A denúncia será marcada como <strong>"{pendingStatusChange.status}"</strong>. 
                      Esta alteração será registrada no histórico de auditoria e poderá ser visualizada pelos outros administradores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <Button
                  onClick={() => {
                    setShowStatusConfirm(false);
                    setPendingStatusChange(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmStatusChange}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Confirmar Mudança
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Admin;
