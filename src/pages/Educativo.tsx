import { useState } from "react";
import { BookOpen, Shield, Users, Phone, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";

const Educativo = () => {
  const [activeTab, setActiveTab] = useState("direitos");

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <BookOpen className="text-blue-foreground" size={48} />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Centro Educativo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Conheça seus direitos, aprenda sobre violência doméstica e encontre recursos de apoio
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="direitos" className="flex items-center space-x-2">
                <Shield size={16} />
                <span>Direitos</span>
              </TabsTrigger>
              <TabsTrigger value="tipos" className="flex items-center space-x-2">
                <FileText size={16} />
                <span>Tipos</span>
              </TabsTrigger>
              <TabsTrigger value="recursos" className="flex items-center space-x-2">
                <Users size={16} />
                <span>Recursos</span>
              </TabsTrigger>
              <TabsTrigger value="emergencia" className="flex items-center space-x-2">
                <Phone size={16} />
                <span>Emergência</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Direitos */}
            <TabsContent value="direitos" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="text-primary" size={24} />
                      <span>Direitos Fundamentais</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Direito à vida, liberdade e segurança pessoal</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Direito à integridade física, psíquica e moral</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Direito à igualdade de tratamento perante a lei</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Direito à proteção contra qualquer forma de discriminação</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="text-primary" size={24} />
                      <span>Lei Maria da Penha</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      A Lei Maria da Penha (Lei 11.340/2006) é a principal legislação brasileira para coibir a violência doméstica e familiar contra a mulher.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Cria mecanismos para coibir a violência doméstica</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Estabelece medidas protetivas de urgência</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Prevê punições mais severas para agressores</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Tipos */}
            <TabsContent value="tipos" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Violência Física</CardTitle>
                    <CardDescription>Agressões corporais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Qualquer conduta que ofenda a integridade ou saúde corporal da mulher.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p>• Socos, chutes, empurrões</p>
                      <p>• Queimaduras, cortes</p>
                      <p>• Estrangulamento</p>
                      <p>• Uso de objetos como armas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Violência Psicológica</CardTitle>
                    <CardDescription>Danos emocionais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Qualquer conduta que cause dano emocional e diminuição da autoestima.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p>• Humilhação, ridicularização</p>
                      <p>• Controle de comportamento</p>
                      <p>• Isolamento social</p>
                      <p>• Ameaças constantes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Violência Sexual</CardTitle>
                    <CardDescription>Abuso e assédio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Qualquer conduta que force a mulher a presenciar ou participar de relação sexual.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p>• Estupro conjugal</p>
                      <p>• Assédio sexual</p>
                      <p>• Exploração sexual</p>
                      <p>• Tráfico de mulheres</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Violência Econômica</CardTitle>
                    <CardDescription>Controle financeiro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Qualquer conduta que configure retenção ou subtração de bens.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p>• Controle do dinheiro</p>
                      <p>• Impedimento de trabalhar</p>
                      <p>• Destruição de documentos</p>
                      <p>• Retenção de salário</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Violência Moral</CardTitle>
                    <CardDescription>Calúnia e difamação</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Qualquer conduta que configure calúnia, difamação ou injúria.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p>• Acusações falsas</p>
                      <p>• Difamação pública</p>
                      <p>• Exposição de intimidade</p>
                      <p>• Fofocas maldosas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Violência Patrimonial</CardTitle>
                    <CardDescription>Destruição de bens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Qualquer conduta que configure retenção, subtração ou destruição de bens.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p>• Quebra de objetos pessoais</p>
                      <p>• Destruição de documentos</p>
                      <p>• Venda forçada de bens</p>
                      <p>• Esconder pertences</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Recursos */}
            <TabsContent value="recursos" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="text-primary" size={24} />
                      <span>Rede de Apoio</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Centros de Referência da Mulher</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Delegacias Especializadas de Atendimento à Mulher (DEAM)</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Casas Abrigo</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Serviços de Psicologia e Assistência Social</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="text-primary" size={24} />
                      <span>Medidas Protetivas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      As medidas protetivas são ordens judiciais que visam proteger a mulher em situação de violência.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Afastamento do agressor do lar</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Proibição de aproximação</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Suspensão de posse de arma de fogo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Emergência */}
            <TabsContent value="emergencia" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-soft border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-800">
                      <Phone className="text-red-600" size={24} />
                      <span>Números de Emergência</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-800">Polícia Militar</h4>
                        <p className="text-3xl font-bold text-red-600">190</p>
                        <p className="text-sm text-red-600">Para emergências imediatas</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-800">Disque 180</h4>
                        <p className="text-3xl font-bold text-red-600">180</p>
                        <p className="text-sm text-red-600">Central de Atendimento à Mulher</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-800">Disque 100</h4>
                        <p className="text-3xl font-bold text-red-600">100</p>
                        <p className="text-sm text-red-600">Direitos Humanos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="text-primary" size={24} />
                      <span>Plano de Segurança</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Prepare-se para uma situação de emergência com antecedência.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Tenha um plano de fuga</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Mantenha documentos importantes em local seguro</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Tenha dinheiro reserva escondido</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">Identifique pessoas de confiança para contato</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Educativo;