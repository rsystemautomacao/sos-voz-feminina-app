import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UpdateNotificationProps {
  isVisible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

const UpdateNotification = ({ isVisible, onUpdate, onDismiss }: UpdateNotificationProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <Card className="w-80 shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="text-primary-foreground" size={16} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary text-sm">
                  Nova versão disponível!
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Uma nova versão do app foi carregada. Clique para atualizar e obter as últimas melhorias.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={onDismiss}
            >
              <X size={14} />
            </Button>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <Button
              size="sm"
              className="flex-1"
              onClick={onUpdate}
            >
              <RefreshCw size={14} className="mr-2" />
              Atualizar Agora
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateNotification;
