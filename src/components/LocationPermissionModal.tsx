import { MapPin, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
  onClose: () => void;
}

const LocationPermissionModal = ({ isOpen, onConfirm, onDeny, onClose }: LocationPermissionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="text-primary" size={20} />
            <span>Permissão de Localização</span>
          </DialogTitle>
          <DialogDescription>
            Para encontrar psicólogos próximos à sua localização
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações sobre privacidade */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <Shield className="text-primary mt-1 flex-shrink-0" size={16} />
              <div>
                <h3 className="font-semibold text-primary text-sm mb-1">
                  Sua Privacidade é Importante
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sua localização será usada <strong>exclusivamente</strong> para buscar psicólogos na sua região. 
                  Os dados não são armazenados nem compartilhados.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">O que acontece quando você permite:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Seu dispositivo solicitará permissão de localização</li>
                <li>• O mapa nativo do seu celular será aberto</li>
                <li>• A busca por "psicólogo" será feita automaticamente</li>
                <li>• Você verá os resultados próximos à sua localização</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Se você não permitir:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Você pode fazer a busca manualmente no seu app de mapas</li>
                <li>• Digite "psicólogo" na barra de pesquisa</li>
                <li>• Navegue pelos resultados disponíveis</li>
              </ul>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={onConfirm}
              className="flex-1"
            >
              <MapPin size={16} className="mr-2" />
              Permitir e Buscar
            </Button>
            <Button
              variant="outline"
              onClick={onDeny}
              className="flex-1"
            >
              Buscar Manualmente
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs text-muted-foreground"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionModal;
