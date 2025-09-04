import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  AlertTriangle, 
  Clock,
  Calendar,
  Download,
  Filter,
  PieChart,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { denunciaService } from "@/services/denunciaService";
import { adminService } from "@/services/adminService";
import AdminNavigation from "@/components/AdminNavigation";

const AdminEstatisticas = () => {
  const [estatisticas, setEstatisticas] = useState<any>({});
  const [periodo, setPeriodo] = useState("30dias");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEstatisticas();
  }, [periodo]);

  const loadEstatisticas = async () => {
    setIsLoading(true);
    
    try {
      const denuncias = await denunciaService.getDenuncias();
      const adminStats = await adminService.getAdminStats();
      
      // Garantir que denuncias seja um array
      const denunciasArray = Array.isArray(denuncias) ? denuncias : [];
      
      // Calcular período
      const hoje = new Date();
      let dataInicio = new Date();
      
      switch (periodo) {
        case "7dias":
          dataInicio.setDate(hoje.getDate() - 7);
          break;
        case "30dias":
          dataInicio.setDate(hoje.getDate() - 30);
          break;
        case "90dias":
          dataInicio.setDate(hoje.getDate() - 90);
          break;
        case "1ano":
          dataInicio.setFullYear(hoje.getFullYear() - 1);
          break;
        default:
          dataInicio.setDate(hoje.getDate() - 30);
      }

      // Filtrar denúncias por período
      const denunciasFiltradas = denunciasArray.filter(denuncia => 
        new Date(denuncia.dataCriacao) >= dataInicio
      );

      // Estatísticas por tipo de violência
      const tiposViolencia = denunciasFiltradas.reduce((acc: any, denuncia) => {
        acc[denuncia.tipoViolencia] = (acc[denuncia.tipoViolencia] || 0) + 1;
        return acc;
      }, {});

      // Estatísticas por status
      const statusCount = denunciasFiltradas.reduce((acc: any, denuncia) => {
        acc[denuncia.status] = (acc[denuncia.status] || 0) + 1;
        return acc;
      }, {});

      // Estatísticas por prioridade
      const prioridadeCount = denunciasFiltradas.reduce((acc: any, denuncia) => {
        if (denuncia.prioridade) {
          acc[denuncia.prioridade] = (acc[denuncia.prioridade] || 0) + 1;
        }
        return acc;
      }, {});

      // Tendência temporal (últimos 7 dias)
      const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() - i);
        return data.toISOString().split('T')[0];
      }).reverse();

      const tendenciaTemporal = ultimos7Dias.map(data => {
        const count = denunciasArray.filter(denuncia => 
          denuncia.dataCriacao.startsWith(data)
        ).length;
        return { data, count };
      });

      // Estatísticas por localização
      const localizacoes = denunciasFiltradas.reduce((acc: any, denuncia) => {
        if (denuncia.localizacao?.estado) {
          acc[denuncia.localizacao.estado] = (acc[denuncia.localizacao.estado] || 0) + 1;
        }
        return acc;
      }, {});

      setEstatisticas({
        total: denunciasFiltradas.length,
        totalGeral: denunciasArray.length,
        tiposViolencia,
        statusCount,
        prioridadeCount,
        tendenciaTemporal,
        localizacoes,
        adminStats,
        periodo: {
          inicio: dataInicio.toLocaleDateString('pt-BR'),
          fim: hoje.toLocaleDateString('pt-BR')
        }
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportarRelatorio = async (formato: 'pdf' | 'excel') => {
    try {
      if (formato === 'excel') {
        // Exportação Excel com encoding correto
        const dados = await denunciaService.getDenuncias();
        const dadosArray = Array.isArray(dados) ? dados : [];
        const csvContent = [
          ['ID Público', 'Tipo Violência', 'Status', 'Prioridade', 'Data Criação', 'Localização'],
          ...dadosArray.map(d => [
            d.idPublico || '',
            d.tipoViolencia || '',
            d.status || '',
            d.prioridade || 'N/A',
            new Date(d.dataCriacao).toLocaleDateString('pt-BR'),
            `${d.localizacao?.cidade || ''}, ${d.localizacao?.estado || ''}`
          ])
        ].map(row => row.join(';')).join('\n');

        // Adicionar BOM para UTF-8
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { 
          type: 'text/csv;charset=utf-8;' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_denuncias_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Exportação PDF real
        await exportarPDF();
      }

      toast({
        title: "Relatório exportado!",
        description: `Relatório em ${formato.toUpperCase()} foi baixado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const exportarPDF = async () => {
    try {
      // Criar conteúdo HTML para o PDF
      const dados = await denunciaService.getDenuncias();
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório de Denúncias</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { margin: 20px 0; }
            .stat-item { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Denúncias</h1>
            <p>Período: ${estatisticas.periodo?.inicio || ''} a ${estatisticas.periodo?.fim || ''}</p>
            <p>Total de denúncias: ${estatisticas.total || 0}</p>
          </div>
          
          <div class="stats">
            <h3>Estatísticas por Status:</h3>
            ${Object.entries(estatisticas.statusCount || {}).map(([status, count]) => 
              `<div class="stat-item">${status}: ${count}</div>`
            ).join('')}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID Público</th>
                <th>Tipo Violência</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Data Criação</th>
                <th>Localização</th>
              </tr>
            </thead>
            <tbody>
              ${dados.map(d => `
                <tr>
                  <td>${d.idPublico || ''}</td>
                  <td>${d.tipoViolencia || ''}</td>
                  <td>${d.status || ''}</td>
                  <td>${d.prioridade || 'N/A'}</td>
                  <td>${new Date(d.dataCriacao).toLocaleDateString('pt-BR')}</td>
                  <td>${d.localizacao?.cidade || ''}, ${d.localizacao?.estado || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      // Criar blob com o HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      
      // Abrir em nova aba para impressão/PDF
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.print();
        };
      }
      
      // Limpar URL após um tempo
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
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

  const getTipoViolenciaColor = (tipo: string) => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800'
    ];
    return colors[Object.keys(estatisticas.tiposViolencia || {}).indexOf(tipo) % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <AdminNavigation />
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando estatísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <AdminNavigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <BarChart3 className="text-blue-foreground" size={48} />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Dashboard de Estatísticas
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Análise completa dos dados de denúncias e atividades do sistema
            </p>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                  <SelectItem value="1ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline">
                {estatisticas.periodo?.inicio} - {estatisticas.periodo?.fim}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => exportarRelatorio('excel')}
                className="flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Excel</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => exportarRelatorio('pdf')}
                className="flex items-center space-x-2"
              >
                <Download size={16} />
                <span>PDF</span>
              </Button>
            </div>
          </div>

          {/* Cards Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Denúncias</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.total}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.max(0, (estatisticas.totalGeral || 0) - (estatisticas.total || 0))} no total geral
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.statusCount?.pendente || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando análise
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.statusCount?.analisando || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Sendo processadas
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.statusCount?.resolvido || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Casos finalizados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos e Análises */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Tipos de Violência */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="text-primary" size={24} />
                  <span>Tipos de Violência</span>
                </CardTitle>
                <CardDescription>
                  Distribuição por categoria de violência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(estatisticas.tiposViolencia || {}).map(([tipo, count]: [string, any]) => (
                    <div key={tipo} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getTipoViolenciaColor(tipo)}>
                          {tipo.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status das Denúncias */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="text-primary" size={24} />
                  <span>Status das Denúncias</span>
                </CardTitle>
                <CardDescription>
                  Distribuição por status atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(estatisticas.statusCount || {}).map(([status, count]: [string, any]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tendência Temporal */}
          <Card className="shadow-soft mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-primary" size={24} />
                <span>Tendência dos Últimos 7 Dias</span>
              </CardTitle>
              <CardDescription>
                Evolução diária de denúncias recebidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 space-x-2">
                {estatisticas.tendenciaTemporal?.map((item: any, index: number) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="bg-primary rounded-t w-8 transition-all duration-300 hover:bg-primary/80"
                      style={{ 
                        height: `${Math.max(10, (item.count / Math.max(...estatisticas.tendenciaTemporal.map((i: any) => i.count))) * 100)}%` 
                      }}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                    <span className="text-xs font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de Administradores */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-primary" size={24} />
                <span>Estatísticas de Administradores</span>
              </CardTitle>
              <CardDescription>
                Atividade e uso do sistema administrativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{estatisticas.adminStats?.totalAdmins || 0}</div>
                  <p className="text-sm text-muted-foreground">Total de Admins</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{estatisticas.adminStats?.activeAdmins || 0}</div>
                  <p className="text-sm text-muted-foreground">Admins Ativos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{estatisticas.adminStats?.superAdmins || 0}</div>
                  <p className="text-sm text-muted-foreground">Super Admins</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{estatisticas.adminStats?.actionsLast30Days || 0}</div>
                  <p className="text-sm text-muted-foreground">Ações (30 dias)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminEstatisticas;
