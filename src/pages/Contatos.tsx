import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Shield, AlertTriangle, Users, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import ManualSearchModal from "@/components/ManualSearchModal";

const Contatos = () => {
  const [showManualSearchModal, setShowManualSearchModal] = useState(false);

  const handleDenyLocation = () => {
    setShowManualSearchModal(true);
  };

  const emergencyContacts = [
    {
      name: "Polícia Militar",
      number: "190",
      description: "Emergências imediatas",
      type: "emergency",
      icon: AlertTriangle
    },
    {
      name: "Disque 180",
      number: "180",
      description: "Central de Atendimento à Mulher",
      type: "emergency",
      icon: Shield
    },
    {
      name: "Disque 100",
      number: "100",
      description: "Direitos Humanos",
      type: "emergency",
      icon: Shield
    }
  ];

  const supportServices = [
    {
      name: "Centro de Referência da Mulher",
      description: "Acolhimento e orientação jurídica",
      services: ["Acolhimento", "Orientação Jurídica", "Apoio Psicológico"],
      type: "support"
    },
    {
      name: "Delegacia da Mulher (DEAM)",
      description: "Registro de ocorrências e investigações",
      services: ["Registro de BO", "Investigação", "Medidas Protetivas"],
      type: "legal"
    },
    {
      name: "Casa Abrigo",
      description: "Acolhimento temporário para mulheres em risco",
      services: ["Acolhimento", "Proteção", "Reconstrução de Vida"],
      type: "shelter"
    },
    {
      name: "Serviço de Psicologia",
      description: "Apoio emocional e saúde mental",
      services: ["Terapia", "Apoio Emocional", "Processamento de Trauma"],
      type: "health"
    },
    {
      name: "Assistência Social",
      description: "Orientação sobre benefícios e recursos",
      services: ["Benefícios", "Orientação", "Inclusão Social"],
      type: "social"
    },
    {
      name: "Defensoria Pública",
      description: "Assistência jurídica gratuita",
      services: ["Assessoria Jurídica", "Representação Legal", "Orientação"],
      type: "legal"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'shelter': return 'bg-green-100 text-green-800';
      case 'health': return 'bg-pink-100 text-pink-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'support': return Shield;
      case 'legal': return Shield;
      case 'shelter': return Heart;
      case 'health': return Heart;
      case 'social': return Users;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <Phone className="text-primary-foreground" size={48} />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Rede de Apoio
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Encontre contatos de emergência e serviços especializados para mulheres em situação de violência
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Contatos de Emergência</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <Card key={index} className="shadow-soft border-red-200 bg-red-50 hover:shadow-strong transition-all">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-red-600" size={32} />
                      </div>
                      <CardTitle className="text-red-800">{contact.name}</CardTitle>
                      <CardDescription className="text-red-600">{contact.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-3">
                        <p className="text-4xl font-bold text-red-600">{contact.number}</p>
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => window.open(`tel:${contact.number}`)}
                        >
                          <Phone size={16} className="mr-2" />
                          Ligar Agora
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Support Services */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Serviços de Apoio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportServices.map((service, index) => {
                const Icon = getTypeIcon(service.type);
                return (
                  <Card key={index} className="shadow-soft hover:shadow-strong transition-all">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className="text-primary" size={24} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <Badge className={getTypeColor(service.type)}>
                            {service.type === 'emergency' && 'Emergência'}
                            {service.type === 'support' && 'Apoio'}
                            {service.type === 'legal' && 'Jurídico'}
                            {service.type === 'shelter' && 'Abrigo'}
                            {service.type === 'health' && 'Saúde'}
                            {service.type === 'social' && 'Social'}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Serviços oferecidos:</h4>
                        <div className="space-y-2">
                          {service.services.map((s, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span className="text-sm text-muted-foreground">{s}</span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => {
                            // Aqui você pode adicionar lógica para buscar o contato mais próximo
                            // Por enquanto, vamos mostrar o modal de busca manual
                            handleDenyLocation();
                          }}
                        >
                          <MapPin size={16} className="mr-2" />
                          Encontrar Mais Próximo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Information Card */}
          <Card className="shadow-soft border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">
                    Como Funciona o Atendimento
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Contato:</strong> Entre em contato com o serviço mais próximo
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Acolhimento:</strong> Você será recebida com respeito e sigilo
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Orientação:</strong> Receberá orientações sobre seus direitos e opções
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">
                    Seus Direitos no Atendimento
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Sigilo:</strong> Suas informações são protegidas
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Respeito:</strong> Atendimento humanizado e sem julgamentos
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Escolha:</strong> Você decide sobre as medidas a tomar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual Search Modal */}
      <ManualSearchModal 
        isOpen={showManualSearchModal} 
        onClose={() => setShowManualSearchModal(false)} 
      />
    </div>
  );
};

export default Contatos;