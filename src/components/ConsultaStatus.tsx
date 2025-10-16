import { useState } from "react";
import { Search, FileText, Clock, AlertTriangle, CheckCircle, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clipboard } from '@capacitor/clipboard';
import { denunciaService, Denuncia } from "@/services/denunciaService";

const ConsultaStatus = () => {
  const [denunciaId, setDenunciaId] = useState("");
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!denunciaId.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite o número do relato.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setDenuncia(null);

    try {
      const foundDenuncia = await denunciaService.getDenunciaByIdPublico(denunciaId.trim());
      
      if (foundDenuncia) {
        setDenuncia(foundDenuncia);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Erro ao buscar relato:', error);
      toast({
        title: "Erro na consulta",
        description: "Não foi possível consultar o status do relato.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Detectar se está no mobile (Capacitor)
      const isMobile = typeof window !== 'undefined' && window.location.protocol === 'https:';
      
      if (isMobile) {
        // Usar Capacitor Clipboard no mobile
        await Clipboard.write({
          string: text
        });
      } else {
        // Usar navigator.clipboard no web
        await navigator.clipboard.writeText(text);
      }
      
      toast({
        title: "Copiado!",
        description: "Informação copiada para a área de transferência.",
      });
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar automaticamente.",
        variant: "destructive",
      });
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
      case 'pendente': return <Clock size={16} />;
      case 'analisando': return <AlertTriangle size={16} />;
      case 'resolvido': return <CheckCircle size={16} />;
      case 'arquivado': return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pendente': return 'Seu relato foi recebido e está aguardando análise.';
      case 'analisando': return 'Seu relato está sendo analisado por nossa equipe.';
      case 'resolvido': return 'Seu relato foi analisado e as medidas necessárias foram tomadas.';
      case 'arquivado': return 'Seu relato foi arquivado após análise completa.';
      default: return 'Status não disponível.';
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

  return (
    <div className="space-y-6">
      {/* Campo de Busca */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="text-primary" size={24} />
            <span>Consultar Status do Relato</span>
          </CardTitle>
          <CardDescription>
            Digite o número do relato para acompanhar o status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ex: 3108251000"
              value={denunciaId}
              onChange={(e) => setDenunciaId(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={16} />
              )}
              <span>Consultar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado da Busca */}
      {isLoading && (
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Consultando status do relato...</p>
          </CardContent>
        </Card>
      )}

      {notFound && (
        <Card className="shadow-soft border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <X className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Relato não encontrado</h3>
            <p className="text-red-600">
              Não foi possível encontrar um relato com o número informado. 
              Verifique se o número está correto e tente novamente.
            </p>
          </CardContent>
        </Card>
      )}

      {denuncia && (
        <Card className="shadow-soft border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="text-green-600" size={24} />
                <div>
                  <CardTitle className="text-green-800">
                    Relato #{denuncia.idPublico}
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Status atualizado em {formatDate(denuncia.dataCriacao)}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`Relato #${denuncia.idPublico} - Status: ${denuncia.status}`)}
                className="flex items-center space-x-2"
              >
                <Copy size={16} />
                <span>Copiar</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">Status Atual</h4>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(denuncia.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(denuncia.status)}
                    <span className="capitalize">{denuncia.status}</span>
                  </div>
                </Badge>
              </div>
              <p className="text-sm text-green-700">
                {getStatusDescription(denuncia.status)}
              </p>
            </div>

            {/* Informações do Relato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Tipo de Violência</h4>
                <p className="text-sm capitalize">{denuncia.tipoViolencia.replace('_', ' ')}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Data de Registro</h4>
                <p className="text-sm">{formatDate(denuncia.dataCriacao)}</p>
              </div>

              {denuncia.localizacao?.cidade && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">Localização</h4>
                  <p className="text-sm">
                    {denuncia.localizacao.cidade}, {denuncia.localizacao.estado}
                    {denuncia.localizacao.bairro && ` - ${denuncia.localizacao.bairro}`}
                  </p>
                </div>
              )}

              {denuncia.prioridade && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">Prioridade</h4>
                  <Badge className="bg-orange-100 text-orange-800">
                    <span className="capitalize">{denuncia.prioridade}</span>
                  </Badge>
                </div>
              )}
            </div>

            {/* Observações (se houver) */}
            {denuncia.observacoes && (
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Observações da Equipe</h4>
                <div className="bg-white/50 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-800 whitespace-pre-wrap">
                    {denuncia.observacoes}
                  </p>
                </div>
              </div>
            )}

            {/* Evidências (se houver) */}
            {denuncia.evidencias && denuncia.evidencias.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Evidências Anexadas</h4>
                <p className="text-sm text-green-700">
                  {denuncia.evidencias.length} arquivo(s) foram anexados ao relato.
                </p>
              </div>
            )}

            {/* Informações Importantes */}
            <div className="bg-white/50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Informações Importantes</h4>
              <div className="space-y-2 text-sm text-green-700">
                <p>• Seu relato é tratado com total confidencialidade</p>
                <p>• O status é atualizado conforme o progresso da análise</p>
                <p>• Em caso de emergência, procure ajuda imediata</p>
                <p>• Guarde este número para futuras consultas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultaStatus;
