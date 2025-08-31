import { Phone, MessageSquare, Globe, Heart, Scale, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import ManualSearchModal from "@/components/ManualSearchModal";

const Contatos = () => {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showManualSearchModal, setShowManualSearchModal] = useState(false);

  const emergencyContacts = [
    {
      name: "Disque 180",
      description: "Central de Atendimento à Mulher - 24h",
      phone: "180",
      type: "emergency",
      icon: Phone,
    },
    {
      name: "Polícia Militar",
      description: "Emergências e ocorrências policiais",
      phone: "190",
      type: "emergency", 
      icon: Phone,
    },
    {
      name: "Bombeiros",
      description: "Emergências médicas e resgates",
      phone: "193",
      type: "emergency",
      icon: Phone,
    },
  ];

  const supportContacts = [
    {
      category: "Apoio Psicológico",
      icon: Heart,
      contacts: [
        {
          name: "Centro de Valorização da Vida (CVV)",
          description: "Apoio emocional e prevenção do suicídio",
          phone: "188",
          website: "cvv.org.br"
        },
        {
          name: "Mapa da Saúde Mental",
          description: "Encontre psicólogos em sua região",
          type: "map",
          special: true
        },
        {
          name: "Psicólogos do SUS",
          description: "Atendimento gratuito pelo Sistema Único de Saúde",
          phone: "136"
        }
      ]
    },
    {
      category: "Apoio Jurídico",
      icon: Scale,
      contacts: [
        {
          name: "Defensoria Pública",
          description: "Assistência jurídica gratuita",
          phone: "129"
        },
        {
          name: "OAB - Comissão da Mulher",
          description: "Orientação jurídica especializada",
          website: "oab.org.br"
        },
        {
          name: "Ministério Público",
          description: "Denúncias e acompanhamento de casos",
          website: "mpf.mp.br"
        }
      ]
    },
    {
      category: "Organizações de Apoio",
      icon: Users,
      contacts: [
        {
          name: "Instituto Maria da Penha",
          description: "Educação e direitos das mulheres",
          website: "institutomariadapenha.org.br"
        },
        {
          name: "Casa da Mulher Brasileira",
          description: "Atendimento integral à mulher",
          website: "gov.br/mdh"
        },
        {
          name: "Think Olga",
          description: "Empoderamento feminino e educação",
          website: "thinkolga.com"
        }
      ]
    }
  ];

  const callNumber = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const openWebsite = (website: string) => {
    window.open(`https://${website}`, '_blank');
  };

  const handleMapButtonClick = () => {
    setShowLocationModal(true);
  };

  const handleConfirmLocation = async () => {
    setShowLocationModal(false);
    setIsRequestingLocation(true);
    
    try {
      // Verificar se o navegador suporta geolocalização
      if (!navigator.geolocation) {
        alert('Seu navegador não suporta geolocalização. Por favor, use um dispositivo móvel.');
        setIsRequestingLocation(false);
        return;
      }

      // Solicitar permissão de localização
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Detectar o sistema operacional para abrir o mapa correto
      const userAgent = navigator.userAgent.toLowerCase();
      let mapUrl = '';

      if (/iphone|ipad|ipod/.test(userAgent)) {
        // iOS - Apple Maps
        mapUrl = `https://maps.apple.com/?q=psicólogo&ll=${latitude},${longitude}&z=13`;
      } else if (/android/.test(userAgent)) {
        // Android - Google Maps
        mapUrl = `https://www.google.com/maps/search/psicólogo/@${latitude},${longitude},13z`;
      } else {
        // Desktop ou outros - Google Maps
        mapUrl = `https://www.google.com/maps/search/psicólogo/@${latitude},${longitude},13z`;
      }

      // Abrir o mapa
      window.open(mapUrl, '_blank');
      
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permissão de localização negada. Para encontrar psicólogos próximos, permita o acesso à sua localização.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Localização indisponível. Verifique se o GPS está ativado.');
            break;
          case error.TIMEOUT:
            alert('Tempo limite excedido. Tente novamente.');
            break;
          default:
            alert('Erro ao obter localização. Tente novamente.');
        }
      } else {
        alert('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
    setShowManualSearchModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-strong">
            <Phone className="text-primary-foreground" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Rede de Contatos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Uma rede de apoio completa com profissionais e organizações 
            especializadas em proteção e apoio às mulheres.
          </p>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <span className="text-emergency">Contatos de Emergência</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="shadow-strong border-emergency/20 bg-emergency/5">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-3">
                    <contact.icon className="text-emergency-foreground" size={24} />
                  </div>
                  <CardTitle className="text-emergency">{contact.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {contact.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant="emergency"
                    size="lg"
                    className="w-full text-xl font-bold"
                    onClick={() => callNumber(contact.phone)}
                  >
                    {contact.phone}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Contacts */}
        <div className="space-y-8">
          {supportContacts.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <category.icon className="text-primary-foreground" size={20} />
                  </div>
                  <span className="text-primary">{category.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {category.contacts.map((contact, contactIndex) => (
                    <div 
                      key={contactIndex}
                      className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          {contact.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {contact.description}
                        </p>
                        <div className="flex space-x-2">
                          {contact.phone && (
                            <Button 
                              variant="soft" 
                              size="sm"
                              onClick={() => callNumber(contact.phone)}
                            >
                              <Phone size={14} />
                              {contact.phone}
                            </Button>
                          )}
                          {contact.website && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openWebsite(contact.website)}
                            >
                              <Globe size={14} />
                              Website
                            </Button>
                          )}
                          {contact.special && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleMapButtonClick}
                              disabled={isRequestingLocation}
                            >
                              <MapPin size={14} />
                              {isRequestingLocation ? 'Carregando...' : 'Buscar Próximos'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notice */}
        <Card className="mt-8 border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <MessageSquare className="text-warning mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-warning mb-2">
                  Importante - Segurança Digital
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Sempre limpe o histórico do navegador após usar este app</p>
                  <p>• Use navegação privada/anônima quando possível</p>
                  <p>• Tenha um plano de segurança para situações de emergência</p>
                  <p>• Mantenha estes contatos salvos em local seguro</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Permission Notice */}
        <Card className="mt-4 border-info/20 bg-info/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <MapPin className="text-info mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-info mb-2">
                  Sobre o Mapa da Saúde Mental
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Sua localização será usada apenas para buscar psicólogos próximos</p>
                  <p>• Os dados de localização não são armazenados</p>
                  <p>• O mapa abrirá no aplicativo nativo do seu dispositivo</p>
                  <p>• Você pode negar a permissão a qualquer momento</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Permissão de Localização */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onConfirm={handleConfirmLocation}
        onDeny={handleDenyLocation}
        onClose={() => setShowLocationModal(false)}
      />

      {/* Modal de Busca Manual */}
      <ManualSearchModal
        isOpen={showManualSearchModal}
        onClose={() => setShowManualSearchModal(false)}
      />
    </div>
  );
};

export default Contatos;