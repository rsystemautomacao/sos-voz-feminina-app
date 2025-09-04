import { Shield, Users, Settings, BarChart3, FileText, AlertTriangle, CheckCircle, Clock, Eye, ArrowLeft, Building2, Code, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavigation from "@/components/AdminNavigation";

const Sobre = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.includes('/admin') || location.pathname === '/sobre' && localStorage.getItem('adminToken');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <AdminNavigation />
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <Shield className="text-primary-foreground" size={48} />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Painel Administrativo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sistema de gerenciamento e monitoramento de denúncias de violência contra mulheres
            </p>
          </div>

          {/* Funcionalidades do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-soft hover:shadow-strong transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-primary-foreground" size={24} />
                </div>
                <CardTitle>Gestão de Denúncias</CardTitle>
                <CardDescription>
                  Sistema completo para análise e acompanhamento de casos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Visualização de denúncias anônimas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Atualização de status e prioridades</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Acesso a evidências anexadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Sistema de observações internas</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-blue rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="text-blue-foreground" size={24} />
                </div>
                <CardTitle>Análise de Dados</CardTitle>
                <CardDescription>
                  Relatórios e estatísticas em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Dashboard interativo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Métricas por tipo de violência</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Análise temporal de casos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Exportação de relatórios</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-green rounded-full flex items-center justify-center mb-4">
                  <Users className="text-green-foreground" size={24} />
                </div>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Controle de acesso e permissões administrativas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Sistema de convites seguros</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Controle de permissões</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Logs de atividades</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm">Rastreamento de ações</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segurança e Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-soft border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="text-primary" size={24} />
                  <span>Segurança e Privacidade</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Criptografia:</strong> Todos os dados são criptografados em repouso e em trânsito
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Logs de Auditoria:</strong> Todas as ações são registradas com timestamp e usuário
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Controle de Acesso:</strong> Sistema de permissões baseado em roles
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Backup Automático:</strong> Dados são salvos automaticamente com redundância
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Settings className="text-blue-600" size={24} />
                  <span>Funcionalidades Avançadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Filtros Avançados:</strong> Busca por múltiplos critérios
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Exportação:</strong> Relatórios em PDF e Excel
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Notificações:</strong> Alertas para casos urgentes
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Dashboard:</strong> Visualização em tempo real
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Técnicas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="text-primary" size={24} />
                <span>Informações do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Versão do Sistema</h4>
                  <Badge variant="outline">v2.1.0</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Última Atualização</h4>
                  <p className="text-sm text-muted-foreground">31/08/2025</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Status</h4>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Operacional
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
  }

  // Versão para usuários (mantém o conteúdo original)
  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
            <Shield className="text-primary-foreground" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sobre o SOS Voz Feminina
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma segura e anônima para denunciar violência contra mulheres
          </p>
        </div>

        {/* Missão */}
        <Card className="shadow-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="text-primary" size={24} />
              <span>Nossa Missão</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              O SOS Voz Feminina nasceu da necessidade de criar um espaço seguro e confidencial 
              para que mulheres possam denunciar situações de violência sem medo de retaliação. 
              Nossa missão é empoderar mulheres através da tecnologia, oferecendo uma ferramenta 
              que garante anonimato total e facilita o processo de denúncia.
            </p>
          </CardContent>
        </Card>

        {/* Valores */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-foreground" size={24} />
              </div>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Garantimos total anonimato e proteção dos dados pessoais
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-foreground" size={24} />
              </div>
              <CardTitle>Apoio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Oferecemos suporte emocional e orientação jurídica
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-foreground" size={24} />
              </div>
              <CardTitle>Justiça</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Trabalhamos para garantir que a justiça seja feita
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Como Funciona */}
        <Card className="shadow-soft mb-8">
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold">Para Vítimas</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <p className="text-sm text-muted-foreground">
                      Acesse a plataforma de forma anônima
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <p className="text-sm text-muted-foreground">
                      Preencha o formulário de denúncia
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <p className="text-sm text-muted-foreground">
                      Receba um ID para acompanhar o caso
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Nossa Equipe</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      Analisa cada denúncia com cuidado
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      Encaminha para autoridades competentes
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      Acompanha o progresso dos casos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="shadow-soft mb-8">
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Para dúvidas sobre o funcionamento da plataforma ou suporte técnico, 
              entre em contato através dos canais oficiais de denúncia: <strong>Disque 180</strong> 
              ou <strong>Polícia Militar 190</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Informações do Desenvolvedor */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="text-primary" size={20} />
              <span>Informações do Desenvolvedor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="text-primary" size={20} />
                  <div>
                    <h4 className="font-semibold">Empresa Desenvolvedora</h4>
                    <p className="text-sm text-muted-foreground">Tech Solutions Brasil</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="text-primary" size={20} />
                  <div>
                    <h4 className="font-semibold">Tecnologias Utilizadas</h4>
                    <p className="text-sm text-muted-foreground">React, TypeScript, Tailwind CSS</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="text-primary" size={20} />
                  <div>
                    <h4 className="font-semibold">Segurança</h4>
                    <p className="text-sm text-muted-foreground">Criptografia de ponta a ponta</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="text-primary" size={20} />
                  <div>
                    <h4 className="font-semibold">Email de Suporte</h4>
                    <p className="text-sm text-muted-foreground">suporte@techsolutions.com.br</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-primary" size={20} />
                  <div>
                    <h4 className="font-semibold">Telefone</h4>
                    <p className="text-sm text-muted-foreground">+55 (11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-primary" size={20} />
                  <div>
                    <h4 className="font-semibold">Localização</h4>
                    <p className="text-sm text-muted-foreground">São Paulo, SP - Brasil</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Versão:</strong> 1.0.0
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Sistema Administrativo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sobre;
