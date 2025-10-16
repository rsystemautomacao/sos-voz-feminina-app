import { CheckCircle, Copy, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clipboard } from '@capacitor/clipboard';

interface DenunciaConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  denunciaId: string;
  tipoViolencia: string;
}

const DenunciaConfirmModal = ({ isOpen, onClose, denunciaId, tipoViolencia }: DenunciaConfirmModalProps) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      // Detectar se está no mobile (Capacitor)
      const isMobile = typeof window !== 'undefined' && window.location.protocol === 'https:';
      
      if (isMobile) {
        // Usar Capacitor Clipboard no mobile
        await Clipboard.write({
          string: denunciaId
        });
      } else {
        // Usar navigator.clipboard no web
        await navigator.clipboard.writeText(denunciaId);
      }
      
      toast({
        title: "ID copiado!",
        description: "O número do relato foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o ID automaticamente.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm shadow-strong border-0 bg-white/95 backdrop-blur-sm max-h-[85vh] overflow-y-auto">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="text-green-foreground" size={24} />
          </div>
          <CardTitle className="text-xl text-green-600">Relato Registrado!</CardTitle>
          <CardDescription className="text-sm">
            Seu relato foi recebido com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 space-y-4">
          {/* ID do Relato */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="text-primary" size={16} />
              <span className="font-semibold text-sm">Número do Relato:</span>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg p-3">
              <div className="text-center">
                <span className="text-xl font-bold text-primary tracking-wider">
                  #{denunciaId}
                </span>
              </div>
            </div>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="w-full flex items-center space-x-2"
            >
              <Copy size={14} />
              <span>Copiar Número</span>
            </Button>
          </div>

          {/* Informações Importantes */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
              <div className="text-xs">
                <h4 className="font-semibold text-yellow-800 mb-1">Guarde este número!</h4>
                <p className="text-yellow-700">
                  Use para consultar o status na seção "Consultar Relato".
                </p>
              </div>
            </div>
          </div>

          {/* Tipo de Violência */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Tipo de Violência:</span>
            <p className="text-sm capitalize">{tipoViolencia?.replace('_', ' ') || 'Não especificado'}</p>
          </div>

          {/* Próximos Passos */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">O que acontece agora?</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Seu relato será analisado por nossa equipe</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Você pode acompanhar o status usando o número acima</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Mantenha-se segura e procure ajuda se necessário</span>
              </div>
            </div>
          </div>

          {/* Botão de Fechar */}
          <div className="pt-3">
            <Button
              onClick={onClose}
              className="w-full h-10 bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold rounded-lg"
            >
              Entendi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DenunciaConfirmModal;
