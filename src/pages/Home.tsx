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
  ArrowRight,
  Heart,
  Users,
  Lock,
  CheckCircle,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import ConsultaStatus from "@/components/ConsultaStatus";

const Home = () => {
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        <div className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {/* Logo com efeito especial */}
              <div className="relative mb-8">
                <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white">
              <img 
                src="/logo-sos-voz-feminina.png" 
                    alt="S.O.S Voz Feminina" 
                    className="w-36 h-36 object-contain"
              />
            </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={16} />
                </div>
              </div>
              
              {/* Título principal */}
              <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-6 leading-tight">
                S.O.S Voz Feminina
            </h1>
              
              {/* Subtítulo */}
              <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium mb-8">
                Você não está sozinha. Denuncie de forma <span className="text-purple-600 font-bold">100% anônima</span> e segura.
              </p>
              
              {/* Badges de confiança */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Shield className="text-green-600" size={20} />
                  <span className="text-sm font-semibold text-gray-700">100% Seguro</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Lock className="text-blue-600" size={20} />
                  <span className="text-sm font-semibold text-gray-700">Totalmente Anônimo</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Zap className="text-purple-600" size={20} />
                  <span className="text-sm font-semibold text-gray-700">Resposta Rápida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl p-2">
              <TabsTrigger value="inicio" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300">
                <Shield size={18} />
                <span className="font-semibold">Início</span>
              </TabsTrigger>
              <TabsTrigger value="denuncia" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300">
                <FileText size={18} />
                <span className="font-semibold">Denunciar</span>
              </TabsTrigger>
              <TabsTrigger value="consulta" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300">
                <Search size={18} />
                <span className="font-semibold">Consultar</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Início */}
            <TabsContent value="inicio" className="space-y-12">
              {/* Cards de Ação Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card Denúncia - Destaque */}
                <Card className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-red-50 to-orange-50">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <CardHeader className="text-center pb-6 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <AlertTriangle className="text-white" size={32} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Fazer Denúncia</CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      Denuncie de forma 100% anônima e segura
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center relative z-10">
                    <Button 
                      asChild
                      className="w-full h-14 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to="/denuncia">
                        <span>Denunciar Agora</span>
                        <ArrowRight size={20} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Card Consulta */}
                <Card className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <CardHeader className="text-center pb-6 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Search className="text-white" size={32} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Consultar Status</CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      Acompanhe o status da sua denúncia
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center relative z-10">
                    <Button 
                      variant="outline"
                      className="w-full h-14 font-bold text-lg rounded-2xl border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={() => setActiveTab("consulta")}
                    >
                      <span>Consultar</span>
                      <ArrowRight size={20} />
                    </Button>
                  </CardContent>
                </Card>

                {/* Card Informações */}
                <Card className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <CardHeader className="text-center pb-6 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <BookOpen className="text-white" size={32} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Informações</CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      Conheça seus direitos e recursos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center relative z-10">
                    <Button 
                      asChild
                      variant="outline"
                      className="w-full h-14 font-bold text-lg rounded-2xl border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Link to="/educativo">
                        <span>Saiba Mais</span>
                        <ArrowRight size={20} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Seção de Segurança e Como Funciona */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Segurança */}
                <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -translate-y-12 translate-x-12"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Shield className="text-white" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Sua Segurança é Nossa Prioridade
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-800">100% Anônimo</p>
                          <p className="text-sm text-gray-600">Não coletamos dados pessoais identificáveis</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-800">Totalmente Confidencial</p>
                          <p className="text-sm text-gray-600">Seus dados são protegidos com criptografia</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-800">Conexão Segura</p>
                          <p className="text-sm text-gray-600">Protocolo HTTPS e servidores protegidos</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Como Funciona */}
                <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-12 translate-x-12"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Users className="text-white" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Como Funciona
                      </h3>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800">Denuncie</p>
                          <p className="text-sm text-gray-600">Preencha o formulário anônimo com os detalhes</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-semibold text-gray-800">Receba o ID</p>
                          <p className="text-sm text-gray-600">Guarde o número da denúncia para acompanhar</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-semibold text-gray-800">Acompanhe</p>
                          <p className="text-sm text-gray-600">Consulte o status quando quiser, de forma anônima</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* Contatos de Emergência */}
              <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-red-50 to-pink-50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Phone className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-800">
                      Contatos de Emergência
                  </CardTitle>
                  </div>
                  <CardDescription className="text-red-600 text-lg font-medium">
                    Em caso de emergência, ligue imediatamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                      <h4 className="font-bold text-red-800 text-lg mb-3">Polícia Militar</h4>
                      <p className="text-4xl font-black text-red-600 mb-2">190</p>
                      <p className="text-sm text-red-600">Emergências policiais</p>
                    </div>
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                      <h4 className="font-bold text-red-800 text-lg mb-3">Disque 180</h4>
                      <p className="text-4xl font-black text-red-600 mb-2">180</p>
                      <p className="text-sm text-red-600">Central de Atendimento à Mulher</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Denúncia */}
            <TabsContent value="denuncia" className="space-y-8">
              <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-red-50 to-orange-50">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full -translate-y-20 translate-x-20"></div>
                <CardHeader className="text-center pb-8 relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <AlertTriangle className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-800 mb-4">Fazer Denúncia Anônima</CardTitle>
                  <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Sua denúncia é importante e será tratada com total confidencialidade. 
                    Você pode incluir fotos, áudios e outros tipos de evidências.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <Button 
                    asChild
                    size="lg"
                    className="h-16 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 px-12"
                  >
                    <Link to="/denuncia">
                      <AlertTriangle size={24} />
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