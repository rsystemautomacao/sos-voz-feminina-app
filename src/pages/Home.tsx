import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Shield, 
  FileText, 
  BookOpen, 
  Phone, 
  Info,
  Search,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import ConsultaStatus from "@/components/ConsultaStatus";

const Home = () => {
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <Shield className="text-emergency-foreground" size={48} />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              SOS Voz Feminina
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Você não está sozinha. Denuncie de forma anônima e segura. 
              Nossa equipe está aqui para ajudar e proteger.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="inicio" className="flex items-center space-x-2">
                <Shield size={16} />
                <span>Início</span>
              </TabsTrigger>
              <TabsTrigger value="denuncia" className="flex items-center space-x-2">
                <FileText size={16} />
                <span>Denunciar</span>
              </TabsTrigger>
              <TabsTrigger value="consulta" className="flex items-center space-x-2">
                <Search size={16} />
                <span>Consultar</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Início */}
            <TabsContent value="inicio" className="space-y-8">
              {/* Cards de Ação */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-soft hover:shadow-strong transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="text-emergency-foreground" size={28} />
                    </div>
                    <CardTitle className="text-xl">Fazer Denúncia</CardTitle>
                    <CardDescription>
                      Denuncie de forma 100% anônima e segura
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      asChild
                      className="w-full h-12 bg-gradient-emergency hover:bg-gradient-emergency/90 text-white font-semibold rounded-xl"
                    >
                      <Link to="/denuncia">
                        <span>Denunciar Agora</span>
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-strong transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-primary-foreground" size={28} />
                    </div>
                    <CardTitle className="text-xl">Consultar Status</CardTitle>
                    <CardDescription>
                      Acompanhe o status da sua denúncia
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      variant="outline"
                      className="w-full h-12 font-semibold rounded-xl"
                      onClick={() => setActiveTab("consulta")}
                    >
                      <span>Consultar</span>
                      <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-strong transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="text-blue-foreground" size={28} />
                    </div>
                    <CardTitle className="text-xl">Informações</CardTitle>
                    <CardDescription>
                      Conheça seus direitos e recursos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      asChild
                      variant="outline"
                      className="w-full h-12 font-semibold rounded-xl"
                    >
                      <Link to="/educativo">
                        <span>Saiba Mais</span>
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Informações de Segurança */}
              <Card className="shadow-soft border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-primary">
                        Sua Segurança é Nossa Prioridade
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-muted-foreground">
                            <strong>100% Anônimo:</strong> Não coletamos dados pessoais
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Confidencial:</strong> Seus dados são protegidos
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Seguro:</strong> Conexão criptografada
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-primary">
                        Como Funciona
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Denuncie:</strong> Preencha o formulário anônimo
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Receba o ID:</strong> Guarde o número da denúncia
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Acompanhe:</strong> Consulte o status quando quiser
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contatos de Emergência */}
              <Card className="shadow-soft border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <Phone className="text-red-600" size={24} />
                    <span>Contatos de Emergência</span>
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    Em caso de emergência, ligue imediatamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-800">Polícia Militar</h4>
                      <p className="text-2xl font-bold text-red-600">190</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-800">Disque 180</h4>
                      <p className="text-2xl font-bold text-red-600">180</p>
                      <p className="text-sm text-red-600">Central de Atendimento à Mulher</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Denúncia */}
            <TabsContent value="denuncia" className="space-y-8">
              <Card className="shadow-soft">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Fazer Denúncia Anônima</CardTitle>
                  <CardDescription>
                    Sua denúncia é importante e será tratada com total confidencialidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    asChild
                    size="lg"
                    className="h-14 bg-gradient-emergency hover:bg-gradient-emergency/90 text-white font-semibold text-lg rounded-xl"
                  >
                    <Link to="/denuncia">
                      <AlertTriangle size={20} />
                      <span>Iniciar Denúncia</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Consulta */}
            <TabsContent value="consulta" className="space-y-8">
              <ConsultaStatus />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Home;