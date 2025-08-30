import { Link } from "react-router-dom";
import { Shield, FileText, BookOpen, Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <Shield className="text-primary-foreground" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              SOS <span className="bg-gradient-primary bg-clip-text text-transparent">Voz Feminina</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Um espaço seguro e anônimo para denunciar assédio e buscar apoio. 
              Sua voz importa e você não está sozinha.
            </p>
          </div>

          {/* Emergency Button */}
          <div className="mb-12">
            <Link to="/denuncia">
              <Button 
                variant="emergency" 
                size="emergency" 
                className="animate-pulse hover:animate-none transition-all"
              >
                <AlertTriangle size={28} />
                Fazer Denúncia Rápida
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-3">
              Denúncia 100% anônima e segura
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como podemos te ajudar?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-primary-foreground" size={24} />
                </div>
                <CardTitle className="text-primary">Registrar Denúncia</CardTitle>
                <CardDescription>
                  Relate situações de assédio de forma anônima e segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/denuncia">
                  <Button variant="safe" className="w-full">
                    Fazer Denúncia
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-primary-foreground" size={24} />
                </div>
                <CardTitle className="text-primary">Material Educativo</CardTitle>
                <CardDescription>
                  Conheça seus direitos e formas de proteção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/educativo">
                  <Button variant="soft" className="w-full">
                    Acessar Conteúdo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-accent-foreground" size={24} />
                </div>
                <CardTitle className="text-primary">Rede de Apoio</CardTitle>
                <CardDescription>
                  Contatos de psicólogos, advogados e serviços de apoio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/contatos">
                  <Button variant="soft" className="w-full">
                    Ver Contatos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-primary">
            Segurança e Confidencialidade
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">100% Anônimo</h3>
              <p className="text-muted-foreground text-sm">
                Suas informações pessoais nunca são coletadas
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Dados Protegidos</h3>
              <p className="text-muted-foreground text-sm">
                Todas as denúncias são criptografadas e seguras
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={32} className="text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Apoio Especializado</h3>
              <p className="text-muted-foreground text-sm">
                Acesso direto a profissionais qualificados
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;