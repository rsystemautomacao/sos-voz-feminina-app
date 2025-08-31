import { MapPin, Search, Smartphone, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ManualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualSearchModal = ({ isOpen, onClose }: ManualSearchModalProps) => {
  // Detectar o sistema operacional para dar instruções específicas
  const userAgent = navigator.userAgent.toLowerCase();
  let isIOS = /iphone|ipad|ipod/.test(userAgent);
  let isAndroid = /android/.test(userAgent);
  let isMobile = isIOS || isAndroid;

  const getInstructions = () => {
    if (isIOS) {
      return {
        title: "Buscar no iPhone/iPad",
        icon: <Smartphone className="text-blue-500" size={20} />,
        steps: [
          {
            icon: <MapPin className="text-green-500" size={16} />,
            text: "Abra o app \"Mapas\" no seu iPhone/iPad"
          },
          {
            icon: <Search className="text-blue-500" size={16} />,
            text: "Digite \"psicólogo\" na barra de pesquisa"
          },
          {
            icon: <CheckCircle className="text-green-500" size={16} />,
            text: "Toque em \"Buscar\""
          },
          {
            icon: <MapPin className="text-purple-500" size={16} />,
            text: "Navegue pelos resultados próximos à sua localização"
          }
        ],
        alternative: {
          title: "Ou use o Google Maps:",
          steps: [
            "Abra o app \"Google Maps\"",
            "Digite \"psicólogo\" na barra de pesquisa",
            "Toque em \"Buscar\"",
            "Filtre por distância ou avaliações"
          ]
        }
      };
    } else if (isAndroid) {
      return {
        title: "Buscar no Android",
        icon: <Smartphone className="text-green-500" size={20} />,
        steps: [
          {
            icon: <Globe className="text-blue-500" size={16} />,
            text: "Abra o app \"Google Maps\" no seu Android"
          },
          {
            icon: <Search className="text-blue-500" size={16} />,
            text: "Digite \"psicólogo\" na barra de pesquisa"
          },
          {
            icon: <CheckCircle className="text-green-500" size={16} />,
            text: "Toque em \"Buscar\""
          },
          {
            icon: <MapPin className="text-purple-500" size={16} />,
            text: "Filtre por distância, avaliações ou horário de funcionamento"
          }
        ],
        alternative: {
          title: "Você também pode usar outros apps de mapa instalados no seu dispositivo."
        }
      };
    } else {
      return {
        title: "Buscar no Computador",
        icon: <Globe className="text-blue-500" size={20} />,
        steps: [
          {
            icon: <Globe className="text-blue-500" size={16} />,
            text: "Abra o Google Maps no seu navegador"
          },
          {
            icon: <Search className="text-blue-500" size={16} />,
            text: "Digite \"psicólogo\" na barra de pesquisa"
          },
          {
            icon: <CheckCircle className="text-green-500" size={16} />,
            text: "Clique em \"Buscar\""
          },
          {
            icon: <MapPin className="text-purple-500" size={16} />,
            text: "Filtre por distância ou avaliações"
          }
        ],
        alternative: {
          title: "Ou use o app de mapas do seu dispositivo móvel."
        }
      };
    }
  };

  const instructions = getInstructions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            {instructions.icon}
            <span>Como Buscar Psicólogos Manualmente</span>
          </DialogTitle>
          <DialogDescription>
            Instruções passo a passo para encontrar psicólogos próximos
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Instruções principais */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-primary flex items-center space-x-2">
              <MapPin className="text-primary" size={20} />
              <span>{instructions.title}</span>
            </h3>
            
            <div className="space-y-2">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    {step.icon}
                    <span className="text-sm font-medium">{step.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternativa */}
          {instructions.alternative && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-muted">
              <h4 className="font-medium text-sm text-muted-foreground">
                {instructions.alternative.title}
              </h4>
              {instructions.alternative.steps ? (
                <ul className="text-xs text-muted-foreground space-y-1">
                  {instructions.alternative.steps.map((step, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {instructions.alternative.title}
                </p>
              )}
            </div>
          )}

          {/* Dicas adicionais */}
          <div className="space-y-3 p-4 bg-success/10 rounded-lg border border-success/20">
            <h4 className="font-medium text-sm text-success flex items-center space-x-2">
              <CheckCircle className="text-success" size={16} />
              <span>Dicas para uma busca eficiente:</span>
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Filtre por avaliações (4+ estrelas)</li>
              <li>• Verifique horários de funcionamento</li>
              <li>• Leia comentários de outros pacientes</li>
              <li>• Considere a distância de sua casa/trabalho</li>
              <li>• Verifique se aceitam seu plano de saúde</li>
            </ul>
          </div>
        </div>

        {/* Botão fixo na parte inferior */}
        <div className="flex-shrink-0 pt-4 border-t border-border">
          <Button onClick={onClose} className="w-full" size="lg">
            Entendi, obrigada!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualSearchModal;
